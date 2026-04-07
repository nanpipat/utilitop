"use client";

import { useState } from "react";
import ToolLayout, { ActionButton, CopyButton, ErrorDisplay } from "@/components/layout/ToolLayout";

function getRelativeTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const abs = Math.abs(diff);
  const suffix = diff > 0 ? "ago" : "from now";

  const seconds = Math.floor(abs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (seconds < 60) return `${seconds} second${seconds !== 1 ? "s" : ""} ${suffix}`;
  if (minutes < 60) return `${minutes} minute${minutes !== 1 ? "s" : ""} ${suffix}`;
  if (hours < 24) return `${hours} hour${hours !== 1 ? "s" : ""} ${suffix}`;
  if (days < 30) return `${days} day${days !== 1 ? "s" : ""} ${suffix}`;
  if (months < 12) return `${months} month${months !== 1 ? "s" : ""} ${suffix}`;
  return `${years} year${years !== 1 ? "s" : ""} ${suffix}`;
}

export default function TimestampConverter() {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [result, setResult] = useState<{
    unixSeconds: number;
    unixMillis: number;
    iso: string;
    utc: string;
    local: string;
    relative: string;
  } | null>(null);

  const convert = (value?: string) => {
    const v = (value || input).trim();
    if (!v) {
      setResult(null);
      setError("");
      return;
    }
    try {
      let date: Date;
      const num = Number(v);
      if (!isNaN(num) && v.length >= 10) {
        if (v.length <= 10) date = new Date(num * 1000);
        else date = new Date(num);
      } else {
        date = new Date(v);
      }
      if (isNaN(date.getTime())) throw new Error("Invalid date or timestamp");

      setResult({
        unixSeconds: Math.floor(date.getTime() / 1000),
        unixMillis: date.getTime(),
        iso: date.toISOString(),
        utc: date.toUTCString(),
        local: date.toLocaleString(),
        relative: getRelativeTime(date),
      });
      setError("");
    } catch (e: any) {
      setError(e.message);
      setResult(null);
    }
  };

  const setNow = () => {
    const now = Math.floor(Date.now() / 1000).toString();
    setInput(now);
    convert(now);
  };

  return (
    <ToolLayout title="Timestamp Converter" description="Convert between Unix timestamps and dates">
      <div className="flex flex-wrap items-center gap-3 mb-3">
        <ActionButton onClick={setNow} variant="secondary">Now</ActionButton>
        <ActionButton onClick={() => convert()} variant="primary">Convert</ActionButton>
        <ActionButton onClick={() => { setInput(""); setResult(null); setError(""); }} variant="secondary">Clear</ActionButton>
      </div>
      <div className="mb-3">
        <span className="text-xs text-text-secondary mb-1 block">Input (Unix timestamp or date string)</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && convert()}
          placeholder="e.g. 1700000000 or 2023-11-14T22:13:20Z"
          className="w-full px-3 py-2 bg-bg-secondary border border-border rounded-md font-mono text-sm focus:outline-none focus:ring-1 focus:ring-accent placeholder:text-text-placeholder"
        />
      </div>
      {error && <ErrorDisplay message={error} />}
      {result && (
        <div className="space-y-2">
          {[
            { label: "Unix (seconds)", value: result.unixSeconds.toString() },
            { label: "Unix (milliseconds)", value: result.unixMillis.toString() },
            { label: "ISO 8601", value: result.iso },
            { label: "UTC", value: result.utc },
            { label: "Local", value: result.local },
            { label: "Relative", value: result.relative },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2 px-3 py-2 bg-bg-secondary border border-border rounded-md">
              <span className="text-xs text-text-secondary min-w-[140px]">{item.label}</span>
              <code className="flex-1 text-sm font-mono">{item.value}</code>
              <CopyButton value={item.value} />
            </div>
          ))}
        </div>
      )}
    </ToolLayout>
  );
}
