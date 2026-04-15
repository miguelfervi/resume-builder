"use client";

import { LinkEntry } from "@/app/types/resume";
import { CollapsibleSection } from "./CollapsibleSection";
import { SortableList } from "./SortableList";

interface Props {
  links: LinkEntry[];
  onChange: (links: LinkEntry[]) => void;
}

export function LinksEditor({ links, onChange }: Props) {
  function addLink() {
    onChange([...links, { id: crypto.randomUUID(), label: "", url: "" }]);
  }

  function updateLink(id: string, updates: Partial<LinkEntry>) {
    onChange(links.map((l) => (l.id === id ? { ...l, ...updates } : l)));
  }

  function removeLink(id: string) {
    onChange(links.filter((l) => l.id !== id));
  }

  return (
    <CollapsibleSection title="Links" defaultOpen={false}>
      <SortableList
        items={links}
        onReorder={onChange}
        renderItem={(link) => (
          <div className="flex items-center gap-2">
            <input type="text" value={link.label} onChange={(e) => updateLink(link.id, { label: e.target.value })}
              placeholder="LinkedIn" className="w-24 flex-shrink-0 border border-gray-200 rounded px-2 py-1.5 text-xs text-gray-800 focus:outline-none focus:border-blue-400 transition-colors" />
            <input type="url" value={link.url} onChange={(e) => updateLink(link.id, { url: e.target.value })}
              placeholder="https://..." className="flex-1 border border-gray-200 rounded px-2 py-1.5 text-xs text-gray-800 focus:outline-none focus:border-blue-400 transition-colors" />
            <button type="button" onClick={() => removeLink(link.id)} className="text-gray-300 hover:text-red-400 transition-colors flex-shrink-0">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
      />
      <button type="button" onClick={addLink}
        className="w-full py-2 border border-dashed border-gray-300 rounded text-xs text-gray-500 hover:border-blue-400 hover:text-blue-500 transition-colors font-medium">
        + Add link
      </button>
    </CollapsibleSection>
  );
}
