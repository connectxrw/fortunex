import { v } from "convex/values";
import { internal } from "../_generated/api";
import type { Doc } from "../_generated/dataModel";
import {
  internalAction,
  internalMutation,
  internalQuery,
  query,
} from "../_generated/server";
import { r2 } from "../uploadFiles";

export const getPostById = internalQuery({
  args: {
    id: v.id("post"),
  },
  handler: async (ctx, args) => {
    const post = await ctx.db.get("post", args.id);
    if (!post) {
      return null;
    }
    const coverImages = await Promise.all(
      post.coverImageKeys.map(async (fileKey) => {
        const coverImageUrl = await r2.getUrl(fileKey, {
          expiresIn: 60 * 60 * 24 * 7,
        });
        return {
          key: fileKey,
          url: coverImageUrl,
        };
      }),
    );
    const business = await ctx.db.get("business", post.businessId);
    const logo = business?.profileImageKey
      ? await r2.getUrl(business.profileImageKey, {
          expiresIn: 60 * 60 * 24 * 7,
        })
      : null;

    const likesCount = (
      await ctx.db
        .query("likedPosts")
        .withIndex("by_postId_userId", (q) => q.eq("postId", post._id))
        .collect()
    ).length;

    const postBusiness = {
      name: business?.name,
      handle: business?.handle,
      status: business?.status,
      category: business?.category,
      followersCount: business?.followersCount,
      logo,
    };

    return {
      ...post,
      coverImages,
      postBusiness,
      likesCount,
    };
  },
});

// for vector search

export const getPost = query({
  args: {
    postId: v.id("post"),
  },
  handler: async (ctx, args) => await ctx.db.get("post", args.postId),
});

export const getPostsWithoutEmbeddings = query({
  args: {
    businessId: v.optional(v.id("business")),
  },
  handler: async (ctx, args) => {
    let quer = ctx.db
      .query("post")
      .filter((q) => q.eq(q.field("embedding"), undefined));

    if (args.businessId) {
      quer = quer.filter((q) => q.eq(q.field("businessId"), args.businessId));
    }

    return await quer.collect();
  },
});

// in convex/post.ts
export const fetchAndFilterPosts = internalAction({
  args: {
    results: v.array(v.object({ id: v.id("post"), score: v.number() })),
    businessId: v.optional(v.id("business")),
  },
  handler: async (ctx, args) => {
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
      likesCount: number;
    })[] = [];
    for (const result of args.results) {
      const post = await ctx.runQuery(internal.ai.post.getPostById, {
        id: result.id,
      });
      if (!post) {
        continue;
      }

      // Perform the 'AND' logic manually here
      if (args.businessId && post.businessId !== args.businessId) {
        continue;
      }

      posts.push({ ...post, score: result.score });
    }
    return posts;
  },
});

export const updateEmbedding = internalMutation({
  args: {
    postId: v.id("post"),
    embedding: v.array(v.float64()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch("post", args.postId, {
      embedding: args.embedding,
    });
  },
});
