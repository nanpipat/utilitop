"use client";

import { useState, useEffect, useCallback } from "react";
import ToolLayout, { InputArea, OutputArea, ActionButton, CopyButton, ErrorDisplay, Toggle, Select } from "@/components/layout/ToolLayout";

export default function JsonFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [indent, setIndent] = useState("2");
  const [minify, setMinify] = useState(false);
  const [sortKeys, setSortKeys] = useState(false);

  const formatJson = useCallback(() => {
    if (!input.trim()) {
      setOutput("");
      setError("");
      return;
    }
    try {
      const parsed = JSON.parse(input);
      let obj = parsed;
      if (sortKeys && typeof parsed === "object" && parsed !== null) {
        obj = sortObjectKeys(parsed);
      }
      const indentVal = indent === "tab" ? "\t" : Number(indent);
      setOutput(JSON.stringify(obj, null, minify ? undefined : indentVal));
      setError("");
    } catch (e: any) {
      const match = e.message.match(/position\s+(\d+)/);
      if (match) {
        const pos = parseInt(match[1]);
        const lines = input.substring(0, pos).split("\n");
        const line = lines.length;
        const col = lines[lines.length - 1].length + 1;
        setError(`Invalid JSON at line ${line}, column ${col}: ${e.message}`);
      } else {
        setError(`Invalid JSON: ${e.message}`);
      }
      setOutput("");
    }
  }, [input, indent, minify, sortKeys]);

  function sortObjectKeys(obj: any): any {
    if (Array.isArray(obj)) return obj.map(sortObjectKeys);
    if (obj !== null && typeof obj === "object") {
      return Object.keys(obj)
        .sort()
        .reduce((result: any, key: string) => {
          result[key] = sortObjectKeys(obj[key]);
          return result;
        }, {});
    }
    return obj;
  }

  useEffect(() => {
    const timer = setTimeout(formatJson, 300);
    return () => clearTimeout(timer);
  }, [formatJson]);

  return (
    <ToolLayout title="JSON Formatter" description="Format, validate, and minify JSON">
      <div className="flex flex-wrap items-center gap-3 mb-3">
        <Select
          value={indent}
          onChange={setIndent}
          label="Indent:"
          options={[
            { value: "2", label: "2 spaces" },
            { value: "4", label: "4 spaces" },
            { value: "tab", label: "Tab" },
          ]}
        />
        <Toggle label="Minify" checked={minify} onChange={setMinify} />
        <Toggle label="Sort keys" checked={sortKeys} onChange={setSortKeys} />
        <ActionButton onClick={() => { setInput(""); setOutput(""); setError(""); }} variant="secondary">
          Clear
        </ActionButton>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-text-secondary">Input</span>
          </div>
          <InputArea value={input} onChange={setInput} placeholder="Paste your JSON here..." />
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
