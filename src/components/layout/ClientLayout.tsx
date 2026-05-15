"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import SearchBar from "@/components/layout/SearchBar";
import { CATEGORIES, CATEGORY_ORDER, TOOLS_BY_CATEGORY } from "@/lib/registry";
import { cn } from "@/lib/utils";
import { Sun, Moon, X } from "lucide-react";
import { LogoIcon } from "@/components/ui/Logo";

const categoryTone = (color: string) => ({
  color: `var(--${color})`,
  backgroundColor: `color-mix(in srgb, var(--${color}) 16%, var(--bg-primary))`,
});

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

      {/* Desktop dark mode toggle */}
      <div className="hidden lg:flex items-center gap-1 fixed top-3 right-5 z-30">
        <button
          onClick={toggleDark}
          className="p-2 bg-bg-primary brutal-button text-text-primary"
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>

      <SearchBar open={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Mobile menu drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 animate-fade-in">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed left-0 top-0 bottom-0 w-[270px] max-w-[85vw] bg-bg-secondary border-r-2 border-border overflow-y-auto shadow-xl animate-slide-up">
            {/* Drawer header */}
            <div className="flex items-center justify-between px-4 py-3 border-b-2 border-border">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                <LogoIcon size={24} />
                <span className="font-extrabold text-sm tracking-tight">Utilitop</span>
              </Link>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 bg-bg-primary brutal-button text-text-primary"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Drawer nav */}
            <nav className="px-2 py-3">
              {CATEGORY_ORDER.map((cat) => {
                const info = CATEGORIES[cat];
                const tools = TOOLS_BY_CATEGORY[cat];
                return (
                  <div key={cat} className="mb-3">
                    <div className="flex items-center gap-2 px-2 py-1.5 text-[10px] font-extrabold text-text-secondary uppercase tracking-wide">
                      <div
                        className="w-4 h-4 rounded flex items-center justify-center text-[8px] border border-border"
                        style={categoryTone(info.color)}
                      >
                        ●
                      </div>
                      {info.label}
                    </div>
                    {tools.map((tool) => (
                      <Link
                        key={tool.id}
                        href={tool.path}
                        className={cn(
                          "block px-3 py-1.5 text-xs rounded border-2 transition-all duration-150 ml-2",
                          pathname === tool.path
                            ? "bg-bg-primary text-accent font-extrabold border-border shadow-sm"
                            : "text-text-secondary border-transparent hover:bg-bg-hover hover:text-text-primary hover:border-border"
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
