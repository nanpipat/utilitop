"use client";

import { useState } from "react";
import ToolLayout, { ActionButton, CopyButton } from "@/components/layout/ToolLayout";

function getStrength(password: string): { label: string; color: string; width: string } {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (password.length >= 16) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;
  if (score <= 2) return { label: "Weak", color: "bg-error", width: "w-1/4" };
  if (score <= 4) return { label: "Fair", color: "bg-warning", width: "w-2/4" };
  if (score <= 5) return { label: "Strong", color: "bg-green-400", width: "w-3/4" };
  return { label: "Very Strong", color: "bg-success", width: "w-full" };
}

export default function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [uppercase, setUppercase] = useState(true);
  const [lowercase, setLowercase] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false);
  const [excludeChars, setExcludeChars] = useState("");
  const [count, setCount] = useState(1);
  const [passwords, setPasswords] = useState<string[]>([]);

  const generate = () => {
    let chars = "";
    if (lowercase) chars += "abcdefghijklmnopqrstuvwxyz";
    if (uppercase) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (numbers) chars += "0123456789";
    if (symbols) chars += "!@#$%^&*()_+-=[]{}|;:,.<>?";
    if (excludeAmbiguous) chars = chars.replace(/[0Ol1I]/g, "");
    if (excludeChars) {
      for (const c of excludeChars) chars = chars.replace(new RegExp(c.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"), "");
    }
    if (!chars) return;
    const arr = new Uint32Array(length);
    const results: string[] = [];
    for (let n = 0; n < count; n++) {
      crypto.getRandomValues(arr);
      let pwd = "";
      for (let i = 0; i < length; i++) pwd += chars[arr[i] % chars.length];
      results.push(pwd);
    }
    setPasswords(results);
  };

  const strength = passwords.length > 0 ? getStrength(passwords[0]) : null;

  return (
    <ToolLayout title="Password Generator" description="Generate secure random passwords">
      <div className="space-y-3 mb-4">
        <div>
          <div className="flex justify-between text-xs text-text-secondary mb-1">
            <span>Length: {length}</span>
          </div>
          <input type="range" min={8} max={128} value={length} onChange={(e) => setLength(Number(e.target.value))} className="w-full" />
        </div>
        <div className="flex flex-wrap gap-4">
          {[
            { label: "Uppercase", checked: uppercase, onChange: setUppercase },
            { label: "Lowercase", checked: lowercase, onChange: setLowercase },
            { label: "Numbers", checked: numbers, onChange: setNumbers },
            { label: "Symbols", checked: symbols, onChange: setSymbols },
            { label: "Exclude ambiguous", checked: excludeAmbiguous, onChange: setExcludeAmbiguous },
          ].map((opt) => (
            <label key={opt.label} className="flex items-center gap-1.5 text-xs cursor-pointer">
              <input type="checkbox" checked={opt.checked} onChange={(e) => opt.onChange(e.target.checked)} className="rounded border-border" />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-text-secondary">Exclude chars:</span>
          <input type="text" value={excludeChars} onChange={(e) => setExcludeChars(e.target.value)} className="px-2 py-1 text-xs bg-bg-secondary border border-border rounded-md w-32" placeholder="e.g. 0O" />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-text-secondary">Quantity:</span>
          <input type="number" min={1} max={10} value={count} onChange={(e) => setCount(Math.min(10, Math.max(1, parseInt(e.target.value) || 1)))} className="w-16 px-2 py-1 text-xs bg-bg-secondary border border-border rounded-md" />
        </div>
        <ActionButton onClick={generate}>Generate</ActionButton>
      </div>
      {passwords.length > 0 && strength && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-bg-hover rounded-full overflow-hidden">
              <div className={`h-full ${strength.color} ${strength.width} rounded-full transition-all`} />
            </div>
            <span className="text-xs font-medium">{strength.label}</span>
          </div>
          {passwords.map((pwd, i) => (
            <div key={i} className="flex items-center gap-2 px-3 py-2 bg-bg-secondary border border-border rounded-md">
              <code className="flex-1 font-mono text-sm break-all">{pwd}</code>
              <CopyButton value={pwd} />
            </div>
          ))}
        </div>
      )}
    </ToolLayout>
  );
}
