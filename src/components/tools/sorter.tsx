"use client";

import { useState } from "react";
import ToolLayout, { InputArea, OutputArea, ActionButton, CopyButton, Select, Toggle } from "@/components/layout/ToolLayout";

export default function TextSorter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [removeDuplicates, setRemoveDuplicates] = useState(false);
  const [trimWhitespace, setTrimWhitespace] = useState(false);
  const [ignoreCase, setIgnoreCase] = useState(false);

  const process = () => {
    if (!input.trim()) { setOutput(""); return; }
    let lines = input.split("\n");
    if (trimWhitespace) lines = lines.map((l) => l.trim());
    if (removeDuplicates) {
      if (ignoreCase) {
        const seen = new Set<string>();
        lines = lines.filter((l) => {
          const key = l.toLowerCase();
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });
      } else {
        lines = Array.from(new Set(lines));
      }
    }
    if (sortOrder === "asc") lines.sort((a, b) => a.localeCompare(b));
    else if (sortOrder === "desc") lines.sort((a, b) => b.localeCompare(a));
    else lines.sort(() => Math.random() - 0.5);
    setOutput(lines.join("\n"));
  };

  return (
    <ToolLayout title="Text Sorter & Deduplicator" description="Sort lines and remove duplicates">
      <div className="flex flex-wrap items-center gap-3 mb-3">
        <Select value={sortOrder} onChange={setSortOrder} label="Sort:" options={[{ value: "asc", label: "A → Z" }, { value: "desc", label: "Z → A" }, { value: "random", label: "Random shuffle" }]} />
        <Toggle label="Remove duplicates" checked={removeDuplicates} onChange={setRemoveDuplicates} />
        <Toggle label="Trim whitespace" checked={trimWhitespace} onChange={setTrimWhitespace} />
        <Toggle label="Ignore case (dedup)" checked={ignoreCase} onChange={setIgnoreCase} />
        <ActionButton onClick={process}>Process</ActionButton>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <div>
          <span className="text-xs text-text-secondary mb-1 block">Input</span>
          <InputArea value={input} onChange={setInput} placeholder="Enter lines to sort..." />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-text-secondary">Output</span>
            {output && <CopyButton value={output} />}
          </div>
          <OutputArea value={output} />
        </div>
      </div>
    </ToolLayout>
  );
}
