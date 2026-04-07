"use client";

import { useState } from "react";
import * as Diff from "diff";
import ToolLayout, { InputArea, Toggle } from "@/components/layout/ToolLayout";

export default function TextDiff() {
  const [original, setOriginal] = useState("");
  const [modified, setModified] = useState("");
  const [ignoreWhitespace, setIgnoreWhitespace] = useState(false);

  const changes = Diff.diffLines(original, modified, { ignoreWhitespace: ignoreWhitespace || undefined });

  return (
    <ToolLayout title="Text Diff" description="Compare two texts and show differences">
      <div className="flex flex-wrap items-center gap-3 mb-3">
        <Toggle label="Ignore whitespace" checked={ignoreWhitespace} onChange={setIgnoreWhitespace} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
        <div>
          <span className="text-xs text-text-secondary mb-1 block">Original</span>
          <InputArea value={original} onChange={setOriginal} placeholder="Enter original text..." />
        </div>
        <div>
          <span className="text-xs text-text-secondary mb-1 block">Modified</span>
          <InputArea value={modified} onChange={setModified} placeholder="Enter modified text..." />
        </div>
      </div>
      <div>
        <span className="text-xs text-text-secondary mb-1 block">Diff</span>
        <div className="px-3 py-2 bg-bg-secondary border border-border rounded-md font-mono text-sm overflow-x-auto max-h-96 overflow-y-auto whitespace-pre">
          {changes.map((part, i) => (
            <span
              key={i}
              className={
                part.added
                  ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                  : part.removed
                  ? "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 line-through"
                  : ""
              }
            >
              {part.value}
            </span>
          ))}
        </div>
      </div>
    </ToolLayout>
  );
}
