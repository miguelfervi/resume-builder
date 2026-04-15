"use client";

import { CollapsibleSection } from "./CollapsibleSection";

interface Props {
  hobbies: string[];
  onChange: (hobbies: string[]) => void;
}

export function HobbiesEditor({ hobbies, onChange }: Props) {
  function addHobby() {
    onChange([...hobbies, ""]);
  }

  function updateHobby(index: number, value: string) {
    const updated = [...hobbies];
    updated[index] = value;
    onChange(updated);
  }

  function removeHobby(index: number) {
    onChange(hobbies.filter((_, i) => i !== index));
  }

  return (
    <CollapsibleSection title="Hobbies">
      <div className="space-y-2">
        {hobbies.map((hobby, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              type="text"
              value={hobby}
              onChange={(e) => updateHobby(i, e.target.value)}
              placeholder="Music, Travel, etc."
              className="flex-1 border border-gray-200 rounded px-2 py-1.5 text-xs text-gray-800 focus:outline-none focus:border-blue-400 transition-colors"
            />
            <button
              type="button"
              onClick={() => removeHobby(i)}
              className="text-gray-300 hover:text-red-400 transition-colors flex-shrink-0"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addHobby}
          className="w-full py-2 border border-dashed border-gray-300 rounded text-xs text-gray-500 hover:border-blue-400 hover:text-blue-500 transition-colors font-medium"
        >
          + Add hobby
        </button>
      </div>
    </CollapsibleSection>
  );
}
