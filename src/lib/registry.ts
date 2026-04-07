import { Tool, Category, CategoryInfo } from "@/types/tool";

export const CATEGORIES: Record<Category, CategoryInfo> = {
  formatters: { label: "Formatters", icon: "FileCode" },
  encoders: { label: "Encoders / Decoders", icon: "Lock" },
  generators: { label: "Generators", icon: "Sparkles" },
  converters: { label: "Converters", icon: "ArrowLeftRight" },
  text: { label: "Text Tools", icon: "Type" },
  network: { label: "Network / Web", icon: "Globe" },
};

export const TOOLS: Tool[] = [
  {
    id: "json-formatter",
    name: "JSON Formatter",
    description: "Format, validate, and minify JSON",
    category: "formatters",
    keywords: ["json", "format", "validate", "minify", "beautify", "pretty"],
    path: "/formatters/json-formatter",
    icon: "Braces",
  },
  {
    id: "yaml-formatter",
    name: "YAML Formatter",
    description: "Format and validate YAML",
    category: "formatters",
    keywords: ["yaml", "format", "validate"],
    path: "/formatters/yaml-formatter",
    icon: "FileText",
  },
  {
    id: "xml-formatter",
    name: "XML Formatter",
    description: "Format and minify XML",
    category: "formatters",
    keywords: ["xml", "format", "minify", "beautify"],
    path: "/formatters/xml-formatter",
    icon: "FileCode",
  },
  {
    id: "sql-formatter",
    name: "SQL Formatter",
    description: "Format SQL queries with dialect support",
    category: "formatters",
    keywords: ["sql", "format", "query", "mysql", "postgres"],
    path: "/formatters/sql-formatter",
    icon: "Database",
  },
  {
    id: "html-formatter",
    name: "HTML Formatter",
    description: "Format and beautify HTML",
    category: "formatters",
    keywords: ["html", "format", "beautify", "indent"],
    path: "/formatters/html-formatter",
    icon: "FileCode",
  },
  {
    id: "css-formatter",
    name: "CSS Formatter",
    description: "Format and minify CSS",
    category: "formatters",
    keywords: ["css", "format", "minify", "beautify", "style"],
    path: "/formatters/css-formatter",
    icon: "Paintbrush",
  },
  {
    id: "js-formatter",
    name: "JS/TS Formatter",
    description: "Format JavaScript and TypeScript code",
    category: "formatters",
    keywords: ["javascript", "typescript", "js", "ts", "format", "beautify"],
    path: "/formatters/js-formatter",
    icon: "FileCode2",
  },
  {
    id: "base64",
    name: "Base64 Encoder/Decoder",
    description: "Encode and decode Base64 strings",
    category: "encoders",
    keywords: ["base64", "encode", "decode", "url-safe"],
    path: "/encoders/base64",
    icon: "Binary",
  },
  {
    id: "url",
    name: "URL Encoder/Decoder",
    description: "Encode and decode URL components",
    category: "encoders",
    keywords: ["url", "encode", "decode", "uri", "percent"],
    path: "/encoders/url",
    icon: "Link",
  },
  {
    id: "jwt",
    name: "JWT Decoder",
    description: "Decode and inspect JWT tokens",
    category: "encoders",
    keywords: ["jwt", "token", "decode", "json web token", "header", "payload"],
    path: "/encoders/jwt",
    icon: "KeyRound",
  },
  {
    id: "html-entity",
    name: "HTML Entity Encoder/Decoder",
    description: "Encode and decode HTML entities",
    category: "encoders",
    keywords: ["html", "entity", "encode", "decode", "special characters"],
    path: "/encoders/html-entity",
    icon: "Code",
  },
  {
    id: "unicode",
    name: "Unicode Encoder/Decoder",
    description: "Convert text to/from Unicode escapes",
    category: "encoders",
    keywords: ["unicode", "escape", "encode", "decode", "u0041"],
    path: "/encoders/unicode",
    icon: "Languages",
  },
  {
    id: "gzip",
    name: "GZip Compress/Decompress",
    description: "Compress and decompress text with GZip",
    category: "encoders",
    keywords: ["gzip", "compress", "decompress", "deflate", "zlib"],
    path: "/encoders/gzip",
    icon: "FileArchive",
  },
  {
    id: "hex",
    name: "Hex Encoder/Decoder",
    description: "Convert text to/from hexadecimal",
    category: "encoders",
    keywords: ["hex", "hexadecimal", "encode", "decode", "convert"],
    path: "/encoders/hex",
    icon: "Hash",
  },
  {
    id: "morse-code",
    name: "Morse Code Encoder/Decoder",
    description: "Convert text to/from Morse code",
    category: "encoders",
    keywords: ["morse", "code", "dot", "dash", "telegraph"],
    path: "/encoders/morse-code",
    icon: "Radio",
  },
  {
    id: "uuid",
    name: "UUID Generator",
    description: "Generate UUID/GUID values",
    category: "generators",
    keywords: ["uuid", "guid", "unique", "id", "random", "v4", "v1"],
    path: "/generators/uuid",
    icon: "Fingerprint",
  },
  {
    id: "hash",
    name: "Hash Generator",
    description: "Generate MD5, SHA-1, SHA-256, SHA-512 hashes",
    category: "generators",
    keywords: ["hash", "md5", "sha", "sha256", "sha512", "sha1", "hmac"],
    path: "/generators/hash",
    icon: "Shield",
  },
  {
    id: "password",
    name: "Password Generator",
    description: "Generate secure random passwords",
    category: "generators",
    keywords: ["password", "random", "secure", "strong", "generate"],
    path: "/generators/password",
    icon: "Key",
  },
  {
    id: "lorem-ipsum",
    name: "Lorem Ipsum Generator",
    description: "Generate placeholder text",
    category: "generators",
    keywords: ["lorem", "ipsum", "placeholder", "dummy", "text"],
    path: "/generators/lorem-ipsum",
    icon: "AlignLeft",
  },
  {
    id: "qr-code",
    name: "QR Code Generator",
    description: "Generate QR codes from text or URLs",
    category: "generators",
    keywords: ["qr", "qr code", "generate", "image", "scan"],
    path: "/generators/qr-code",
    icon: "QrCode",
  },
  {
    id: "cron",
    name: "CRON Parser",
    description: "Parse and explain CRON expressions",
    category: "generators",
    keywords: ["cron", "schedule", "parser", "crontab", "interval"],
    path: "/generators/cron",
    icon: "Clock",
  },
  {
    id: "color",
    name: "Color Picker",
    description: "Pick and convert colors between formats",
    category: "generators",
    keywords: ["color", "hex", "rgb", "hsl", "picker", "palette"],
    path: "/generators/color",
    icon: "Palette",
  },
  {
    id: "checksum",
    name: "File Checksum",
    description: "Calculate file hashes (MD5, SHA-256, etc.)",
    category: "generators",
    keywords: ["checksum", "file", "hash", "md5", "sha", "verify"],
    path: "/generators/checksum",
    icon: "FileCheck",
  },
  {
    id: "json-yaml",
    name: "JSON ↔ YAML Converter",
    description: "Convert between JSON and YAML formats",
    category: "converters",
    keywords: ["json", "yaml", "convert", "transform"],
    path: "/converters/json-yaml",
    icon: "ArrowLeftRight",
  },
  {
    id: "json-csv",
    name: "JSON ↔ CSV Converter",
    description: "Convert between JSON and CSV formats",
    category: "converters",
    keywords: ["json", "csv", "convert", "table", "delimiter"],
    path: "/converters/json-csv",
    icon: "Table",
  },
  {
    id: "timestamp",
    name: "Timestamp Converter",
    description: "Convert between Unix timestamps and dates",
    category: "converters",
    keywords: ["timestamp", "unix", "date", "time", "epoch", "iso"],
    path: "/converters/timestamp",
    icon: "Calendar",
  },
  {
    id: "number-base",
    name: "Number Base Converter",
    description: "Convert numbers between bases (bin, oct, dec, hex)",
    category: "converters",
    keywords: ["number", "base", "binary", "octal", "decimal", "hex", "convert"],
    path: "/converters/number-base",
    icon: "Hash",
  },
  {
    id: "xml-json",
    name: "XML ↔ JSON Converter",
    description: "Convert between XML and JSON formats",
    category: "converters",
    keywords: ["xml", "json", "convert", "transform"],
    path: "/converters/xml-json",
    icon: "ArrowLeftRight",
  },
  {
    id: "markdown",
    name: "Markdown Preview",
    description: "Preview Markdown rendered as HTML",
    category: "converters",
    keywords: ["markdown", "md", "preview", "render", "html"],
    path: "/converters/markdown",
    icon: "FileText",
  },
  {
    id: "regex",
    name: "Regex Tester",
    description: "Test and debug regular expressions",
    category: "text",
    keywords: ["regex", "regexp", "regular expression", "match", "test", "pattern"],
    path: "/text/regex",
    icon: "Regex",
  },
  {
    id: "diff",
    name: "Text Diff",
    description: "Compare two texts and show differences",
    category: "text",
    keywords: ["diff", "compare", "difference", "text", "changes"],
    path: "/text/diff",
    icon: "GitCompare",
  },
  {
    id: "case-converter",
    name: "Case Converter",
    description: "Convert text between different cases",
    category: "text",
    keywords: ["case", "camel", "snake", "kebab", "pascal", "upper", "lower", "title"],
    path: "/text/case-converter",
    icon: "CaseSensitive",
  },
  {
    id: "counter",
    name: "Word & Character Counter",
    description: "Count words, characters, lines, and more",
    category: "text",
    keywords: ["word", "character", "count", "line", "sentence", "paragraph"],
    path: "/text/counter",
    icon: "Calculator",
  },
  {
    id: "sorter",
    name: "Text Sorter & Deduplicator",
    description: "Sort lines and remove duplicates",
    category: "text",
    keywords: ["sort", "deduplicate", "unique", "lines", "shuffle", "alphabetical"],
    path: "/text/sorter",
    icon: "ArrowDownAZ",
  },
  {
    id: "list",
    name: "List Converter / Joiner",
    description: "Convert lists between delimiters",
    category: "text",
    keywords: ["list", "join", "delimiter", "comma", "newline", "convert"],
    path: "/text/list",
    icon: "List",
  },
  {
    id: "http-status",
    name: "HTTP Status Codes",
    description: "Reference for HTTP status codes",
    category: "network",
    keywords: ["http", "status", "code", "response", "200", "404", "500"],
    path: "/network/http-status",
    icon: "Server",
  },
  {
    id: "jsonpath",
    name: "JSONPath Tester",
    description: "Test JSONPath expressions against JSON data",
    category: "network",
    keywords: ["jsonpath", "json", "query", "path", "select", "filter"],
    path: "/network/jsonpath",
    icon: "Search",
  },
  {
    id: "jwt-generator",
    name: "JWT Generator",
    description: "Generate signed JWT tokens",
    category: "network",
    keywords: ["jwt", "generate", "sign", "token", "hs256"],
    path: "/network/jwt-generator",
    icon: "KeyRound",
  },
];

export function getToolById(id: string): Tool | undefined {
  return TOOLS.find((t) => t.id === id);
}

export function getToolByPath(category: string, tool: string): Tool | undefined {
  return TOOLS.find((t) => t.path === `/${category}/${tool}`);
}

export function getToolsByCategory(category: Category): Tool[] {
  return TOOLS.filter((t) => t.category === category);
}

export function searchTools(query: string): Tool[] {
  if (!query.trim()) return [];
  const q = query.toLowerCase();
  return TOOLS.filter((tool) => {
    if (tool.name.toLowerCase().includes(q)) return true;
    if (tool.description.toLowerCase().includes(q)) return true;
    if (tool.keywords.some((k) => k.toLowerCase().includes(q))) return true;
    return false;
  });
}

export function fuzzySearchTools(query: string): Tool[] {
  if (!query.trim()) return [];
  const q = query.toLowerCase();

  const exact = TOOLS.filter(
    (tool) =>
      tool.name.toLowerCase().includes(q) ||
      tool.description.toLowerCase().includes(q) ||
      tool.keywords.some((k) => k.toLowerCase().includes(q))
  );
  if (exact.length > 0) return exact;

  return TOOLS.filter((tool) => {
    const fields = [tool.name, tool.description, ...tool.keywords].join(" ").toLowerCase();
    let pi = 0;
    for (let i = 0; i < fields.length && pi < q.length; i++) {
      if (fields[i] === q[pi]) pi++;
    }
    return pi === q.length;
  });
}
