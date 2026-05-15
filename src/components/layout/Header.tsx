"use client";

import Link from "next/link";
import { Menu, Sun, Moon, Search } from "lucide-react";
import { LogoIcon } from "@/components/ui/Logo";

interface HeaderProps {
  onMenuToggle: () => void;
  onSearchOpen: () => void;
  isDark: boolean;
  onToggleDark: () => void;
}

export default function Header({ onMenuToggle, onSearchOpen, isDark, onToggleDark }: HeaderProps) {
  return (
    <header className="lg:hidden flex items-center gap-2 px-4 py-2.5 border-b-2 border-border bg-bg-secondary sticky top-0 z-20">
      <button
        onClick={onMenuToggle}
        className="p-1.5 bg-bg-primary brutal-button text-text-primary"
      >
        <Menu className="w-4 h-4" />
      </button>
      <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
        <LogoIcon size={24} />
        <span className="font-extrabold text-sm tracking-tight">Utilitop</span>
      </Link>
      <div className="flex-1" />
      <button
        onClick={onSearchOpen}
        className="p-1.5 bg-bg-primary brutal-button text-text-primary"
      >
        <Search className="w-4 h-4" />
      </button>
      <button
        onClick={onToggleDark}
        className="p-1.5 bg-bg-primary brutal-button text-text-primary"
      >
        {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      </button>
    </header>
  );
}
