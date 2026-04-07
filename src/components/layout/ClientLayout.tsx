"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import SearchBar from "@/components/layout/SearchBar";
import { TOOLS, CATEGORIES } from "@/lib/registry";
import { Category } from "@/types/tool";
import { cn } from "@/lib/utils";
import { Sun, Moon, X } from "lucide-react";

const CATEGORY_ORDER: Category[] = [
  "formatters",
  "encoders",
  "generators",
  "converters",
  "text",
  "network",
];

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  useEffect(() => {
    const handler = () => setSearchOpen(true);
    window.addEventListener("open-search", handler);
    return () => window.removeEventListener("open-search", handler);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const toggleDark = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar onSearchOpen={() => setSearchOpen(true)} />
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <Header
          onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
          onSearchOpen={() => setSearchOpen(true)}
          isDark={isDark}
          onToggleDark={toggleDark}
        />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>

      <div className="hidden lg:flex items-center gap-1 fixed top-2 right-4 z-30">
        <button
          onClick={toggleDark}
          className="p-2 hover:bg-bg-hover rounded-md transition-colors text-text-secondary"
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>

      <SearchBar open={searchOpen} onClose={() => setSearchOpen(false)} />

      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="fixed inset-0 bg-black/40" onClick={() => setMobileMenuOpen(false)} />
          <div className="fixed left-0 top-0 bottom-0 w-[280px] bg-bg-primary border-r border-border overflow-y-auto">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <span className="font-semibold text-sm">Utilitop</span>
              <button onClick={() => setMobileMenuOpen(false)}>
                <X className="w-4 h-4" />
              </button>
            </div>
            <nav className="px-2 py-2">
              {CATEGORY_ORDER.map((cat) => {
                const info = CATEGORIES[cat];
                const tools = TOOLS.filter((t) => t.category === cat);
                return (
                  <div key={cat} className="mb-2">
                    <div className="px-2 py-1 text-xs font-medium text-text-secondary">
                      {info.label}
                    </div>
                    {tools.map((tool) => (
                      <Link
                        key={tool.id}
                        href={tool.path}
                        className={cn(
                          "block px-3 py-1.5 text-xs rounded transition-colors",
                          pathname === tool.path
                            ? "bg-bg-active font-medium"
                            : "text-text-secondary hover:bg-bg-hover"
                        )}
                      >
                        {tool.name}
                      </Link>
                    ))}
                  </div>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}
