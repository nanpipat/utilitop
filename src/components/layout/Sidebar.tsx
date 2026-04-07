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
  ChevronDown,
  ChevronRight,
  Search,
  Shield,
} from "lucide-react";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  FileCode,
  Lock,
  Sparkles,
  ArrowLeftRight,
  Type,
  Globe,
};

const CATEGORY_ORDER: Category[] = [
  "formatters",
  "encoders",
  "generators",
  "converters",
  "text",
  "network",
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
    <aside className="hidden lg:flex flex-col w-[240px] min-w-[240px] h-screen bg-bg-secondary border-r border-border overflow-y-auto">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
        <Shield className="w-5 h-5 text-accent" />
        <span className="font-semibold text-sm">Utilitop</span>
      </div>

      <button
        onClick={onSearchOpen}
        className="mx-3 mt-3 flex items-center gap-2 px-3 py-1.5 text-xs text-text-secondary bg-bg-primary border border-border rounded-md hover:bg-bg-hover transition-colors"
      >
        <Search className="w-3.5 h-3.5" />
        <span>Search tools...</span>
        <kbd className="ml-auto text-[10px] opacity-50">⌘K</kbd>
      </button>

      <nav className="flex-1 px-2 py-2 space-y-0.5">
        {CATEGORY_ORDER.map((cat) => {
          const info = CATEGORIES[cat];
          const tools = TOOLS.filter((t) => t.category === cat);
          const Icon = ICON_MAP[info.icon] || FileCode;
          const isOpen = !collapsed[cat];

          return (
            <div key={cat}>
              <button
                onClick={() => toggleCategory(cat)}
                className="flex items-center gap-2 w-full px-2 py-1.5 text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-bg-hover rounded transition-colors"
              >
                {isOpen ? (
                  <ChevronDown className="w-3 h-3" />
                ) : (
                  <ChevronRight className="w-3 h-3" />
                )}
                <Icon className="w-3.5 h-3.5" />
                <span>{info.label}</span>
              </button>

              {isOpen && (
                <div className="ml-5 space-y-0">
                  {tools.map((tool) => (
                    <Link
                      key={tool.id}
                      href={tool.path}
                      className={cn(
                        "flex items-center px-2 py-1 text-xs rounded transition-colors",
                        pathname === tool.path
                          ? "bg-bg-active text-text-primary font-medium"
                          : "text-text-secondary hover:text-text-primary hover:bg-bg-hover"
                      )}
                    >
                      {tool.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className="px-3 py-2 border-t border-border">
        <p className="text-[10px] text-text-secondary text-center">
          🔒 All processing happens in your browser. No data is sent to any server.
        </p>
      </div>
    </aside>
  );
}
