"use client";

import { useRef, useState } from "react";
import { ResumeData } from "@/app/types/resume";

interface Props {
  data: ResumeData;
  resumeName: string;
  onImport: (data: ResumeData) => void;
}

function isValidResumeData(obj: unknown): obj is ResumeData {
  if (typeof obj !== "object" || obj === null) return false;
  const d = obj as Record<string, unknown>;
  return typeof d.personalDetails === "object" && Array.isArray(d.employmentHistory);
}

export function JsonExportImport({ data, resumeName, onImport }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  function handleExport() {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${resumeName.replace(/\s+/g, "_")}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    setError(null);
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target?.result as string);
        if (!isValidResumeData(parsed)) throw new Error("Invalid format");
        onImport(parsed);
      } catch {
        setError("Invalid JSON file");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  }

  return (
    <div className="flex items-center gap-2">
      <button type="button" onClick={handleExport} title="Export JSON"
        className="flex items-center gap-1 text-[10px] text-gray-500 hover:text-gray-700 transition-colors border border-gray-200 rounded px-2 py-1 hover:border-gray-300">
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        Export
      </button>
      <button type="button" onClick={() => inputRef.current?.click()} title="Import JSON"
        className="flex items-center gap-1 text-[10px] text-gray-500 hover:text-gray-700 transition-colors border border-gray-200 rounded px-2 py-1 hover:border-gray-300">
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l4-4m0 0l4 4m-4-4v12" />
        </svg>
        Import
      </button>
      {error && <span className="text-[10px] text-red-500">{error}</span>}
      <input ref={inputRef} type="file" accept=".json,application/json" className="hidden" onChange={handleImport} />
    </div>
  );
}
