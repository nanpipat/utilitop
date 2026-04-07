"use client";

import { useState } from "react";
import ToolLayout, { InputArea, OutputArea, ActionButton, CopyButton, ErrorDisplay, Select } from "@/components/layout/ToolLayout";

export default function Base64Tool() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState("encode");
  const [urlSafe, setUrlSafe] = useState(false);

  const process = (): { output: string; error: string } => {
    if (!input.trim()) return { output: "", error: "" };
    try {
      if (mode === "encode") {
        const encoder = new TextEncoder();
        const bytes = encoder.encode(input);
        let binary = "";
        bytes.forEach((b) => (binary += String.fromCharCode(b)));
        let result = btoa(binary);
        if (urlSafe) {
          result = result.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
        }
        return { output: result, error: "" };
      } else {
        let str = input.trim();
        if (urlSafe) {
          str = str.replace(/-/g, "+").replace(/_/g, "/");
          while (str.length % 4) str += "=";
        }
        const binary = atob(str);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
        const decoder = new TextDecoder();
        return { output: decoder.decode(bytes), error: "" };
      }
    } catch (e: any) {
      return { output: "", error: `${mode === "encode" ? "Encoding" : "Decoding"} failed: ${e.message}` };
    }
  };

  const result = process();

  return (
    <ToolLayout title="Base64 Encoder/Decoder" description="Encode and decode Base64 strings">
      <div className="flex flex-wrap items-center gap-3 mb-3">
        <Select value={mode} onChange={setMode} options={[{ value: "encode", label: "Encode" }, { value: "decode", label: "Decode" }]} />
        <label className="flex items-center gap-2 text-xs cursor-pointer">
          <input type="checkbox" checked={urlSafe} onChange={(e) => setUrlSafe(e.target.checked)} className="rounded border-border" />
          <span>URL-safe</span>
        </label>
        <ActionButton onClick={() => { setInput(""); }} variant="secondary">Clear</ActionButton>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-text-secondary">Input</span>
          </div>
          <InputArea value={input} onChange={setInput} placeholder={mode === "encode" ? "Enter text to encode..." : "Enter Base64 to decode..."} />
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
