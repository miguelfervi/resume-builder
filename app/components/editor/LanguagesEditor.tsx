"use client";

import { Language } from "@/app/types/resume";
import { CollapsibleSection } from "./CollapsibleSection";

interface Props {
  languages: Language[];
  onChange: (languages: Language[]) => void;
}

export function LanguagesEditor({ languages, onChange }: Props) {
  function addLanguage() {
    onChange([...languages, { id: crypto.randomUUID(), name: "", level: 75 }]);
  }

  function updateLanguage(id: string, updates: Partial<Language>) {
    onChange(languages.map((l) => (l.id === id ? { ...l, ...updates } : l)));
  }

  function removeLanguage(id: string) {
    onChange(languages.filter((l) => l.id !== id));
  }

  return (
    <CollapsibleSection title="Languages">
      <div className="space-y-3">
        {languages.map((lang) => (
          <div key={lang.id} className="space-y-1">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={lang.name}
                onChange={(e) => updateLanguage(lang.id, { name: e.target.value })}
                placeholder="English, Spanish, etc."
                className="flex-1 border border-gray-200 rounded px-2 py-1.5 text-xs text-gray-800 focus:outline-none focus:border-blue-400 transition-colors"
              />
              <button
                type="button"
                onClick={() => removeLanguage(lang.id)}
                className="text-gray-300 hover:text-red-400 transition-colors flex-shrink-0"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex items-center gap-2 px-0.5">
              <input
                type="range"
                min={0}
                max={100}
                value={lang.level}
                onChange={(e) => updateLanguage(lang.id, { level: Number(e.target.value) })}
                className="flex-1 accent-blue-500 h-1"
              />
              <span className="text-[10px] text-gray-400 w-7 text-right tabular-nums">{lang.level}%</span>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={addLanguage}
          className="w-full py-2 border border-dashed border-gray-300 rounded text-xs text-gray-500 hover:border-blue-400 hover:text-blue-500 transition-colors font-medium"
        >
          + Add language
        </button>
      </div>
    </CollapsibleSection>
  );
}
