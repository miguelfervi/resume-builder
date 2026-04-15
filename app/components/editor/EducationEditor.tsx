"use client";

import { EducationEntry } from "@/app/types/resume";
import { CollapsibleSection } from "./CollapsibleSection";
import { SortableList } from "./SortableList";

interface Props {
  entries: EducationEntry[];
  onChange: (entries: EducationEntry[]) => void;
}

function EntryEditor({ entry, onChange, onRemove }: { entry: EducationEntry; onChange: (e: EducationEntry) => void; onRemove: () => void }) {
  function update<K extends keyof EducationEntry>(key: K, value: EducationEntry[K]) {
    onChange({ ...entry, [key]: value });
  }

  return (
    <div className="border border-gray-100 rounded-lg p-3 space-y-2.5 bg-white">
      <div className="flex justify-between items-center">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Education</span>
        <button type="button" onClick={onRemove} className="text-gray-300 hover:text-red-400 transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {[
          { label: "Degree / Field", key: "degree" as const, placeholder: "Computer Science" },
          { label: "School", key: "school" as const, placeholder: "University of..." },
          { label: "City", key: "city" as const, placeholder: "Barcelona" },
          { label: "Start Date", key: "startDate" as const, placeholder: "September 2018" },
        ].map(({ label, key, placeholder }) => (
          <div key={key}>
            <label className="block text-[10px] font-medium text-gray-500 mb-1">{label}</label>
            <input type="text" value={entry[key]} onChange={(e) => update(key, e.target.value)} placeholder={placeholder}
              className="w-full border border-gray-200 rounded px-2 py-1 text-xs text-gray-800 focus:outline-none focus:border-blue-400 transition-colors" />
          </div>
        ))}
      </div>
      <div>
        <label className="block text-[10px] font-medium text-gray-500 mb-1">End Date</label>
        <input type="text" value={entry.endDate} onChange={(e) => update("endDate", e.target.value)} placeholder="June 2022"
          className="w-full border border-gray-200 rounded px-2 py-1 text-xs text-gray-800 focus:outline-none focus:border-blue-400 transition-colors" />
      </div>
      <div>
        <label className="block text-[10px] font-medium text-gray-500 mb-1">Description (optional)</label>
        <textarea value={entry.description} onChange={(e) => update("description", e.target.value)} placeholder="Relevant coursework, thesis..." rows={2}
          className="w-full border border-gray-200 rounded px-2 py-1.5 text-xs text-gray-800 focus:outline-none focus:border-blue-400 transition-colors resize-none" />
      </div>
    </div>
  );
}

export function EducationEditor({ entries, onChange }: Props) {
  function addEntry() {
    onChange([...entries, { id: crypto.randomUUID(), degree: "", school: "", city: "", startDate: "", endDate: "", description: "" }]);
  }

  return (
    <CollapsibleSection title="Education" defaultOpen={false}>
      <SortableList
        items={entries}
        onReorder={onChange}
        renderItem={(entry) => (
          <EntryEditor
            entry={entry}
            onChange={(updated) => onChange(entries.map((e) => (e.id === updated.id ? updated : e)))}
            onRemove={() => onChange(entries.filter((e) => e.id !== entry.id))}
          />
        )}
      />
      <button type="button" onClick={addEntry}
        className="w-full py-2 border border-dashed border-gray-300 rounded text-xs text-gray-500 hover:border-blue-400 hover:text-blue-500 transition-colors font-medium">
        + Add education
      </button>
    </CollapsibleSection>
  );
}
