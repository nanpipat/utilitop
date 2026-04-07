"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import ToolLayout from "@/components/layout/ToolLayout";
import DiagramEditor from "@/components/diagrams/DiagramEditor";

const EXAMPLES = [
  {
    label: "Flowchart (ไทย)",
    code: `flowchart TD
    A[เริ่มต้น] --> B{เงื่อนไข}
    B -->|ใช่| C[ดำเนินการ]
    B -->|ไม่| D[สิ้นสุด]
    C --> D`,
  },
  {
    label: "Sequence (ไทย)",
    code: `sequenceDiagram
    participant ผู้ใช้
    participant ระบบ
    participant ฐานข้อมูล
    ผู้ใช้->>ระบบ: ส่งข้อมูลล็อกอิน
    ระบบ->>ฐานข้อมูล: ตรวจสอบรหัสผ่าน
    ฐานข้อมูล-->>ระบบ: ผลการตรวจสอบ
    ระบบ-->>ผู้ใช้: แสดงหน้าหลัก`,
  },
  {
    label: "Class Diagram",
    code: `classDiagram
    class Animal {
        +String name
        +int age
        +makeSound()
    }
    class Dog {
        +fetch()
    }
    class Cat {
        +purr()
    }
    Animal <|-- Dog
    Animal <|-- Cat`,
  },
  {
    label: "ER Diagram",
    code: `erDiagram
    CUSTOMER ||--o{ ORDER : places
    ORDER ||--|{ LINE-ITEM : contains
    CUSTOMER {
        string name
        string email
    }
    ORDER {
        int id
        date created
    }`,
  },
  {
    label: "Gantt Chart",
    code: `gantt
    title Project Timeline
    dateFormat  YYYY-MM-DD
    section Planning
    Research       :a1, 2024-01-01, 30d
    Design         :after a1, 20d
    section Development
    Frontend       :2024-02-20, 45d
    Backend        :2024-02-20, 40d`,
  },
  {
    label: "State Diagram",
    code: `stateDiagram-v2
    [*] --> Idle
    Idle --> Processing : Submit
    Processing --> Success : OK
    Processing --> Error : Fail
    Success --> Idle : Reset
    Error --> Idle : Retry`,
  },
  {
    label: "Pie Chart",
    code: `pie title Technology Usage
    "JavaScript" : 40
    "Python" : 25
    "TypeScript" : 20
    "Go" : 10
    "Rust" : 5`,
  },
  {
    label: "Git Graph",
    code: `gitGraph
    commit
    commit
    branch develop
    checkout develop
    commit
    commit
    checkout main
    merge develop
    commit`,
  },
];

const THEMES = ["default", "dark", "forest", "neutral", "base"];

let mermaidInitialized = false;

export default function MermaidTool() {
  const [theme, setTheme] = useState<"default" | "dark" | "forest" | "neutral" | "base">("default");
  const renderCount = useRef(0);

  useEffect(() => {
    const init = async () => {
      const m = await import("mermaid");
      m.default.initialize({
        startOnLoad: false,
        theme: theme,
        fontFamily: '"Sarabun", "Noto Sans Thai", "Inter", sans-serif',
      });
      mermaidInitialized = true;
    };
    init();
  }, [theme]);

  const renderMermaid = useCallback(async (code: string): Promise<string> => {
    const m = await import("mermaid");
    if (!mermaidInitialized) {
      m.default.initialize({
        startOnLoad: false,
        theme: theme,
        fontFamily: '"Sarabun", "Noto Sans Thai", "Inter", sans-serif',
      });
      mermaidInitialized = true;
    }
    renderCount.current++;
    const id = `mermaid-${Date.now()}-${renderCount.current}`;
    const { svg } = await m.default.render(id, code);
    return svg;
  }, [theme]);

  const themeSelector = (
    <div className="flex items-center gap-2">
      <span className="text-[11px] text-text-secondary">Theme:</span>
      <select
        value={theme}
        onChange={(e) => setTheme(e.target.value as typeof theme)}
        className="px-2 py-1 text-[11px] bg-bg-tertiary border border-border rounded-lg"
      >
        {THEMES.map((t) => (
          <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
        ))}
      </select>
    </div>
  );

  return (
    <ToolLayout title="Mermaid" description="Create diagrams using Mermaid syntax — rendered locally in your browser">
      <DiagramEditor
        language="Mermaid"
        defaultCode={EXAMPLES[0].code}
        examples={EXAMPLES}
        onRender={renderMermaid}
        debounceMs={600}
        filename="mermaid-diagram"
        themeSelector={themeSelector}
      />
    </ToolLayout>
  );
}
