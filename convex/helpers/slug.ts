import slugify from "slugify";
import type { QueryCtx } from "../_generated/server";
import { Id } from "../_generated/dataModel";

export function createSlug(title: string) {
  return slugify(title, {
    lower: true, // lowercase
    strict: true, // remove special chars
    trim: true, // trim hyphens
    locale: "en", // normalize chars
  }); // optional max length
}

export async function generateUniquePostSlug(
  ctx: QueryCtx,
  title: string,
  businessId: Id<"business">,
) {
  const baseSlug = createSlug(title);

  const existing = await ctx.db
    .query("post")
    .withIndex("by_businessId_slug", (q) =>
      q.eq("businessId", businessId).eq("slug", baseSlug),
    )
    .first();

  if (!existing) {
    return baseSlug;
  }

  let counter = 2;
  while (true) {
    const slug = `${baseSlug}-${counter}`;
    const found = await ctx.db
      .query("post")
      .withIndex("by_businessId_slug", (q) =>
        q.eq("businessId", businessId).eq("slug", slug),
      )
      .first();

    if (!found) {
      return slug;
    }
    counter++;
  }
}

export async function generateUniqueBusinessHandle(
  ctx: QueryCtx,
  name: string,
) {
  const baseSlug = createSlug(name);

  const existing = await ctx.db
    .query("business")
    .withIndex("by_handle", (q) => q.eq("handle", baseSlug))
    .first();

  if (!existing) {
    return baseSlug;
  }

  let counter = 2;
  while (true) {
    const slug = `${baseSlug}-${counter}`;
    const found = await ctx.db
      .query("business")
      .withIndex("by_handle", (q) => q.eq("handle", slug))
      .first();

    if (!found) {
      return slug;
    }
    counter++;
  }
}
