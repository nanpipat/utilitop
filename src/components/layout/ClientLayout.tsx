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
  "diagrams",
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
      <div className="flex-1 flex flex-col min-h-screen min-w-0 overflow-hidden">
        <Header
          onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
          onSearchOpen={() => setSearchOpen(true)}
          isDark={isDark}
          onToggleDark={toggleDark}
        />
        <main className="flex-1 overflow-y-auto overflow-x-hidden">{children}</main>
      </div>

      <div className="hidden lg:flex items-center gap-1 fixed top-3 right-5 z-30">
        <button
          onClick={toggleDark}
          className="p-2 hover:bg-bg-hover rounded-xl transition-all duration-200 text-text-secondary hover:text-text-primary"
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>

      <SearchBar open={searchOpen} onClose={() => setSearchOpen(false)} />

      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 animate-fade-in">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <div className="fixed left-0 top-0 bottom-0 w-[280px] sm:w-[300px] max-w-[85vw] bg-bg-primary border-r border-border overflow-y-auto shadow-xl animate-slide-up">
            <div className="flex items-center justify-between px-4 sm:px-5 py-3 sm:py-4 border-b border-border">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-accent to-blue-400 flex items-center justify-center text-white font-bold text-[10px]">U</div>
                <span className="font-bold text-sm">Utilitop</span>
              </div>
              <button onClick={() => setMobileMenuOpen(false)} className="p-1.5 hover:bg-bg-hover rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </div>
            <nav className="px-2 sm:px-3 py-3">
              {CATEGORY_ORDER.map((cat) => {
                const info = CATEGORIES[cat];
                const tools = TOOLS.filter((t) => t.category === cat);
                return (
                  <div key={cat} className="mb-2 sm:mb-3">
                    <div className="flex items-center gap-2 px-2 py-1.5 text-xs font-semibold text-text-secondary">
                      <div className={`w-4 h-4 rounded bg-${info.color}/15 text-${info.color} flex items-center justify-center text-[8px]`}>●</div>
                      {info.label}
                    </div>
                    {tools.map((tool) => (
                      <Link
                        key={tool.id}
                        href={tool.path}
                        className={cn(
                          "block px-3 py-1.5 text-xs rounded-lg transition-all duration-150 ml-2",
                          pathname === tool.path
                            ? "bg-accent/10 text-accent font-semibold"
                            : "text-text-secondary hover:bg-bg-hover hover:text-text-primary"
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
