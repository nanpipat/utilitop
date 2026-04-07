"use client";

import { useState, useRef } from "react";
import ToolLayout, { CopyButton, ErrorDisplay } from "@/components/layout/ToolLayout";

async function hashFile(algorithm: string, file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const hash = await crypto.subtle.digest(algorithm, buffer);
  return Array.from(new Uint8Array(hash)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

export default function FileChecksum() {
  const [file, setFile] = useState<File | null>(null);
  const [hashes, setHashes] = useState<{ algo: string; hash: string }[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const processFile = async (f: File) => {
    setFile(f);
    setLoading(true);
    setError("");
    try {
      const algos = ["SHA-1", "SHA-256", "SHA-384", "SHA-512"];
      const results = await Promise.all(algos.map((algo) => hashFile(algo, f)));
      setHashes(algos.map((algo, i) => ({ algo, hash: results[i] })));
    } catch (e: any) {
      setError(`Error: ${e.message}`);
      setHashes([]);
    }
    setLoading(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files[0]) processFile(e.dataTransfer.files[0]);
  };

  return (
    <ToolLayout title="File Checksum" description="Calculate file hashes (MD5, SHA-256, etc.)">
      <div className="mb-3 p-3 bg-accent-light border border-accent/30 rounded-md text-xs text-accent">
        🔒 Your file is processed locally in the browser. No data is uploaded to any server.
      </div>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-md p-8 text-center cursor-pointer transition-colors ${dragOver ? "border-accent bg-accent-light" : "border-border hover:border-accent/50"}`}
      >
        <input ref={inputRef} type="file" className="hidden" onChange={(e) => e.target.files?.[0] && processFile(e.target.files[0])} />
        <p className="text-sm text-text-secondary">Drop a file here or click to select</p>
        {file && <p className="mt-2 text-xs font-medium">{file.name} ({(file.size / 1024).toFixed(1)} KB)</p>}
      </div>
      {loading && <div className="mt-3 text-sm text-text-secondary">Computing hashes...</div>}
      {error && <div className="mt-3"><ErrorDisplay message={error} /></div>}
      {hashes.length > 0 && (
        <div className="mt-3 space-y-2">
          {hashes.map((h) => (
            <div key={h.algo} className="flex items-center gap-2 px-3 py-2 bg-bg-secondary border border-border rounded-md">
              <span className="text-xs text-text-secondary min-w-[80px] font-medium">{h.algo}</span>
              <code className="flex-1 text-xs font-mono break-all">{h.hash}</code>
              <CopyButton value={h.hash} />
            </div>
          ))}
        </div>
      )}
    </ToolLayout>
  );
}
