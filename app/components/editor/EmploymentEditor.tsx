"use client";

import { EmploymentEntry } from "@/app/types/resume";
import { CollapsibleSection } from "./CollapsibleSection";
import { SortableList } from "./SortableList";

interface Props {
  entries: EmploymentEntry[];
  onChange: (entries: EmploymentEntry[]) => void;
}

function BulletInput({
  value,
  onChange,
  onRemove,
}: {
  value: string;
  onChange: (v: string) => void;
  onRemove: () => void;
}) {
  return (
    <div className="flex gap-2 items-start">
      <span className="mt-2 text-gray-400 text-xs flex-shrink-0">•</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Describe an achievement..."
        className="flex-1 border border-gray-200 rounded px-2 py-1.5 text-xs text-gray-800 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition-colors"
      />
      <button
        type="button"
        onClick={onRemove}
        className="mt-1.5 text-gray-300 hover:text-red-400 transition-colors flex-shrink-0"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

function EntryEditor({
  entry,
  onChange,
  onRemove,
}: {
  entry: EmploymentEntry;
  onChange: (e: EmploymentEntry) => void;
  onRemove: () => void;
}) {
  function updateField(key: keyof EmploymentEntry, value: string | boolean) {
    onChange({ ...entry, [key]: value });
  }

  function updateBullet(index: number, value: string) {
    const bullets = [...entry.bullets];
    bullets[index] = value;
    onChange({ ...entry, bullets });
  }

  function addBullet() {
    onChange({ ...entry, bullets: [...entry.bullets, ""] });
  }

  function removeBullet(index: number) {
    onChange({ ...entry, bullets: entry.bullets.filter((_, i) => i !== index) });
  }

  return (
    <div className="border border-gray-100 rounded-lg p-3 space-y-2.5 bg-white">
      <div className="flex justify-between items-center">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
          Job
        </span>
        <button
          type="button"
          onClick={onRemove}
          className="text-gray-300 hover:text-red-400 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-[10px] font-medium text-gray-500 mb-1">Job Title</label>
          <input
            type="text"
            value={entry.jobTitle}
            onChange={(e) => updateField("jobTitle", e.target.value)}
            placeholder="Front-End Engineer"
            className="w-full border border-gray-200 rounded px-2 py-1 text-xs text-gray-800 focus:outline-none focus:border-blue-400 transition-colors"
          />
        </div>
        <div>
          <label className="block text-[10px] font-medium text-gray-500 mb-1">Employer</label>
          <input
            type="text"
            value={entry.employer}
            onChange={(e) => updateField("employer", e.target.value)}
            placeholder="Acme Corp"
            className="w-full border border-gray-200 rounded px-2 py-1 text-xs text-gray-800 focus:outline-none focus:border-blue-400 transition-colors"
          />
        </div>
        <div>
          <label className="block text-[10px] font-medium text-gray-500 mb-1">City</label>
          <input
            type="text"
            value={entry.city}
            onChange={(e) => updateField("city", e.target.value)}
            placeholder="Barcelona"
            className="w-full border border-gray-200 rounded px-2 py-1 text-xs text-gray-800 focus:outline-none focus:border-blue-400 transition-colors"
          />
        </div>
        <div>
          <label className="block text-[10px] font-medium text-gray-500 mb-1">Start Date</label>
          <input
            type="text"
            value={entry.startDate}
            onChange={(e) => updateField("startDate", e.target.value)}
            placeholder="January 2022"
            className="w-full border border-gray-200 rounded px-2 py-1 text-xs text-gray-800 focus:outline-none focus:border-blue-400 transition-colors"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <label className="flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer">
          <input
            type="checkbox"
            checked={entry.current}
            onChange={(e) => updateField("current", e.target.checked)}
            className="rounded border-gray-300"
          />
          Current job
        </label>
        {!entry.current && (
          <div className="flex-1">
            <input
              type="text"
              value={entry.endDate}
              onChange={(e) => updateField("endDate", e.target.value)}
              placeholder="December 2023"
              className="w-full border border-gray-200 rounded px-2 py-1 text-xs text-gray-800 focus:outline-none focus:border-blue-400 transition-colors"
            />
          </div>
        )}
      </div>

      <div>
        <label className="block text-[10px] font-medium text-gray-500 mb-1.5">Achievements / Responsibilities</label>
        <div className="space-y-1.5">
          {entry.bullets.map((bullet, i) => (
            <BulletInput
              key={i}
              value={bullet}
              onChange={(v) => updateBullet(i, v)}
              onRemove={() => removeBullet(i)}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={addBullet}
          className="mt-2 text-xs text-blue-500 hover:text-blue-700 font-medium"
        >
          + Add bullet
        </button>
      </div>
    </div>
  );
}

export function EmploymentEditor({ entries, onChange }: Props) {
  function addEntry() {
    onChange([
      ...entries,
      {
        id: crypto.randomUUID(),
        jobTitle: "",
        employer: "",
        city: "",
        startDate: "",
        endDate: "",
        current: false,
        bullets: [],
      },
    ]);
  }

  function updateEntry(id: string, updated: EmploymentEntry) {
    onChange(entries.map((e) => (e.id === id ? updated : e)));
  }

  function removeEntry(id: string) {
    onChange(entries.filter((e) => e.id !== id));
  }

  return (
    <CollapsibleSection title="Employment History">
      <div className="space-y-3">
        <SortableList
          items={entries}
          onReorder={onChange}
          renderItem={(entry) => (
            <EntryEditor
              entry={entry}
              onChange={(updated) => updateEntry(entry.id, updated)}
              onRemove={() => removeEntry(entry.id)}
            />
          )}
        />
        <button
          type="button"
          onClick={addEntry}
          className="w-full py-2 border border-dashed border-gray-300 rounded text-xs text-gray-500 hover:border-blue-400 hover:text-blue-500 transition-colors font-medium"
        >
          + Add job
        </button>
      </div>
    </CollapsibleSection>
  );
}
