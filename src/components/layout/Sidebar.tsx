"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CATEGORIES, CATEGORY_ORDER, TOOLS_BY_CATEGORY } from "@/lib/registry";
import { cn } from "@/lib/utils";
import {
  FileCode, Lock, Sparkles, ArrowLeftRight, Type, Globe, GitBranch,
  ChevronDown, ChevronRight, Search, Shield,
} from "lucide-react";
import { LogoIcon } from "@/components/ui/Logo";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  FileCode, Lock, Sparkles, ArrowLeftRight, Type, Globe, GitBranch,
};

const categoryTone = (color: string) => ({
  color: `var(--${color})`,
  backgroundColor: `color-mix(in srgb, var(--${color}) 16%, var(--bg-primary))`,
});

interface SidebarProps {
  onSearchOpen: () => void;
}

export default function Sidebar({ onSearchOpen }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const toggleCategory = (cat: string) => {
    setCollapsed((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };

  return (
    <aside className="hidden lg:flex flex-col w-[242px] min-w-[242px] h-screen bg-bg-secondary border-r-2 border-border overflow-y-auto">
      {/* Brand */}
      <Link
        href="/"
        className="flex items-center gap-2.5 px-5 py-4 border-b-2 border-border hover:bg-bg-hover transition-colors duration-150 group"
      >
        <LogoIcon size={28} />
        <span className="font-extrabold text-base tracking-tight text-text-primary group-hover:text-accent transition-colors">
          Utilitop
        </span>
      </Link>

      {/* Search */}
      <div className="px-3 pt-3 pb-1">
        <button
          onClick={onSearchOpen}
          className="flex items-center gap-2 w-full px-3 py-2 text-xs text-text-secondary bg-bg-primary brutal-button"
        >
          <Search className="w-3.5 h-3.5 text-accent" />
          <span className="font-semibold">Search tools...</span>
          <kbd className="ml-auto text-[10px] bg-bg-tertiary px-1.5 py-0.5 rounded font-mono border-2 border-border">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-2 space-y-0.5">
        {CATEGORY_ORDER.map((cat) => {
          const info = CATEGORIES[cat];
          const tools = TOOLS_BY_CATEGORY[cat];
          const Icon = ICON_MAP[info.icon] || FileCode;
          const isOpen = !collapsed[cat];

          return (
            <div key={cat}>
              <button
                onClick={() => toggleCategory(cat)}
                className="flex items-center gap-2 w-full px-2.5 py-2 text-[11px] font-extrabold text-text-secondary hover:text-text-primary hover:bg-bg-hover rounded transition-all duration-150 uppercase tracking-wide"
              >
                {isOpen ? (
                  <ChevronDown className="w-3 h-3 opacity-40 shrink-0" />
                ) : (
                  <ChevronRight className="w-3 h-3 opacity-40 shrink-0" />
                )}
                <div
                  className="w-5 h-5 rounded flex items-center justify-center shrink-0 border-2 border-border"
                  style={categoryTone(info.color)}
                >
                  <Icon className="w-3 h-3" />
                </div>
                <span>{info.label}</span>
              </button>

              {isOpen && (
                <div className="ml-4 space-y-px mt-0.5 mb-1.5">
                  {tools.map((tool) => {
                    const isActive = pathname === tool.path;
                    return (
                      <Link
                        key={tool.id}
                        href={tool.path}
                        className={cn(
                          "flex items-center gap-2 px-2.5 py-1.5 text-xs rounded transition-all duration-150 border-2",
                          isActive
                            ? "bg-bg-primary text-accent font-extrabold border-border shadow-sm"
                            : "text-text-secondary border-transparent hover:text-text-primary hover:bg-bg-hover hover:border-border"
                        )}
                      >
                        {isActive && (
                          <div className="w-1.5 h-1.5 rounded-full bg-accent shrink-0 border border-border" />
                        )}
                        {tool.name}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-3 border-t-2 border-border">
        <div className="flex items-center gap-1.5 text-[10px] text-text-secondary font-semibold">
          <Shield className="w-3 h-3 text-success" />
          <span>All processing is local & private</span>
        </div>
      </div>
    </aside>
  );
}
