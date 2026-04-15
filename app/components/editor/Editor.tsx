"use client";

import { ResumeData } from "@/app/types/resume";
import { PersonalDetailsEditor } from "./PersonalDetailsEditor";
import { ProfileEditor } from "./ProfileEditor";
import { EmploymentEditor } from "./EmploymentEditor";
import { SkillsEditor } from "./SkillsEditor";
import { LanguagesEditor } from "./LanguagesEditor";
import { HobbiesEditor } from "./HobbiesEditor";

interface Props {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
  onReset: () => void;
}

export function Editor({ data, onChange, onReset }: Props) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-base font-bold text-gray-900">Resume Builder</h1>
        <button
          type="button"
          onClick={() => {
            if (confirm("Reset all data?")) onReset();
          }}
          className="text-xs text-gray-400 hover:text-red-500 transition-colors"
        >
          Reset
        </button>
      </div>

      <PersonalDetailsEditor
        data={data.personalDetails}
        onChange={(personalDetails) => onChange({ ...data, personalDetails })}
      />

      <ProfileEditor
        value={data.profile}
        onChange={(profile) => onChange({ ...data, profile })}
      />

      <EmploymentEditor
        entries={data.employmentHistory}
        onChange={(employmentHistory) => onChange({ ...data, employmentHistory })}
      />

      <SkillsEditor
        skills={data.skills}
        onChange={(skills) => onChange({ ...data, skills })}
      />

      <LanguagesEditor
        languages={data.languages}
        onChange={(languages) => onChange({ ...data, languages })}
      />

      <HobbiesEditor
        hobbies={data.hobbies}
        onChange={(hobbies) => onChange({ ...data, hobbies })}
      />
    </div>
  );
}
