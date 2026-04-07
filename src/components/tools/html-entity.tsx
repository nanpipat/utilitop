"use client";

import { useState } from "react";
import ToolLayout, { InputArea, OutputArea, ActionButton, CopyButton, ErrorDisplay, Select } from "@/components/layout/ToolLayout";

export default function HtmlEntityTool() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState("encode");

  const process = (): { output: string; error: string } => {
    if (!input.trim()) return { output: "", error: "" };
    try {
      if (mode === "encode") {
        const el = document.createElement("div");
        el.textContent = input;
        return { output: el.innerHTML, error: "" };
      } else {
        const el = document.createElement("div");
        el.innerHTML = input;
        return { output: el.textContent || "", error: "" };
      }
    } catch (e: any) {
      return { output: "", error: `${mode === "encode" ? "Encoding" : "Decoding"} failed: ${e.message}` };
    }
  };

  const result = process();

  return (
    <ToolLayout title="HTML Entity Encoder/Decoder" description="Encode and decode HTML entities">
      <div className="flex flex-wrap items-center gap-3 mb-3">
        <Select value={mode} onChange={setMode} options={[{ value: "encode", label: "Encode" }, { value: "decode", label: "Decode" }]} />
        <ActionButton onClick={() => setInput("")} variant="secondary">Clear</ActionButton>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <div>
          <span className="text-xs text-text-secondary mb-1 block">Input</span>
          <InputArea value={input} onChange={setInput} placeholder={mode === "encode" ? "Enter text with special characters..." : "Enter HTML entities..."} />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-text-secondary">Output</span>
            {result.output && <CopyButton value={result.output} />}
          </div>
          <OutputArea value={result.output} />
        </div>
      </div>
      {result.error && <div className="mt-2"><ErrorDisplay message={result.error} /></div>}
    </ToolLayout>
  );
}
