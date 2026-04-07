"use client";

import dynamic from "next/dynamic";

const toolMap: Record<string, React.ComponentType> = {
  "json-formatter": dynamic(() => import("@/components/tools/json-formatter")),
  "yaml-formatter": dynamic(() => import("@/components/tools/yaml-formatter")),
  "xml-formatter": dynamic(() => import("@/components/tools/xml-formatter")),
  "sql-formatter": dynamic(() => import("@/components/tools/sql-formatter")),
  "html-formatter": dynamic(() => import("@/components/tools/html-formatter")),
  "css-formatter": dynamic(() => import("@/components/tools/css-formatter")),
  "js-formatter": dynamic(() => import("@/components/tools/js-formatter")),
  base64: dynamic(() => import("@/components/tools/base64")),
  url: dynamic(() => import("@/components/tools/url")),
  jwt: dynamic(() => import("@/components/tools/jwt")),
  "html-entity": dynamic(() => import("@/components/tools/html-entity")),
  unicode: dynamic(() => import("@/components/tools/unicode")),
  gzip: dynamic(() => import("@/components/tools/gzip")),
  hex: dynamic(() => import("@/components/tools/hex")),
  "morse-code": dynamic(() => import("@/components/tools/morse-code")),
  uuid: dynamic(() => import("@/components/tools/uuid")),
  hash: dynamic(() => import("@/components/tools/hash")),
  password: dynamic(() => import("@/components/tools/password")),
  "lorem-ipsum": dynamic(() => import("@/components/tools/lorem-ipsum")),
  "qr-code": dynamic(() => import("@/components/tools/qr-code")),
  cron: dynamic(() => import("@/components/tools/cron")),
  color: dynamic(() => import("@/components/tools/color")),
  checksum: dynamic(() => import("@/components/tools/checksum")),
  "json-yaml": dynamic(() => import("@/components/tools/json-yaml")),
  "json-csv": dynamic(() => import("@/components/tools/json-csv")),
  timestamp: dynamic(() => import("@/components/tools/timestamp")),
  "number-base": dynamic(() => import("@/components/tools/number-base")),
  "xml-json": dynamic(() => import("@/components/tools/xml-json")),
  markdown: dynamic(() => import("@/components/tools/markdown")),
  regex: dynamic(() => import("@/components/tools/regex")),
  diff: dynamic(() => import("@/components/tools/diff")),
  "case-converter": dynamic(() => import("@/components/tools/case-converter")),
  counter: dynamic(() => import("@/components/tools/counter")),
  sorter: dynamic(() => import("@/components/tools/sorter")),
  list: dynamic(() => import("@/components/tools/list")),
  "http-status": dynamic(() => import("@/components/tools/http-status")),
  jsonpath: dynamic(() => import("@/components/tools/jsonpath")),
  "jwt-generator": dynamic(() => import("@/components/tools/jwt-generator")),
};

export function getToolComponent(toolId: string) {
  return toolMap[toolId];
}

export default function ToolRenderer({ toolId }: { toolId: string }) {
  const Component = toolMap[toolId];

  if (!Component) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="text-sm text-error">Tool not found: {toolId}</div>
      </div>
    );
  }

  return <Component />;
}
