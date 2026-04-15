"use client";

import { Skill } from "@/app/types/resume";
import { CollapsibleSection } from "./CollapsibleSection";
import { SortableList } from "./SortableList";

interface Props {
  skills: Skill[];
  onChange: (skills: Skill[]) => void;
}

export function SkillsEditor({ skills, onChange }: Props) {
  function addSkill() {
    onChange([...skills, { id: crypto.randomUUID(), name: "", level: 75 }]);
  }

  function updateSkill(id: string, updates: Partial<Skill>) {
    onChange(skills.map((s) => (s.id === id ? { ...s, ...updates } : s)));
  }

  function removeSkill(id: string) {
    onChange(skills.filter((s) => s.id !== id));
  }

  return (
    <CollapsibleSection title="Skills">
      <div className="space-y-3">
        <SortableList
          items={skills}
          onReorder={onChange}
          renderItem={(skill) => (
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={skill.name}
                  onChange={(e) => updateSkill(skill.id, { name: e.target.value })}
                  placeholder="Vue, React, etc."
                  className="flex-1 border border-gray-200 rounded px-2 py-1.5 text-xs text-gray-800 focus:outline-none focus:border-blue-400 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => removeSkill(skill.id)}
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
                  value={skill.level}
                  onChange={(e) => updateSkill(skill.id, { level: Number(e.target.value) })}
                  className="flex-1 accent-blue-500 h-1"
                />
                <span className="text-[10px] text-gray-400 w-7 text-right tabular-nums">{skill.level}%</span>
              </div>
            </div>
          )}
        />
        <button
          type="button"
          onClick={addSkill}
          className="w-full py-2 border border-dashed border-gray-300 rounded text-xs text-gray-500 hover:border-blue-400 hover:text-blue-500 transition-colors font-medium"
        >
          + Add skill
        </button>
      </div>
    </CollapsibleSection>
  );
}
