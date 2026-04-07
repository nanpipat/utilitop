"use client";

import { useState, useEffect, useCallback } from "react";
import ToolLayout, { InputArea, OutputArea, ActionButton, CopyButton, ErrorDisplay, Select, Toggle } from "@/components/layout/ToolLayout";

function simpleFormat(code: string, semicolons: boolean, singleQuotes: boolean): string {
  let result = code;
  if (!semicolons) result = result.replace(/;(\s*\n)/g, "$1").replace(/;(\s*$)/g, "$1");
  if (singleQuotes) {
    result = result.replace(/"([^"\\]*(\\.[^"\\]*)*)"/g, (m, c) => "'" + c.replace(/'/g, "\\'") + "'");
  } else {
    result = result.replace(/'([^'\\]*(\\.[^'\\]*)*)'/g, (m, c) => '"' + c.replace(/"/g, '\\"') + '"');
  }
  let formatted = "";
  let indent = 0;
  const lines = result.split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) { formatted += "\n"; continue; }
    if (trimmed.startsWith("}") || trimmed.startsWith("]") || trimmed.startsWith(")")) indent = Math.max(0, indent - 1);
    formatted += "  ".repeat(indent) + trimmed + "\n";
    const openCount = (trimmed.match(/[{[(]/g) || []).length;
    const closeCount = (trimmed.match(/[}\])]/g) || []).length;
    indent += openCount - closeCount;
    if (indent < 0) indent = 0;
  }
  return formatted.trim();
}

export default function JsFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [semicolons, setSemicolons] = useState(true);
  const [singleQuotes, setSingleQuotes] = useState(false);

  const format = useCallback(() => {
    if (!input.trim()) { setOutput(""); setError(""); return; }
    try {
      setOutput(simpleFormat(input, semicolons, singleQuotes));
      setError("");
    } catch (e: any) {
      setError(`Error: ${e.message}`);
      setOutput("");
    }
  }, [input, semicolons, singleQuotes]);

  useEffect(() => {
    const timer = setTimeout(format, 300);
    return () => clearTimeout(timer);
  }, [format]);

  return (
    <ToolLayout title="JS/TS Formatter" description="Format JavaScript and TypeScript code">
      <div className="flex flex-wrap items-center gap-3 mb-3">
        <Select value={language} onChange={setLanguage} label="Language:" options={[{ value: "javascript", label: "JavaScript" }, { value: "typescript", label: "TypeScript" }]} />
        <Toggle label="Semicolons" checked={semicolons} onChange={setSemicolons} />
        <Toggle label="Single quotes" checked={singleQuotes} onChange={setSingleQuotes} />
        <ActionButton onClick={() => { setInput(""); setOutput(""); setError(""); }} variant="secondary">Clear</ActionButton>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <span className="text-xs text-text-secondary mb-1 block">Input</span>
          <InputArea value={input} onChange={setInput} placeholder="Paste your JS/TS code here..." />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-text-secondary">Output</span>
            {output && <CopyButton value={output} />}
          </div>
          <OutputArea value={output} />
        </div>
      </div>
      {error && <div className="mt-2"><ErrorDisplay message={error} /></div>}
    </ToolLayout>
  );
}
