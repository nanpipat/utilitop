"use client";

import { useState } from "react";
import ToolLayout, { InputArea, CopyButton, ErrorDisplay } from "@/components/layout/ToolLayout";

function decodeBase64Url(str: string): string {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) base64 += "=";
  return atob(base64);
}

function formatTimestamp(ts: number): string {
  const date = new Date(ts * 1000);
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  const expired = diff < 0;
  const absDiff = Math.abs(diff);
  const days = Math.floor(absDiff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((absDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  let relative = expired ? "Expired" : "Valid";
  if (days > 0) relative += ` (${expired ? "" : "expires in "}${days}d ${hours}h)`;
  else if (hours > 0) relative += ` (${expired ? "" : "expires in "}${hours}h)`;
  else relative += expired ? " (just expired)" : " (expires soon)";

  return `${date.toISOString()} — ${relative}`;
}

export default function JwtDecoder() {
  const [input, setInput] = useState("");
  const [header, setHeader] = useState("");
  const [payload, setPayload] = useState("");
  const [error, setError] = useState("");
  const [timestamps, setTimestamps] = useState<Record<string, string>>({});

  const decode = () => {
    if (!input.trim()) {
      setHeader("");
      setPayload("");
      setError("");
      setTimestamps({});
      return;
    }
    try {
      const parts = input.trim().split(".");
      if (parts.length !== 3) throw new Error("JWT must have 3 parts separated by dots");

      const headerObj = JSON.parse(decodeBase64Url(parts[0]));
      setHeader(JSON.stringify(headerObj, null, 2));

      const payloadObj = JSON.parse(decodeBase64Url(parts[1]));
      setPayload(JSON.stringify(payloadObj, null, 2));

      const ts: Record<string, string> = {};
      if (payloadObj.exp) ts.exp = formatTimestamp(payloadObj.exp);
      if (payloadObj.iat) ts.iat = formatTimestamp(payloadObj.iat);
      if (payloadObj.nbf) ts.nbf = formatTimestamp(payloadObj.nbf);
      setTimestamps(ts);

      setError("");
    } catch (e: any) {
      setError(`Invalid JWT: ${e.message}`);
      setHeader("");
      setPayload("");
      setTimestamps({});
    }
  };

  return (
    <ToolLayout title="JWT Decoder" description="Decode and inspect JWT tokens">
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-text-secondary">JWT Token</span>
        </div>
        <InputArea value={input} onChange={(v) => { setInput(v); }} placeholder="Paste your JWT token here..." rows={4} />
        <button onClick={decode} className="mt-2 px-3 py-1.5 text-xs font-medium rounded-md bg-accent text-white hover:opacity-90 transition-colors">
          Decode
        </button>
      </div>
      {error && <ErrorDisplay message={error} />}
      {header && (
        <div className="space-y-3 mt-3">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-text-secondary font-medium">Header</span>
              <CopyButton value={header} />
            </div>
            <div className="px-3 py-2 bg-bg-secondary border border-border rounded-md font-mono text-sm whitespace-pre-wrap">{header}</div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-text-secondary font-medium">Payload</span>
              <CopyButton value={payload} />
            </div>
            <div className="px-3 py-2 bg-bg-secondary border border-border rounded-md font-mono text-sm whitespace-pre-wrap">{payload}</div>
            {Object.keys(timestamps).length > 0 && (
              <div className="mt-2 space-y-1">
                {Object.entries(timestamps).map(([key, val]) => (
                  <div key={key} className="flex items-center gap-2 text-xs">
                    <span className="text-text-secondary font-medium">{key}:</span>
                    <span>{val}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div>
            <span className="text-xs text-text-secondary font-medium">Signature</span>
            <div className="mt-1 px-3 py-2 bg-bg-secondary border border-border rounded-md text-xs text-text-secondary">
              Cannot verify without secret
            </div>
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
