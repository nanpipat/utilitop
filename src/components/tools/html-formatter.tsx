"use client";

import { useState, useEffect, useCallback } from "react";
import ToolLayout, { InputArea, OutputArea, ActionButton, CopyButton, ErrorDisplay, Select } from "@/components/layout/ToolLayout";

function formatHtml(html: string, indentSize: number): string {
  const indent = " ".repeat(indentSize);
  let result = "";
  let level = 0;
  const selfClosing = /^<(area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)\b/i;
  const raw = html.replace(/>\s+</g, "><").trim();
  const tokens = raw.match(/(<[^>]+>|[^<]+)/g) || [];
  
  for (const token of tokens) {
    const trimmed = token.trim();
    if (!trimmed) continue;
    if (trimmed.startsWith("</")) {
      level = Math.max(0, level - 1);
      result += indent.repeat(level) + trimmed + "\n";
    } else if (trimmed.startsWith("<")) {
      result += indent.repeat(level) + trimmed + "\n";
      if (!trimmed.endsWith("/>") && !selfClosing.test(trimmed) && !trimmed.startsWith("<!") && !trimmed.startsWith("<?")) {
        level++;
      }
    } else {
      result += indent.repeat(level) + trimmed + "\n";
    }
  }
  return result.trim();
}

export default function HtmlFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [indent, setIndent] = useState("2");

  const format = useCallback(() => {
    if (!input.trim()) { setOutput(""); setError(""); return; }
    try {
      setOutput(formatHtml(input, Number(indent)));
      setError("");
    } catch (e: any) {
      setError(`Error: ${e.message}`);
      setOutput("");
    }
  }, [input, indent]);

  useEffect(() => {
    const timer = setTimeout(format, 300);
    return () => clearTimeout(timer);
  }, [format]);

  return (
    <ToolLayout title="HTML Formatter" description="Format and beautify HTML">
      <div className="flex flex-wrap items-center gap-3 mb-3">
        <Select value={indent} onChange={setIndent} label="Indent:" options={[{ value: "2", label: "2 spaces" }, { value: "4", label: "4 spaces" }]} />
        <ActionButton onClick={() => { setInput(""); setOutput(""); setError(""); }} variant="secondary">Clear</ActionButton>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <span className="text-xs text-text-secondary mb-1 block">Input</span>
          <InputArea value={input} onChange={setInput} placeholder="Paste your HTML here..." />
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
