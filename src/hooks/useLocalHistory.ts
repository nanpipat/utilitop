"use client";

import { useState, useEffect, useCallback } from "react";

export function useLocalHistory(key: string, maxSize: number = 10) {
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(`history_${key}`);
      if (stored) setHistory(JSON.parse(stored));
    } catch {}
  }, [key]);

  const add = useCallback(
    (value: string) => {
      if (!value.trim()) return;
      setHistory((prev) => {
        const next = [value, ...prev.filter((v) => v !== value)].slice(0, maxSize);
        try {
          localStorage.setItem(`history_${key}`, JSON.stringify(next));
        } catch {}
        return next;
      });
    },
    [key, maxSize]
  );

  const clear = useCallback(() => {
    setHistory([]);
    try {
      localStorage.removeItem(`history_${key}`);
    } catch {}
  }, [key]);

  return { history, add, clear };
}
