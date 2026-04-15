"use client";

import { CollapsibleSection } from "./CollapsibleSection";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export function ProfileEditor({ value, onChange }: Props) {
  return (
    <CollapsibleSection title="Profile">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Write a professional summary..."
        rows={5}
        className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm text-gray-800 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition-colors resize-y"
      />
    </CollapsibleSection>
  );
}
