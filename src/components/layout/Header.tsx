"use client";

import { Menu, Sun, Moon, Search } from "lucide-react";

interface HeaderProps {
  onMenuToggle: () => void;
  onSearchOpen: () => void;
  isDark: boolean;
  onToggleDark: () => void;
}

export default function Header({ onMenuToggle, onSearchOpen, isDark, onToggleDark }: HeaderProps) {
  return (
    <header className="lg:hidden flex items-center gap-2 px-4 py-2.5 border-b border-border bg-bg-secondary/80 backdrop-blur-lg sticky top-0 z-20">
      <button onClick={onMenuToggle} className="p-1.5 hover:bg-bg-hover rounded-lg transition-colors">
        <Menu className="w-4 h-4" />
      </button>
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-accent to-blue-400 flex items-center justify-center text-white font-bold text-[10px]">U</div>
        <span className="font-bold text-sm">Utilitop</span>
      </div>
      <div className="flex-1" />
      <button onClick={onSearchOpen} className="p-1.5 hover:bg-bg-hover rounded-lg transition-colors">
        <Search className="w-4 h-4" />
      </button>
      <button onClick={onToggleDark} className="p-1.5 hover:bg-bg-hover rounded-lg transition-colors">
        {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      </button>
    </header>
  );
}
