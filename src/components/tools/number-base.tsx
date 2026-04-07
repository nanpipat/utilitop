"use client";

import { useState } from "react";
import ToolLayout, { CopyButton, ErrorDisplay, Select } from "@/components/layout/ToolLayout";

export default function NumberBaseConverter() {
  const [input, setInput] = useState("");
  const [fromBase, setFromBase] = useState("10");
  const [_error, setError] = useState("");

  const getValue = (): number | null => {
    if (!input.trim()) return null;
    const num = parseInt(input, Number(fromBase));
    if (isNaN(num)) return null;
    return num;
  };

  const value = getValue();

  const formats = value !== null ? [
    { label: "Binary (Base 2)", value: value.toString(2), prefix: "0b" },
    { label: "Octal (Base 8)", value: value.toString(8), prefix: "0o" },
    { label: "Decimal (Base 10)", value: value.toString(10), prefix: "" },
    { label: "Hexadecimal (Base 16)", value: value.toString(16).toUpperCase(), prefix: "0x" },
  ] : [];

  return (
    <ToolLayout title="Number Base Converter" description="Convert numbers between bases">
      <div className="flex flex-wrap items-center gap-3 mb-3">
        <Select value={fromBase} onChange={setFromBase} label="From base:" options={[
          { value: "2", label: "Binary (2)" },
          { value: "8", label: "Octal (8)" },
          { value: "10", label: "Decimal (10)" },
          { value: "16", label: "Hex (16)" },
        ]} />
      </div>
      <div className="mb-3">
        <span className="text-xs text-text-secondary mb-1 block">Input Number</span>
        <input type="text" value={input} onChange={(e) => { setInput(e.target.value); setError(parseInt(e.target.value, Number(fromBase)) ? "" : ""); }} placeholder="Enter a number..." className="w-full px-3 py-2 bg-bg-secondary border border-border rounded-md font-mono text-sm focus:outline-none focus:ring-1 focus:ring-accent" />
      </div>
      {input && value === null && <ErrorDisplay message="Invalid number for selected base" />}
      {formats.length > 0 && (
        <div className="space-y-2">
          {formats.map((f) => (
            <div key={f.label} className="flex items-center gap-2 px-3 py-2 bg-bg-secondary border border-border rounded-md">
              <span className="text-xs text-text-secondary min-w-[160px]">{f.label}</span>
              <code className="flex-1 text-sm font-mono">{f.prefix}{f.value}</code>
              <CopyButton value={`${f.prefix}${f.value}`} />
            </div>
          ))}
        </div>
      )}
    </ToolLayout>
  );
}
