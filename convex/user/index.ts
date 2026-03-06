import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { authComponent, createAuth } from "../auth";
import { r2 } from "../uploadFiles";

export const updateUserOnBoarding = mutation({
  args: {
    username: v.string(),
    accountType: v.union(v.literal("personal"), v.literal("business")),
  },
  handler: async (ctx, args) => {
    const { auth, headers } = await authComponent.getAuth(createAuth, ctx);
    const result = await auth.api.updateUser({
      body: {
        username: args.username,
        accountType: args.accountType,
      },
      headers,
    });
    return result;
  },
});

export const updateUserAccountType = mutation({
  args: {
    accountType: v.union(v.literal("personal"), v.literal("business")),
  },
  handler: async (ctx, args) => {
    const { auth, headers } = await authComponent.getAuth(createAuth, ctx);
    const result = await auth.api.updateUser({
      body: {
        accountType: args.accountType,
      },
      headers,
    });
    return result;
  },
});

export const updateUsername = mutation({
  args: {
    username: v.string(),
  },
  handler: async (ctx, args) => {
    const { auth, headers } = await authComponent.getAuth(createAuth, ctx);
    const result = await auth.api.updateUser({
      body: {
        username: args.username,
      },
      headers,
    });
    return result;
  },
});

export const updateDisplayName = mutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const { auth, headers } = await authComponent.getAuth(createAuth, ctx);
    const result = await auth.api.updateUser({
      body: {
        name: args.name,
      },
      headers,
    });
    return result;
  },
});

export const updateAvatar = mutation({
  args: {
    avatar: v.string(),
  },
  handler: async (ctx, args) => {
    const { auth, headers } = await authComponent.getAuth(createAuth, ctx);
    const result = await auth.api.updateUser({
      body: {
        image: args.avatar,
      },
      headers,
    });
    return result;
  },
});

export const deleteCurrentUserPosts = mutation({
  handler: async (ctx) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) {
      return {
        success: false,
        message: "User not found",
      };
    }
    // delete user docs
    const posts = await ctx.db
      .query("post")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .collect();

    for (const post of posts) {
      if (!post.coverImageKeys?.length) continue;

      await Promise.allSettled(
        post.coverImageKeys.map((fileKey) => r2.deleteObject(ctx, fileKey)),
      );
    }

    for (const post of posts) {
      await ctx.db.delete("post", post._id);
    }

    // delete the business docs
    const businesses = await ctx.db
      .query("business")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .collect();

    for (const business of businesses) {
      await ctx.db.delete("business", business._id);
    }

    return {
      success: true,
      message: "User and business docs deleted successfully",
    };
  },
});
