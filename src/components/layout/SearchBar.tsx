"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { TOOLS, fuzzySearchTools } from "@/lib/registry";
import { Search, X, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  open: boolean;
  onClose: () => void;
}

export default function SearchBar({ open, onClose }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();

  const results = query.trim() ? fuzzySearchTools(query) : TOOLS;

  useEffect(() => {
    if (open) {
      setQuery("");
      setSelectedIndex(0);
    }
  }, [open]);

  if (!open) return null;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && results[selectedIndex]) {
      router.push(results[selectedIndex].path);
      onClose();
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-bg-primary border border-border rounded-lg shadow-2xl overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
          <Search className="w-4 h-4 text-text-secondary shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search tools..."
            className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-placeholder outline-none"
            autoFocus
          />
          <button onClick={onClose} className="text-text-secondary hover:text-text-primary">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="max-h-80 overflow-y-auto">
          {results.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-text-secondary">
              No tools found
            </div>
          ) : (
            results.slice(0, 20).map((tool, i) => (
              <button
                key={tool.id}
                onClick={() => {
                  router.push(tool.path);
                  onClose();
                }}
                onMouseEnter={() => setSelectedIndex(i)}
                className={cn(
                  "flex items-center gap-3 w-full px-4 py-2 text-left transition-colors",
                  i === selectedIndex ? "bg-bg-hover" : ""
                )}
              >
                <ArrowRight className="w-3 h-3 text-text-secondary shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{tool.name}</div>
                  <div className="text-xs text-text-secondary truncate">{tool.description}</div>
                </div>
                <span className="text-[10px] text-text-secondary capitalize shrink-0">
                  {tool.category}
                </span>
              </button>
            ))
          )}
        </div>
        <div className="flex items-center gap-4 px-4 py-2 border-t border-border text-[10px] text-text-secondary">
          <span>↑↓ Navigate</span>
          <span>↵ Select</span>
          <span>Esc Close</span>
        </div>
      </div>
    </div>
  );
}
