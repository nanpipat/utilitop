"use client";

import { useState } from "react";
import ToolLayout, { InputArea, OutputArea, ActionButton, CopyButton, ErrorDisplay, Select } from "@/components/layout/ToolLayout";

export default function UrlTool() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState("encode");
  const [method, setMethod] = useState("component");

  const process = (): { output: string; error: string } => {
    if (!input.trim()) return { output: "", error: "" };
    try {
      if (mode === "encode") {
        return { output: method === "component" ? encodeURIComponent(input) : encodeURI(input), error: "" };
      } else {
        return { output: method === "component" ? decodeURIComponent(input) : decodeURI(input), error: "" };
      }
    } catch (e: any) {
      return { output: "", error: `${mode === "encode" ? "Encoding" : "Decoding"} failed: ${e.message}` };
    }
  };

  const result = process();

  return (
    <ToolLayout title="URL Encoder/Decoder" description="Encode and decode URL components">
      <div className="flex flex-wrap items-center gap-3 mb-3">
        <Select value={mode} onChange={setMode} options={[{ value: "encode", label: "Encode" }, { value: "decode", label: "Decode" }]} />
        <Select value={method} onChange={setMethod} label="Method:" options={[{ value: "component", label: "encodeURIComponent" }, { value: "uri", label: "encodeURI" }]} />
        <ActionButton onClick={() => setInput("")} variant="secondary">Clear</ActionButton>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <span className="text-xs text-text-secondary mb-1 block">Input</span>
          <InputArea value={input} onChange={setInput} placeholder={mode === "encode" ? "Enter text to encode..." : "Enter encoded URL..."} />
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
