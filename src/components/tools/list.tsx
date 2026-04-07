"use client";

import { useState } from "react";
import ToolLayout, { InputArea, OutputArea, ActionButton, CopyButton, Select } from "@/components/layout/ToolLayout";

export default function ListConverter() {
  const [input, setInput] = useState("");
  const [inputDelimiter, setInputDelimiter] = useState("newline");
  const [outputDelimiter, setOutputDelimiter] = useState("comma");
  const [wrapItems, setWrapItems] = useState("none");
  const [customInputDelim, setCustomInputDelim] = useState("");
  const [customOutputDelim, setCustomOutputDelim] = useState("");
  const [output, setOutput] = useState("");

  const getDelimiter = (type: string, custom: string): string => {
    switch (type) {
      case "newline": return "\n";
      case "comma": return ",";
      case "semicolon": return ";";
      case "pipe": return "|";
      case "custom": return custom;
      default: return "\n";
    }
  };

  const process = () => {
    if (!input.trim()) { setOutput(""); return; }
    const inDelim = getDelimiter(inputDelimiter, customInputDelim);
    const outDelim = getDelimiter(outputDelimiter, customOutputDelim);
    let items = input.split(inDelim).map((s) => s.trim()).filter(Boolean);
    if (wrapItems === "quotes") items = items.map((s) => `"${s}"`);
    else if (wrapItems === "single-quotes") items = items.map((s) => `'${s}'`);
    else if (wrapItems === "brackets") items = items.map((s) => `[${s}]`);
    else if (wrapItems === "parens") items = items.map((s) => `(${s})`);
    setOutput(items.join(outDelim));
  };

  return (
    <ToolLayout title="List Converter / Joiner" description="Convert lists between delimiters">
      <div className="space-y-2 mb-3">
        <div className="flex flex-wrap items-center gap-3">
          <Select value={inputDelimiter} onChange={setInputDelimiter} label="Input delimiter:" options={[{ value: "newline", label: "Newline" }, { value: "comma", label: "Comma (,)" }, { value: "semicolon", label: "Semicolon (;)" }, { value: "pipe", label: "Pipe (|)" }, { value: "custom", label: "Custom" }]} />
          {inputDelimiter === "custom" && <input type="text" value={customInputDelim} onChange={(e) => setCustomInputDelim(e.target.value)} className="w-20 px-2 py-1 text-xs bg-bg-secondary border border-border rounded-md" placeholder="delim" />}
          <Select value={outputDelimiter} onChange={setOutputDelimiter} label="Output delimiter:" options={[{ value: "newline", label: "Newline" }, { value: "comma", label: "Comma (,)" }, { value: "semicolon", label: "Semicolon (;)" }, { value: "pipe", label: "Pipe (|)" }, { value: "custom", label: "Custom" }]} />
          {outputDelimiter === "custom" && <input type="text" value={customOutputDelim} onChange={(e) => setCustomOutputDelim(e.target.value)} className="w-20 px-2 py-1 text-xs bg-bg-secondary border border-border rounded-md" placeholder="delim" />}
          <Select value={wrapItems} onChange={setWrapItems} label="Wrap:" options={[{ value: "none", label: "None" }, { value: "quotes", label: '"quotes"' }, { value: "single-quotes", label: "'quotes'" }, { value: "brackets", label: "[brackets]" }, { value: "parens", label: "(parens)" }]} />
        </div>
        <ActionButton onClick={process}>Convert</ActionButton>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <span className="text-xs text-text-secondary mb-1 block">Input</span>
          <InputArea value={input} onChange={setInput} placeholder="Enter list items..." />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-text-secondary">Output</span>
            {output && <CopyButton value={output} />}
          </div>
          <OutputArea value={output} />
        </div>
      </div>
    </ToolLayout>
  );
}
