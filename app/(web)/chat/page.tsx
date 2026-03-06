import { MessageCircleIcon } from "lucide-react";
import type { Metadata } from "next";
import { Suspense } from "react";
import Container from "@/components/custom/container";
import { SiteHeader } from "@/features/web/_shared/site-header";
import { ChatInput } from "@/features/web/ai/chat-input";

export const metadata: Metadata = {
  title: "Chat",
};
export default function ChatPage() {
  return (
    <div className="flex h-full flex-col gap-2">
      <div className="container sticky top-0 z-50 bg-secondary">
        <SiteHeader
          icon={<MessageCircleIcon className="size-4 text-muted-foreground" />}
          title="Chat"
        />
      </div>
      <Container className="relative h-full md:py-4">
        <Suspense>
          <ChatInput />
        </Suspense>
      </Container>
    </div>
  );
}
