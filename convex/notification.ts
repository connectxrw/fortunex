import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";
import { authComponent } from "./auth";
import { getNotificationContent } from "./helpers";
import { r2 } from "./uploadFiles";

export const sendNotification = mutation({
  args: {
    receiverId: v.string(),
    senderId: v.string(),
    senderAccountType: v.union(v.literal("personal"), v.literal("business")),
    type: v.union(
      v.literal("business_followed"),
      v.literal("business_unfollowed"),
      v.literal("new_business_post"),
      v.literal("business_verified"),
      v.literal("business_unverified"),
      v.literal("business_contacted"),
    ),
    businessHandle: v.optional(v.string()),
    postSlug: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (args.type === "new_business_post") {
      console.log("new_business_post args", args);
    }
    const {
      receiverId,
      senderId,
      senderAccountType,
      type,
      businessHandle,
      postSlug,
    } = args;

    const sender =
      args.senderAccountType === "personal"
        ? await authComponent.getAnyUserById(ctx, senderId)
        : await ctx.db.get("business", senderId as Id<"business">);

    if (!sender) {
      console.log("Sender not found for", args);
      return { success: false, message: "Sender not found" };
    }

    const { title, message } = getNotificationContent({
      type,
      actorName:
        args.senderAccountType === "personal" ? sender.name : sender.name,
    });

    await ctx.db.insert("notifications", {
      receiverId,
      senderId,
      senderAccountType,
      type,
      businessHandle,
      postSlug,
      title,
      message,
      isRead: false,
      status: "inbox",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return {
      success: true,
      message: "Notification sent successfully",
    };
  },
});

export const getMyNotifications = query({
  handler: async (ctx) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) {
      return {
        data: null,
        success: false,
        message: "Unauthorized",
      };
    }
    const notifications = await ctx.db
      .query("notifications")
      .withIndex("by_receiverId", (q) => q.eq("receiverId", user._id))
      .collect();

    const notificationsWithSender = await Promise.all(
      notifications.map(async (notification) => {
        let senderAvatarUrl: string | null = null;
        if (notification.senderAccountType === "business") {
          const business = await ctx.db.get(
            notification.senderId as Id<"business">,
          );
          if (business?.profileImageKey) {
            senderAvatarUrl = await r2.getUrl(business.profileImageKey, {
              expiresIn: 60 * 60 * 24 * 7, // 7 days
            });
          }
        } else {
          const sender = await authComponent.getAnyUserById(
            ctx,
            notification.senderId,
          );
          senderAvatarUrl = sender?.image ?? null;
        }

        return {
          ...notification,
          senderAvatarUrl,
        };
      }),
    );

    return {
      data: notificationsWithSender.sort((a, b) => b.createdAt - a.createdAt),
      success: true,
      message: "Notifications fetched successfully",
    };
  },
});

export const toggleNotificationAsRead = mutation({
  args: {
    notificationId: v.id("notifications"),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) {
      return {
        success: false,
        message: "Unauthorized",
      };
    }
    const notification = await ctx.db.get(args.notificationId);
    if (!notification || notification.receiverId !== user._id) {
      return {
        success: false,
        message: "Notification not found",
      };
    }
    await ctx.db.patch("notifications", args.notificationId, {
      isRead: !notification.isRead,
    });
    return {
      success: true,
      message: notification.isRead
        ? "Notification marked as unread"
        : "Notification marked as read",
    };
  },
});

export const toggleNotificationAsArchived = mutation({
  args: {
    notificationId: v.id("notifications"),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) {
      return {
        success: false,
        message: "Unauthorized",
      };
    }
    const notification = await ctx.db.get(args.notificationId);
    if (!notification || notification.receiverId !== user._id) {
      return {
        success: false,
        message: "Notification not found",
      };
    }
    await ctx.db.patch("notifications", args.notificationId, {
      status: notification.status === "archived" ? "inbox" : "archived",
    });
    return {
      success: true,
      message:
        notification.status === "archived"
          ? "Notification unarchived"
          : "Notification archived",
    };
  },
});

export const deleteNotification = mutation({
  args: {
    notificationId: v.id("notifications"),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) {
      return {
        success: false,
        message: "Unauthorized",
      };
    }
    const notification = await ctx.db.get(args.notificationId);
    if (!notification || notification.receiverId !== user._id) {
      return {
        success: false,
        message: "Notification not found",
      };
    }
    await ctx.db.delete("notifications", args.notificationId);
    return {
      success: true,
      message: "Notification deleted",
    };
  },
});
