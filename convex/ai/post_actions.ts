"use node";

import { google } from "@ai-sdk/google";
import { embed } from "ai";
import { v } from "convex/values";
import { api, internal } from "../_generated/api";
import type { Doc } from "../_generated/dataModel";
import { action } from "../_generated/server";
// import { api, internal } from "../_generated/api";
// import { action } from "../_generated/server";

// Generate embedding for a post
export const generatePostEmbedding = action({
  args: {
    postId: v.id("post"),
  },
  handler: async (ctx, args) => {
    // Get the post
    const post = await ctx.runQuery(api.ai.post.getPost, {
      postId: args.postId,
    });

    if (!post) {
      throw new Error("Post not found");
    }

    // Combine title and content for embedding
    const textToEmbed = `${post.title}\n\n${post.content}`;

    // Generate embedding using Google Gemini
    const { embedding } = await embed({
      model: google.embeddingModel("gemini-embedding-001"),
      value: textToEmbed,
    });

    // Update post with embedding
    await ctx.runMutation(internal.ai.post.updateEmbedding, {
      postId: args.postId,
      embedding,
    });

    return { success: true };
  },
});

// Batch generate embeddings for multiple posts
export const generateManyPostEmbeddings = action({
  args: {
    postIds: v.array(v.id("post")),
  },
  handler: async (ctx, args) => {
    const results: { postId: string; success: boolean; error?: string }[] = [];

    for (const postId of args.postIds) {
      try {
        await ctx.runAction(api.ai.post_actions.generatePostEmbedding, {
          postId,
        });
        results.push({ postId, success: true });
      } catch (error) {
        results.push({
          postId,
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    return results;
  },
});

// Search posts using vector similarity
export const searchPostsByVector = action({
  args: {
    query: v.string(),
    businessId: v.optional(v.id("business")),
    limit: v.optional(v.number()),
    scoreThreshold: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 10;
    const scoreThreshold = args.scoreThreshold ?? 0.7;

    // Generate embedding for the search query
    const { embedding } = await embed({
      model: google.embeddingModel("gemini-embedding-001"),
      value: args.query,
    });

    // Vector search
    const vectorResults = await ctx.vectorSearch("post", "by_embedding", {
      vector: embedding,
      limit: Math.min(limit * 2, 30),
      filter: (q) => q.eq("status", "published"),
    });

    // Filter by score threshold
    const filteredByScore = vectorResults.filter(
      (result) => result._score >= scoreThreshold,
    );

    if (filteredByScore.length === 0) {
      console.log(
        `[Hybrid Search] No results above threshold for: "${args.query}"`,
      );
      return [];
    }
    const posts: (Doc<"post"> & { score: number } & {
      coverImages: { key: string; url: string }[];
      postBusiness: {
        name: string | undefined;
        handle: string | undefined;
        status: "verified" | "unverified" | "deleted" | undefined;
        category: string | undefined;
        followersCount: number | undefined;
        logo: string | null;
      };
    })[] = await ctx.runAction(internal.ai.post.fetchAndFilterPosts, {
      results: filteredByScore.map((r) => ({ id: r._id, score: r._score })),
      businessId: args.businessId,
    });

    return posts.slice(0, limit);
  },
});
