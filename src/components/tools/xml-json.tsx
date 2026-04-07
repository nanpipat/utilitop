"use client";

import { useState } from "react";
import { XMLBuilder, XMLParser } from "fast-xml-parser";
import ToolLayout, { InputArea, OutputArea, ActionButton, CopyButton, ErrorDisplay, Select } from "@/components/layout/ToolLayout";

export default function XmlJsonConverter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [mode, setMode] = useState("xml-to-json");

  const convert = () => {
    if (!input.trim()) { setOutput(""); setError(""); return; }
    try {
      if (mode === "xml-to-json") {
        const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "@_" });
        const parsed = parser.parse(input);
        setOutput(JSON.stringify(parsed, null, 2));
      } else {
        const parsed = JSON.parse(input);
        const builder = new XMLBuilder({ ignoreAttributes: false, attributeNamePrefix: "@_", format: true });
        setOutput(builder.build(parsed));
      }
      setError("");
    } catch (e: any) {
      setError(`Conversion error: ${e.message}`);
      setOutput("");
    }
  };

  return (
    <ToolLayout title="XML ↔ JSON Converter" description="Convert between XML and JSON formats">
      <div className="flex flex-wrap items-center gap-3 mb-3">
        <Select value={mode} onChange={setMode} options={[{ value: "xml-to-json", label: "XML → JSON" }, { value: "json-to-xml", label: "JSON → XML" }]} />
        <ActionButton onClick={convert}>Convert</ActionButton>
        <ActionButton onClick={() => { setInput(""); setOutput(""); setError(""); }} variant="secondary">Clear</ActionButton>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <div>
          <span className="text-xs text-text-secondary mb-1 block">{mode === "xml-to-json" ? "XML Input" : "JSON Input"}</span>
          <InputArea value={input} onChange={setInput} placeholder={mode === "xml-to-json" ? "Paste XML here..." : "Paste JSON here..."} />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-text-secondary">{mode === "xml-to-json" ? "JSON Output" : "XML Output"}</span>
            {output && <CopyButton value={output} />}
          </div>
          <OutputArea value={output} />
        </div>
      </div>
      {error && <div className="mt-2"><ErrorDisplay message={error} /></div>}
    </ToolLayout>
  );
}
