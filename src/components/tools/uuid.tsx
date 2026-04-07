"use client";

import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import ToolLayout, { ActionButton, CopyButton, Select } from "@/components/layout/ToolLayout";

export default function UuidGenerator() {
  const [uuids, setUuids] = useState<string[]>([]);
  const [version, setVersion] = useState("v4");
  const [uppercase, setUppercase] = useState(false);
  const [noHyphens, setNoHyphens] = useState(false);
  const [count, setCount] = useState(1);

  const generate = () => {
    const results: string[] = [];
    for (let i = 0; i < count; i++) {
      let id = uuidv4();
      if (noHyphens) id = id.replace(/-/g, "");
      if (uppercase) id = id.toUpperCase();
      results.push(id);
    }
    setUuids(results);
  };

  return (
    <ToolLayout title="UUID Generator" description="Generate UUID/GUID values">
      <div className="flex flex-wrap items-center gap-3 mb-3">
        <Select value={version} onChange={setVersion} label="Version:" options={[{ value: "v4", label: "v4 (Random)" }]} />
        <label className="flex items-center gap-2 text-xs cursor-pointer">
          <input type="checkbox" checked={uppercase} onChange={(e) => setUppercase(e.target.checked)} className="rounded border-border" />
          <span>Uppercase</span>
        </label>
        <label className="flex items-center gap-2 text-xs cursor-pointer">
          <input type="checkbox" checked={noHyphens} onChange={(e) => setNoHyphens(e.target.checked)} className="rounded border-border" />
          <span>No hyphens</span>
        </label>
        <div className="flex items-center gap-2">
          <span className="text-xs text-text-secondary">Count:</span>
          <input type="number" min={1} max={100} value={count} onChange={(e) => setCount(Math.min(100, Math.max(1, parseInt(e.target.value) || 1)))} className="w-16 px-2 py-1 text-xs bg-bg-secondary border border-border rounded-md" />
        </div>
        <ActionButton onClick={generate}>Generate</ActionButton>
      </div>
      {uuids.length > 0 && (
        <div className="space-y-1">
          {uuids.map((id, i) => (
            <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-bg-secondary border border-border rounded-md">
              <code className="flex-1 font-mono text-sm">{id}</code>
              <CopyButton value={id} />
            </div>
          ))}
          <div className="mt-2">
            <CopyButton value={uuids.join("\n")} />
            <span className="text-xs text-text-secondary ml-2">Copy all</span>
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
