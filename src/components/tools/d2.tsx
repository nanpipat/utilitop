"use client";

import { useCallback } from "react";
import ToolLayout from "@/components/layout/ToolLayout";
import DiagramEditor from "@/components/diagrams/DiagramEditor";
import { renderViaKroki } from "@/lib/tools/kroki";

const PRIVACY_NOTE = `D2 diagrams are rendered by kroki.io\nYour diagram source is sent to their servers.\nDo not include sensitive information.`;

const EXAMPLES = [
  {
    label: "Basic (ไทย)",
    code: `ผู้ใช้ -> ระบบ: ล็อกอิน
ระบบ -> ฐานข้อมูล: ตรวจสอบ
ฐานข้อมูล -> ระบบ: ผลลัพธ์
ระบบ -> ผู้ใช้: JWT token`,
  },
  {
    label: "Architecture",
    code: `direction: right

Frontend: {
  shape: rectangle
  style.fill: "#e7f3ff"
}
Backend API: {
  shape: rectangle
  style.fill: "#fff3e0"
}
Database: {
  shape: cylinder
  style.fill: "#e8f5e9"
}
Cache: {
  shape: cylinder
  style.fill: "#fce4ec"
}

Frontend -> Backend API: HTTP request
Backend API -> Database: SQL query
Backend API -> Cache: get/set`,
  },
  {
    label: "Flowchart",
    code: `direction: down

Start -> Check: Submit form
Check -> Process: Valid?
Check -> Error: Invalid
Process -> Success: Done
Error -> Start: Fix & retry
Success -> End`,
  },
  {
    label: "Multi-tier",
    code: `direction: right

Client: {
  shape: rectangle
  Web App
  Mobile App
}

Load Balancer: {
  shape: hexagon
}

Server A: { shape: rectangle }
Server B: { shape: rectangle }

Database: { shape: cylinder }

Client -> Load Balancer: HTTPS
Load Balancer -> Server A: route
Load Balancer -> Server B: route
Server A -> Database: query
Server B -> Database: query`,
  },
];

export default function D2Tool() {
  const renderD2 = useCallback(async (code: string): Promise<string> => {
    return renderViaKroki("d2", code);
  }, []);

  return (
    <ToolLayout title="D2" description="Create modern diagrams using D2 syntax">
      <DiagramEditor
        language="D2"
        defaultCode={EXAMPLES[0].code}
        examples={EXAMPLES}
        onRender={renderD2}
        privacyNote={PRIVACY_NOTE}
        debounceMs={800}
        filename="d2-diagram"
      />
    </ToolLayout>
  );
}
