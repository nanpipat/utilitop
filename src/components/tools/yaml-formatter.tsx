"use client";

import { useState, useEffect, useCallback } from "react";
import yaml from "js-yaml";
import ToolLayout, { InputArea, OutputArea, ActionButton, CopyButton, ErrorDisplay, Select } from "@/components/layout/ToolLayout";

export default function YamlFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [indent, setIndent] = useState("2");

  const format = useCallback(() => {
    if (!input.trim()) { setOutput(""); setError(""); return; }
    try {
      const parsed = yaml.load(input);
      setOutput(yaml.dump(parsed, { indent: Number(indent), lineWidth: -1 }));
      setError("");
    } catch (e: any) {
      setError(`Invalid YAML: ${e.message}`);
      setOutput("");
    }
  }, [input, indent]);

  useEffect(() => {
    const timer = setTimeout(format, 300);
    return () => clearTimeout(timer);
  }, [format]);

  return (
    <ToolLayout title="YAML Formatter" description="Format and validate YAML">
      <div className="flex flex-wrap items-center gap-3 mb-3">
        <Select value={indent} onChange={setIndent} label="Indent:" options={[{ value: "2", label: "2 spaces" }, { value: "4", label: "4 spaces" }]} />
        <ActionButton onClick={() => { setInput(""); setOutput(""); setError(""); }} variant="secondary">Clear</ActionButton>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <span className="text-xs text-text-secondary mb-1 block">Input</span>
          <InputArea value={input} onChange={setInput} placeholder="Paste your YAML here..." />
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
