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
              <Link href="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 shrink-0">
                  <path fillRule="evenodd" clipRule="evenodd" d="M8.25 9C8.25 8.58579 8.58579 8.25 9 8.25H15C15.4142 8.25 15.75 8.58579 15.75 9C15.75 9.41421 15.4142 9.75 15 9.75H12.75V15C12.75 15.4142 12.4142 15.75 12 15.75C11.5858 15.75 11.25 15.4142 11.25 15V9.75H9C8.58579 9.75 8.25 9.41421 8.25 9Z" fill="var(--accent)"/>
                  <path fillRule="evenodd" clipRule="evenodd" d="M5.85986 3.26307C5.56645 2.5232 4.84432 2 4 2C2.89543 2 2 2.89543 2 4C2 4.84433 2.5232 5.56645 3.26307 5.85986C3.25449 5.90526 3.25 5.9521 3.25 6L3.25 18C3.25 18.0479 3.25449 18.0947 3.26307 18.1401C2.5232 18.4335 2 19.1557 2 20C2 21.1046 2.89543 22 4 22C4.84433 22 5.56645 21.4768 5.85986 20.7369C5.90526 20.7455 5.9521 20.75 6 20.75H18C18.0479 20.75 18.0947 20.7455 18.1401 20.7369C18.4335 21.4768 19.1557 22 20 22C21.1046 22 22 21.1046 22 20C22 19.1557 21.4768 18.4335 20.7369 18.1401C20.7455 18.0947 20.75 18.0479 20.75 18L20.75 6C20.75 5.9521 20.7455 5.90526 20.7369 5.85986C21.4768 5.56645 22 4.84433 22 4C22 2.89543 21.1046 2 20 2C19.1557 2 18.4335 2.5232 18.1401 3.26307C18.0947 3.25449 18.0479 3.25 18 3.25H6C5.9521 3.25 5.90526 3.25449 5.85986 3.26307ZM4.73693 5.85986C4.74551 5.90526 4.75 5.9521 4.75 6L4.75 18C4.75 18.0479 4.74551 18.0947 4.73693 18.1401C5.24875 18.3431 5.65689 18.7512 5.85986 19.2631C5.90526 19.2545 5.9521 19.25 6 19.25H18C18.0479 19.25 18.0947 19.2545 18.1401 19.2631C18.3431 18.7512 18.7512 18.3431 19.2631 18.1401C19.2545 18.0947 19.25 18.0479 19.25 18V6C19.25 5.9521 19.2545 5.90526 19.2631 5.85986C18.7512 5.65689 18.3431 5.24875 18.1401 4.73693C18.0947 4.74551 18.0479 4.75 18 4.75H6C5.9521 4.75 5.90526 4.74551 5.85986 4.73693C5.65689 5.24875 5.24875 5.65689 4.73693 5.85986Z" fill="var(--accent)"/>
                </svg>
                <span className="font-mono font-bold text-sm">Utilitop</span>
              </Link>
              <button onClick={() => setMobileMenuOpen(false)} className="p-1.5 hover:bg-bg-hover rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </div>
            <nav className="px-2 sm:px-3 py-3">
              {CATEGORY_ORDER.map((cat) => {
                const info = CATEGORIES[cat];
                const tools = TOOLS_BY_CATEGORY[cat];
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
