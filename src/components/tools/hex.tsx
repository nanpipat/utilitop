"use client";

import { useState } from "react";
import ToolLayout, { InputArea, OutputArea, ActionButton, CopyButton, ErrorDisplay, Select } from "@/components/layout/ToolLayout";

export default function HexTool() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState("encode");

  const process = (): { output: string; error: string } => {
    if (!input.trim()) return { output: "", error: "" };
    try {
      if (mode === "encode") {
        return { output: Array.from(new TextEncoder().encode(input)).map((b) => b.toString(16).padStart(2, "0")).join(" "), error: "" };
      } else {
        const hex = input.trim().replace(/\s+/g, "");
        const bytes = new Uint8Array(hex.length / 2);
        for (let i = 0; i < hex.length; i += 2) bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
        return { output: new TextDecoder().decode(bytes), error: "" };
      }
    } catch (e: any) {
      return { output: "", error: `${mode === "encode" ? "Encoding" : "Decoding"} failed: ${e.message}` };
    }
  };

  const result = process();

  return (
    <ToolLayout title="Hex Encoder/Decoder" description="Convert text to/from hexadecimal">
      <div className="flex flex-wrap items-center gap-3 mb-3">
        <Select value={mode} onChange={setMode} options={[{ value: "encode", label: "Text → Hex" }, { value: "decode", label: "Hex → Text" }]} />
        <ActionButton onClick={() => setInput("")} variant="secondary">Clear</ActionButton>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <div>
          <span className="text-xs text-text-secondary mb-1 block">Input</span>
          <InputArea value={input} onChange={setInput} placeholder={mode === "encode" ? "Enter text..." : "Enter hex string..."} />
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
