"use client";

import { useState, useEffect, useCallback } from "react";
import { XMLBuilder, XMLParser } from "fast-xml-parser";
import ToolLayout, { InputArea, OutputArea, ActionButton, CopyButton, ErrorDisplay, Select, Toggle } from "@/components/layout/ToolLayout";

export default function XmlFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [indent, setIndent] = useState("2");
  const [minify, setMinify] = useState(false);

  const format = useCallback(() => {
    if (!input.trim()) { setOutput(""); setError(""); return; }
    try {
      const parser = new XMLParser({ ignoreAttributes: false, preserveOrder: true });
      const parsed = parser.parse(input);
      const builder = new XMLBuilder({
        ignoreAttributes: false,
        preserveOrder: true,
        format: !minify,
        indentBy: " ".repeat(Number(indent)),
      });
      setOutput(builder.build(parsed));
      setError("");
    } catch (e: any) {
      setError(`Invalid XML: ${e.message}`);
      setOutput("");
    }
  }, [input, indent, minify]);

  useEffect(() => {
    const timer = setTimeout(format, 300);
    return () => clearTimeout(timer);
  }, [format]);

  return (
    <ToolLayout title="XML Formatter" description="Format and minify XML">
      <div className="flex flex-wrap items-center gap-3 mb-3">
        <Select value={indent} onChange={setIndent} label="Indent:" options={[{ value: "2", label: "2 spaces" }, { value: "4", label: "4 spaces" }]} />
        <Toggle label="Minify" checked={minify} onChange={setMinify} />
        <ActionButton onClick={() => { setInput(""); setOutput(""); setError(""); }} variant="secondary">Clear</ActionButton>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <span className="text-xs text-text-secondary mb-1 block">Input</span>
          <InputArea value={input} onChange={setInput} placeholder="Paste your XML here..." />
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
