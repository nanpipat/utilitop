"use client";

import { useState } from "react";
import yaml from "js-yaml";
import ToolLayout, { InputArea, OutputArea, ActionButton, CopyButton, ErrorDisplay, Select } from "@/components/layout/ToolLayout";

export default function JsonYamlConverter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [mode, setMode] = useState("json-to-yaml");

  const convert = () => {
    if (!input.trim()) { setOutput(""); setError(""); return; }
    try {
      if (mode === "json-to-yaml") {
        const parsed = JSON.parse(input);
        setOutput(yaml.dump(parsed, { indent: 2, lineWidth: -1 }));
      } else {
        const parsed = yaml.load(input);
        setOutput(JSON.stringify(parsed, null, 2));
      }
      setError("");
    } catch (e: any) {
      setError(`Conversion error: ${e.message}`);
      setOutput("");
    }
  };

  return (
    <ToolLayout title="JSON ↔ YAML Converter" description="Convert between JSON and YAML formats">
      <div className="flex flex-wrap items-center gap-3 mb-3">
        <Select value={mode} onChange={setMode} options={[{ value: "json-to-yaml", label: "JSON → YAML" }, { value: "yaml-to-json", label: "YAML → JSON" }]} />
        <ActionButton onClick={convert}>Convert</ActionButton>
        <ActionButton onClick={() => { setInput(""); setOutput(""); setError(""); }} variant="secondary">Clear</ActionButton>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <div>
          <span className="text-xs text-text-secondary mb-1 block">{mode === "json-to-yaml" ? "JSON Input" : "YAML Input"}</span>
          <InputArea value={input} onChange={setInput} placeholder={mode === "json-to-yaml" ? "Paste JSON here..." : "Paste YAML here..."} />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-text-secondary">{mode === "json-to-yaml" ? "YAML Output" : "JSON Output"}</span>
            {output && <CopyButton value={output} />}
          </div>
          <OutputArea value={output} />
        </div>
      </div>
      {error && <div className="mt-2"><ErrorDisplay message={error} /></div>}
    </ToolLayout>
  );
}
