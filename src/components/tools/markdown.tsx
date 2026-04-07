"use client";

import { useState, useEffect, useCallback } from "react";
import { marked } from "marked";
import DOMPurify from "dompurify";
import ToolLayout, { CopyButton, Toggle } from "@/components/layout/ToolLayout";

export default function MarkdownPreview() {
  const [input, setInput] = useState("# Hello World\n\nThis is **markdown** preview.\n\n- List item 1\n- List item 2\n\n```js\nconsole.log('hello');\n```\n");
  const [html, setHtml] = useState("");
  const [darkPreview, setDarkPreview] = useState(false);

  const render = useCallback(() => {
    try {
      const raw = marked.parse(input, { async: false }) as string;
      setHtml(DOMPurify.sanitize(raw));
    } catch {
      setHtml("<p>Render error</p>");
    }
  }, [input]);

  useEffect(() => {
    const timer = setTimeout(render, 300);
    return () => clearTimeout(timer);
  }, [render]);

  return (
    <ToolLayout title="Markdown Preview" description="Preview Markdown rendered as HTML">
      <div className="flex flex-wrap items-center gap-3 mb-3">
        <Toggle label="Dark preview" checked={darkPreview} onChange={setDarkPreview} />
        <CopyButton value={html} />
        <span className="text-xs text-text-secondary ml-1">Copy HTML</span>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <div>
          <span className="text-xs text-text-secondary mb-1 block">Markdown</span>
          <textarea value={input} onChange={(e) => setInput(e.target.value)} className="w-full px-3 py-2 bg-bg-secondary border border-border rounded-md font-mono text-sm resize-y focus:outline-none focus:ring-1 focus:ring-accent" rows={16} />
        </div>
        <div>
          <span className="text-xs text-text-secondary mb-1 block">Preview</span>
          <div
            className={`px-4 py-3 border border-border rounded-md overflow-y-auto prose prose-sm max-w-none ${darkPreview ? "bg-gray-900 text-gray-100" : "bg-white"}`}
            style={{ minHeight: "400px" }}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </div>
    </ToolLayout>
  );
}
