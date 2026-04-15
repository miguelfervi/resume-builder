"use client";

import { CertificationEntry } from "@/app/types/resume";
import { CollapsibleSection } from "./CollapsibleSection";
import { SortableList } from "./SortableList";

interface Props {
  certifications: CertificationEntry[];
  onChange: (certifications: CertificationEntry[]) => void;
}

function EntryEditor({ entry, onChange, onRemove }: { entry: CertificationEntry; onChange: (e: CertificationEntry) => void; onRemove: () => void }) {
  function update<K extends keyof CertificationEntry>(key: K, value: CertificationEntry[K]) {
    onChange({ ...entry, [key]: value });
  }

  return (
    <div className="border border-gray-100 rounded-lg p-3 space-y-2 bg-white">
      <div className="flex justify-between items-center">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Certificate</span>
        <button type="button" onClick={onRemove} className="text-gray-300 hover:text-red-400 transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
      <div>
        <label className="block text-[10px] font-medium text-gray-500 mb-1">Name</label>
        <input type="text" value={entry.name} onChange={(e) => update("name", e.target.value)} placeholder="AWS Solutions Architect"
          className="w-full border border-gray-200 rounded px-2 py-1 text-xs text-gray-800 focus:outline-none focus:border-blue-400 transition-colors" />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-[10px] font-medium text-gray-500 mb-1">Issuer</label>
          <input type="text" value={entry.issuer} onChange={(e) => update("issuer", e.target.value)} placeholder="Amazon"
            className="w-full border border-gray-200 rounded px-2 py-1 text-xs text-gray-800 focus:outline-none focus:border-blue-400 transition-colors" />
        </div>
        <div>
          <label className="block text-[10px] font-medium text-gray-500 mb-1">Date</label>
          <input type="text" value={entry.date} onChange={(e) => update("date", e.target.value)} placeholder="March 2024"
            className="w-full border border-gray-200 rounded px-2 py-1 text-xs text-gray-800 focus:outline-none focus:border-blue-400 transition-colors" />
        </div>
      </div>
    </div>
  );
}

export function CertificationsEditor({ certifications, onChange }: Props) {
  function addEntry() {
    onChange([...certifications, { id: crypto.randomUUID(), name: "", issuer: "", date: "" }]);
  }

  return (
    <CollapsibleSection title="Certifications" defaultOpen={false}>
      <SortableList
        items={certifications}
        onReorder={onChange}
        renderItem={(entry) => (
          <EntryEditor
            entry={entry}
            onChange={(updated) => onChange(certifications.map((c) => (c.id === updated.id ? updated : c)))}
            onRemove={() => onChange(certifications.filter((c) => c.id !== entry.id))}
          />
        )}
      />
      <button type="button" onClick={addEntry}
        className="w-full py-2 border border-dashed border-gray-300 rounded text-xs text-gray-500 hover:border-blue-400 hover:text-blue-500 transition-colors font-medium">
        + Add certification
      </button>
    </CollapsibleSection>
  );
}
