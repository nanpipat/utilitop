"use client";

import { Search } from "lucide-react";

interface SearchTriggerProps {
  className?: string;
}

export default function SearchTrigger({ className = "" }: SearchTriggerProps) {
  return (
    <button
      onClick={() => window.dispatchEvent(new CustomEvent("open-search"))}
      className={`flex items-center gap-3 text-left px-4 py-3 bg-bg-primary brutal-button group ${className}`}
    >
      <Search className="w-4 h-4 text-accent shrink-0" />
      <span className="text-sm text-text-placeholder flex-1 font-semibold">Search tools...</span>
      <kbd className="hidden sm:inline text-[11px] bg-bg-secondary text-text-primary px-2 py-0.5 rounded font-mono border-2 border-border shadow-sm">
        ⌘K
      </kbd>
    </button>
  );
}
