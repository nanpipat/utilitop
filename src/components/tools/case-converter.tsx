"use client";

import { useState } from "react";
import ToolLayout, { InputArea, CopyButton } from "@/components/layout/ToolLayout";

function toWords(text: string): string[] {
  return text.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/[_\-./]+/g, " ").trim().split(/\s+/).filter(Boolean);
}

function toCamelCase(text: string): string {
  return toWords(text).map((w, i) => i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join("");
}

function toPascalCase(text: string): string {
  return toWords(text).map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join("");
}

function toSnakeCase(text: string): string {
  return toWords(text).map((w) => w.toLowerCase()).join("_");
}

function toKebabCase(text: string): string {
  return toWords(text).map((w) => w.toLowerCase()).join("-");
}

function toScreamingSnake(text: string): string {
  return toWords(text).map((w) => w.toUpperCase()).join("_");
}

function toDotCase(text: string): string {
  return toWords(text).map((w) => w.toLowerCase()).join(".");
}

function toTitleCase(text: string): string {
  return toWords(text).map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ");
}

export default function CaseConverter() {
  const [input, setInput] = useState("");

  const cases = input.trim() ? [
    { label: "UPPER CASE", value: input.toUpperCase() },
    { label: "lower case", value: input.toLowerCase() },
    { label: "Title Case", value: toTitleCase(input) },
    { label: "camelCase", value: toCamelCase(input) },
    { label: "PascalCase", value: toPascalCase(input) },
    { label: "snake_case", value: toSnakeCase(input) },
    { label: "kebab-case", value: toKebabCase(input) },
    { label: "SCREAMING_SNAKE_CASE", value: toScreamingSnake(input) },
    { label: "dot.case", value: toDotCase(input) },
  ] : [];

  return (
    <ToolLayout title="Case Converter" description="Convert text between different cases">
      <div className="mb-3">
        <InputArea value={input} onChange={setInput} placeholder="Enter text to convert..." rows={3} />
      </div>
      {cases.length > 0 && (
        <div className="space-y-2">
          {cases.map((c) => (
            <div key={c.label} className="flex items-center gap-2 px-3 py-2 bg-bg-secondary border border-border rounded-md">
              <span className="text-xs text-text-secondary min-w-[180px]">{c.label}</span>
              <code className="flex-1 text-sm font-mono break-all">{c.value}</code>
              <CopyButton value={c.value} />
            </div>
          ))}
        </div>
      )}
    </ToolLayout>
  );
}
