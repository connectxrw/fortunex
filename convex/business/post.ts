import { ConvexError, v } from "convex/values";
import { api } from "../_generated/api";
import { mutation, query } from "../_generated/server";
import { authComponent } from "../auth";
import { generateUniquePostSlug } from "../helpers/slug";
import { r2 } from "../uploadFiles";

export const addNewPost = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    price: v.optional(v.string()),
    currency: v.optional(v.string()),
    ctaLink: v.optional(v.string()),
    ctaLabel: v.optional(v.string()),
    subcategory: v.optional(v.string()),
    coverImageKeys: v.array(v.string()),
    status: v.union(v.literal("published"), v.literal("draft")),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);

    if (!user || user.accountType !== "business") {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "You must be logged in to create a post",
      });
    }

    const business = await ctx.db
      .query("business")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .first();

    if (!business) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "You must have a business to create a post",
      });
    }

    const slug = await generateUniquePostSlug(ctx, args.title, business._id);

    // Insert new question paper
    const post = await ctx.db.insert("post", {
      title: args.title,
      slug,
      content: args.content,
      price: args.price,
      currency: args.currency,
      ctaLink: args.ctaLink,
      ctaLabel: args.ctaLabel,
      subcategory: args.subcategory,
      viewType: "card",
      status: args.status,
      coverImageKeys: args.coverImageKeys,
      category: business.category,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      userId: user._id,
      businessId: business._id,
    });

    await ctx.scheduler.runAfter(0, api.ai.post_actions.generatePostEmbedding, {
      postId: post,
    });

    return { slug, title: args.title };
  },
});
export const editPost = mutation({
  args: {
    postId: v.id("post"),
    title: v.string(),
    content: v.string(),
    price: v.optional(v.string()),
    currency: v.optional(v.string()),
    ctaLink: v.optional(v.string()),
    ctaLabel: v.optional(v.string()),
    subcategory: v.optional(v.string()),
    coverImageKeys: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);

    if (!user || user.accountType !== "business") {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "You must be the owner of this business to edit a post",
      });
    }
    const business = await ctx.db
      .query("business")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .first();

    if (!business) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "You must have a business to edit a post",
      });
    }

    const post = await ctx.db.get("post", args.postId);
    if (!post || post.userId !== user._id || post.businessId !== business._id) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "You must be the owner of this post to edit it",
      });
    }

    let slug = post.slug;

    if (args.title !== post.title) {
      slug = await generateUniquePostSlug(ctx, args.title, business._id);
    }

    // Update post
    await ctx.db.patch("post", args.postId, {
      title: args.title,
      content: args.content,
      ctaLink: args.ctaLink,
      ctaLabel: args.ctaLabel,
      price: args.price,
      currency: args.currency,
      subcategory: args.subcategory,
      slug,
      coverImageKeys: args.coverImageKeys,
      updatedAt: Date.now(),
    });
    await ctx.scheduler.runAfter(0, api.ai.post_actions.generatePostEmbedding, {
      postId: args.postId,
    });

    return { slug, title: args.title };
  },
});
export const deletePost = mutation({
  args: {
    postId: v.id("post"),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);

    if (!user) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "You must be logged in to delete a post",
      });
    }
    const business = await ctx.db
      .query("business")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .first();
    if (!business) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "You must have a business to delete a post",
      });
    }

    const post = await ctx.db.get("post", args.postId);
    if (!post || post.userId !== user._id || post.businessId !== business._id) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "You must be the owner of this post to delete it",
      });
    }

    if (post.coverImageKeys) {
      try {
        await Promise.all(
          post.coverImageKeys.map(async (fileKey) => {
            await r2.deleteObject(ctx, fileKey);
          }),
        );
      } catch (error) {
        console.error("Failed to delete image:", error);
        throw new ConvexError({
          code: "INTERNAL",
          message: "Failed to delete old file",
        });
      }
    }

    // Insert new question paper
    const postId = await ctx.db.delete("post", args.postId);

    return { success: true, postId };
  },
});

export const deletePostImage = mutation({
  args: {
    postId: v.id("post"),
    imageKey: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);

    if (!user) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "You must be logged in to delete a post",
      });
    }
    const business = await ctx.db
      .query("business")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .first();
    if (!business) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "You must have a business to delete a post",
      });
    }

    const post = await ctx.db.get("post", args.postId);
    if (!post || post.userId !== user._id || post.businessId !== business._id) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "You must be the owner of this post to delete it's image",
      });
    }

    if (post.coverImageKeys && post.coverImageKeys.length <= 1) {
      throw new ConvexError({
        code: "BAD_REQUEST",
        message: "You must have at least one image to delete",
      });
    }
    if (args.imageKey) {
      try {
        await r2.deleteObject(ctx, args.imageKey);
      } catch (error) {
        console.error("Failed to delete image:", error);
        throw new ConvexError({
          code: "INTERNAL",
          message: "Failed to delete post image",
        });
      }
    }
    await ctx.db.patch("post", args.postId, {
      coverImageKeys: post.coverImageKeys?.filter(
        (key) => key !== args.imageKey,
      ),
      updatedAt: Date.now(),
    });

    return { slug: post.slug, title: post.title };
  },
});

export const updatePostStatus = mutation({
  args: {
    id: v.id("post"),
    status: v.union(v.literal("published"), v.literal("draft")),
  },
  handler: async (ctx, { id, status }) => {
    const user = await authComponent.getAuthUser(ctx);

    if (!user) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "You must be logged in to update a post",
      });
    }

    const business = await ctx.db
      .query("business")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .first();

    if (!business) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "You must have a business to update a post",
      });
    }

    const post = await ctx.db.get("post", id);

    if (!post || post.userId !== user._id || post.businessId !== business._id) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "You must be the owner of this post to update it",
      });
    }

    await ctx.db.patch("post", id, {
      status,
      updatedAt: Date.now(),
    });

    return { status };
  },
});

export const getPostsByBusinessHandle = query({
  args: {
    handle: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "You must be logged in to get posts",
      });
    }
    const business = await ctx.db
      .query("business")
      .withIndex("by_handle", (q) => q.eq("handle", args.handle))
      .first();
    if (!business) {
      return null;
    }
    const posts = await ctx.db
      .query("post")
      .withIndex("by_businessId_status", (q) =>
        q.eq("businessId", business._id).eq("status", "published"),
      )
      .collect();

    const postsWithCoverImageUrls = await Promise.all(
      posts.map(async (post) => {
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
        const logo = business?.profileImageKey
          ? await r2.getUrl(business.profileImageKey, {
              expiresIn: 60 * 60 * 24 * 7,
            })
          : null;

        const saved = await ctx.db
          .query("savedPosts")
          .withIndex("by_postId_userId", (q) =>
            q.eq("postId", post._id).eq("userId", user._id),
          )
          .first();

        // check if i have liked this post
        const liked = await ctx.db
          .query("likedPosts")
          .withIndex("by_postId_userId", (q) =>
            q.eq("postId", post._id).eq("userId", user._id),
          )
          .first();

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
          isMine: post.userId === user._id,
          saved: saved !== null,
          liked: liked !== null,
          likesCount,
        };
      }),
    );
    return postsWithCoverImageUrls;
  },
});
