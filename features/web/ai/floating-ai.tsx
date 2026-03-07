"use client";

import { type UseChatHelpers, useChat } from "@ai-sdk/react";
import { Presence } from "@radix-ui/react-presence";
import { DefaultChatTransport, type FileUIPart } from "ai";
import { Authenticated, AuthLoading, Unauthenticated } from "convex/react";
import {
  CopyIcon,
  RefreshCcwIcon,
  ShareIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
  XIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  type ComponentProps,
  createContext,
  Fragment,
  use,
  useEffect,
  useRef,
  useState,
} from "react";
import { RemoveScroll } from "react-remove-scroll";
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
import { Suggestion, Suggestions } from "@/components/ai-elements/suggestion";
import { Button } from "@/components/ui/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import { Spinner } from "@/components/ui/spinner";
import { useIsMobile } from "@/hooks/use-mobile";
import { useFilters } from "@/lib/nuqs-params";
import { cn } from "@/lib/utils";
import ChatPosts from "./chat-posts";
import { Greeting } from "./greeting";
import { suggestions } from "./suggestions";
import { ThinkingIndicator } from "./thinking";

const Context = createContext<{
  ai: boolean;
  setSearchParams: (params: { ai: boolean }) => void;
  chat: UseChatHelpers<ChatMessage>;
} | null>(null);

function useChatContext() {
  // biome-ignore lint/style/noNonNullAssertion: <explanation>
  return use(Context)!.chat;
}

function SearchAIInput() {
  const { status, sendMessage, messages } = useChatContext();
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isLoading = status === "streaming" || status === "submitted";
  const showSuggestions = messages.length === 0 && !isLoading;

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage({ text: suggestion });
  };

  const handleSubmit = (message: PromptInputMessage) => {
    const hasText = Boolean(message.text);
    const hasAttachments = Boolean(message.files?.length);

    if (!(hasText || hasAttachments)) {
      return;
    }

    sendMessage({
      text: message.text || "Sent with attachments",
      files: message.files,
    });
    setInput("");
  };

  useEffect(() => {
    if (isLoading) {
      document.getElementById("nd-ai-input")?.focus();
    }
  }, [isLoading]);

  return (
    <>
      {showSuggestions && (
        <Suggestions className="mb-2">
          {suggestions.map((suggestion) => (
            <Suggestion
              key={suggestion}
              onClick={handleSuggestionClick}
              suggestion={suggestion}
            />
          ))}
        </Suggestions>
      )}
      <div className={cn(isLoading ? "opacity-50" : "")}>
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
                value={input}
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
    </>
  );
}

function List(
  props: Omit<ComponentProps<"div">, "dir"> & { messagecount: number },
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isUserScrollingRef = useRef(false);
  const prevmessagecountRef = useRef(props.messagecount);

  // Scroll to bottom when new message is submitted
  useEffect(() => {
    if (props.messagecount > prevmessagecountRef.current) {
      // New message submitted, reset scroll lock and scroll to bottom
      isUserScrollingRef.current = false;
      if (containerRef.current) {
        containerRef.current.scrollTo({
          top: containerRef.current.scrollHeight,
          behavior: "smooth",
        });
      }
    }
    prevmessagecountRef.current = props.messagecount;
  }, [props.messagecount]);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }
    function callback() {
      const container = containerRef.current;
      if (!container) {
        return;
      }

      // Only auto-scroll if user hasn't manually scrolled up
      if (!isUserScrollingRef.current) {
        container.scrollTo({
          top: container.scrollHeight,
          behavior: "instant",
        });
      }
    }

    const observer = new ResizeObserver(callback);
    callback();

    const element = containerRef.current?.firstElementChild;

    if (element) {
      observer.observe(element);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  // Track when user manually scrolls
  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 50;

      // If user is near bottom, enable auto-scroll, otherwise disable it
      isUserScrollingRef.current = !isNearBottom;
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      ref={containerRef}
      {...props}
      className={cn(
        "fd-scroll-container flex min-w-0 flex-col overflow-y-auto",
        props.className,
      )}
    >
      {props.children}
    </div>
  );
}

export function FloatingAIChat() {
  const [{ ai }, setSearchParams] = useFilters();
  const isMobile = useIsMobile();
  const pathname = usePathname();

  const chat = useChat<ChatMessage>({
    id: "search",
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });
  const onKeyPress = (e: KeyboardEvent) => {
    if (e.key === "Escape" && ai) {
      setSearchParams({ ai: false });
      e.preventDefault();
    }

    if (e.key === "/" && (e.metaKey || e.ctrlKey) && !ai) {
      setSearchParams({ ai: true });
      e.preventDefault();
    }
  };

  const onKeyPressRef = useRef(onKeyPress);
  onKeyPressRef.current = onKeyPress;
  useEffect(() => {
    const listener = (e: KeyboardEvent) => onKeyPressRef.current(e);
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, []);
  if (pathname.endsWith("/chat")) {
    return null;
  }

  return (
    <Context value={{ chat, ai, setSearchParams }}>
      <RemoveScroll enabled={ai}>
        <Presence present={ai}>
          <div
            className={cn(
              "@container/main fixed inset-0 z-50 flex flex-col items-center bg-background",
              isMobile
                ? "p-4 py-2 pb-40"
                : "right-(--removed-body-scroll-bar-size,0) p-2 pb-33.5",
              ai ? "animate-fd-fade-in" : "animate-fd-fade-out",
            )}
          >
            <div
              className={cn(
                "sticky top-0 flex items-center justify-end gap-2",
                isMobile ? "w-full" : "w-[min(800px,90vw)]",
              )}
            >
              <Button
                className="rounded-full"
                onClick={() => setSearchParams({ ai: false })}
                size="icon-sm"
                variant={"outline"}
              >
                <XIcon />
              </Button>
            </div>
            <AuthLoading>
              <Spinner />
            </AuthLoading>
            <Unauthenticated>
              <div className="flex h-screen w-full max-w-sm flex-col justify-center space-y-8">
                <div className="space-y-2 text-center">
                  <h1 className="mb-4 font-serif text-lg">Welcome to Chat</h1>
                  <p className="font-sans text-muted-foreground text-sm">
                    Sign in to continue using the AI chat
                  </p>
                </div>
                <Button asChild className="rounded-full" size="lg">
                  <Link href="/login">Sign in</Link>
                </Button>
              </div>
            </Unauthenticated>
            <Authenticated>
              <List
                className={cn(
                  "overscroll-contain",
                  isMobile ? "w-full px-2" : "w-[min(800px,90vw)] pr-2",
                )}
                messagecount={chat.messages.length}
              >
                <ChatMessages
                  messages={chat.messages}
                  regenerate={chat.regenerate}
                  status={chat.status}
                />
              </List>
            </Authenticated>
          </div>
        </Presence>
        <Authenticated>
          <div
            className={cn(
              "fixed z-50 -translate-x-1/2 bg-transparent transition-[width,height] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
              isMobile ? "bottom-4" : "bottom-4",
              ai
                ? isMobile
                  ? "h-auto w-[calc(100vw-2rem)] overflow-visible"
                  : "h-auto w-[min(800px,90vw)] overflow-visible"
                : isMobile
                  ? "h-9 w-32 overflow-hidden rounded-2xl text-fd-secondary-foreground lg:h-12"
                  : "h-10 w-40 overflow-hidden rounded-2xl text-fd-secondary-foreground",
            )}
            style={{
              left: "calc(50% - var(--removed-body-scroll-bar-size,0px)/2)",
            }}
          >
            {ai && (
              <div className="flex flex-col">
                <SearchAIInput />
              </div>
            )}
          </div>
        </Authenticated>
      </RemoveScroll>
    </Context>
  );
}

function ChatMessages({
  messages,
  status,
  regenerate,
}: {
  messages: ChatMessage[];
  status: string;
  regenerate: () => void;
}) {
  return (
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
  );
}
