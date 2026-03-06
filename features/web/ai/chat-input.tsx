"use client";

import { useChat } from "@ai-sdk/react";
import type { FileUIPart } from "ai";
import {
  CopyIcon,
  RefreshCcwIcon,
  ShareIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
} from "lucide-react";
import Link from "next/link";
import { Fragment, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { ChatMessage } from "@/app/api/chat/route";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageAction,
  MessageActions,
  MessageAttachment,
  MessageAttachments,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputActionAddAttachments,
  PromptInputActionMenu,
  PromptInputActionMenuContent,
  PromptInputActionMenuTrigger,
  PromptInputAttachment,
  PromptInputAttachments,
  PromptInputBody,
  PromptInputFooter,
  type PromptInputMessage,
  PromptInputProvider,
  PromptInputSpeechButton,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from "@/components/ai-elements/prompt-input";
import { Button } from "@/components/ui/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import { useFilters } from "@/lib/nuqs-params";
import ChatPosts from "./chat-posts";
import { Greeting } from "./greeting";
import { ThinkingIndicator } from "./thinking";

export function ChatInput() {
  const [{ q }] = useFilters();
  const [input, setInput] = useState("");
  // const [webSearch, setWebSearch] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { messages, sendMessage, status, regenerate } = useChat<ChatMessage>();

  const handleSubmit = (message: PromptInputMessage) => {
    const hasText = Boolean(message.text);
    const hasAttachments = Boolean(message.files?.length);

    if (!(hasText || hasAttachments)) {
      return;
    }

    sendMessage(
      {
        text: message.text || "Sent with attachments",
        files: message.files,
      },
      // {
      //   body: {
      //     webSearch,
      //   },
      // }
    );
    setInput("");
  };
  // if we have q in params, we should focus the textarea
  useEffect(() => {
    if (q) {
      textareaRef.current?.focus();
      if (textareaRef.current) {
        textareaRef.current.value = q;
      }
    }
  }, [q]);

  return (
    <div className="relative mx-auto size-full h-[83vh] max-w-2xl lg:max-w-3xl">
      <div className="flex h-full w-full flex-col gap-2">
        <Conversation>
          <ConversationContent>
            {messages.length === 0 && <Greeting />}
            {messages.map((message, messageIndex) => {
              const isLastMessage = messageIndex === messages.length - 1;
              const isAssistant = message.role === "assistant";

              // Get all text content from the message
              const textParts = message.parts.filter((p) => p.type === "text");
              const toolParts = message.parts.filter(
                (p) => p.type === "tool-showPosts",
              );

              // Get file attachments
              const fileAttachments = message.parts
                .filter((p) => p.type === "file")
                .map((p) => {
                  const filePart = p as FileUIPart;
                  return {
                    type: "file" as const,
                    url: filePart.url,
                    mediaType: filePart.mediaType,
                    filename: filePart.filename,
                  };
                });

              // Combine all text content
              const fullTextContent = textParts
                .map((p) => (p as { type: "text"; text: string }).text)
                .join("\n\n");

              return (
                <Fragment key={message.id}>
                  {/* Render tool calls (posts) first */}
                  {toolParts.map((part, i) => (
                    <Message
                      className="flex flex-col"
                      from={message.role}
                      key={`${message.id}-tool-${i}`}
                    >
                      {part.type === "tool-showPosts" && part.output?.posts && (
                        <ChatPosts posts={part.output.posts} />
                      )}
                    </Message>
                  ))}

                  {/* Render text content if exists */}
                  {fullTextContent && (
                    <Message from={message.role}>
                      {fileAttachments.length > 0 && (
                        <MessageAttachments className="mb-2">
                          {fileAttachments.map((attachment, idx) => (
                            <MessageAttachment
                              data={attachment}
                              key={`${attachment.url}-${idx}`}
                            />
                          ))}
                        </MessageAttachments>
                      )}
                      <MessageContent>
                        <MessageResponse className="text-base text-foreground/90">
                          {fullTextContent}
                        </MessageResponse>
                      </MessageContent>
                    </Message>
                  )}

                  {/* Render actions ONCE at the end of assistant messages */}
                  {isAssistant && isLastMessage && fullTextContent && (
                    <MessageActions>
                      <MessageAction
                        label="Copy"
                        onClick={() => {
                          navigator.clipboard.writeText(fullTextContent);
                          toast("Copied to clipboard");
                        }}
                        tooltip="Copy"
                      >
                        <CopyIcon className="size-4" />
                      </MessageAction>
                      <MessageAction label="Like" tooltip="Like">
                        <ThumbsUpIcon className="size-4" />
                      </MessageAction>
                      <MessageAction label="Dislike" tooltip="Dislike">
                        <ThumbsDownIcon className="size-4" />
                      </MessageAction>
                      <MessageAction label="Share" tooltip="Share">
                        <ShareIcon className="size-4" />
                      </MessageAction>
                      <MessageAction
                        label="Retry"
                        onClick={() => regenerate()}
                        tooltip="Retry"
                      >
                        <RefreshCcwIcon className="size-4" />
                      </MessageAction>
                    </MessageActions>
                  )}
                </Fragment>
              );
            })}
            {status === "submitted" && <ThinkingIndicator />}
            {status === "error" && (
              <Item variant="muted">
                <ItemContent>
                  <ItemTitle>Message Limit Reached</ItemTitle>
                  <ItemDescription>
                    You&apos;ve reached the maximum message limit for this chat
                    session. Please try again later to continue.
                  </ItemDescription>
                </ItemContent>
                <ItemActions>
                  <Button asChild size="sm" variant="outline">
                    <Link href="/help-center">Learn more</Link>
                  </Button>
                </ItemActions>
              </Item>
            )}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>

        <div className="sticky bottom-0 z-2 mt-auto">
          <PromptInputProvider>
            <PromptInput
              className="bg-background"
              globalDrop
              multiple
              onSubmit={handleSubmit}
            >
              <PromptInputAttachments>
                {(attachment) => <PromptInputAttachment data={attachment} />}
              </PromptInputAttachments>
              <PromptInputBody>
                <PromptInputTextarea
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask anything..."
                  ref={textareaRef}
                  value={q ? q : input}
                />
              </PromptInputBody>
              <PromptInputFooter>
                <PromptInputTools>
                  <PromptInputActionMenu>
                    <PromptInputActionMenuTrigger />
                    <PromptInputActionMenuContent>
                      <PromptInputActionAddAttachments />
                    </PromptInputActionMenuContent>
                  </PromptInputActionMenu>
                  <PromptInputSpeechButton textareaRef={textareaRef} />
                </PromptInputTools>
                <PromptInputSubmit
                  disabled={!(input || status)}
                  status={status}
                />
              </PromptInputFooter>
            </PromptInput>
          </PromptInputProvider>
        </div>
      </div>
    </div>
  );
}
