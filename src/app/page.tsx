import Link from "next/link";
import { TOOLS, CATEGORIES } from "@/lib/registry";
import { Category } from "@/types/tool";

const CATEGORY_ORDER: Category[] = [
  "formatters",
  "encoders",
  "generators",
  "converters",
  "text",
  "network",
];

export default function HomePage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="mb-8">
        <h1 className="text-xl font-semibold mb-1">Developer Tools</h1>
        <p className="text-sm text-text-secondary">
          All tools run in your browser. No data leaves your machine.
        </p>
      </div>

      <div className="space-y-8">
        {CATEGORY_ORDER.map((cat) => {
          const info = CATEGORIES[cat];
          const tools = TOOLS.filter((t) => t.category === cat);
          return (
            <section key={cat}>
              <h2 className="text-sm font-medium text-text-secondary mb-3">{info.label}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {tools.map((tool) => (
                  <Link
                    key={tool.id}
                    href={tool.path}
                    className="block px-3 py-2.5 border border-border rounded-md hover:bg-bg-hover hover:border-bg-active transition-colors"
                  >
                    <div className="text-sm font-medium">{tool.name}</div>
                    <div className="text-xs text-text-secondary mt-0.5">{tool.description}</div>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
