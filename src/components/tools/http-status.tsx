"use client";

import { useState } from "react";
import ToolLayout from "@/components/layout/ToolLayout";

const STATUS_CODES = [
  { code: 100, name: "Continue", description: "The server has received the request headers and the client should proceed to send the request body.", category: "1xx" },
  { code: 101, name: "Switching Protocols", description: "The server is switching protocols as requested by the client.", category: "1xx" },
  { code: 200, name: "OK", description: "The request has succeeded.", category: "2xx" },
  { code: 201, name: "Created", description: "The request has been fulfilled and a new resource has been created.", category: "2xx" },
  { code: 204, name: "No Content", description: "The server has fulfilled the request but does not need to return an entity-body.", category: "2xx" },
  { code: 301, name: "Moved Permanently", description: "The requested resource has been assigned a new permanent URI.", category: "3xx" },
  { code: 302, name: "Found", description: "The requested resource resides temporarily under a different URI.", category: "3xx" },
  { code: 304, name: "Not Modified", description: "The resource has not been modified since the last request.", category: "3xx" },
  { code: 400, name: "Bad Request", description: "The server could not understand the request due to malformed syntax.", category: "4xx" },
  { code: 401, name: "Unauthorized", description: "The request requires user authentication.", category: "4xx" },
  { code: 403, name: "Forbidden", description: "The server understood the request but refuses to authorize it.", category: "4xx" },
  { code: 404, name: "Not Found", description: "The server has not found anything matching the Request-URI.", category: "4xx" },
  { code: 405, name: "Method Not Allowed", description: "The method specified in the Request-Line is not allowed for the identified resource.", category: "4xx" },
  { code: 408, name: "Request Timeout", description: "The server did not receive a complete request message within the time it was prepared to wait.", category: "4xx" },
  { code: 409, name: "Conflict", description: "The request could not be completed due to a conflict with the current state of the resource.", category: "4xx" },
  { code: 410, name: "Gone", description: "The requested resource is no longer available and no forwarding address is known.", category: "4xx" },
  { code: 413, name: "Payload Too Large", description: "The server is refusing to process a request because the request payload is larger than the server is willing or able to process.", category: "4xx" },
  { code: 422, name: "Unprocessable Entity", description: "The server understands the content type and syntax but was unable to process the contained instructions.", category: "4xx" },
  { code: 429, name: "Too Many Requests", description: "The user has sent too many requests in a given amount of time.", category: "4xx" },
  { code: 500, name: "Internal Server Error", description: "The server encountered an unexpected condition which prevented it from fulfilling the request.", category: "5xx" },
  { code: 502, name: "Bad Gateway", description: "The server received an invalid response from an upstream server.", category: "5xx" },
  { code: 503, name: "Service Unavailable", description: "The server is currently unable to handle the request due to temporary overloading or maintenance.", category: "5xx" },
  { code: 504, name: "Gateway Timeout", description: "The server did not receive a timely response from an upstream server.", category: "5xx" },
];

const CATEGORY_COLORS: Record<string, string> = {
  "1xx": "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300",
  "2xx": "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300",
  "3xx": "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300",
  "4xx": "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300",
  "5xx": "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300",
};

export default function HttpStatusCodes() {
  const [search, setSearch] = useState("");

  const filtered = search.trim()
    ? STATUS_CODES.filter((s) => {
        const q = search.toLowerCase();
        return s.code.toString().includes(q) || s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q);
      })
    : STATUS_CODES;

  return (
    <ToolLayout title="HTTP Status Codes" description="Reference for HTTP status codes">
      <div className="mb-3">
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by code or name..." className="w-full px-3 py-2 bg-bg-secondary border border-border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-accent" />
      </div>
      <div className="space-y-1">
        {filtered.map((status) => (
          <div key={status.code} className="flex items-start gap-3 px-3 py-2 hover:bg-bg-hover rounded-md transition-colors">
            <span className={`px-2 py-0.5 rounded text-xs font-bold min-w-[48px] text-center ${CATEGORY_COLORS[status.category]}`}>
              {status.code}
            </span>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium">{status.name}</div>
              <div className="text-xs text-text-secondary">{status.description}</div>
            </div>
            <span className="text-[10px] text-text-secondary">{status.category}</span>
          </div>
        ))}
        {filtered.length === 0 && <div className="text-sm text-text-secondary text-center py-4">No matching status codes</div>}
      </div>
    </ToolLayout>
  );
}
