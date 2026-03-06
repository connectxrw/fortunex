"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function ExpandableText({
  text,
  words = 10,
}: {
  text: string;
  words?: number;
}) {
  const [expanded, setExpanded] = useState(false);

  const wordList = text.split(" ");
  const isLong = wordList.length > words;

  const displayText = expanded ? text : wordList.slice(0, words).join(" ");

  return (
    <p className="text-foreground/80 leading-7 tracking-tight">
      {displayText}
      {isLong && !expanded && "... "}{" "}
      {isLong && (
        <Button
          className="h-auto p-0 font-medium"
          onClick={() => setExpanded((v) => !v)}
          size="sm"
          variant="link"
        >
          {expanded ? "See less" : "See more"}
        </Button>
      )}
    </p>
  );
}
