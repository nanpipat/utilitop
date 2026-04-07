"use client";

import { ReactNode, useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Copy, Check } from "lucide-react";

interface ToolLayoutProps {
  title: string;
  description: string;
  children: ReactNode;
}

export default function ToolLayout({ title, description, children }: ToolLayoutProps) {
  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-5 py-4 sm:py-8 animate-fade-in">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-base sm:text-xl font-bold tracking-tight">{title}</h1>
        <p className="text-xs sm:text-sm text-text-secondary mt-1">{description}</p>
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
      rows={rows || 8}
      className={cn(
        "w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-bg-tertiary border border-border rounded-xl font-mono text-xs sm:text-sm resize-y focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/50 placeholder:text-text-placeholder transition-all duration-200",
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
        "w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-bg-tertiary border border-border rounded-xl font-mono text-xs sm:text-sm whitespace-pre-wrap break-words min-h-[80px] sm:min-h-[100px] overflow-auto",
        className
      )}
    >
      {value || <span className="text-text-placeholder">Output will appear here...</span>}
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
        "px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-semibold rounded-lg sm:rounded-xl transition-all duration-200 disabled:opacity-40",
        variant === "primary" && "bg-accent text-white hover:bg-accent-hover shadow-sm hover:shadow-md active:scale-[0.97]",
        variant === "secondary" && "bg-bg-hover text-text-primary hover:bg-bg-active border border-border",
        variant === "danger" && "bg-error text-white hover:opacity-90 shadow-sm",
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
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
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
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [value]);

  if (!value) return null;

  return (
    <button
      onClick={handleCopy}
      className={cn(
        "flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 text-[11px] sm:text-xs rounded-lg transition-all duration-200",
        copied
          ? "bg-success/15 text-success font-medium"
          : "text-text-secondary hover:text-text-primary hover:bg-bg-hover",
        className
      )}
    >
      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

interface ErrorDisplayProps {
  message: string;
}

export function ErrorDisplay({ message }: ErrorDisplayProps) {
  return (
    <div className="flex items-start gap-2 px-3 sm:px-4 py-2.5 sm:py-3 bg-error/8 border border-error/20 rounded-xl text-xs sm:text-sm text-error animate-fade-in">
      <span className="text-sm sm:text-base leading-none mt-px shrink-0">⚠</span>
      <span className="leading-relaxed break-words">{message}</span>
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
    <label className="flex items-center gap-2 text-xs cursor-pointer select-none group">
      <div
        className={cn(
          "w-8 h-[18px] rounded-full transition-all duration-200 relative shrink-0",
          checked ? "bg-accent" : "bg-bg-active"
        )}
        onClick={() => onChange(!checked)}
      >
        <div
          className={cn(
            "absolute top-[2px] w-[14px] h-[14px] rounded-full bg-white shadow-sm transition-all duration-200",
            checked ? "left-[16px]" : "left-[2px]"
          )}
        />
      </div>
      <span className="text-text-secondary group-hover:text-text-primary transition-colors">{label}</span>
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
    <div className="flex items-center gap-1.5 sm:gap-2">
      {label && <span className="text-[11px] sm:text-xs text-text-secondary font-medium">{label}</span>}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-2 sm:px-3 py-1 sm:py-1.5 text-[11px] sm:text-xs bg-bg-tertiary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/50 transition-all duration-200 cursor-pointer"
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
