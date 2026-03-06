import { ConvexError, v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { authComponent } from "../auth";
import { api } from "../_generated/api";
import { r2 } from "../uploadFiles";

export const getAllBusinesses = query({
  args: {},
  handler: async (ctx) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Unauthorized",
      });
    }
    // check if he is admin
    if (
      user.email !== (process.env.ADMIN_EMAIL as string) ||
      !user.emailVerified
    ) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Unauthorized",
      });
    }
    const businesses = await ctx.db.query("business").collect();
    const businessesWithCertificate = await Promise.all(
      businesses.map(async (business) => ({
        id: business._id,
        name: business.name,
        handle: business.handle,
        category: business.category,
        email: business.email,
        status: business.status,
        createdAt: business.createdAt,
        updatedAt: business.updatedAt,
        certificateFileUrl: business.certificateFileKey
          ? await r2.getUrl(business.certificateFileKey, {
              expiresIn: 60 * 60 * 24 * 7,
            })
          : null,
      })),
    );

    return businessesWithCertificate;
  },
});

export const verifyBusiness = mutation({
  args: {
    businessId: v.id("business"),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Unauthorized",
      });
    }
    // check if he is admin
    if (
      user.email !== (process.env.ADMIN_EMAIL as string) ||
      !user.emailVerified
    ) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Unauthorized",
      });
    }
    const business = await ctx.db.get("business", args.businessId);
    if (!business) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Business not found",
      });
    }
    await ctx.db.patch("business", args.businessId, {
      status: "verified",
    });
    await ctx.runMutation(api.notification.sendNotification, {
      receiverId: business.userId,
      type: "business_verified",
      businessHandle: business.handle,
      senderId: user._id,
      senderAccountType: "personal",
    });
    return {
      success: true,
    };
  },
});

export const unverifyBusiness = mutation({
  args: {
    businessId: v.id("business"),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Unauthorized",
      });
    }
    // check if he is admin
    if (
      user.email !== (process.env.ADMIN_EMAIL as string) ||
      !user.emailVerified
    ) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Unauthorized",
      });
    }
    const business = await ctx.db.get("business", args.businessId);
    if (!business) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Business not found",
      });
    }
    await ctx.db.patch("business", args.businessId, {
      status: "unverified",
    });
    await ctx.runMutation(api.notification.sendNotification, {
      receiverId: business.userId,
      type: "business_unverified",
      businessHandle: business.handle,
      senderId: user._id,
      senderAccountType: "personal",
    });
    return {
      success: true,
    };
  },
});
