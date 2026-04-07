"use client";

import { useState, useEffect, useCallback } from "react";
import ToolLayout, { InputArea, OutputArea, ActionButton, CopyButton, ErrorDisplay, Toggle } from "@/components/layout/ToolLayout";

function formatCss(css: string): string {
  let result = css.trim();
  result = result.replace(/\s*{\s*/g, " {\n  ");
  result = result.replace(/\s*}\s*/g, "\n}\n\n");
  result = result.replace(/;\s*/g, ";\n  ");
  result = result.replace(/\n\s*\n\s*\n/g, "\n\n");
  result = result.replace(/  \n}/g, "\n}");
  return result.trim();
}

function minifyCss(css: string): string {
  return css.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\s+/g, " ").replace(/\s*([{}:;,])\s*/g, "$1").replace(/;}/g, "}").trim();
}

export default function CssFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [minify, setMinify] = useState(false);

  const format = useCallback(() => {
    if (!input.trim()) { setOutput(""); setError(""); return; }
    try {
      setOutput(minify ? minifyCss(input) : formatCss(input));
      setError("");
    } catch (e: any) {
      setError(`Error: ${e.message}`);
      setOutput("");
    }
  }, [input, minify]);

  useEffect(() => {
    const timer = setTimeout(format, 300);
    return () => clearTimeout(timer);
  }, [format]);

  return (
    <ToolLayout title="CSS Formatter" description="Format and minify CSS">
      <div className="flex flex-wrap items-center gap-3 mb-3">
        <Toggle label="Minify" checked={minify} onChange={setMinify} />
        <ActionButton onClick={() => { setInput(""); setOutput(""); setError(""); }} variant="secondary">Clear</ActionButton>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <span className="text-xs text-text-secondary mb-1 block">Input</span>
          <InputArea value={input} onChange={setInput} placeholder="Paste your CSS here..." />
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
