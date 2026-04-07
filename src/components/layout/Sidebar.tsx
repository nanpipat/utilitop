"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { TOOLS, CATEGORIES } from "@/lib/registry";
import { Category } from "@/types/tool";
import { cn } from "@/lib/utils";
import {
  FileCode,
  Lock,
  Sparkles,
  ArrowLeftRight,
  Type,
  Globe,
  GitBranch,
  ChevronDown,
  ChevronRight,
  Search,
  Zap,
} from "lucide-react";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  FileCode,
  Lock,
  Sparkles,
  ArrowLeftRight,
  Type,
  Globe,
  GitBranch,
};

const CATEGORY_ORDER: Category[] = [
  "formatters",
  "encoders",
  "generators",
  "converters",
  "text",
  "network",
  "diagrams",
];

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
    <aside className="hidden lg:flex flex-col w-[250px] min-w-[250px] h-screen bg-bg-secondary border-r border-border overflow-y-auto">
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-border">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-accent to-blue-400 flex items-center justify-center text-white font-bold text-xs shadow-sm">
          U
        </div>
        <span className="font-bold text-sm tracking-tight">Utilitop</span>
      </div>

      <div className="px-3 pt-3">
        <button
          onClick={onSearchOpen}
          className="flex items-center gap-2 w-full px-3 py-2 text-xs text-text-secondary bg-bg-primary border border-border rounded-xl hover:bg-bg-hover hover:border-bg-active transition-all duration-200 shadow-sm"
        >
          <Search className="w-3.5 h-3.5" />
          <span>Search tools...</span>
          <kbd className="ml-auto text-[10px] bg-bg-tertiary px-1.5 py-0.5 rounded-md font-mono opacity-60">⌘K</kbd>
        </button>
      </div>

      <nav className="flex-1 px-3 py-3 space-y-0.5">
        {CATEGORY_ORDER.map((cat) => {
          const info = CATEGORIES[cat];
          const tools = TOOLS.filter((t) => t.category === cat);
          const Icon = ICON_MAP[info.icon] || FileCode;
          const isOpen = !collapsed[cat];

          return (
            <div key={cat}>
              <button
                onClick={() => toggleCategory(cat)}
                className="flex items-center gap-2 w-full px-2.5 py-2 text-xs font-semibold text-text-secondary hover:text-text-primary hover:bg-bg-hover rounded-lg transition-all duration-150"
              >
                {isOpen ? (
                  <ChevronDown className="w-3 h-3 opacity-50" />
                ) : (
                  <ChevronRight className="w-3 h-3 opacity-50" />
                )}
                <div className={`w-5 h-5 rounded-md bg-${info.color}/15 text-${info.color} flex items-center justify-center`}>
                  <Icon className="w-3 h-3" />
                </div>
                <span>{info.label}</span>
              </button>

              {isOpen && (
                <div className="ml-4 space-y-0.5 mt-0.5 mb-1">
                  {tools.map((tool) => {
                    const isActive = pathname === tool.path;
                    return (
                      <Link
                        key={tool.id}
                        href={tool.path}
                        className={cn(
                          "flex items-center px-2.5 py-1.5 text-xs rounded-lg transition-all duration-150",
                          isActive
                            ? "bg-accent/10 text-accent font-semibold"
                            : "text-text-secondary hover:text-text-primary hover:bg-bg-hover"
                        )}
                      >
                        {isActive && <div className="w-1 h-1 rounded-full bg-accent mr-2" />}
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

      <div className="px-4 py-3 border-t border-border">
        <div className="flex items-center gap-1.5 text-[10px] text-text-secondary">
          <Zap className="w-3 h-3" />
          <span>All processing is local & private</span>
        </div>
      </div>
    </aside>
  );
}
