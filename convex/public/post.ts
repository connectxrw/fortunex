import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";
import { query } from "../_generated/server";
import { businessCategory } from "../schema";
import { r2 } from "../uploadFiles";

export const getUnAuthPosts = query({
  args: {
    paginationOpts: paginationOptsValidator,
    category: businessCategory,
    subcategory: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const posts = await ctx.db
      .query("post")
      .withIndex("by_status", (q) => q.eq("status", "published"))
      .filter((q) => {
        const categoryMatch = q.eq(q.field("category"), args.category);
        if (args.subcategory) {
          return q.and(
            categoryMatch,
            q.eq(q.field("subcategory"), args.subcategory),
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
          latitude: business?.latitude,
          longitude: business?.longitude,
        };
        return {
          ...post,
          coverImages,
          postBusiness,
          likesCount,
        };
      }),
    );
    return {
      ...posts,
      page: postsWithCoverImageUrls,
    };
  },
});

export const searchUnAuthPosts = query({
  args: {
    search: v.string(),
  },
  handler: async (ctx, args) => {
    const posts = await ctx.db
      .query("post")
      .withSearchIndex("search_post", (q) =>
        q.search("title", args.search).eq("status", "published"),
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
          latitude: business?.latitude,
          longitude: business?.longitude,
        };
        return {
          ...post,
          coverImages,
          postBusiness,
          likesCount,
        };
      }),
    );
    return postsWithCoverImageUrls;
  },
});

export const getUnAuthPostBySlug = query({
  args: {
    slug: v.string(),
  },
  handler: async (ctx, args) => {
    const post = await ctx.db
      .query("post")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
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
      openingHours: business?.openingHours,
    };
    return {
      ...post,
      coverImages,
      postBusiness,
      likesCount,
    };
  },
});

export const getOtherBsnPosts = query({
  args: {
    paginationOpts: paginationOptsValidator,
    businessId: v.id("business"),
  },
  handler: async (ctx, args) => {
    const posts = await ctx.db
      .query("post")
      .withIndex("by_businessId_status", (q) =>
        q.eq("businessId", args.businessId).eq("status", "published"),
      )
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
          latitude: business?.latitude,
          longitude: business?.longitude,
        };
        return {
          ...post,
          coverImages,
          postBusiness,
          likesCount,
        };
      }),
    );
    return {
      ...posts,
      page: postsWithCoverImageUrls,
    };
  },
});
