"use client";

import { Shield, Menu, Sun, Moon, Search } from "lucide-react";

interface HeaderProps {
  onMenuToggle: () => void;
  onSearchOpen: () => void;
  isDark: boolean;
  onToggleDark: () => void;
}

export default function Header({ onMenuToggle, onSearchOpen, isDark, onToggleDark }: HeaderProps) {
  return (
    <header className="lg:hidden flex items-center gap-2 px-3 py-2 border-b border-border bg-bg-secondary">
      <button onClick={onMenuToggle} className="p-1.5 hover:bg-bg-hover rounded">
        <Menu className="w-4 h-4" />
      </button>
      <div className="flex items-center gap-1.5">
        <Shield className="w-4 h-4 text-accent" />
        <span className="font-semibold text-sm">Utilitop</span>
      </div>
      <div className="flex-1" />
      <button
        onClick={onSearchOpen}
        className="p-1.5 hover:bg-bg-hover rounded"
      >
        <Search className="w-4 h-4" />
      </button>
      <button onClick={onToggleDark} className="p-1.5 hover:bg-bg-hover rounded">
        {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      </button>
    </header>
  );
}
