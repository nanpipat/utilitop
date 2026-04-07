"use client";

import { useState, useEffect } from "react";
import ToolLayout, { CopyButton, ErrorDisplay } from "@/components/layout/ToolLayout";

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const m = hex.replace("#", "").match(/^([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
  if (!m) return null;
  return { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) };
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l: Math.round(l * 100) };
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hslToHex(h: number, s: number, l: number): string {
  s /= 100; l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function generatePalette(hex: string): { label: string; colors: string[] }[] {
  const rgb = hexToRgb(hex);
  if (!rgb) return [];
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  return [
    { label: "Complementary", colors: [hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l)] },
    { label: "Analogous", colors: [hslToHex((hsl.h + 30) % 360, hsl.s, hsl.l), hslToHex((hsl.h - 30 + 360) % 360, hsl.s, hsl.l)] },
    { label: "Triadic", colors: [hslToHex((hsl.h + 120) % 360, hsl.s, hsl.l), hslToHex((hsl.h + 240) % 360, hsl.s, hsl.l)] },
  ];
}

export default function ColorPicker() {
  const [hex, setHex] = useState("#2383e2");
  const [rgb, setRgb] = useState({ r: 35, g: 131, b: 226 });
  const [hsl, setHsl] = useState({ h: 210, s: 78, l: 51 });
  const [error, setError] = useState("");
  const [palette, setPalette] = useState<{ label: string; colors: string[] }[]>([]);

  const updateFromHex = (value: string) => {
    setHex(value);
    const result = hexToRgb(value);
    if (result) {
      setRgb(result);
      setHsl(rgbToHsl(result.r, result.g, result.b));
      setPalette(generatePalette(value));
      setError("");
    } else setError("Invalid HEX color");
  };

  useEffect(() => { updateFromHex(hex); }, []);

  return (
    <ToolLayout title="Color Picker" description="Pick and convert colors between formats">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div className="w-full h-32 rounded-md border border-border" style={{ backgroundColor: hex }} />
          <div>
            <label className="text-xs text-text-secondary block mb-1">HEX</label>
            <div className="flex items-center gap-2">
              <input type="color" value={hex} onChange={(e) => updateFromHex(e.target.value)} className="w-8 h-8 rounded border border-border cursor-pointer" />
              <input type="text" value={hex} onChange={(e) => updateFromHex(e.target.value)} className="flex-1 px-2 py-1 bg-bg-secondary border border-border rounded-md font-mono text-sm" />
              <CopyButton value={hex} />
            </div>
          </div>
          <div>
            <label className="text-xs text-text-secondary block mb-1">RGB</label>
            <div className="flex items-center gap-2">
              <span className="flex-1 px-2 py-1 bg-bg-secondary border border-border rounded-md font-mono text-sm">{`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`}</span>
              <CopyButton value={`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`} />
            </div>
          </div>
          <div>
            <label className="text-xs text-text-secondary block mb-1">HSL</label>
            <div className="flex items-center gap-2">
              <span className="flex-1 px-2 py-1 bg-bg-secondary border border-border rounded-md font-mono text-sm">{`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`}</span>
              <CopyButton value={`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`} />
            </div>
          </div>
          {error && <ErrorDisplay message={error} />}
        </div>
        <div className="space-y-4">
          {palette.map((group) => (
            <div key={group.label}>
              <span className="text-xs text-text-secondary font-medium block mb-2">{group.label}</span>
              <div className="flex gap-2">
                {group.colors.map((color) => (
                  <div key={color} className="flex flex-col items-center gap-1">
                    <div className="w-16 h-16 rounded-md border border-border cursor-pointer" style={{ backgroundColor: color }} onClick={() => updateFromHex(color)} />
                    <span className="text-[10px] font-mono">{color}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </ToolLayout>
  );
}
