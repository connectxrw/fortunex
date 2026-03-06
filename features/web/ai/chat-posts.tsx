import { cn } from "@/lib/utils";
import type { TChatPost } from "@/types";
import { UnAuthPostCard } from "../post/un-auth/card";

export default function ChatPosts({ posts }: { posts: TChatPost[] }) {
  // remove score in posts
  return (
    <div className={cn("grid @xl/main:grid-cols-3 grid-cols-1 gap-4")}>
      {posts.map((post) => (
        <UnAuthPostCard key={post._id} post={post} showMore={false} />
      ))}
    </div>
  );
}
