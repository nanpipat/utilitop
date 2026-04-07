"use client";

import { useState } from "react";
import ToolLayout, { InputArea, OutputArea, ActionButton, CopyButton, ErrorDisplay, Select } from "@/components/layout/ToolLayout";

export default function UnicodeTool() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState("encode");

  const process = (): { output: string; error: string } => {
    if (!input.trim()) return { output: "", error: "" };
    try {
      if (mode === "encode") {
        return { output: Array.from(input).map((c) => "\\u" + c.charCodeAt(0).toString(16).padStart(4, "0")).join(""), error: "" };
      } else {
        const decoded = input.replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
        return { output: decoded, error: "" };
      }
    } catch (e: any) {
      return { output: "", error: `${mode === "encode" ? "Encoding" : "Decoding"} failed: ${e.message}` };
    }
  };

  const result = process();

  return (
    <ToolLayout title="Unicode Encoder/Decoder" description="Convert text to/from Unicode escapes">
      <div className="flex flex-wrap items-center gap-3 mb-3">
        <Select value={mode} onChange={setMode} options={[{ value: "encode", label: "Text → Unicode" }, { value: "decode", label: "Unicode → Text" }]} />
        <ActionButton onClick={() => setInput("")} variant="secondary">Clear</ActionButton>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <span className="text-xs text-text-secondary mb-1 block">Input</span>
          <InputArea value={input} onChange={setInput} placeholder={mode === "encode" ? "Enter text..." : "Enter \\u0041 format..."} />
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
