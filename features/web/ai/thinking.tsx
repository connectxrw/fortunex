"use client";
import { motion } from "motion/react";
import { Loader } from "@/components/ai-elements/loader";
import { Shimmer } from "@/components/ai-elements/shimmer";

export const ThinkingMessage = () => {
  const role = "assistant";

  return (
    <motion.div
      animate={{ opacity: 1 }}
      className="group/message w-full"
      data-role={role}
      data-testid="message-assistant-loading"
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
      initial={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-start justify-start gap-3">
        <Loader />

        <div className="flex w-full flex-col gap-2 md:gap-4">
          <div className="p-0 text-muted-foreground text-sm">Thinking...</div>
        </div>
      </div>
    </motion.div>
  );
};

export function ThinkingIndicator() {
  return (
    <div className="flex flex-col">
      <Shimmer className="mb-1 font-medium text-sm">Thinking...</Shimmer>
      <div className="flex items-end gap-1 text-fd-muted-foreground text-sm">
        <div className="flex items-center gap-1 opacity-70">
          <span className="inline-block size-1 animate-bounce rounded-full bg-fd-primary [animation-delay:0ms]" />
          <span className="inline-block size-1 animate-bounce rounded-full bg-fd-primary opacity-80 [animation-delay:150ms]" />
          <span className="inline-block size-1 animate-bounce rounded-full bg-fd-primary [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  );
}
