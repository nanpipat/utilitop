"use client";

import { useState } from "react";
import ToolLayout, { InputArea, CopyButton, ErrorDisplay, Toggle } from "@/components/layout/ToolLayout";

async function hashText(algorithm: string, text: string, key?: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  if (key) {
    const keyData = encoder.encode(key);
    const cryptoKey = await crypto.subtle.importKey("raw", keyData, { name: "HMAC", hash: algorithm }, false, ["sign"]);
    const signature = await crypto.subtle.sign("HMAC", cryptoKey, data);
    return Array.from(new Uint8Array(signature)).map((b) => b.toString(16).padStart(2, "0")).join("");
  }
  const hash = await crypto.subtle.digest(algorithm, data);
  return Array.from(new Uint8Array(hash)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

function simpleCRC32(text: string): string {
  let crc = 0xFFFFFFFF;
  const table: number[] = [];
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    table[i] = c;
  }
  for (let i = 0; i < text.length; i++) crc = table[(crc ^ text.charCodeAt(i)) & 0xFF] ^ (crc >>> 8);
  return ((crc ^ 0xFFFFFFFF) >>> 0).toString(16).padStart(8, "0");
}

export default function HashGenerator() {
  const [input, setInput] = useState("");
  const [results, setResults] = useState<{ algo: string; hash: string }[]>([]);
  const [error, setError] = useState("");
  const [hmacMode, setHmacMode] = useState(false);
  const [hmacKey, setHmacKey] = useState("");

  const generate = async () => {
    if (!input) { setResults([]); setError(""); return; }
    try {
      const algos = hmacMode
        ? ["SHA-1", "SHA-256", "SHA-384", "SHA-512"]
        : ["SHA-1", "SHA-256", "SHA-384", "SHA-512"];
      const hashes = await Promise.all(algos.map((algo) => hashText(algo, input, hmacMode ? hmacKey : undefined)));
      const res = algos.map((algo, i) => ({ algo, hash: hashes[i] }));
      if (!hmacMode) res.unshift({ algo: "CRC32", hash: simpleCRC32(input) });
      setResults(res);
      setError("");
    } catch (e: any) {
      setError(`Error: ${e.message}`);
      setResults([]);
    }
  };

  return (
    <ToolLayout title="Hash Generator" description="Generate MD5, SHA-1, SHA-256, SHA-512 hashes">
      <div className="flex flex-wrap items-center gap-3 mb-3">
        <Toggle label="HMAC mode" checked={hmacMode} onChange={setHmacMode} />
        <button onClick={generate} className="px-3 py-1.5 text-xs font-medium rounded-md bg-accent text-white hover:opacity-90 transition-colors">Generate</button>
        <button onClick={() => { setInput(""); setResults([]); setError(""); }} className="px-3 py-1.5 text-xs font-medium rounded-md bg-bg-hover hover:bg-bg-active transition-colors">Clear</button>
      </div>
      {hmacMode && (
        <div className="mb-3">
          <span className="text-xs text-text-secondary mb-1 block">HMAC Key</span>
          <input type="text" value={hmacKey} onChange={(e) => setHmacKey(e.target.value)} className="w-full px-3 py-2 bg-bg-secondary border border-border rounded-md text-sm font-mono focus:outline-none focus:ring-1 focus:ring-accent" placeholder="Enter secret key..." />
        </div>
      )}
      <div className="mb-3">
        <span className="text-xs text-text-secondary mb-1 block">Input Text</span>
        <InputArea value={input} onChange={setInput} placeholder="Enter text to hash..." rows={4} />
      </div>
      {error && <ErrorDisplay message={error} />}
      {results.length > 0 && (
        <div className="space-y-2">
          {results.map((r) => (
            <div key={r.algo} className="flex items-center gap-2 px-3 py-2 bg-bg-secondary border border-border rounded-md">
              <span className="text-xs text-text-secondary min-w-[80px] font-medium">{r.algo}</span>
              <code className="flex-1 text-xs font-mono break-all">{r.hash}</code>
              <CopyButton value={r.hash} />
            </div>
          ))}
        </div>
      )}
    </ToolLayout>
  );
}
