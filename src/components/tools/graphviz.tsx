"use client";

import { useCallback } from "react";
import ToolLayout from "@/components/layout/ToolLayout";
import DiagramEditor from "@/components/diagrams/DiagramEditor";

const EXAMPLES = [
  {
    label: "Directed Graph (ไทย)",
    code: `digraph G {
    rankdir=LR
    node [shape=box, fontname="Sarabun"]

    ผู้ใช้ -> ระบบ [label="request"]
    ระบบ -> ฐานข้อมูล [label="query"]
    ฐานข้อมูล -> ระบบ [label="result"]
    ระบบ -> ผู้ใช้ [label="response"]
}`,
  },
  {
    label: "Cluster Subgraphs",
    code: `digraph G {
    compound=true
    node [shape=box]

    subgraph cluster_frontend {
        label="Frontend"
        style=filled
        color="#e7f3ff"
        React SPA
        NextJS
    }

    subgraph cluster_backend {
        label="Backend"
        style=filled
        color="#fff3e0"
        "API Server"
        "Auth Service"
    }

    subgraph cluster_db {
        label="Database"
        style=filled
        color="#e8f5e9"
        PostgreSQL
        Redis
    }

    "React SPA" -> "API Server"
    NextJS -> "API Server"
    "API Server" -> "Auth Service"
    "API Server" -> PostgreSQL
    "Auth Service" -> Redis
}`,
  },
  {
    label: "Undirected Graph",
    code: `graph G {
    layout=neato
    node [shape=circle, style=filled, fillcolor="#e7f3ff"]

    A -- B -- C
    B -- D -- E
    C -- E
    A -- D
}`,
  },
  {
    label: "State Machine",
    code: `digraph states {
    rankdir=LR
    node [shape=circle, fontname="Sarabun"]
    node [fillcolor="#e7f3ff" style=filled]

    idle -> processing [label="submit"]
    processing -> success [label="ok"]
    processing -> error [label="fail"]
    success -> idle [label="reset"]
    error -> idle [label="retry"]

    idle [fillcolor="#e8f5e9"]
    success [fillcolor="#c8e6c9"]
    error [fillcolor="#ffebee"]
}`,
  },
];

let graphvizInstance: any = null;

export default function GraphvizTool() {
  const renderGraphviz = useCallback(async (dot: string): Promise<string> => {
    if (!graphvizInstance) {
      const { Graphviz } = await import("@hpcc-js/wasm");
      graphvizInstance = await Graphviz.load();
    }
    return graphvizInstance.dot(dot);
  }, []);

  return (
    <ToolLayout title="Graphviz" description="Create graphs using DOT language — rendered locally via WebAssembly">
      <DiagramEditor
        language="DOT"
        defaultCode={EXAMPLES[0].code}
        examples={EXAMPLES}
        onRender={renderGraphviz}
        debounceMs={500}
        filename="graphviz-diagram"
      />
    </ToolLayout>
  );
}
