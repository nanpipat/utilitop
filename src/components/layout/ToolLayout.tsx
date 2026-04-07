"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ToolLayoutProps {
  title: string;
  description: string;
  children: ReactNode;
}

export default function ToolLayout({ title, description, children }: ToolLayoutProps) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="mb-4">
        <h1 className="text-lg font-semibold">{title}</h1>
        <p className="text-sm text-text-secondary">{description}</p>
      </div>
      {children}
    </div>
  );
}

interface InputAreaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  rows?: number;
}

export function InputArea({ value, onChange, placeholder, className, rows }: InputAreaProps) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows || 12}
      className={cn(
        "w-full px-3 py-2 bg-bg-secondary border border-border rounded-md font-mono text-sm resize-y focus:outline-none focus:ring-1 focus:ring-accent placeholder:text-text-placeholder",
        className
      )}
    />
  );
}

interface OutputAreaProps {
  value: string;
  className?: string;
}

export function OutputArea({ value, className }: OutputAreaProps) {
  return (
    <div
      className={cn(
        "w-full px-3 py-2 bg-bg-secondary border border-border rounded-md font-mono text-sm whitespace-pre-wrap break-all min-h-[100px]",
        className
      )}
    >
      {value}
    </div>
  );
}

interface ActionButtonProps {
  onClick: () => void;
  children: ReactNode;
  variant?: "primary" | "secondary" | "danger";
  className?: string;
  disabled?: boolean;
}

export function ActionButton({
  onClick,
  children,
  variant = "primary",
  className,
  disabled,
}: ActionButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "px-3 py-1.5 text-xs font-medium rounded-md transition-colors disabled:opacity-50",
        variant === "primary" && "bg-accent text-white hover:opacity-90",
        variant === "secondary" && "bg-bg-hover text-text-primary hover:bg-bg-active",
        variant === "danger" && "bg-error text-white hover:opacity-90",
        className
      )}
    >
      {children}
    </button>
  );
}

interface CopyButtonProps {
  value: string;
  className?: string;
}

export function CopyButton({ value, className }: CopyButtonProps) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = value;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={cn(
        "px-2 py-1 text-xs text-text-secondary hover:text-text-primary hover:bg-bg-hover rounded transition-colors",
        className
      )}
    >
      Copy
    </button>
  );
}

interface ErrorDisplayProps {
  message: string;
}

export function ErrorDisplay({ message }: ErrorDisplayProps) {
  return (
    <div className="flex items-start gap-2 px-3 py-2 bg-red-50 dark:bg-red-900/20 border border-error/30 rounded-md text-sm text-error">
      <span>⚠</span>
      <span>{message}</span>
    </div>
  );
}

interface ToggleProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function Toggle({ label, checked, onChange }: ToggleProps) {
  return (
    <label className="flex items-center gap-2 text-xs cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="rounded border-border"
      />
      <span>{label}</span>
    </label>
  );
}

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  label?: string;
}

export function Select({ value, onChange, options, label }: SelectProps) {
  return (
    <div className="flex items-center gap-2">
      {label && <span className="text-xs text-text-secondary">{label}</span>}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-2 py-1 text-xs bg-bg-secondary border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-accent"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
