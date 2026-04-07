"use client";

import { useState } from "react";
import QRCode from "qrcode";
import ToolLayout, { ActionButton, Select } from "@/components/layout/ToolLayout";

export default function QrCodeGenerator() {
  const [input, setInput] = useState("");
  const [size, setSize] = useState("256");
  const [errorCorrection, setErrorCorrection] = useState("M");
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [dataUrl, setDataUrl] = useState("");
  const [svgUrl, setSvgUrl] = useState("");

  const generate = async () => {
    if (!input.trim()) return;
    try {
      const url = await QRCode.toDataURL(input, {
        width: Number(size),
        margin: 2,
        errorCorrectionLevel: errorCorrection as any,
        color: { dark: fgColor, light: bgColor },
      });
      setDataUrl(url);
      const svg = await QRCode.toString(input, {
        type: "svg",
        width: Number(size),
        margin: 2,
        errorCorrectionLevel: errorCorrection as any,
        color: { dark: fgColor, light: bgColor },
      });
      setSvgUrl(svg);
    } catch {}
  };

  const downloadPng = () => {
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = "qrcode.png";
    a.click();
  };

  const downloadSvg = () => {
    const blob = new Blob([svgUrl], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "qrcode.svg";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ToolLayout title="QR Code Generator" description="Generate QR codes from text or URLs">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div>
            <span className="text-xs text-text-secondary mb-1 block">Text or URL</span>
            <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Enter text or URL..." className="w-full px-3 py-2 bg-bg-secondary border border-border rounded-md text-sm resize-y focus:outline-none focus:ring-1 focus:ring-accent" rows={3} />
          </div>
          <div className="flex flex-wrap gap-3">
            <Select value={size} onChange={setSize} label="Size:" options={[{ value: "128", label: "128px" }, { value: "256", label: "256px" }, { value: "512", label: "512px" }]} />
            <Select value={errorCorrection} onChange={setErrorCorrection} label="Error correction:" options={[{ value: "L", label: "Low (7%)" }, { value: "M", label: "Medium (15%)" }, { value: "Q", label: "Quartile (25%)" }, { value: "H", label: "High (30%)" }]} />
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-xs">
              <span className="text-text-secondary">Foreground:</span>
              <input type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="w-8 h-6 rounded border border-border" />
            </label>
            <label className="flex items-center gap-2 text-xs">
              <span className="text-text-secondary">Background:</span>
              <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-8 h-6 rounded border border-border" />
            </label>
          </div>
          <ActionButton onClick={generate}>Generate QR Code</ActionButton>
        </div>
        <div>
          {dataUrl && (
            <div className="flex flex-col items-center gap-3">
              <img src={dataUrl} alt="QR Code" className="border border-border rounded-md" />
              <div className="flex gap-2">
                <ActionButton onClick={downloadPng} variant="secondary">Download PNG</ActionButton>
                <ActionButton onClick={downloadSvg} variant="secondary">Download SVG</ActionButton>
              </div>
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
