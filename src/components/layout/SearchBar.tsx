"use client";

import { useState, useEffect, useDeferredValue } from "react";
import { useRouter } from "next/navigation";
import { TOOLS, CATEGORIES, fuzzySearchTools } from "@/lib/registry";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  open: boolean;
  onClose: () => void;
}

export default function SearchBar({ open, onClose }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();

  // useDeferredValue lets React prioritize input responsiveness over search computation
  const deferredQuery = useDeferredValue(query);
  const results = deferredQuery.trim() ? fuzzySearchTools(deferredQuery) : TOOLS;

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
    <div className="fixed inset-0 z-50 flex items-start justify-center px-3 sm:px-0 pt-[6vh] sm:pt-[12vh] animate-fade-in">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-bg-primary border border-border rounded-xl sm:rounded-2xl shadow-xl overflow-hidden animate-slide-up">
        <div className="flex items-center gap-3 px-3 sm:px-5 py-3 sm:py-4 border-b border-border">
          <Search className="w-4 h-4 text-accent shrink-0" />
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
          <button onClick={onClose} className="text-text-secondary hover:text-text-primary p-1 rounded-lg hover:bg-bg-hover transition-colors">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="max-h-[50vh] sm:max-h-80 overflow-y-auto p-1.5 sm:p-2">
          {results.length === 0 ? (
            <div className="px-4 py-6 sm:py-8 text-center text-sm text-text-secondary">
              No tools found for &ldquo;{query}&rdquo;
            </div>
          ) : (
            results.slice(0, 20).map((tool, i) => {
              const catInfo = CATEGORIES[tool.category];
              return (
                <button
                  key={tool.id}
                  onClick={() => {
                    router.push(tool.path);
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(i)}
                  className={cn(
                    "flex items-center gap-2 sm:gap-3 w-full px-2.5 sm:px-3 py-2 sm:py-2.5 text-left rounded-lg sm:rounded-xl transition-all duration-150",
                    i === selectedIndex ? "bg-accent/8" : "hover:bg-bg-hover"
                  )}
                >
                  <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-${catInfo.color}/10 text-${catInfo.color} flex items-center justify-center shrink-0`}>
                    <span className="text-[9px] sm:text-[10px] font-bold">●</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs sm:text-sm font-medium truncate">{tool.name}</div>
                    <div className="text-[10px] sm:text-xs text-text-secondary truncate">{tool.description}</div>
                  </div>
                  <span className={`hidden sm:inline text-[10px] px-2 py-0.5 rounded-md bg-${catInfo.color}/10 text-${catInfo.color} capitalize shrink-0 font-medium`}>
                    {tool.category}
                  </span>
                </button>
              );
            })
          )}
        </div>
        <div className="hidden sm:flex items-center gap-3 px-5 py-2.5 border-t border-border text-[10px] text-text-secondary">
          <span className="flex items-center gap-1"><kbd className="px-1 py-0.5 bg-bg-tertiary rounded text-[9px]">↑↓</kbd> Navigate</span>
          <span className="flex items-center gap-1"><kbd className="px-1 py-0.5 bg-bg-tertiary rounded text-[9px]">↵</kbd> Select</span>
          <span className="flex items-center gap-1"><kbd className="px-1 py-0.5 bg-bg-tertiary rounded text-[9px]">esc</kbd> Close</span>
        </div>
      </div>
    </div>
  );
}
