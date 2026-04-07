"use client";

import { useState } from "react";
import cronstrue from "cronstrue";
import parser from "cron-parser";
import ToolLayout, { ErrorDisplay } from "@/components/layout/ToolLayout";

export default function CronParser() {
  const [input, setInput] = useState("");
  const [description, setDescription] = useState("");
  const [nextRuns, setNextRuns] = useState<string[]>([]);
  const [fields, setFields] = useState<{ label: string; value: string }[]>([]);
  const [error, setError] = useState("");

  const parse = () => {
    if (!input.trim()) { setDescription(""); setNextRuns([]); setFields([]); setError(""); return; }
    try {
      const desc = cronstrue.toString(input);
      setDescription(desc);
      const interval = parser.parse(input);
      const runs: string[] = [];
      for (let i = 0; i < 5; i++) {
        const next = interval.next();
        if (next) runs.push(String(next));
      }
      setNextRuns(runs);
      const parts = input.trim().split(/\s+/);
      const labels = ["Minute", "Hour", "Day of Month", "Month", "Day of Week"];
      if (parts.length === 6) labels.unshift("Second");
      setFields(labels.map((l, i) => ({ label: l, value: parts[i] || "" })));
      setError("");
    } catch (e: any) {
      setError(`Invalid CRON expression: ${e.message}`);
      setDescription("");
      setNextRuns([]);
      setFields([]);
    }
  };

  return (
    <ToolLayout title="CRON Parser" description="Parse and explain CRON expressions">
      <div className="mb-3">
        <span className="text-xs text-text-secondary mb-1 block">CRON Expression</span>
        <div className="flex gap-2">
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && parse()} placeholder="e.g. 0 9 * * *" className="flex-1 px-3 py-2 bg-bg-secondary border border-border rounded-md font-mono text-sm focus:outline-none focus:ring-1 focus:ring-accent" />
          <button onClick={parse} className="px-3 py-1.5 text-xs font-medium rounded-md bg-accent text-white hover:opacity-90 transition-colors">Parse</button>
        </div>
        <div className="flex gap-2 mt-2 flex-wrap">
          {["* * * * *", "0 9 * * *", "*/5 * * * *", "0 0 1 * *", "0 0 * * 1"].map((ex) => (
            <button key={ex} onClick={() => { setInput(ex); }} className="px-2 py-1 text-[10px] bg-bg-hover rounded hover:bg-bg-active">{ex}</button>
          ))}
        </div>
      </div>
      {error && <ErrorDisplay message={error} />}
      {description && (
        <div className="space-y-3">
          <div className="px-3 py-2 bg-accent-light border border-accent/30 rounded-md text-sm font-medium">{description}</div>
          {fields.length > 0 && (
            <div>
              <span className="text-xs text-text-secondary font-medium block mb-1">Field Breakdown</span>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                {fields.map((f) => (
                  <div key={f.label} className="px-3 py-2 bg-bg-secondary border border-border rounded-md text-center">
                    <div className="text-[10px] text-text-secondary">{f.label}</div>
                    <div className="font-mono text-sm">{f.value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {nextRuns.length > 0 && (
            <div>
              <span className="text-xs text-text-secondary font-medium block mb-1">Next 5 Executions</span>
              <div className="space-y-1">
                {nextRuns.map((run, i) => (
                  <div key={i} className="px-3 py-1.5 bg-bg-secondary border border-border rounded-md text-sm font-mono">{new Date(run).toLocaleString()}</div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </ToolLayout>
  );
}
