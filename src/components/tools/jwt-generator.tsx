"use client";

import { useState } from "react";
import ToolLayout, { InputArea, CopyButton, ErrorDisplay } from "@/components/layout/ToolLayout";

function base64UrlEncode(data: Uint8Array): string {
  let binary = "";
  data.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function textToBase64Url(text: string): string {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(text);
  return base64UrlEncode(bytes);
}

async function signJWT(header: string, payload: string, secret: string, algorithm: string): Promise<string> {
  const headerB64 = textToBase64Url(header);
  const payloadB64 = textToBase64Url(payload);
  const message = `${headerB64}.${payloadB64}`;

  const algoMap: Record<string, string> = { HS256: "SHA-256", HS384: "SHA-384", HS512: "SHA-512" };
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: algoMap[algorithm] }, false, ["sign"]);
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(message));
  const signatureB64 = base64UrlEncode(new Uint8Array(signature));

  return `${message}.${signatureB64}`;
}

export default function JwtGenerator() {
  const [payload, setPayload] = useState('{\n  "sub": "1234567890",\n  "name": "John Doe",\n  "iat": 1700000000\n}');
  const [secret, setSecret] = useState("your-256-bit-secret");
  const [algorithm, setAlgorithm] = useState("HS256");
  const [token, setToken] = useState("");
  const [error, setError] = useState("");

  const generate = async () => {
    try {
      JSON.parse(payload);
      const header = JSON.stringify({ alg: algorithm, typ: "JWT" });
      const result = await signJWT(header, payload, secret, algorithm);
      setToken(result);
      setError("");
    } catch (e: any) {
      setError(`Error: ${e.message}`);
      setToken("");
    }
  };

  return (
    <ToolLayout title="JWT Generator" description="Generate signed JWT tokens">
      <div className="mb-3 p-3 bg-red-50 dark:bg-red-900/20 border border-error/30 rounded-md text-xs text-error">
        ⚠ Do NOT use production secrets in this tool. This runs entirely in your browser.
      </div>
      <div className="space-y-3">
        <div>
          <span className="text-xs text-text-secondary mb-1 block">Payload (JSON)</span>
          <InputArea value={payload} onChange={setPayload} placeholder="Enter JSON payload..." rows={6} />
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="flex-1 min-w-[200px]">
            <span className="text-xs text-text-secondary mb-1 block">Secret Key</span>
            <input type="text" value={secret} onChange={(e) => setSecret(e.target.value)} className="w-full px-3 py-2 bg-bg-secondary border border-border rounded-md font-mono text-sm focus:outline-none focus:ring-1 focus:ring-accent" placeholder="Enter secret key..." />
          </div>
          <div>
            <span className="text-xs text-text-secondary mb-1 block">Algorithm</span>
            <select value={algorithm} onChange={(e) => setAlgorithm(e.target.value)} className="px-2 py-2 text-xs bg-bg-secondary border border-border rounded-md">
              <option value="HS256">HS256</option>
              <option value="HS384">HS384</option>
              <option value="HS512">HS512</option>
            </select>
          </div>
        </div>
        <button onClick={generate} className="px-3 py-1.5 text-xs font-medium rounded-md bg-accent text-white hover:opacity-90 transition-colors">
          Generate JWT
        </button>
        {error && <ErrorDisplay message={error} />}
        {token && (
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-text-secondary font-medium">JWT Token</span>
              <CopyButton value={token} />
            </div>
            <div className="px-3 py-2 bg-bg-secondary border border-border rounded-md font-mono text-xs break-all max-h-48 overflow-y-auto">{token}</div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
