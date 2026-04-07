"use client";

import { useState } from "react";
import ToolLayout, { InputArea, OutputArea, ActionButton, CopyButton, ErrorDisplay, Select } from "@/components/layout/ToolLayout";

const MORSE_MAP: Record<string, string> = {
  "A": ".-", "B": "-...", "C": "-.-.", "D": "-..", "E": ".", "F": "..-.", "G": "--.", "H": "....", "I": "..", "J": ".---", "K": "-.-", "L": ".-..", "M": "--", "N": "-.", "O": "---", "P": ".--.", "Q": "--.-", "R": ".-.", "S": "...", "T": "-", "U": "..-", "V": "...-", "W": ".--", "X": "-..-", "Y": "-.--", "Z": "--..", "0": "-----", "1": ".----", "2": "..---", "3": "...--", "4": "....-", "5": ".....", "6": "-....", "7": "--...", "8": "---..", "9": "----.", ".": ".-.-.-", ",": "--..--", "?": "..--..", "'": ".----.", "!": "-.-.--", "/": "-..-.", "(": "-.--.", ")": "-.--.-", "&": ".-...", ":": "---...", ";": "-.-.-.", "=": "-...-", "+": ".-.-.", "-": "-....-", "_": "..--.-", '"': ".-..-.", "$": "...-..-", "@": ".--.-.",
};

const REVERSE_MORSE: Record<string, string> = Object.fromEntries(Object.entries(MORSE_MAP).map(([k, v]) => [v, k]));

export default function MorseCodeTool() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState("encode");

  const process = (): { output: string; error: string } => {
    if (!input.trim()) return { output: "", error: "" };
    try {
      if (mode === "encode") {
        return {
          output: input.toUpperCase().split("").map((c) => c === " " ? "/" : MORSE_MAP[c] || "").filter(Boolean).join(" "),
          error: "",
        };
      } else {
        return {
          output: input.trim().split(" / ").map((word) =>
            word.split(" ").map((code) => REVERSE_MORSE[code] || "").join("")
          ).join(" "),
          error: "",
        };
      }
    } catch (e: any) {
      return { output: "", error: `Error: ${e.message}` };
    }
  };

  const result = process();

  return (
    <ToolLayout title="Morse Code Encoder/Decoder" description="Convert text to/from Morse code">
      <div className="flex flex-wrap items-center gap-3 mb-3">
        <Select value={mode} onChange={setMode} options={[{ value: "encode", label: "Text → Morse" }, { value: "decode", label: "Morse → Text" }]} />
        <ActionButton onClick={() => setInput("")} variant="secondary">Clear</ActionButton>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <span className="text-xs text-text-secondary mb-1 block">Input</span>
          <InputArea value={input} onChange={setInput} placeholder={mode === "encode" ? "Enter text..." : "Enter morse (. - format)..."} />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-text-secondary">Output</span>
            {result.output && <CopyButton value={result.output} />}
          </div>
          <OutputArea value={result.output} />
        </div>
      </div>
      {result.error && <div className="mt-2"><ErrorDisplay message={result.error} /></div>}
    </ToolLayout>
  );
}
