"use node";

import { api } from "../_generated/api";
import type { Doc } from "../_generated/dataModel";
import { action } from "../_generated/server";

export const backfillPostEmbeddings = action({
  args: {},
  handler: async (ctx): Promise<{ processed: number; message: string }> => {
    // Explicitly type the result to avoid circular inference errors
    const posts: Doc<"post">[] = await ctx.runQuery(
      api.ai.post.getPostsWithoutEmbeddings,
      {},
    );

    console.log(`Found ${posts.length} posts without embeddings`);
    // ... rest of your logic

    const postIds = posts.map((p) => p._id);

    // Process in batches of 10
    const batchSize = 10;
    for (let i = 0; i < postIds.length; i += batchSize) {
      const batch = postIds.slice(i, i + batchSize);
      await ctx.runAction(api.ai.post_actions.generateManyPostEmbeddings, {
        postIds: batch,
      });
      console.log(
        `Processed ${Math.min(i + batchSize, postIds.length)} of ${
          postIds.length
        }`,
      );
    }
    return {
      processed: posts.length,
      message: "Backfill complete",
    };
  },
});
