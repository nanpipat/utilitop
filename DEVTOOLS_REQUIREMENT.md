# DevTools Web App — Product Requirement Document

> **สำหรับ Claude Code:** อ่านเอกสารนี้ทั้งหมดก่อนเริ่ม implement ทุก section มีความสำคัญ
> Stack: Next.js 14 + TypeScript + Tailwind CSS + App Router
> Deploy: Vercel (static-friendly, no server-side secrets)
> Philosophy: **Stateless, Privacy-first, Client-side only**

---

## 1. Project Overview

สร้าง Developer Tools web application ที่รวมเครื่องมือสำหรับ developer ไว้ในที่เดียว คล้าย DevToys แต่เป็น web-based ทำงานใน browser ทั้งหมด ไม่มี backend ไม่เก็บข้อมูลผู้ใช้

### Core Principles

- **Stateless** — ไม่มี database, ไม่มี API calls ออกไปภายนอก ทุกอย่างคำนวณใน browser
- **Privacy-first** — ข้อมูลที่ user paste เข้ามาไม่ออกจากเครื่องเด็ดขาด
- **Zero auth** — ไม่ต้อง login ไม่ต้อง signup
- **PWA-ready** — ใช้งาน offline ได้หลังโหลดครั้งแรก
- **Notion-inspired UI** — clean, minimal, อ่านง่าย ไม่ฟุ่มเฟือย

---

## 2. Tech Stack

| Layer         | Choice                            | Version |
| ------------- | --------------------------------- | ------- |
| Framework     | Next.js (App Router)              | 14.x    |
| Language      | TypeScript                        | 5.x     |
| Styling       | Tailwind CSS                      | 3.x     |
| UI Components | shadcn/ui                         | latest  |
| Icons         | Lucide React                      | latest  |
| Crypto/Hash   | Web Crypto API (built-in browser) | —       |
| YAML parse    | `js-yaml`                         | 4.x     |
| XML parse     | `fast-xml-parser`                 | 4.x     |
| SQL format    | `sql-formatter`                   | 15.x    |
| QR Code       | `qrcode`                          | 1.x     |
| Diff          | `diff`                            | 5.x     |
| UUID          | `uuid`                            | 9.x     |
| Markdown      | `marked` + `dompurify`            | latest  |
| PWA           | `next-pwa`                        | latest  |

### Dependencies to install

```bash
npm install js-yaml fast-xml-parser sql-formatter qrcode diff uuid marked dompurify
npm install -D @types/js-yaml @types/uuid @types/dompurify
npx shadcn-ui@latest init
```

---

## 3. Directory Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout with sidebar
│   ├── page.tsx                # Home / search page
│   ├── [category]/
│   │   └── [tool]/
│   │       └── page.tsx        # Dynamic tool page
│   └── globals.css
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx         # Left navigation
│   │   ├── SearchBar.tsx       # Global search (Cmd+K)
│   │   └── Header.tsx          # Top bar (mobile)
│   ├── ui/                     # shadcn components
│   └── tools/                  # Tool-specific components (ถ้ามี)
├── lib/
│   ├── tools/                  # Logic สำหรับแต่ละ tool (pure functions)
│   │   ├── formatters.ts
│   │   ├── encoders.ts
│   │   ├── generators.ts
│   │   ├── converters.ts
│   │   ├── text.ts
│   │   └── hash.ts
│   ├── registry.ts             # Tool registry (metadata ของทุก tool)
│   └── utils.ts
├── hooks/
│   ├── useClipboard.ts
│   └── useLocalHistory.ts      # Optional: เก็บ input ล่าสุดใน localStorage
└── types/
    └── tool.ts
```

---

## 4. UI Design System (Notion-inspired)

### Color Palette

```css
/* globals.css */
:root {
  --bg-primary: #ffffff;
  --bg-secondary: #f7f6f3; /* Notion sidebar background */
  --bg-hover: #efefef;
  --bg-active: #e9e9e7;
  --border: #e9e9e7;
  --text-primary: #37352f; /* Notion dark text */
  --text-secondary: #787774; /* Notion muted text */
  --text-placeholder: #9b9b9b;
  --accent: #2383e2; /* Notion blue */
  --accent-light: #e7f3ff;
  --success: #0f7b6c;
  --error: #eb5757;
  --warning: #dfab01;
}

.dark {
  --bg-primary: #191919;
  --bg-secondary: #202020;
  --bg-hover: #2d2d2d;
  --bg-active: #333333;
  --border: #2d2d2d;
  --text-primary: #e6e6e5;
  --text-secondary: #9b9b9b;
  --accent: #529cca;
  --accent-light: #1a2d3e;
}
```

### Typography

- Font: `Inter` (Google Fonts) — ใกล้เคียง Notion มากที่สุด
- Body: 14px / line-height 1.5
- Code/Mono: `JetBrains Mono` หรือ `Fira Code`
- ไม่ใช้ font size ใหญ่ เน้นความกระทัดรัด

### Layout

```
┌─────────────────────────────────────────────────────┐
│  [Logo]  DevTools              [Search Cmd+K] [Dark] │  ← Header (mobile only)
├──────────────┬──────────────────────────────────────┤
│              │                                       │
│   Sidebar    │   Tool Content Area                   │
│   (240px)    │                                       │
│              │  ┌─────────────────────────────────┐ │
│  🔍 Search   │  │  Tool Title                      │ │
│              │  │  Brief description               │ │
│  ▾ Formatters│  ├─────────────────────────────────┤ │
│    JSON      │  │                                  │ │
│    YAML      │  │  Input / Output Area             │ │
│    XML       │  │                                  │ │
│    SQL       │  └─────────────────────────────────┘ │
│              │                                       │
│  ▾ Encoders  │                                       │
│    Base64    │                                       │
│    ...       │                                       │
└──────────────┴──────────────────────────────────────┘
```

### Component Patterns

**ToolLayout** — wrapper ทุก tool ต้องใช้:

```tsx
<ToolLayout
  title="JSON Formatter"
  description="Format, validate, and minify JSON"
  category="formatters"
>
  {/* tool content */}
</ToolLayout>
```

**InputArea** — textarea สำหรับ input:

- Monospace font
- สีพื้นหลัง `bg-secondary`
- Border subtle
- Placeholder text บอกว่า paste อะไร
- Auto-resize height หรือ resize-y

**OutputArea** — แสดงผลลัพธ์:

- Monospace font
- มีปุ่ม Copy ที่มุมบนขวา
- ถ้า error แสดงสีแดง inline ไม่ใช้ alert

**ActionButton** — ปุ่ม primary action:

- สีน้ำเงิน Notion-blue
- ขนาดกระทัดรัด
- ไม่ใหญ่เกิน

---

## 5. Tool Registry

สร้างไฟล์ `src/lib/registry.ts` เก็บ metadata ของทุก tool:

```typescript
export interface Tool {
  id: string; // unique slug เช่น "json-formatter"
  name: string; // "JSON Formatter"
  description: string; // brief description
  category: Category;
  keywords: string[]; // สำหรับ search
  path: string; // "/formatters/json-formatter"
  icon: string; // lucide icon name
}

export type Category =
  | "formatters"
  | "encoders"
  | "generators"
  | "converters"
  | "text"
  | "network";

export const CATEGORIES = {
  formatters: { label: "Formatters", icon: "FileCode" },
  encoders: { label: "Encoders / Decoders", icon: "Lock" },
  generators: { label: "Generators", icon: "Sparkles" },
  converters: { label: "Converters", icon: "ArrowLeftRight" },
  text: { label: "Text Tools", icon: "Type" },
  network: { label: "Network / Web", icon: "Globe" },
};
```

---

## 6. Tool List — 35 Tools

### 6.1 Formatters (7 tools)

#### F-01: JSON Formatter

- **Path:** `/formatters/json-formatter`
- **Input:** Raw JSON text (textarea)
- **Output:** Formatted JSON (textarea)
- **Options:**
  - Indent: 2 spaces / 4 spaces / Tab
  - Toggle: Minify mode
  - Toggle: Sort keys alphabetically
- **Behavior:**
  - Validate ทันทีที่ input เปลี่ยน (debounce 300ms)
  - แสดง error message ระบุ line:column ที่ syntax error
  - ปุ่ม Copy output
  - ปุ่ม Clear
  - ปุ่ม Format (หรือ auto-format)
- **Library:** `JSON.parse` + `JSON.stringify` (built-in)

#### F-02: YAML Formatter

- **Path:** `/formatters/yaml-formatter`
- **Input:** Raw YAML text
- **Output:** Formatted YAML
- **Options:** Indent width (2/4)
- **Library:** `js-yaml`

#### F-03: XML Formatter

- **Path:** `/formatters/xml-formatter`
- **Input:** Raw XML text
- **Output:** Formatted XML
- **Options:** Indent width, Toggle minify
- **Library:** `fast-xml-parser`

#### F-04: SQL Formatter

- **Path:** `/formatters/sql-formatter`
- **Input:** Raw SQL
- **Output:** Formatted SQL
- **Options:**
  - Dialect: Standard / MySQL / PostgreSQL / BigQuery / Spark
  - Uppercase keywords: toggle
  - Indent width
- **Library:** `sql-formatter`

#### F-05: HTML Formatter

- **Path:** `/formatters/html-formatter`
- **Input:** Raw HTML
- **Output:** Formatted HTML
- **Options:** Indent width
- **Library:** `prettier` standalone browser build หรือ custom indent logic

#### F-06: CSS Formatter

- **Path:** `/formatters/css-formatter`
- **Input:** Raw CSS
- **Output:** Formatted CSS
- **Options:** Toggle minify
- **Library:** `prettier` standalone หรือ custom

#### F-07: JavaScript / TypeScript Formatter

- **Path:** `/formatters/js-formatter`
- **Input:** Raw JS หรือ TS code
- **Output:** Formatted code
- **Options:**
  - Language: JavaScript / TypeScript
  - Semicolons: on/off
  - Single quotes: on/off
- **Library:** `prettier` standalone browser build

---

### 6.2 Encoders / Decoders (8 tools)

#### E-01: Base64 Encoder/Decoder

- **Path:** `/encoders/base64`
- **Modes:** Encode / Decode (toggle)
- **Input:** Text หรือ paste Base64 string
- **Options:**
  - Standard Base64
  - URL-safe Base64 (replace `+` → `-`, `/` → `_`)
- **Library:** `btoa` / `atob` + TextEncoder/TextDecoder (built-in)
- **Note:** handle Unicode ด้วย TextEncoder

#### E-02: URL Encoder/Decoder

- **Path:** `/encoders/url`
- **Modes:** Encode / Decode
- **Options:**
  - `encodeURIComponent` (default)
  - `encodeURI` (encode ทั้ง URL)
- **Library:** built-in browser

#### E-03: JWT Decoder

- **Path:** `/encoders/jwt`
- **Input:** JWT token string
- **Output:** แสดง 3 sections แยก:
  - Header (JSON formatted)
  - Payload (JSON formatted + human-readable timestamps สำหรับ `exp`, `iat`, `nbf`)
  - Signature (แสดงว่า "Cannot verify without secret")
- **Note:** decode only ไม่ verify signature (stateless, ไม่รับ secret)
- **Bonus:** แสดง expiry status (expired / valid / expires in X days)
- **Library:** base64 decode + JSON.parse

#### E-04: HTML Entity Encoder/Decoder

- **Path:** `/encoders/html-entity`
- **Modes:** Encode / Decode
- **Input:** Text with special chars หรือ HTML entities
- **Library:** DOMParser / DOM manipulation (built-in)

#### E-05: Unicode Encoder/Decoder

- **Path:** `/encoders/unicode`
- **Modes:** Text → Unicode escapes / Unicode escapes → Text
- **Input:** Text
- **Output:** `\u0041\u006E...` format หรือ reverse
- **Library:** built-in JS string methods

#### E-06: GZip Compress/Decompress

- **Path:** `/encoders/gzip`
- **Input:** Text
- **Output:** Base64-encoded compressed string (Gzip)
- **Modes:** Compress / Decompress
- **Library:** `CompressionStream` API (browser built-in, modern browsers)
- **Note:** แสดง size ก่อน/หลัง และ compression ratio

#### E-07: Hex Encoder/Decoder

- **Path:** `/encoders/hex`
- **Modes:** Text → Hex / Hex → Text
- **Input:** Plain text หรือ hex string
- **Library:** built-in JS

#### E-08: Morse Code Encoder/Decoder

- **Path:** `/encoders/morse-code`
- **Modes:** Text → Morse / Morse → Text
- **Input:** Text หรือ Morse (`. - /` format)
- **Library:** custom lookup table (no external lib needed)

---

### 6.3 Generators (8 tools)

#### G-01: UUID Generator

- **Path:** `/generators/uuid`
- **Options:**
  - Version: v4 (random) / v1 (time-based) / v5 (namespace)
  - Uppercase / Lowercase
  - With/without hyphens
  - Bulk: generate N UUIDs (1–100)
- **Library:** `uuid`

#### G-02: Hash Generator

- **Path:** `/generators/hash`
- **Input:** Text to hash
- **Output:** Show all hashes simultaneously:
  - MD5
  - SHA-1
  - SHA-256
  - SHA-384
  - SHA-512
  - CRC32 (optional)
- **Options:** HMAC mode (input key)
- **Library:** Web Crypto API (`crypto.subtle`) + CRC32 custom

#### G-03: Password Generator

- **Path:** `/generators/password`
- **Options:**
  - Length: slider 8–128
  - Include: Uppercase / Lowercase / Numbers / Symbols
  - Exclude ambiguous characters (0, O, l, 1, etc.)
  - Exclude specific characters (custom input)
  - Quantity: generate 1–10 passwords
- **Output:** แสดง strength indicator (Weak / Fair / Strong / Very Strong)
- **Library:** `crypto.getRandomValues()` (built-in)

#### G-04: Lorem Ipsum Generator

- **Path:** `/generators/lorem-ipsum`
- **Options:**
  - Type: Words / Sentences / Paragraphs
  - Count: slider
  - Start with "Lorem ipsum...": toggle
- **Library:** built-in static word list

#### G-05: QR Code Generator

- **Path:** `/generators/qr-code`
- **Input:** URL หรือ text
- **Options:**
  - Size: 128 / 256 / 512 px
  - Error correction: L / M / Q / H
  - Foreground / background color
- **Output:** แสดง QR image + ปุ่ม Download PNG/SVG
- **Library:** `qrcode`

#### G-06: CRON Parser

- **Path:** `/generators/cron`
- **Input:** CRON expression (5 หรือ 6 fields)
- **Output:**
  - Human-readable description ("Every day at 9:00 AM")
  - Next 5 execution times
  - Field breakdown (Minute / Hour / Day / Month / Weekday)
- **Library:** `cronstrue` + `cron-parser`

#### G-07: Color Generator / Picker

- **Path:** `/generators/color`
- **Features:**
  - Input: HEX / RGB / HSL / HSB
  - Convert ระหว่าง formats อัตโนมัติ
  - Color preview swatch ขนาดใหญ่
  - Generate complementary / analogous / triadic colors
  - Copy button แต่ละ format
- **Library:** custom color conversion functions

#### G-08: Checksum / File Hash

- **Path:** `/generators/checksum`
- **Input:** Upload file (drag & drop หรือ file picker)
- **Output:** MD5, SHA-1, SHA-256, SHA-512 ของไฟล์
- **Note:** ทำงาน local ทั้งหมด ไฟล์ไม่ upload ไปไหน แจ้งผู้ใช้ชัดเจน
- **Library:** Web Crypto API + FileReader

---

### 6.4 Converters (6 tools)

#### C-01: JSON ↔ YAML Converter

- **Path:** `/converters/json-yaml`
- **Modes:** JSON → YAML / YAML → JSON (toggle)
- **Input/Output:** side-by-side หรือ toggle view
- **Library:** `js-yaml`

#### C-02: JSON ↔ CSV Converter

- **Path:** `/converters/json-csv`
- **Modes:** JSON → CSV / CSV → JSON
- **Input:** JSON array of objects หรือ CSV text
- **Output:** CSV / JSON
- **Options:** Custom delimiter (, / ; / Tab)
- **Library:** custom parser

#### C-03: Timestamp Converter

- **Path:** `/converters/timestamp`
- **Input:** Unix timestamp (seconds หรือ milliseconds) หรือ date string
- **Output:** แสดงทั้งหมด:
  - Unix timestamp (seconds)
  - Unix timestamp (milliseconds)
  - ISO 8601
  - UTC string
  - Local time (browser timezone)
  - Relative time ("3 days ago")
- **Bonus:** "Now" button ใส่ timestamp ปัจจุบัน
- **Library:** built-in Date API

#### C-04: Number Base Converter

- **Path:** `/converters/number-base`
- **Input:** Number in any base
- **Options:** From base: 2 / 8 / 10 / 16 (หรือ custom 2–36)
- **Output:** แสดงทุก base พร้อมกัน (Binary / Octal / Decimal / Hex)
- **Library:** built-in JS `parseInt` + `toString`

#### C-05: XML ↔ JSON Converter

- **Path:** `/converters/xml-json`
- **Modes:** XML → JSON / JSON → XML
- **Library:** `fast-xml-parser`

#### C-06: Markdown Preview

- **Path:** `/converters/markdown`
- **Input:** Markdown text (left panel)
- **Output:** Rendered HTML preview (right panel) — live update
- **Options:** Dark/light preview background
- **Security:** sanitize HTML with DOMPurify ก่อน render
- **Library:** `marked` + `dompurify`

---

### 6.5 Text Tools (6 tools)

#### T-01: Regex Tester

- **Path:** `/text/regex`
- **Input:**
  - Regex pattern input
  - Flags: g / i / m / s / u (checkboxes)
  - Test string (multiline textarea)
- **Output:**
  - Highlight matches ใน test string
  - Match list: แสดง index, match value, groups
  - Match count
- **Library:** built-in JS RegExp

#### T-02: Text Diff / Compare

- **Path:** `/text/diff`
- **Input:** 2 text areas (Original / Modified)
- **Output:** Diff view แบบ line-by-line ไฮไลต์สีเขียว/แดง
- **Options:** Ignore whitespace toggle
- **Library:** `diff`

#### T-03: Case Converter

- **Path:** `/text/case-converter`
- **Input:** Text
- **Output:** แสดงทุก case พร้อมกัน:
  - UPPER CASE
  - lower case
  - Title Case
  - camelCase
  - PascalCase
  - snake_case
  - kebab-case
  - SCREAMING_SNAKE_CASE
  - dot.case
- **Library:** custom functions

#### T-04: Word / Character Counter

- **Path:** `/text/counter`
- **Input:** Text (textarea)
- **Output:** Stats แบบ live:
  - Characters (with/without spaces)
  - Words
  - Lines
  - Sentences
  - Paragraphs
  - Reading time (estimate)
- **Library:** built-in JS

#### T-05: Text Sorter / Deduplicator

- **Path:** `/text/sorter`
- **Input:** Lines of text
- **Options:**
  - Sort: A→Z / Z→A / Random shuffle
  - Remove duplicates toggle
  - Trim whitespace toggle
  - Ignore case for dedup
- **Output:** Processed text
- **Library:** built-in JS

#### T-06: List Converter / Joiner

- **Path:** `/text/list`
- **Input:** Text lines หรือ delimited string
- **Options:**
  - Input delimiter: newline / comma / semicolon / pipe / custom
  - Output delimiter: same options
  - Wrap each item: none / quotes / brackets
- **Output:** Converted string เช่น `"item1","item2","item3"`
- **Library:** built-in JS

---

### 6.6 Network / Web (3 tools — bonus)

#### N-01: HTTP Status Codes Reference

- **Path:** `/network/http-status`
- **Features:**
  - Search bar กรอง status code หรือ name
  - แสดง: code, name, description, category (2xx/3xx/4xx/5xx)
  - Static data ไม่ต้อง fetch
- **Library:** built-in

#### N-02: JSONPath Tester

- **Path:** `/network/jsonpath`
- **Input:** JSON + JSONPath expression
- **Output:** Matching result
- **Library:** `jsonpath-plus`

#### N-03: JWT Generator (Bonus)

- **Path:** `/network/jwt-generator`
- **Input:** Payload (JSON editor), Secret, Algorithm (HS256/HS384/HS512)
- **Output:** Signed JWT token
- **Note:** ทำงาน client-side ทั้งหมด ใช้ Web Crypto API
- **Warning:** แสดง banner ว่า "อย่าใช้ production secrets ในเครื่องมือนี้"

---

## 7. Search System

### Global Search (Cmd+K / Ctrl+K)

- เปิด Modal search เมื่อกด shortcut
- Search ใน: tool name, description, keywords
- Fuzzy search — พิมพ์ผิดนิดหน่อยก็หาเจอ
- Recent tools (เก็บใน localStorage)
- Navigate ด้วยลูกศรแป้นพิมพ์ + Enter

### Implementation

```typescript
// ใช้ simple fuzzy match ก่อน ไม่ต้องใช้ library ใหญ่
function fuzzyMatch(pattern: string, str: string): boolean {
  pattern = pattern.toLowerCase();
  str = str.toLowerCase();
  let pi = 0;
  for (let i = 0; i < str.length && pi < pattern.length; i++) {
    if (str[i] === pattern[pi]) pi++;
  }
  return pi === pattern.length;
}
```

---

## 8. Routing Structure

```
/                           → Home (grid ของทุก tools)
/formatters/json-formatter  → JSON Formatter
/formatters/yaml-formatter  → YAML Formatter
/formatters/xml-formatter   → XML Formatter
/formatters/sql-formatter   → SQL Formatter
/formatters/html-formatter  → HTML Formatter
/formatters/css-formatter   → CSS Formatter
/formatters/js-formatter    → JS/TS Formatter
/encoders/base64            → Base64
/encoders/url               → URL Encoder
/encoders/jwt               → JWT Decoder
/encoders/html-entity       → HTML Entity
/encoders/unicode           → Unicode
/encoders/gzip              → GZip
/encoders/hex               → Hex
/encoders/morse-code        → Morse Code
/generators/uuid            → UUID Generator
/generators/hash            → Hash Generator
/generators/password        → Password Generator
/generators/lorem-ipsum     → Lorem Ipsum
/generators/qr-code         → QR Code
/generators/cron            → CRON Parser
/generators/color           → Color Generator
/generators/checksum        → File Checksum
/converters/json-yaml       → JSON ↔ YAML
/converters/json-csv        → JSON ↔ CSV
/converters/timestamp       → Timestamp Converter
/converters/number-base     → Number Base Converter
/converters/xml-json        → XML ↔ JSON
/converters/markdown        → Markdown Preview
/text/regex                 → Regex Tester
/text/diff                  → Text Diff
/text/case-converter        → Case Converter
/text/counter               → Word Counter
/text/sorter                → Text Sorter
/text/list                  → List Converter
/network/http-status        → HTTP Status Codes
/network/jsonpath           → JSONPath Tester
/network/jwt-generator      → JWT Generator
```

---

## 9. Sidebar Navigation

```tsx
// Sidebar แสดง categories + tools ภายใต้
// Collapse/expand แต่ละ category ได้
// Highlight tool ที่ active อยู่
// Mobile: hidden by default, เปิดด้วย hamburger

const navigation = [
  {
    category: "formatters",
    tools: [
      "json-formatter",
      "yaml-formatter",
      "xml-formatter",
      "sql-formatter",
      "html-formatter",
      "css-formatter",
      "js-formatter",
    ],
  },
  {
    category: "encoders",
    tools: [
      "base64",
      "url",
      "jwt",
      "html-entity",
      "unicode",
      "gzip",
      "hex",
      "morse-code",
    ],
  },
  {
    category: "generators",
    tools: [
      "uuid",
      "hash",
      "password",
      "lorem-ipsum",
      "qr-code",
      "cron",
      "color",
      "checksum",
    ],
  },
  {
    category: "converters",
    tools: [
      "json-yaml",
      "json-csv",
      "timestamp",
      "number-base",
      "xml-json",
      "markdown",
    ],
  },
  {
    category: "text",
    tools: ["regex", "diff", "case-converter", "counter", "sorter", "list"],
  },
  {
    category: "network",
    tools: ["http-status", "jsonpath", "jwt-generator"],
  },
];
```

---

## 10. Privacy Banner

แสดง banner เล็กๆ ที่ footer หรือ sidebar:

```
🔒 All processing happens in your browser. No data is sent to any server.
```

สำหรับ tool File Checksum และ JWT Generator ให้แสดง inline warning เพิ่มเติม

---

## 11. PWA Configuration

สร้าง `public/manifest.json`:

```json
{
  "name": "DevTools",
  "short_name": "DevTools",
  "description": "Developer tools that run entirely in your browser",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#37352f",
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

---

## 12. Home Page

แสดง grid ของทุก tools แบ่งตาม category:

- Card แต่ละ tool: icon + name + description 1 บรรทัด
- Hover effect subtle
- คลิกแล้วไปที่ tool page
- Search bar ด้านบน

---

## 13. Dark Mode

- Toggle ที่ sidebar หรือ header
- เก็บ preference ใน `localStorage`
- Support system preference (`prefers-color-scheme`)
- ใช้ Tailwind dark mode class strategy (`class`)
- ไม่มี flash of wrong theme — set class ใน `<html>` ก่อน hydration

```tsx
// ใน _document.tsx หรือ layout.tsx script block
<script
  dangerouslySetInnerHTML={{
    __html: `
    (function() {
      const theme = localStorage.getItem('theme')
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      if (theme === 'dark' || (!theme && prefersDark)) {
        document.documentElement.classList.add('dark')
      }
    })()
  `,
  }}
/>
```

---

## 14. Keyboard Shortcuts

| Shortcut           | Action                  |
| ------------------ | ----------------------- |
| `Cmd+K` / `Ctrl+K` | Open global search      |
| `Escape`           | Close search modal      |
| `↑` / `↓`          | Navigate search results |
| `Enter`            | Go to selected tool     |
| `Cmd+Shift+C`      | Copy current output     |

---

## 15. Error Handling

- ทุก tool ต้อง wrap logic ใน try/catch
- Error แสดง inline ใต้ input พร้อม:
  - ไอคอน ⚠️
  - Message ที่อ่านเข้าใจได้
  - ถ้าเป็น JSON/XML error ระบุ position ด้วย (line X, column Y)
- ไม่ใช้ `alert()` หรือ `console.error` เป็น UX

---

## 16. Performance Requirements

- ทุก tool page ต้อง lazy load — ใช้ `dynamic(() => import(...))` ของ Next.js
- ไม่โหลด `prettier` หรือ library ใหญ่ในหน้า home
- Debounce input สำหรับ tool ที่ compute หนัก: 300ms
- Web Crypto API ใช้ async/await เสมอ

---

## 17. Vercel Deployment Notes

- ไม่มี API routes ที่ต้องการ server runtime — ทุกอย่าง static/client
- `next.config.js` ควร set:
  ```js
  /** @type {import('next').NextConfig} */
  const nextConfig = {
    reactStrictMode: true,
  };
  module.exports = nextConfig;
  ```
- ไม่มี environment variables ที่จำเป็น
- Deploy ได้เลยด้วย `vercel --prod`

---

## 18. Implementation Order (แนะนำ)

ให้ implement ตามลำดับนี้เพื่อ validate architecture ก่อน:

1. Project scaffold + layout (Sidebar + routing)
2. Tool registry + Home page (grid)
3. Global search (Cmd+K)
4. Dark mode
5. JSON Formatter (tool แรก ใช้เป็น template pattern)
6. Base64 Encoder/Decoder
7. UUID Generator
8. JWT Decoder
9. Timestamp Converter
10. ต่อ tools ที่เหลือทั้งหมด โดยใช้ pattern จาก JSON Formatter เป็น template

---

## 19. Testing Checklist (สำหรับ QA ก่อน deploy)

- [ ] ทุก tool ทำงานได้ offline หลังโหลดครั้งแรก
- [ ] ไม่มี network request ออกไปนอกเวลา use tool
- [ ] Dark mode toggle ทำงานทุกหน้า
- [ ] Cmd+K search เจอ tools ถูกต้อง
- [ ] Mobile layout ใช้งานได้ (sidebar collapse)
- [ ] Error handling แสดงผลถูกต้องเมื่อ input ผิดรูปแบบ
- [ ] Copy button ทำงานใน Chrome, Firefox, Safari
- [ ] JWT Decoder แสดง expire time ถูกต้อง
- [ ] File Checksum ทำงานกับไฟล์ขนาดใหญ่ (>100MB)
- [ ] QR Code export PNG/SVG ได้
- [ ] CRON Parser แสดง next runs ถูกต้อง

---

_Document version: 1.0 — Ready for Claude Code implementation_
