"use client";

import { useState } from "react";
import ToolLayout, { InputArea, OutputArea, ActionButton, CopyButton, ErrorDisplay, Select } from "@/components/layout/ToolLayout";

export default function GzipTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [mode, setMode] = useState("compress");
  const [stats, setStats] = useState<{ original: number; result: number; ratio: string } | null>(null);

  const compress = async () => {
    if (!input.trim()) { setOutput(""); setError(""); setStats(null); return; }
    try {
      if (mode === "compress") {
        const encoder = new TextEncoder();
        const data = encoder.encode(input);
        const cs = new CompressionStream("gzip");
        const writer = cs.writable.getWriter();
        const reader = cs.readable.getReader();
        writer.write(data);
        writer.close();
        const chunks: Uint8Array[] = [];
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          chunks.push(value);
        }
        const total = chunks.reduce((acc, c) => acc + c.length, 0);
        const combined = new Uint8Array(total);
        let offset = 0;
        for (const c of chunks) { combined.set(c, offset); offset += c.length; }
        let binary = "";
        combined.forEach((b) => (binary += String.fromCharCode(b)));
        const result = btoa(binary);
        setOutput(result);
        setStats({ original: data.length, result: combined.length, ratio: ((combined.length / data.length) * 100).toFixed(1) + "%" });
        setError("");
      } else {
        const binary = atob(input.trim());
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
        const ds = new DecompressionStream("gzip");
        const writer = ds.writable.getWriter();
        const reader = ds.readable.getReader();
        writer.write(bytes);
        writer.close();
        const chunks: Uint8Array[] = [];
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          chunks.push(value);
        }
        const total = chunks.reduce((acc, c) => acc + c.length, 0);
        const combined = new Uint8Array(total);
        let offset = 0;
        for (const c of chunks) { combined.set(c, offset); offset += c.length; }
        const decoder = new TextDecoder();
        setOutput(decoder.decode(combined));
        setStats({ original: bytes.length, result: combined.length, ratio: ((combined.length / bytes.length) * 100).toFixed(1) + "%" });
        setError("");
      }
    } catch (e: any) {
      setError(`Error: ${e.message}`);
      setOutput("");
      setStats(null);
    }
  };

  return (
    <ToolLayout title="GZip Compress/Decompress" description="Compress and decompress text with GZip">
      <div className="flex flex-wrap items-center gap-3 mb-3">
        <Select value={mode} onChange={setMode} options={[{ value: "compress", label: "Compress" }, { value: "decompress", label: "Decompress" }]} />
        <ActionButton onClick={compress}>Process</ActionButton>
        <ActionButton onClick={() => { setInput(""); setOutput(""); setError(""); setStats(null); }} variant="secondary">Clear</ActionButton>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <div>
          <span className="text-xs text-text-secondary mb-1 block">Input</span>
          <InputArea value={input} onChange={setInput} placeholder={mode === "compress" ? "Enter text to compress..." : "Enter Base64-encoded GZip data..."} />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-text-secondary">Output</span>
            {output && <CopyButton value={output} />}
          </div>
          <OutputArea value={output} />
        </div>
      </div>
      {stats && (
        <div className="mt-2 flex gap-4 text-xs text-text-secondary">
          <span>Original: {stats.original} bytes</span>
          <span>Result: {stats.result} bytes</span>
          <span>Ratio: {stats.ratio}</span>
        </div>
      )}
      {error && <div className="mt-2"><ErrorDisplay message={error} /></div>}
    </ToolLayout>
  );
}
