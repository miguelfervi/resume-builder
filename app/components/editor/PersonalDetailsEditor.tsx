"use client";

import { PersonalDetails } from "@/app/types/resume";
import { CollapsibleSection } from "./CollapsibleSection";
import { PhotoUpload } from "./PhotoUpload";

interface Props {
  data: PersonalDetails;
  onChange: (data: PersonalDetails) => void;
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm text-gray-800 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition-colors"
      />
    </div>
  );
}

export function PersonalDetailsEditor({ data, onChange }: Props) {
  function update(key: keyof PersonalDetails, value: string) {
    onChange({ ...data, [key]: value });
  }

  return (
    <CollapsibleSection title="Personal Details">
      <PhotoUpload
        photoUrl={data.photoUrl}
        onChange={(url) => update("photoUrl", url)}
      />
      <Field label="Full Name" value={data.fullName} onChange={(v) => update("fullName", v)} placeholder="Your name" />
      <Field label="Job Title" value={data.jobTitle} onChange={(v) => update("jobTitle", v)} placeholder="Senior Front-End Engineer" />
      <Field label="Email" value={data.email} onChange={(v) => update("email", v)} placeholder="you@email.com" />
      <Field label="Phone" value={data.phone} onChange={(v) => update("phone", v)} placeholder="+34 600 000 000" />
      <Field label="Location" value={data.address} onChange={(v) => update("address", v)} placeholder="Barcelona, Spain" />
    </CollapsibleSection>
  );
}
