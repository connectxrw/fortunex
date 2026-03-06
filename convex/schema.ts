import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const businessCategory = v.union(
  v.literal("restaurant"),
  v.literal("house"),
  v.literal("tourism"),
  v.literal("healthcare"),
  v.literal("shop"),
  v.literal("entertainment"),
  v.literal("education"),
  v.literal("technology"),
  v.literal("sports"),
  v.literal("agriculture"),
  v.literal("real estate"),
  v.literal("startup"),
  v.literal("jobs"),
  v.literal("media"),
  v.literal("other")
);

const applicationTables = {
  business: defineTable({
    name: v.string(),
    description: v.optional(v.string()),

    // Public identity
    handle: v.string(), // unique (enforced in mutation)
    category: businessCategory,
    location: v.optional(v.string()),

    // Contact
    email: v.string(),
    phone: v.optional(v.string()),
    website: v.optional(v.string()),
    socialLinks: v.optional(v.array(v.string())),
    socialMediaAccounts: v.optional(
      v.array(
        v.object({
          platform: v.string(),
          url: v.string(),
        })
      )
    ),

    // Media
    certificateFileKey: v.optional(v.string()),
    coverImageKey: v.optional(v.string()),
    profileImageKey: v.optional(v.string()),

    // State
    followersCount: v.optional(v.number()),
    status: v.optional(
      v.union(
        v.literal("verified"),
        v.literal("unverified"),
        v.literal("deleted")
      )
    ),

    // Location coordinates (for Near Me feature)
    latitude: v.optional(v.number()),
    longitude: v.optional(v.number()),

    // Ownership
    userId: v.string(),

    // Timestamps
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_handle", ["handle"]),

  businessFollowers: defineTable({
    businessId: v.id("business"),
    userId: v.string(),
    createdAt: v.number(),
  })
    .index("by_businessId", ["businessId"])
    .index("by_userId", ["userId"])
    .index("by_businessId_userId", ["businessId", "userId"]),

  post: defineTable({
    title: v.string(),
    slug: v.string(),
    content: v.string(),
    price: v.optional(v.string()),
    currency: v.optional(v.string()),
    subcategory: v.optional(v.string()),

    // Call to action
    ctaLink: v.optional(v.string()),
    ctaLabel: v.optional(v.string()),

    // Media
    coverImageKeys: v.array(v.string()),

    category: businessCategory,

    // Display
    viewType: v.union(v.literal("card"), v.literal("short")),

    // Workflow
    status: v.union(
      v.literal("draft"),
      v.literal("deleted"),
      v.literal("published"),
      v.literal("archived")
    ),

    // Relations
    userId: v.string(),
    businessId: v.id("business"),

    // Timestamps
    createdAt: v.number(),
    updatedAt: v.number(),

    // NEW: embedding field for vector search
    embedding: v.optional(v.array(v.float64())),
  })
    .index("by_slug_status", ["slug", "status"])
    .index("by_businessId_status", ["businessId", "status"])
    .index("by_businessId_slug", ["businessId", "slug"])
    .index("by_businessId", ["businessId"])
    .index("by_status", ["status"])
    .index("by_slug", ["slug"])
    .index("by_userId", ["userId"])
    .searchIndex("search_post", {
      searchField: "title",
      filterFields: ["status"],
    })

    // NEW: Vector index for semantic search
    .vectorIndex("by_embedding", {
      vectorField: "embedding",
      dimensions: 3072, // Google Gemini embedding dimension
      filterFields: ["status", "businessId"],
    }),

  savedPosts: defineTable({
    postId: v.id("post"),
    userId: v.string(),
  })
    .index("by_userId", ["userId"])
    .index("by_postId_userId", ["postId", "userId"]),

  likedPosts: defineTable({
    postId: v.id("post"),
    userId: v.string(),
  })
    .index("by_userId", ["userId"])
    .index("by_postId_userId", ["postId", "userId"]),

  notifications: defineTable({
    // Receiver of the notification
    receiverId: v.string(),

    // Who triggered it (optional, system/admin actions may not have one)
    senderId: v.string(),
    senderAccountType: v.union(v.literal("personal"), v.literal("business")),

    // Type of notification
    type: v.union(
      v.literal("business_followed"),
      v.literal("business_unfollowed"),
      v.literal("new_business_post"),
      v.literal("business_verified"),
      v.literal("business_unverified"),
      v.literal("business_contacted")
    ),

    // Related entities (optional, depends on type)
    businessHandle: v.optional(v.string()),
    postSlug: v.optional(v.string()),

    // Display content (denormalized for performance)
    title: v.string(),
    message: v.string(),

    // State
    isRead: v.boolean(),
    status: v.union(
      v.literal("inbox"),
      v.literal("archived"),
      v.literal("deleted")
    ),

    // Timestamps
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_receiverId", ["receiverId"])
    .index("by_receiverId_isRead", ["receiverId", "isRead"])
    .index("by_receiverId_status", ["receiverId", "status"]),
};
export default defineSchema({
  ...applicationTables,
});
