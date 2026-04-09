"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CATEGORIES, CATEGORY_ORDER, TOOLS_BY_CATEGORY } from "@/lib/registry";
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
      <Link href="/" className="flex items-center gap-2.5 px-5 py-4 border-b border-border group hover:bg-bg-hover transition-colors duration-150">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 shrink-0">
          <path fillRule="evenodd" clipRule="evenodd" d="M8.25 9C8.25 8.58579 8.58579 8.25 9 8.25H15C15.4142 8.25 15.75 8.58579 15.75 9C15.75 9.41421 15.4142 9.75 15 9.75H12.75V15C12.75 15.4142 12.4142 15.75 12 15.75C11.5858 15.75 11.25 15.4142 11.25 15V9.75H9C8.58579 9.75 8.25 9.41421 8.25 9Z" fill="var(--accent)"/>
          <path fillRule="evenodd" clipRule="evenodd" d="M5.85986 3.26307C5.56645 2.5232 4.84432 2 4 2C2.89543 2 2 2.89543 2 4C2 4.84433 2.5232 5.56645 3.26307 5.85986C3.25449 5.90526 3.25 5.9521 3.25 6L3.25 18C3.25 18.0479 3.25449 18.0947 3.26307 18.1401C2.5232 18.4335 2 19.1557 2 20C2 21.1046 2.89543 22 4 22C4.84433 22 5.56645 21.4768 5.85986 20.7369C5.90526 20.7455 5.9521 20.75 6 20.75H18C18.0479 20.75 18.0947 20.7455 18.1401 20.7369C18.4335 21.4768 19.1557 22 20 22C21.1046 22 22 21.1046 22 20C22 19.1557 21.4768 18.4335 20.7369 18.1401C20.7455 18.0947 20.75 18.0479 20.75 18L20.75 6C20.75 5.9521 20.7455 5.90526 20.7369 5.85986C21.4768 5.56645 22 4.84433 22 4C22 2.89543 21.1046 2 20 2C19.1557 2 18.4335 2.5232 18.1401 3.26307C18.0947 3.25449 18.0479 3.25 18 3.25H6C5.9521 3.25 5.90526 3.25449 5.85986 3.26307ZM4.73693 5.85986C4.74551 5.90526 4.75 5.9521 4.75 6L4.75 18C4.75 18.0479 4.74551 18.0947 4.73693 18.1401C5.24875 18.3431 5.65689 18.7512 5.85986 19.2631C5.90526 19.2545 5.9521 19.25 6 19.25H18C18.0479 19.25 18.0947 19.2545 18.1401 19.2631C18.3431 18.7512 18.7512 18.3431 19.2631 18.1401C19.2545 18.0947 19.25 18.0479 19.25 18V6C19.25 5.9521 19.2545 5.90526 19.2631 5.85986C18.7512 5.65689 18.3431 5.24875 18.1401 4.73693C18.0947 4.74551 18.0479 4.75 18 4.75H6C5.9521 4.75 5.90526 4.74551 5.85986 4.73693C5.65689 5.24875 5.24875 5.65689 4.73693 5.85986Z" fill="var(--accent)"/>
        </svg>
        <span className="font-mono font-bold text-base tracking-tight group-hover:text-accent transition-colors duration-150">Utilitop</span>
      </Link>

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
          const tools = TOOLS_BY_CATEGORY[cat];
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
