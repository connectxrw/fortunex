import { paginationOptsValidator } from "convex/server";
import { query } from "../_generated/server";
import { businessCategory } from "../schema";
import { r2 } from "../uploadFiles";

export const getPublicBusinesses = query({
  args: {
    paginationOpts: paginationOptsValidator,
    category: businessCategory,
  },
  handler: async (ctx, args) => {
    const businesses = await ctx.db
      .query("business")
      .filter((q) =>
        q.and(
          q.eq(q.field("category"), args.category),
          q.neq(q.field("status"), "deleted"),
        ),
      )
      .order("desc")
      .paginate(args.paginationOpts);

    const businessesWithImages = await Promise.all(
      businesses.page.map(async (business) => {
        const logo = business.profileImageKey
          ? await r2.getUrl(business.profileImageKey, {
              expiresIn: 60 * 60 * 24 * 7,
            })
          : null;
        const coverImage = business.coverImageKey
          ? await r2.getUrl(business.coverImageKey, {
              expiresIn: 60 * 60 * 24 * 7,
            })
          : null;
        return { ...business, logo, coverImage };
      }),
    );

    return { ...businesses, page: businessesWithImages };
  },
});
