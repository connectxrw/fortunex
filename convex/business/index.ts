import { ConvexError, v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { authComponent } from "../auth";
import { generateUniqueBusinessHandle } from "../helpers/slug";
import { businessCategory } from "../schema";
import { r2 } from "../uploadFiles";

export const addBusiness = mutation({
  args: {
    businessName: v.string(),
    businessCategory,
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);

    if (!user) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Unauthorized",
      });
    }
    const handle = await generateUniqueBusinessHandle(ctx, args.businessName);

    // Insert new question paper
    await ctx.db.insert("business", {
      name: args.businessName,
      email: user.email,
      category: args.businessCategory,
      handle,
      status: "unverified",
      followersCount: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      userId: user._id,
    });

    return { name: args.businessName, handle };
  },
});

export const getMyBusiness = query({
  args: {},
  handler: async (ctx) => {
    let user;
    try {
      user = await authComponent.getAuthUser(ctx);
    } catch {
      return { success: false, data: null };
    }
    if (!user || user.accountType !== "business") {
      return {
        success: false,
        data: null,
      };
    }
    const business = await ctx.db
      .query("business")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .first();
    if (!business || business.userId !== user._id) {
      return {
        success: true,
        data: null,
      };
    }

    const coverImageUrl = business.coverImageKey
      ? await r2.getUrl(business.coverImageKey, {
          expiresIn: 60 * 60 * 24 * 7,
        })
      : null;
    const profileImageUrl = business.profileImageKey
      ? await r2.getUrl(business.profileImageKey, {
          expiresIn: 60 * 60 * 24 * 7,
        })
      : null;

    const certificateFileUrl = business.certificateFileKey
      ? await r2.getUrl(business.certificateFileKey, {
          expiresIn: 60 * 60 * 24 * 7,
        })
      : null;

    return {
      success: true,
      data: {
        ...business,
        coverImageUrl,
        profileImageUrl,
        certificateFileUrl,
      },
    };
  },
});

export const getBusinessByHandle = query({
  args: {
    handle: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Unauthorized",
      });
    }

    const business = await ctx.db
      .query("business")
      .withIndex("by_handle", (q) => q.eq("handle", args.handle))
      .first();
    if (!business) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Business not found",
      });
    }

    const businessFollowers = await ctx.db
      .query("businessFollowers")
      .withIndex("by_businessId_userId", (q) =>
        q.eq("businessId", business._id).eq("userId", user._id),
      )
      .first();

    const coverImageUrl = business.coverImageKey
      ? await r2.getUrl(business.coverImageKey, {
          expiresIn: 60 * 60 * 24 * 7,
        })
      : null;
    const profileImageUrl = business.profileImageKey
      ? await r2.getUrl(business.profileImageKey, {
          expiresIn: 60 * 60 * 24 * 7,
        })
      : null;

    const posts = await ctx.db
      .query("post")
      .withIndex("by_businessId", (q) => q.eq("businessId", business._id))
      .collect();
    const postsCount = posts.length;

    return {
      ...business,
      coverImageUrl,
      profileImageUrl,
      postsCount,
      isFollowing: !!businessFollowers,
      isMyBusiness: business.userId === user._id,
    };
  },
});

export const updateBusinessName = mutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Unauthorized",
      });
    }
    const business = await ctx.db
      .query("business")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .first();

    if (!business || business.userId !== user._id) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Business not found",
      });
    }

    let handle = business.handle;

    if (args.name !== business.name) {
      handle = await generateUniqueBusinessHandle(ctx, args.name);
    }

    await ctx.db.patch("business", business._id, {
      name: args.name,
      handle,
      updatedAt: Date.now(),
    });
    return {
      success: true,
    };
  },
});

export const updateBusinessCertificate = mutation({
  args: {
    certificateFileKey: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Unauthorized",
      });
    }
    const business = await ctx.db
      .query("business")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .first();

    if (!business || business.userId !== user._id) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Business not found",
      });
    }

    await ctx.db.patch("business", business._id, {
      certificateFileKey: args.certificateFileKey,
      updatedAt: Date.now(),
    });
    return {
      success: true,
    };
  },
});

export const deleteBusinessCertificate = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Unauthorized",
      });
    }
    const business = await ctx.db
      .query("business")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .first();

    if (!business || business.userId !== user._id) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Business not found",
      });
    }

    if (business.certificateFileKey) {
      try {
        await r2.deleteObject(ctx, business.certificateFileKey);
      } catch (error) {
        console.error("Failed to delete image:", error);
        throw new ConvexError({
          code: "INTERNAL",
          message: "Failed to delete old file",
        });
      }
    }
    await ctx.db.patch("business", business._id, {
      certificateFileKey: undefined,
      updatedAt: Date.now(),
    });
    return {
      success: true,
    };
  },
});

const REGX = /^[a-z0-9-]+$/;

export const updateBusinessHandle = mutation({
  args: {
    handle: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Unauthorized",
      });
    }
    const business = await ctx.db
      .query("business")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .first();
    if (!business || business.userId !== user._id) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Business not found",
      });
    }
    const existing = await ctx.db
      .query("business")
      .withIndex("by_handle", (q) => q.eq("handle", args.handle))
      .first();

    if (existing && existing._id !== business._id) {
      throw new ConvexError({
        code: "BAD_REQUEST",
        message: "Handle already taken",
      });
    }
    if (!REGX.test(args.handle)) {
      throw new ConvexError({
        code: "BAD_REQUEST",
        message: "Invalid handle format",
      });
    }
    await ctx.db.patch("business", business._id, {
      handle: args.handle,
      updatedAt: Date.now(),
    });
    return {
      success: true,
    };
  },
});

export const updateBusinessDescription = mutation({
  args: {
    description: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Unauthorized",
      });
    }
    const business = await ctx.db
      .query("business")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .first();
    if (!business || business.userId !== user._id) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Business not found",
      });
    }
    await ctx.db.patch("business", business._id, {
      description: args.description,
      updatedAt: Date.now(),
    });
    return {
      success: true,
    };
  },
});

export const updateBusinessSocialMediaAccounts = mutation({
  args: {
    socialMediaAccounts: v.array(
      v.object({
        platform: v.string(),
        url: v.string(),
      }),
    ),
  },
  async handler(ctx, args) {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Unauthorized",
      });
    }
    const business = await ctx.db
      .query("business")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .first();
    if (!business || business.userId !== user._id) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Business not found",
      });
    }
    await ctx.db.patch("business", business._id, {
      socialMediaAccounts: args.socialMediaAccounts,
      updatedAt: Date.now(),
    });

    return {
      success: true,
    };
  },
});

export const deleteBusinessSocialMediaAccount = mutation({
  args: {
    url: v.string(),
    platform: v.string(),
  },
  async handler(ctx, args) {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Unauthorized",
      });
    }
    const business = await ctx.db
      .query("business")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .first();

    if (!business || business.userId !== user._id) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Business not found",
      });
    }
    await ctx.db.patch("business", business._id, {
      socialMediaAccounts: business.socialMediaAccounts?.filter(
        (account) =>
          account.platform !== args.platform && account.url !== args.url,
      ),
      updatedAt: Date.now(),
    });

    return {
      success: true,
    };
  },
});

export const updateBusinessCategory = mutation({
  args: {
    category: businessCategory,
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Unauthorized",
      });
    }
    const business = await ctx.db
      .query("business")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .first();
    if (!business || business.userId !== user._id) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Business not found",
      });
    }
    await ctx.db.patch("business", business._id, {
      category: args.category,
      updatedAt: Date.now(),
    });
    return {
      success: true,
    };
  },
});

export const updateBusinessContactInfo = mutation({
  args: {
    email: v.string(),
    phone: v.string(),
    location: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Unauthorized",
      });
    }
    const business = await ctx.db
      .query("business")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .first();
    if (!business || business.userId !== user._id) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Business not found",
      });
    }
    await ctx.db.patch("business", business._id, {
      email: args.email,
      phone: args.phone,
      location: args.location,
      updatedAt: Date.now(),
    });
    return {
      success: true,
    };
  },
});

export const updateBusinessCoordinates = mutation({
  args: {
    latitude: v.number(),
    longitude: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) {
      throw new ConvexError({ code: "UNAUTHORIZED", message: "Unauthorized" });
    }
    const business = await ctx.db
      .query("business")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .first();
    if (!business || business.userId !== user._id) {
      throw new ConvexError({ code: "NOT_FOUND", message: "Business not found" });
    }
    await ctx.db.patch("business", business._id, {
      latitude: args.latitude,
      longitude: args.longitude,
      updatedAt: Date.now(),
    });
    return { success: true };
  },
});

export const updateBusinessHours = mutation({
  args: {
    openingHours: v.array(
      v.object({
        day: v.union(
          v.literal("monday"),
          v.literal("tuesday"),
          v.literal("wednesday"),
          v.literal("thursday"),
          v.literal("friday"),
          v.literal("saturday"),
          v.literal("sunday"),
        ),
        open: v.optional(v.string()),
        close: v.optional(v.string()),
        closed: v.boolean(),
      }),
    ),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) {
      throw new ConvexError({ code: "UNAUTHORIZED", message: "Unauthorized" });
    }
    const business = await ctx.db
      .query("business")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .first();
    if (!business || business.userId !== user._id) {
      throw new ConvexError({ code: "NOT_FOUND", message: "Business not found" });
    }
    await ctx.db.patch("business", business._id, {
      openingHours: args.openingHours,
      updatedAt: Date.now(),
    });
    return { success: true };
  },
});

export const updateBusinessLinks = mutation({
  args: {
    links: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Unauthorized",
      });
    }
    const business = await ctx.db
      .query("business")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .first();
    if (!business || business.userId !== user._id) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Business not found",
      });
    }
    await ctx.db.patch("business", business._id, {
      socialLinks: args.links,
      updatedAt: Date.now(),
    });
    return {
      success: true,
    };
  },
});
export const updateBusinessCoverImage = mutation({
  args: {
    coverImageKey: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Unauthorized",
      });
    }
    const business = await ctx.db
      .query("business")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .first();
    if (!business || business.userId !== user._id) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Business not found",
      });
    }
    await ctx.db.patch("business", business._id, {
      coverImageKey: args.coverImageKey,
      updatedAt: Date.now(),
    });
    return {
      success: true,
    };
  },
});

export const removeBusinessCoverImage = mutation({
  handler: async (ctx) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Unauthorized",
      });
    }
    const business = await ctx.db
      .query("business")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .first();
    if (!business || business.userId !== user._id) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Business not found",
      });
    }
    if (business.coverImageKey) {
      try {
        await r2.deleteObject(ctx, business.coverImageKey);
      } catch {
        throw new ConvexError({
          code: "INTERNAL",
          message: "Failed to delete old file",
        });
      }
    }
    await ctx.db.patch("business", business._id, {
      coverImageKey: undefined,
      updatedAt: Date.now(),
    });
    return {
      success: true,
    };
  },
});

export const updateBusinessProfileImage = mutation({
  args: {
    profileImageKey: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Unauthorized",
      });
    }
    const business = await ctx.db
      .query("business")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .first();
    if (!business || business.userId !== user._id) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Business not found",
      });
    }
    await ctx.db.patch("business", business._id, {
      profileImageKey: args.profileImageKey,
      updatedAt: Date.now(),
    });
    return {
      success: true,
    };
  },
});

export const removeBusinessProfileImage = mutation({
  handler: async (ctx) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Unauthorized",
      });
    }
    const business = await ctx.db
      .query("business")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .first();
    if (!business || business.userId !== user._id) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Business not found",
      });
    }
    if (business.profileImageKey) {
      try {
        await r2.deleteObject(ctx, business.profileImageKey);
      } catch {
        throw new ConvexError({
          code: "INTERNAL",
          message: "Failed to delete old file",
        });
      }
    }
    await ctx.db.patch("business", business._id, {
      profileImageKey: undefined,
      updatedAt: Date.now(),
    });
    return {
      success: true,
    };
  },
});
