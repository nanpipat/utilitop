"use client";

import { useState } from "react";
import ToolLayout, { InputArea } from "@/components/layout/ToolLayout";

export default function WordCounter() {
  const [input, setInput] = useState("");

  const stats = {
    chars: input.length,
    charsNoSpaces: input.replace(/\s/g, "").length,
    words: input.trim() ? input.trim().split(/\s+/).length : 0,
    lines: input ? input.split("\n").length : 0,
    sentences: input.trim() ? (input.match(/[.!?]+/g) || []).length : 0,
    paragraphs: input.trim() ? input.split(/\n\s*\n/).filter((p) => p.trim()).length : 0,
    readingTime: Math.max(1, Math.ceil((input.trim() ? input.trim().split(/\s+/).length : 0) / 200)),
  };

  return (
    <ToolLayout title="Word & Character Counter" description="Count words, characters, lines, and more">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
        {[
          { label: "Characters", value: stats.chars },
          { label: "No spaces", value: stats.charsNoSpaces },
          { label: "Words", value: stats.words },
          { label: "Lines", value: stats.lines },
          { label: "Sentences", value: stats.sentences },
          { label: "Paragraphs", value: stats.paragraphs },
          { label: "Reading time", value: `${stats.readingTime} min` },
        ].map((s) => (
          <div key={s.label} className="px-3 py-2 bg-bg-secondary border border-border rounded-md text-center">
            <div className="text-lg font-semibold">{s.value}</div>
            <div className="text-[10px] text-text-secondary">{s.label}</div>
          </div>
        ))}
      </div>
      <InputArea value={input} onChange={setInput} placeholder="Type or paste text here..." />
    </ToolLayout>
  );
}
