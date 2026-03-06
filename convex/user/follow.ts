import { ConvexError, v } from "convex/values";
import { api } from "../_generated/api";
import { mutation } from "../_generated/server";
import { authComponent } from "../auth";

export const followBusiness = mutation({
  args: {
    businessId: v.id("business"),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "You must be logged in to follow a business",
      });
    }
    const business = await ctx.db.get("business", args.businessId);
    if (!business) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Business not found",
      });
    }
    await ctx.db.insert("businessFollowers", {
      businessId: args.businessId,
      userId: user._id,
      createdAt: Date.now(),
    });
    await ctx.db.patch("business", args.businessId, {
      followersCount: (business.followersCount || 0) + 1,
    });
    await ctx.scheduler.runAfter(0, api.notification.sendNotification, {
      receiverId: business.userId,
      type: "business_followed",
      businessHandle: business.handle,
      senderId: user._id,
      senderAccountType: user.accountType as "personal" | "business",
    });
    return { handle: business.handle, name: business.name };
  },
});

export const unfollowBusiness = mutation({
  args: {
    businessId: v.id("business"),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "You must be logged in to follow a business",
      });
    }
    const business = await ctx.db.get("business", args.businessId);
    if (!business) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Business not found",
      });
    }
    const businessFollowers = await ctx.db
      .query("businessFollowers")
      .withIndex("by_businessId_userId", (q) =>
        q.eq("businessId", args.businessId).eq("userId", user._id),
      )
      .first();
    if (!businessFollowers) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Business not followed",
      });
    }
    await ctx.db.delete("businessFollowers", businessFollowers._id);
    await ctx.db.patch("business", args.businessId, {
      followersCount: (business.followersCount || 0) - 1,
    });
    await ctx.scheduler.runAfter(0, api.notification.sendNotification, {
      receiverId: business.userId,
      type: "business_unfollowed",
      businessHandle: business.handle,
      senderId: user._id,
      senderAccountType: user.accountType as "personal" | "business",
    });
    return {
      handle: business.handle,
      name: business.name,
    };
  },
});
