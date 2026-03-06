import { paginationOptsValidator } from "convex/server";
import { ConvexError, v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { authComponent } from "../auth";
import { businessCategory } from "../schema";
import { r2 } from "../uploadFiles";

export const getAuthPosts = query({
  args: {
    paginationOpts: paginationOptsValidator,
    category: businessCategory,
    subcategory: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "You must be logged in to get posts",
      });
    }
    const posts = await ctx.db
      .query("post")
      .withIndex("by_status", (q) => q.eq("status", "published"))
      .filter((q) => {
        const categoryMatch = q.eq(q.field("category"), args.category);
        if (args.subcategory) {
          return q.and(
            categoryMatch,
            q.eq(q.field("subcategory"), args.subcategory)
          );
        }
        return categoryMatch;
      })
      .order("desc")
      .paginate(args.paginationOpts);

    const postsWithCoverImageUrls = await Promise.all(
      posts.page.map(async (post) => {
        const coverImages = await Promise.all(
          post.coverImageKeys.map(async (fileKey) => {
            const coverImageUrl = await r2.getUrl(fileKey, {
              expiresIn: 60 * 60 * 24 * 7,
            });
            return {
              key: fileKey,
              url: coverImageUrl,
            };
          })
        );
        const business = await ctx.db.get("business", post.businessId);
        const logo = business?.profileImageKey
          ? await r2.getUrl(business.profileImageKey, {
              expiresIn: 60 * 60 * 24 * 7,
            })
          : null;

        const saved = await ctx.db
          .query("savedPosts")
          .withIndex("by_postId_userId", (q) =>
            q.eq("postId", post._id).eq("userId", user._id)
          )
          .first();

        const liked = await ctx.db
          .query("likedPosts")
          .withIndex("by_postId_userId", (q) =>
            q.eq("postId", post._id).eq("userId", user._id)
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
          latitude: business?.latitude,
          longitude: business?.longitude,
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
      })
    );
    return {
      ...posts,
      page: postsWithCoverImageUrls,
    };
  },
});

export const searchAuthPosts = query({
  args: {
    search: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "You must be logged in to search posts",
      });
    }
    const posts = await ctx.db
      .query("post")
      .withSearchIndex("search_post", (q) =>
        q.search("title", args.search).eq("status", "published")
      )
      .take(10);

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
          })
        );
        const business = await ctx.db.get("business", post.businessId);
        const logo = business?.profileImageKey
          ? await r2.getUrl(business.profileImageKey, {
              expiresIn: 60 * 60 * 24 * 7,
            })
          : null;

        const saved = await ctx.db
          .query("savedPosts")
          .withIndex("by_postId_userId", (q) =>
            q.eq("postId", post._id).eq("userId", user._id)
          )
          .first();

        const liked = await ctx.db
          .query("likedPosts")
          .withIndex("by_postId_userId", (q) =>
            q.eq("postId", post._id).eq("userId", user._id)
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
          latitude: business?.latitude,
          longitude: business?.longitude,
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
      })
    );
    return postsWithCoverImageUrls;
  },
});

export const getMyPosts = query({
  args: {
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user || user.accountType !== "business") {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "You must be logged in to get posts",
      });
    }
    const posts = await ctx.db
      .query("post")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .order("desc")
      .paginate(args.paginationOpts);

    const postsWithCoverImageUrls = await Promise.all(
      posts.page.map(async (post) => {
        const coverImages = await Promise.all(
          post.coverImageKeys.map(async (fileKey) => {
            const coverImageUrl = await r2.getUrl(fileKey, {
              expiresIn: 60 * 60 * 24 * 7,
            });
            return {
              key: fileKey,
              url: coverImageUrl,
            };
          })
        );
        const business = await ctx.db.get("business", post.businessId);
        const logo = business?.profileImageKey
          ? await r2.getUrl(business.profileImageKey, {
              expiresIn: 60 * 60 * 24 * 7,
            })
          : null;

        const saved = await ctx.db
          .query("savedPosts")
          .withIndex("by_postId_userId", (q) =>
            q.eq("postId", post._id).eq("userId", user._id)
          )
          .first();

        const liked = await ctx.db
          .query("likedPosts")
          .withIndex("by_postId_userId", (q) =>
            q.eq("postId", post._id).eq("userId", user._id)
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
      })
    );
    return {
      ...posts,
      page: postsWithCoverImageUrls,
    };
  },
});

export const getAuthPostBySlug = query({
  args: {
    slug: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) return null;

    const post = await ctx.db
      .query("post")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
    if (!post) return null;

    const coverImages = await Promise.all(
      post.coverImageKeys.map(async (fileKey) => {
        const coverImageUrl = await r2.getUrl(fileKey, {
          expiresIn: 60 * 60 * 24 * 7,
        });
        return {
          key: fileKey,
          url: coverImageUrl,
        };
      })
    );

    const business = await ctx.db.get("business", post.businessId);
    const logo = business?.profileImageKey
      ? await r2.getUrl(business.profileImageKey, {
          expiresIn: 60 * 60 * 24 * 7,
        })
      : null;

    const saved = await ctx.db
      .query("savedPosts")
      .withIndex("by_postId_userId", (q) =>
        q.eq("postId", post._id).eq("userId", user._id)
      )
      .first();

    const liked = await ctx.db
      .query("likedPosts")
      .withIndex("by_postId_userId", (q) =>
        q.eq("postId", post._id).eq("userId", user._id)
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
      openingHours: business?.openingHours,
    };
    return {
      ...post,
      coverImages,
      postBusiness,
      saved: saved !== null,
      liked: liked !== null,
      likesCount,
    };
  },
});

export const toggleSavePost = mutation({
  args: {
    postId: v.id("post"),
    saved: v.boolean(),
  },
  handler: async (ctx, { postId, saved }) => {
    const user = await authComponent.getAuthUser(ctx);

    if (!user) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "You must be logged in to toggle save",
      });
    }

    const post = await ctx.db.get(postId);

    if (!post) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Post not found",
      });
    }

    const existing = await ctx.db
      .query("savedPosts")
      .withIndex("by_postId_userId", (q) =>
        q.eq("postId", postId).eq("userId", user._id)
      )
      .first();

    if (saved) {
      if (existing) {
        return {
          success: false,
          message: "Post already saved",
        };
      }

      const id = await ctx.db.insert("savedPosts", {
        postId,
        userId: user._id,
      });

      return {
        id,
        success: true,
        message: "Post saved successfully",
      };
    }

    if (!existing) {
      return {
        success: false,
        message: "Post is not saved",
      };
    }

    await ctx.db.delete("savedPosts", existing._id);

    return {
      id: existing._id,
      success: true,
      message: "Post unsaved successfully",
    };
  },
});

export const toggleLikePost = mutation({
  args: {
    postId: v.id("post"),
    liked: v.boolean(),
  },
  handler: async (ctx, { postId, liked }) => {
    const user = await authComponent.getAuthUser(ctx);

    if (!user) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "You must be logged in to toggle like",
      });
    }

    const post = await ctx.db.get(postId);

    if (!post) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Post not found",
      });
    }

    const existing = await ctx.db
      .query("likedPosts")
      .withIndex("by_postId_userId", (q) =>
        q.eq("postId", postId).eq("userId", user._id)
      )
      .first();

    if (liked) {
      if (existing) {
        return {
          success: false,
          message: "Post already liked",
        };
      }

      const id = await ctx.db.insert("likedPosts", {
        postId,
        userId: user._id,
      });

      return {
        id,
        success: true,
        message: "Post liked successfully",
      };
    }

    if (!existing) {
      return {
        success: false,
        message: "Post is not liked",
      };
    }

    await ctx.db.delete("likedPosts", existing._id);

    return {
      id: existing._id,
      success: true,
      message: "Post unliked successfully",
    };
  },
});
