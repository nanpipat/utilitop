"use client";

import { useState, useEffect, useCallback } from "react";
import { format as sqlFormat } from "sql-formatter";
import ToolLayout, { InputArea, OutputArea, ActionButton, CopyButton, ErrorDisplay, Select, Toggle } from "@/components/layout/ToolLayout";

export default function SqlFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [dialect, setDialect] = useState("sql");
  const [uppercase, setUppercase] = useState(true);
  const [indent, setIndent] = useState("2");

  const format = useCallback(() => {
    if (!input.trim()) { setOutput(""); setError(""); return; }
    try {
      const result = sqlFormat(input, {
        language: dialect as any,
        keywordCase: uppercase ? "upper" : "preserve",
        tabWidth: Number(indent),
      });
      setOutput(result);
      setError("");
    } catch (e: any) {
      setError(`Invalid SQL: ${e.message}`);
      setOutput("");
    }
  }, [input, dialect, uppercase, indent]);

  useEffect(() => {
    const timer = setTimeout(format, 300);
    return () => clearTimeout(timer);
  }, [format]);

  return (
    <ToolLayout title="SQL Formatter" description="Format SQL queries with dialect support">
      <div className="flex flex-wrap items-center gap-3 mb-3">
        <Select value={dialect} onChange={setDialect} label="Dialect:" options={[
          { value: "sql", label: "Standard" },
          { value: "mysql", label: "MySQL" },
          { value: "postgresql", label: "PostgreSQL" },
          { value: "bigquery", label: "BigQuery" },
          { value: "spark", label: "Spark" },
        ]} />
        <Toggle label="Uppercase keywords" checked={uppercase} onChange={setUppercase} />
        <Select value={indent} onChange={setIndent} label="Indent:" options={[{ value: "2", label: "2 spaces" }, { value: "4", label: "4 spaces" }]} />
        <ActionButton onClick={() => { setInput(""); setOutput(""); setError(""); }} variant="secondary">Clear</ActionButton>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <span className="text-xs text-text-secondary mb-1 block">Input</span>
          <InputArea value={input} onChange={setInput} placeholder="Paste your SQL here..." />
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
