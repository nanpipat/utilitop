"use client";

import { useState } from "react";
import ToolLayout, { InputArea, OutputArea, ActionButton, CopyButton, ErrorDisplay, Select } from "@/components/layout/ToolLayout";

export default function JsonCsvConverter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [mode, setMode] = useState("json-to-csv");
  const [delimiter, setDelimiter] = useState(",");

  function jsonToCsv(json: string, delim: string): string {
    const data = JSON.parse(json);
    if (!Array.isArray(data) || data.length === 0) throw new Error("Input must be a non-empty JSON array of objects");
    const headers = Object.keys(data[0]);
    const rows = data.map((obj: any) => headers.map((h) => {
      const val = String(obj[h] ?? "");
      return val.includes(delim) || val.includes('"') || val.includes('\n') ? `"${val.replace(/"/g, '""')}"` : val;
    }).join(delim));
    return [headers.join(delim), ...rows].join("\n");
  }

  function csvToJson(csv: string, delim: string): string {
    const lines = csv.trim().split("\n");
    if (lines.length < 2) throw new Error("CSV must have at least a header and one data row");
    const headers = parseCsvLine(lines[0], delim);
    const data = lines.slice(1).map((line) => {
      const values = parseCsvLine(line, delim);
      const obj: Record<string, string> = {};
      headers.forEach((h, i) => { obj[h] = values[i] || ""; });
      return obj;
    });
    return JSON.stringify(data, null, 2);
  }

  function parseCsvLine(line: string, delim: string): string[] {
    const result: string[] = [];
    let current = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (inQuotes) {
        if (ch === '"' && line[i + 1] === '"') { current += '"'; i++; }
        else if (ch === '"') inQuotes = false;
        else current += ch;
      } else {
        if (ch === '"') inQuotes = true;
        else if (ch === delim) { result.push(current.trim()); current = ""; }
        else current += ch;
      }
    }
    result.push(current.trim());
    return result;
  }

  const convert = () => {
    if (!input.trim()) { setOutput(""); setError(""); return; }
    try {
      setOutput(mode === "json-to-csv" ? jsonToCsv(input, delimiter) : csvToJson(input, delimiter));
      setError("");
    } catch (e: any) {
      setError(`Conversion error: ${e.message}`);
      setOutput("");
    }
  };

  return (
    <ToolLayout title="JSON ↔ CSV Converter" description="Convert between JSON and CSV formats">
      <div className="flex flex-wrap items-center gap-3 mb-3">
        <Select value={mode} onChange={setMode} options={[{ value: "json-to-csv", label: "JSON → CSV" }, { value: "csv-to-json", label: "CSV → JSON" }]} />
        <Select value={delimiter} onChange={setDelimiter} label="Delimiter:" options={[{ value: ",", label: "Comma (,)" }, { value: ";", label: "Semicolon (;)" }, { value: "\t", label: "Tab" }]} />
        <ActionButton onClick={convert}>Convert</ActionButton>
        <ActionButton onClick={() => { setInput(""); setOutput(""); setError(""); }} variant="secondary">Clear</ActionButton>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <span className="text-xs text-text-secondary mb-1 block">{mode === "json-to-csv" ? "JSON Input" : "CSV Input"}</span>
          <InputArea value={input} onChange={setInput} placeholder={mode === "json-to-csv" ? 'Paste JSON array here, e.g. [{"name":"John"}]' : "Paste CSV here..."} />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-text-secondary">{mode === "json-to-csv" ? "CSV Output" : "JSON Output"}</span>
            {output && <CopyButton value={output} />}
          </div>
          <OutputArea value={output} />
        </div>
      </div>
      {error && <div className="mt-2"><ErrorDisplay message={error} /></div>}
    </ToolLayout>
  );
}
