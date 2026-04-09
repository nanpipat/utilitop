import Link from "next/link";
import { CATEGORIES, CATEGORY_ORDER, TOOLS_BY_CATEGORY } from "@/lib/registry";
import { Category } from "@/types/tool";
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

const CATEGORY_ICONS: Record<Category, string> = {
  formatters: "{ }",
  encoders: "</>",
  generators: "✦",
  converters: "⇄",
  text: "Aa",
  network: "◎",
  diagrams: "◆",
};

export default function HomePage() {
  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-5 py-4 sm:py-8">
      <div className="mb-6 sm:mb-10">
        <div className="flex items-center gap-2.5 sm:gap-3 mb-2">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-accent to-blue-400 flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-sm">U</div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold tracking-tight">Utilitop</h1>
            <p className="text-[11px] sm:text-xs text-text-secondary">
              All tools run in your browser. No data leaves your machine.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6 sm:space-y-10">
        {CATEGORY_ORDER.map((cat) => {
          const info = CATEGORIES[cat];
          const tools = TOOLS_BY_CATEGORY[cat];
          return (
            <section key={cat}>
              <div className="flex items-center gap-2 sm:gap-2.5 mb-3 sm:mb-4">
                <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-md sm:rounded-lg bg-${info.color}/15 text-${info.color} flex items-center justify-center text-[10px] sm:text-xs font-bold`}>
                  {CATEGORY_ICONS[cat]}
                </div>
                <h2 className="text-xs sm:text-sm font-semibold text-text-primary">{info.label}</h2>
                <div className="flex-1 h-px bg-border ml-1 sm:ml-2" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
                {tools.map((tool) => {
                  const Icon = ICON_MAP[tool.icon];
                  return (
                    <Link
                      key={tool.id}
                      href={tool.path}
                      className="group relative flex items-start gap-2.5 sm:gap-3 px-3 sm:px-4 py-3 border border-border rounded-xl bg-bg-primary shadow-sm hover:shadow-md hover:border-bg-active transition-all duration-200 hover:-translate-y-0.5"
                    >
                      <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-${info.color}/10 text-${info.color} flex items-center justify-center shrink-0 mt-0.5 transition-colors group-hover:bg-${info.color}/15`}>
                        {Icon ? <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <span className="text-xs">?</span>}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs sm:text-sm font-medium text-text-primary group-hover:text-accent transition-colors">{tool.name}</div>
                        <div className="text-[11px] sm:text-xs text-text-secondary mt-0.5 leading-relaxed">{tool.description}</div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
