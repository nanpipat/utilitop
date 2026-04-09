"use client";

import dynamic from "next/dynamic";

function ToolSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-5 py-4 sm:py-8 animate-pulse">
      <div className="mb-4 sm:mb-6">
        <div className="h-5 sm:h-6 bg-bg-tertiary rounded-lg w-40 mb-2" />
        <div className="h-3.5 sm:h-4 bg-bg-tertiary rounded-lg w-64" />
      </div>
      <div className="h-9 bg-bg-tertiary rounded-xl w-56 mb-4" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="h-48 bg-bg-tertiary rounded-xl" />
        <div className="h-48 bg-bg-tertiary rounded-xl" />
      </div>
    </div>
  );
}

// Next.js requires the options argument to be an inline object literal (not a variable)
const toolMap: Record<string, React.ComponentType> = {
  "json-formatter": dynamic(() => import("@/components/tools/json-formatter"), { loading: ToolSkeleton }),
  "yaml-formatter": dynamic(() => import("@/components/tools/yaml-formatter"), { loading: ToolSkeleton }),
  "xml-formatter": dynamic(() => import("@/components/tools/xml-formatter"), { loading: ToolSkeleton }),
  "sql-formatter": dynamic(() => import("@/components/tools/sql-formatter"), { loading: ToolSkeleton }),
  "html-formatter": dynamic(() => import("@/components/tools/html-formatter"), { loading: ToolSkeleton }),
  "css-formatter": dynamic(() => import("@/components/tools/css-formatter"), { loading: ToolSkeleton }),
  "js-formatter": dynamic(() => import("@/components/tools/js-formatter"), { loading: ToolSkeleton }),
  base64: dynamic(() => import("@/components/tools/base64"), { loading: ToolSkeleton }),
  url: dynamic(() => import("@/components/tools/url"), { loading: ToolSkeleton }),
  jwt: dynamic(() => import("@/components/tools/jwt"), { loading: ToolSkeleton }),
  "html-entity": dynamic(() => import("@/components/tools/html-entity"), { loading: ToolSkeleton }),
  unicode: dynamic(() => import("@/components/tools/unicode"), { loading: ToolSkeleton }),
  gzip: dynamic(() => import("@/components/tools/gzip"), { loading: ToolSkeleton }),
  hex: dynamic(() => import("@/components/tools/hex"), { loading: ToolSkeleton }),
  "morse-code": dynamic(() => import("@/components/tools/morse-code"), { loading: ToolSkeleton }),
  uuid: dynamic(() => import("@/components/tools/uuid"), { loading: ToolSkeleton }),
  hash: dynamic(() => import("@/components/tools/hash"), { loading: ToolSkeleton }),
  password: dynamic(() => import("@/components/tools/password"), { loading: ToolSkeleton }),
  "lorem-ipsum": dynamic(() => import("@/components/tools/lorem-ipsum"), { loading: ToolSkeleton }),
  "qr-code": dynamic(() => import("@/components/tools/qr-code"), { loading: ToolSkeleton }),
  cron: dynamic(() => import("@/components/tools/cron"), { loading: ToolSkeleton }),
  color: dynamic(() => import("@/components/tools/color"), { loading: ToolSkeleton }),
  checksum: dynamic(() => import("@/components/tools/checksum"), { loading: ToolSkeleton }),
  "json-yaml": dynamic(() => import("@/components/tools/json-yaml"), { loading: ToolSkeleton }),
  "json-csv": dynamic(() => import("@/components/tools/json-csv"), { loading: ToolSkeleton }),
  timestamp: dynamic(() => import("@/components/tools/timestamp"), { loading: ToolSkeleton }),
  "number-base": dynamic(() => import("@/components/tools/number-base"), { loading: ToolSkeleton }),
  "xml-json": dynamic(() => import("@/components/tools/xml-json"), { loading: ToolSkeleton }),
  markdown: dynamic(() => import("@/components/tools/markdown"), { loading: ToolSkeleton }),
  regex: dynamic(() => import("@/components/tools/regex"), { loading: ToolSkeleton }),
  diff: dynamic(() => import("@/components/tools/diff"), { loading: ToolSkeleton }),
  "case-converter": dynamic(() => import("@/components/tools/case-converter"), { loading: ToolSkeleton }),
  counter: dynamic(() => import("@/components/tools/counter"), { loading: ToolSkeleton }),
  sorter: dynamic(() => import("@/components/tools/sorter"), { loading: ToolSkeleton }),
  list: dynamic(() => import("@/components/tools/list"), { loading: ToolSkeleton }),
  "http-status": dynamic(() => import("@/components/tools/http-status"), { loading: ToolSkeleton }),
  jsonpath: dynamic(() => import("@/components/tools/jsonpath"), { loading: ToolSkeleton }),
  "jwt-generator": dynamic(() => import("@/components/tools/jwt-generator"), { loading: ToolSkeleton }),
  mermaid: dynamic(() => import("@/components/tools/mermaid"), { loading: ToolSkeleton }),
  plantuml: dynamic(() => import("@/components/tools/plantuml"), { loading: ToolSkeleton }),
  graphviz: dynamic(() => import("@/components/tools/graphviz"), { loading: ToolSkeleton }),
  d2: dynamic(() => import("@/components/tools/d2"), { loading: ToolSkeleton }),
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
