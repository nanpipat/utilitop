"use client";

import { useState, useEffect, useRef, useCallback, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Copy, Check, Download, ChevronDown, ChevronUp, ZoomIn, ZoomOut, Maximize } from "lucide-react";
import { exportSVG, exportPNG } from "@/lib/tools/diagram-export";

interface Example {
  label: string;
  code: string;
}

interface DiagramEditorProps {
  language: string;
  defaultCode: string;
  examples: Example[];
  onRender: (code: string) => Promise<string>;
  privacyNote?: string;
  debounceMs?: number;
  filename?: string;
  themeSelector?: ReactNode;
}

export default function DiagramEditor({
  language,
  defaultCode,
  examples,
  onRender,
  privacyNote,
  debounceMs = 600,
  filename = "diagram",
  themeSelector,
}: DiagramEditorProps) {
  const [code, setCode] = useState(defaultCode);
  const [svg, setSvg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedExample, setSelectedExample] = useState("");
  const [editorCollapsed, setEditorCollapsed] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const panStart = useRef({ x: 0, y: 0 });
  const renderTimer = useRef<ReturnType<typeof setTimeout>>();
  const previewRef = useRef<HTMLDivElement>(null);

  const doRender = useCallback(async (src: string) => {
    if (!src.trim()) { setSvg(""); setError(""); return; }
    setLoading(true);
    try {
      const result = await onRender(src);
      setSvg(result);
      setError("");
    } catch (e: any) {
      setError(e.message || "Render failed");
      setSvg("");
    }
    setLoading(false);
  }, [onRender]);

  useEffect(() => {
    if (renderTimer.current) clearTimeout(renderTimer.current);
    renderTimer.current = setTimeout(() => doRender(code), debounceMs);
    return () => { if (renderTimer.current) clearTimeout(renderTimer.current); };
  }, [code, debounceMs, doRender]);

  const loadExample = () => {
    const ex = examples.find((e) => e.label === selectedExample);
    if (ex) setCode(ex.code);
  };

  const handleCopy = async () => {
    try { await navigator.clipboard.writeText(svg); } catch {}
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const ZOOM_STEP = 0.15;
  const ZOOM_MIN = 0.1;
  const ZOOM_MAX = 5;

  const zoomIn = () => setZoom((z) => Math.min(z + ZOOM_STEP, ZOOM_MAX));
  const zoomOut = () => setZoom((z) => Math.max(z - ZOOM_STEP, ZOOM_MIN));
  const zoomReset = () => { setZoom(1); setPan({ x: 0, y: 0 }); };

  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      setZoom((z) => Math.min(Math.max(z - e.deltaY * 0.003, ZOOM_MIN), ZOOM_MAX));
    }
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (zoom <= 1) return;
    setIsPanning(true);
    panStart.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isPanning) return;
    setPan({ x: e.clientX - panStart.current.x, y: e.clientY - panStart.current.y });
  };

  const handlePointerUp = () => setIsPanning(false);

  return (
    <div className="space-y-3">
      {privacyNote && (
        <div className="flex items-start gap-2 px-3 sm:px-4 py-2.5 sm:py-3 bg-warning/8 border border-warning/20 rounded-xl text-xs sm:text-sm text-warning">
          <span className="text-sm leading-none mt-px shrink-0">ℹ</span>
          <span className="leading-relaxed whitespace-pre-line">{privacyNote}</span>
        </div>
      )}

      <div className="space-y-3">
        <div className="flex flex-col min-w-0">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setEditorCollapsed(!editorCollapsed)}
                className="p-0.5 text-text-secondary hover:text-text-primary transition-colors"
              >
                {editorCollapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
              </button>
              <span className="text-xs text-text-secondary font-medium">{language} Code</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <select
                value={selectedExample}
                onChange={(e) => setSelectedExample(e.target.value)}
                className="px-2 py-1 text-[11px] bg-bg-tertiary border border-border rounded-lg min-w-0 max-w-[140px]"
              >
                <option value="">Examples...</option>
                {examples.map((ex) => (
                  <option key={ex.label} value={ex.label}>{ex.label}</option>
                ))}
              </select>
              <button
                onClick={loadExample}
                disabled={!selectedExample}
                className="px-2 py-1 text-[11px] font-medium bg-bg-hover text-text-primary rounded-lg hover:bg-bg-active disabled:opacity-40 transition-all shrink-0"
              >
                Load
              </button>
            </div>
          </div>
          {!editorCollapsed && (
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck={false}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-bg-tertiary border border-border rounded-xl font-mono text-xs sm:text-sm resize-y focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/50 placeholder:text-text-placeholder transition-all"
              rows={12}
              placeholder={`Enter ${language} code here...`}
            />
          )}
          {error && (
            <div className="mt-2 flex items-start gap-2 px-3 py-2 bg-error/8 border border-error/20 rounded-xl text-xs text-error break-words">
              <span className="shrink-0">⚠</span>
              <span className="break-all">{error}</span>
            </div>
          )}
        </div>

        <div className="flex flex-col min-w-0">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-text-secondary font-medium">
              Preview
              {loading && <span className="ml-2 text-accent animate-pulse">Rendering...</span>}
            </span>
            <div className="flex items-center gap-2">
              {themeSelector}
              <div className="flex items-center gap-1 bg-bg-secondary rounded-lg border border-border p-0.5">
                <button onClick={zoomOut} disabled={zoom <= ZOOM_MIN} className="p-1 rounded hover:bg-bg-hover disabled:opacity-30 transition-all" title="Zoom out">
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <button onClick={zoomReset} className="px-1.5 py-0.5 text-[10px] font-mono text-text-secondary hover:text-text-primary min-w-[42px] text-center hover:bg-bg-hover rounded transition-all" title="Reset zoom">
                  {Math.round(zoom * 100)}%
                </button>
                <button onClick={zoomIn} disabled={zoom >= ZOOM_MAX} className="p-1 rounded hover:bg-bg-hover disabled:opacity-30 transition-all" title="Zoom in">
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button onClick={zoomReset} disabled={zoom === 1} className="p-1 rounded hover:bg-bg-hover disabled:opacity-30 transition-all" title="Fit">
                  <Maximize className="w-3.5 h-3.5" />
                </button>
              </div>
              {svg && (
                <div className="flex items-center gap-1">
                  <button onClick={() => exportSVG(svg, `${filename}.svg`)} className="flex items-center gap-1 px-2 py-1 text-[11px] font-medium rounded-lg bg-bg-hover text-text-primary hover:bg-bg-active border border-border transition-all">
                    <Download className="w-3 h-3" />SVG
                  </button>
                  <button onClick={() => exportPNG(svg, `${filename}.png`)} className="flex items-center gap-1 px-2 py-1 text-[11px] font-medium rounded-lg bg-bg-hover text-text-primary hover:bg-bg-active border border-border transition-all">
                    <Download className="w-3 h-3" />PNG
                  </button>
                  <button onClick={handleCopy} className={cn("flex items-center gap-1 px-2 py-1 text-[11px] font-medium rounded-lg transition-all border", copied ? "bg-success/15 text-success border-success/30" : "bg-bg-hover text-text-primary hover:bg-bg-active border-border")}>
                    {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    {copied ? "Copied" : "Copy"}
                  </button>
                </div>
              )}
            </div>
          </div>
          <div
            ref={previewRef}
            className={cn(
              "bg-bg-tertiary border border-border rounded-xl overflow-auto",
              isPanning && "cursor-grabbing",
              zoom > 1 && !isPanning && "cursor-grab"
            )}
            style={{ minHeight: "300px", maxHeight: "70vh" }}
            onWheel={handleWheel}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
          >
            {svg ? (
              <div
                className="p-4 inline-block min-w-full"
                style={{
                  transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                  transformOrigin: "center top",
                  transition: isPanning ? "none" : "transform 0.15s ease",
                }}
              >
                <div className="[&>svg]:h-auto [&>svg]:max-w-none" dangerouslySetInnerHTML={{ __html: svg }} />
              </div>
            ) : (
              <div className="flex items-center justify-center p-8" style={{ minHeight: "200px" }}>
                <span className="text-xs sm:text-sm text-text-placeholder">
                  {loading ? "Rendering..." : "Diagram preview will appear here"}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 pt-1">
        <button onClick={() => doRender(code)} className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-semibold rounded-lg sm:rounded-xl bg-accent text-white hover:bg-accent-hover shadow-sm active:scale-[0.97] transition-all">
          Render
        </button>
        <button onClick={() => setEditorCollapsed(!editorCollapsed)} className="px-3 py-1.5 text-[11px] sm:text-xs font-medium rounded-lg sm:rounded-xl bg-bg-hover text-text-primary hover:bg-bg-active border border-border transition-all">
          {editorCollapsed ? "Show Editor" : "Hide Editor"}
        </button>
      </div>
    </div>
  );
}
