import Link from "next/link";
import { CATEGORIES, CATEGORY_ORDER, TOOLS, TOOLS_BY_CATEGORY } from "@/lib/registry";
import { Category } from "@/types/tool";
import SearchTrigger from "@/components/ui/SearchTrigger";
import {
  Braces, FileText, FileCode, Database, Paintbrush, FileCode2,
  Binary, Link as LinkIcon, KeyRound, Code, Languages, FileArchive, Hash, Radio,
  Fingerprint, Shield, Key, AlignLeft, QrCode, Clock, Palette, FileCheck,
  ArrowLeftRight, Table, Calendar,
  Regex, GitCompare, CaseSensitive, Calculator, ArrowDownAZ, List,
  Server, Search, Workflow, Layers, Share2, Spline,
} from "lucide-react";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Braces, FileText, FileCode, Database, Paintbrush, FileCode2,
  Binary, Link: LinkIcon, KeyRound, Code, Languages, FileArchive, Hash, Radio,
  Fingerprint, Shield, Key, AlignLeft, QrCode, Clock, Palette, FileCheck,
  ArrowLeftRight, Table, Calendar,
  Regex, GitCompare, CaseSensitive, Calculator, ArrowDownAZ, List,
  Server, Search, Workflow, Layers, Share2, Spline,
};

const CATEGORY_ACCENT: Record<Category, string> = {
  formatters: "{ }",
  encoders: "</>",
  generators: "✦",
  converters: "⇄",
  text: "Aa",
  network: "◎",
  diagrams: "◆",
};

const categoryTone = (color: string, tint = 14) => ({
  color: `var(--${color})`,
  backgroundColor: `color-mix(in srgb, var(--${color}) ${tint}%, var(--bg-primary))`,
});

export default function HomePage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10">

      {/* ── Hero ──────────────────────────────────────────── */}
      <div className="mb-10 sm:mb-14 text-center">
        <div className="mb-5">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold text-text-primary bg-bg-active px-3 py-1 brutal-button uppercase">
            <Shield className="w-3 h-3" />
            Browser-native · Zero data sent
          </span>
        </div>

        <h1 className="text-3xl sm:text-[2.8rem] font-extrabold text-text-primary leading-tight mb-3 tracking-tight">
          Your Developer<br className="hidden sm:block" /> Utility Toolkit
        </h1>

        <p className="text-sm sm:text-base text-text-secondary max-w-md mx-auto mb-6">
          {TOOLS.length} tools that run entirely in your browser — formatters,
          converters, generators, and more. Fast, private, offline-ready.
        </p>

        <SearchTrigger className="w-full max-w-xl mx-auto" />
      </div>

      {/* ── Tool categories ───────────────────────────────── */}
      <div className="space-y-10 sm:space-y-12">
        {CATEGORY_ORDER.map((cat) => {
          const info = CATEGORIES[cat];
          const tools = TOOLS_BY_CATEGORY[cat];
          return (
            <section key={cat}>
              {/* Section header */}
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-8 h-8 rounded flex items-center justify-center text-xs font-extrabold shrink-0 border-2 border-border shadow-sm"
                  style={categoryTone(info.color, 18)}
                >
                  {CATEGORY_ACCENT[cat]}
                </div>
                <h2 className="text-sm font-extrabold text-text-primary tracking-tight uppercase">
                  {info.label}
                </h2>
                <div className="flex-1 border-t-2 border-border" />
                <span className="text-[10px] text-text-primary font-extrabold shrink-0 bg-bg-secondary border-2 border-border px-2 py-0.5 shadow-sm">
                  {tools.length} tools
                </span>
              </div>

              {/* Tool cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {tools.map((tool) => {
                  const Icon = ICON_MAP[tool.icon];
                  return (
                    <Link key={tool.id} href={tool.path} className="tool-card group">
                      <div
                        className="w-9 h-9 rounded flex items-center justify-center shrink-0 mt-0.5 transition-colors border-2 border-border shadow-sm"
                        style={categoryTone(info.color, 12)}
                      >
                        {Icon ? (
                          <Icon className="w-4 h-4" />
                        ) : (
                          <span className="text-xs">?</span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-extrabold text-text-primary group-hover:text-accent transition-colors leading-snug">
                          {tool.name}
                        </div>
                        <div className="text-xs text-text-secondary mt-0.5 leading-relaxed">
                          {tool.description}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      {/* ── Footer ────────────────────────────────────────── */}
      <div className="mt-16 pt-6 border-t-2 border-border text-center">
        <p className="text-xs text-text-secondary">
          Built by <span className="font-semibold text-text-primary">Top</span> · All tools run locally in your browser
        </p>
      </div>
    </div>
  );
}
