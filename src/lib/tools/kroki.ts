import pako from "pako";

export const encodeDiagram = (source: string): string => {
  const compressed = pako.deflate(new TextEncoder().encode(source));
  return btoa(String.fromCharCode.apply(null, Array.from(compressed)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
};

export const renderViaKroki = async (type: string, code: string): Promise<string> => {
  const encoded = encodeDiagram(code);
  const url = `https://kroki.io/${type}/svg/${encoded}`;
  const res = await fetch(url);
  if (!res.ok) {
    if (res.status === 400) {
      const text = await res.text();
      throw new Error(`Syntax error: ${text}`);
    }
    if (res.status === 429) throw new Error("Too many requests, please wait a moment.");
    throw new Error(`Render failed: ${res.statusText}`);
  }
  return await res.text();
};

export const injectThaiFont = (code: string): string => {
  const hasThaiChars = /[\u0E00-\u0E7F]/.test(code);
  if (!hasThaiChars) return code;
  return code.replace(
    /@startuml([^\n]*)/,
    "@startuml$1\nskinparam defaultFontName Sarabun"
  );
};
