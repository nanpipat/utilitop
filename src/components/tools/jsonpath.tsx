"use client";

import { useState } from "react";
import { JSONPath } from "jsonpath-plus";
import ToolLayout, { InputArea, OutputArea, ActionButton, CopyButton, ErrorDisplay } from "@/components/layout/ToolLayout";

export default function JsonPathTester() {
  const [jsonInput, setJsonInput] = useState('{\n  "store": {\n    "book": [\n      { "title": "Sayings of the Century", "price": 8.95 },\n      { "title": "Moby Dick", "price": 12.99 }\n    ],\n    "bicycle": { "color": "red", "price": 19.95 }\n  }\n}');
  const [path, setPath] = useState("$.store.book[*].title");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const query = () => {
    if (!jsonInput.trim() || !path.trim()) { setOutput(""); setError(""); return; }
    try {
      const json = JSON.parse(jsonInput);
      const result = JSONPath({ path, json });
      setOutput(JSON.stringify(result, null, 2));
      setError("");
    } catch (e: any) {
      setError(e.message.includes("JSON") ? `Invalid JSON: ${e.message}` : `JSONPath error: ${e.message}`);
      setOutput("");
    }
  };

  return (
    <ToolLayout title="JSONPath Tester" description="Test JSONPath expressions against JSON data">
      <div className="space-y-3">
        <div>
          <span className="text-xs text-text-secondary mb-1 block">JSONPath Expression</span>
          <input type="text" value={path} onChange={(e) => setPath(e.target.value)} placeholder="$.store.book[*].title" className="w-full px-3 py-2 bg-bg-secondary border border-border rounded-md font-mono text-sm focus:outline-none focus:ring-1 focus:ring-accent" />
        </div>
        <div className="flex flex-wrap gap-2">
          {["$", "$.store.book[*].title", "$..price", "$.store.*"].map((ex) => (
            <button key={ex} onClick={() => setPath(ex)} className="px-2 py-1 text-[10px] bg-bg-hover rounded hover:bg-bg-active">{ex}</button>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <span className="text-xs text-text-secondary mb-1 block">JSON Data</span>
            <InputArea value={jsonInput} onChange={setJsonInput} placeholder="Paste JSON here..." rows={10} />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-text-secondary">Result</span>
              {output && <CopyButton value={output} />}
            </div>
            <OutputArea value={output} />
          </div>
        </div>
        {error && <ErrorDisplay message={error} />}
        <ActionButton onClick={query}>Query</ActionButton>
      </div>
    </ToolLayout>
  );
}
