import { TOOLS, getToolByPath } from "@/lib/registry";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ToolRenderer from "@/components/ToolRenderer";

interface PageProps {
  params: { category: string; tool: string };
}

export function generateStaticParams() {
  return TOOLS.map((tool) => {
    const parts = tool.path.split("/").filter(Boolean);
    return { category: parts[0], tool: parts[1] };
  });
}

export function generateMetadata({ params }: PageProps): Metadata {
  const tool = getToolByPath(params.category, params.tool);
  if (!tool) return { title: "Utilitop" };
  return {
    title: `${tool.name} - Utilitop`,
    description: tool.description,
  };
}

export default function ToolPage({ params }: PageProps) {
  const tool = getToolByPath(params.category, params.tool);
  if (!tool) notFound();

  return <ToolRenderer toolId={tool.id} />;
}
