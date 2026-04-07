"use client";

import { useCallback } from "react";

export function useClipboard() {
  const copy = useCallback(async (text: string): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand("copy");
        return true;
      } catch {
        return false;
      } finally {
        document.body.removeChild(textarea);
      }
    }
  }, []);

  return { copy };
}
