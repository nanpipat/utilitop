"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import ToolLayout, { ErrorDisplay } from "@/components/layout/ToolLayout";

export default function RegexTester() {
  const [pattern, setPattern] = useState("");
  const [testString, setTestString] = useState("");
  const [globalFlag, setGlobalFlag] = useState(true);
  const [caseInsensitive, setCaseInsensitive] = useState(false);
  const [multiline, setMultiline] = useState(false);
  const [dotAll, setDotAll] = useState(false);
  const [unicode, setUnicode] = useState(false);
  const [error, setError] = useState("");
  const [matches, setMatches] = useState<{ match: string; index: number; groups: string[] }[]>([]);

  const flags = useMemo(() => {
    let f = "";
    if (globalFlag) f += "g";
    if (caseInsensitive) f += "i";
    if (multiline) f += "m";
    if (dotAll) f += "s";
    if (unicode) f += "u";
    return f;
  }, [globalFlag, caseInsensitive, multiline, dotAll, unicode]);

  const test = useCallback(() => {
    if (!pattern || !testString) { setMatches([]); setError(""); return; }
    try {
      const regex = new RegExp(pattern, flags);
      const results: { match: string; index: number; groups: string[] }[] = [];
      if (globalFlag) {
        let m;
        while ((m = regex.exec(testString)) !== null) {
          results.push({ match: m[0], index: m.index, groups: m.slice(1) });
          if (!m[0]) regex.lastIndex++;
        }
      } else {
        const m = regex.exec(testString);
        if (m) results.push({ match: m[0], index: m.index, groups: m.slice(1) });
      }
      setMatches(results);
      setError("");
    } catch (e: any) {
      setError(`Invalid regex: ${e.message}`);
      setMatches([]);
    }
  }, [pattern, testString, flags, globalFlag]);

  useEffect(() => {
    const timer = setTimeout(test, 300);
    return () => clearTimeout(timer);
  }, [test]);

  const highlighted = useMemo(() => {
    if (!pattern || error || matches.length === 0) return testString;
    try {
      const regex = new RegExp(pattern, flags);
      return testString.replace(regex, (match) => `<mark class="bg-yellow-200 dark:bg-yellow-800 rounded px-0.5">${match}</mark>`);
    } catch { return testString; }
  }, [pattern, testString, flags, matches, error]);

  return (
    <ToolLayout title="Regex Tester" description="Test and debug regular expressions">
      <div className="space-y-3">
        <div>
          <span className="text-xs text-text-secondary mb-1 block">Regular Expression</span>
          <div className="flex gap-2">
            <input type="text" value={pattern} onChange={(e) => setPattern(e.target.value)} placeholder="Enter regex pattern..." className="flex-1 px-3 py-2 bg-bg-secondary border border-border rounded-md font-mono text-sm focus:outline-none focus:ring-1 focus:ring-accent" />
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          {[
            { label: "Global (g)", checked: globalFlag, onChange: setGlobalFlag },
            { label: "Case insensitive (i)", checked: caseInsensitive, onChange: setCaseInsensitive },
            { label: "Multiline (m)", checked: multiline, onChange: setMultiline },
            { label: "Dot all (s)", checked: dotAll, onChange: setDotAll },
            { label: "Unicode (u)", checked: unicode, onChange: setUnicode },
          ].map((f) => (
            <label key={f.label} className="flex items-center gap-1.5 text-xs cursor-pointer">
              <input type="checkbox" checked={f.checked} onChange={(e) => f.onChange(e.target.checked)} className="rounded border-border" />
              <span>{f.label}</span>
            </label>
          ))}
        </div>
        <div>
          <span className="text-xs text-text-secondary mb-1 block">Test String</span>
          <textarea value={testString} onChange={(e) => setTestString(e.target.value)} placeholder="Enter test string..." className="w-full px-3 py-2 bg-bg-secondary border border-border rounded-md font-mono text-sm resize-y focus:outline-none focus:ring-1 focus:ring-accent" rows={6} />
        </div>
        {error && <ErrorDisplay message={error} />}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-text-secondary">Match Highlight</span>
            <span className="text-xs text-text-secondary">{matches.length} match{matches.length !== 1 ? "es" : ""}</span>
          </div>
          <div className="px-3 py-2 bg-bg-secondary border border-border rounded-md font-mono text-sm whitespace-pre-wrap break-all min-h-[60px]" dangerouslySetInnerHTML={{ __html: highlighted || '<span class="text-text-placeholder">Matches will appear here</span>' }} />
        </div>
        {matches.length > 0 && (
          <div>
            <span className="text-xs text-text-secondary font-medium block mb-1">Match Details</span>
            <div className="space-y-1 max-h-48 overflow-y-auto">
              {matches.map((m, i) => (
                <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-bg-secondary border border-border rounded-md text-xs font-mono">
                  <span className="text-text-secondary">[{m.index}]</span>
                  <span className="font-medium">{m.match}</span>
                  {m.groups.length > 0 && <span className="text-text-secondary">Groups: {m.groups.join(", ")}</span>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
