"use client";

import { useState } from "react";
import ToolLayout, { ActionButton, CopyButton, Select, Toggle } from "@/components/layout/ToolLayout";

const WORDS = ["lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit", "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore", "magna", "aliqua", "enim", "ad", "minim", "veniam", "quis", "nostrud", "exercitation", "ullamco", "laboris", "nisi", "aliquip", "ex", "ea", "commodo", "consequat", "duis", "aute", "irure", "in", "reprehenderit", "voluptate", "velit", "esse", "cillum", "fugiat", "nulla", "pariatur", "excepteur", "sint", "occaecat", "cupidatat", "non", "proident", "sunt", "culpa", "qui", "officia", "deserunt", "mollit", "anim", "id", "est", "laborum", "perspiciatis", "unde", "omnis", "iste", "natus", "error", "voluptatem", "accusantium", "doloremque", "laudantium", "totam", "rem", "aperiam", "eaque", "ipsa", "quae", "ab", "illo", "inventore", "veritatis", "quasi", "architecto", "beatae", "vitae", "dicta", "explicabo", "nemo", "ipsam", "voluptas", "aspernatur", "aut", "odit", "fugit", "consequuntur", "magni", "dolores", "eos", "ratione", "sequi", "nesciunt", "neque", "porro", "quisquam"];

const LOREM_START = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";

function generateSentence(): string {
  const len = 8 + Math.floor(Math.random() * 12);
  const words: string[] = [];
  for (let i = 0; i < len; i++) words.push(WORDS[Math.floor(Math.random() * WORDS.length)]);
  words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
  return words.join(" ") + ".";
}

function generateParagraph(): string {
  const count = 3 + Math.floor(Math.random() * 4);
  return Array.from({ length: count }, generateSentence).join(" ");
}

export default function LoremIpsumGenerator() {
  const [type, setType] = useState("paragraphs");
  const [count, setCount] = useState(3);
  const [startWithLorem, setStartWithLorem] = useState(true);
  const [output, setOutput] = useState("");

  const generate = () => {
    let result = "";
    if (type === "words") {
      const words: string[] = [];
      for (let i = 0; i < count; i++) words.push(WORDS[Math.floor(Math.random() * WORDS.length)]);
      result = words.join(" ");
    } else if (type === "sentences") {
      const sentences = Array.from({ length: count }, generateSentence);
      result = sentences.join(" ");
    } else {
      const paragraphs = Array.from({ length: count }, generateParagraph);
      result = paragraphs.join("\n\n");
    }
    if (startWithLorem) result = LOREM_START + (type === "words" ? " " : " ") + result;
    setOutput(result);
  };

  return (
    <ToolLayout title="Lorem Ipsum Generator" description="Generate placeholder text">
      <div className="flex flex-wrap items-center gap-3 mb-3">
        <Select value={type} onChange={setType} label="Type:" options={[{ value: "words", label: "Words" }, { value: "sentences", label: "Sentences" }, { value: "paragraphs", label: "Paragraphs" }]} />
        <div className="flex items-center gap-2">
          <span className="text-xs text-text-secondary">Count: {count}</span>
          <input type="number" min={1} max={100} value={count} onChange={(e) => setCount(Math.min(100, Math.max(1, parseInt(e.target.value) || 1)))} className="w-16 px-2 py-1 text-xs bg-bg-secondary border border-border rounded-md" />
        </div>
        <Toggle label='Start with "Lorem ipsum..."' checked={startWithLorem} onChange={setStartWithLorem} />
        <ActionButton onClick={generate}>Generate</ActionButton>
      </div>
      {output && (
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-text-secondary">Output</span>
            <CopyButton value={output} />
          </div>
          <div className="px-3 py-2 bg-bg-secondary border border-border rounded-md text-sm whitespace-pre-wrap max-h-96 overflow-y-auto">{output}</div>
        </div>
      )}
    </ToolLayout>
  );
}
