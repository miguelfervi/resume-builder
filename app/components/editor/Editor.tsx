"use client";

import { ResumeData, SavedResume } from "@/app/types/resume";
import { PersonalDetailsEditor } from "./PersonalDetailsEditor";
import { ProfileEditor } from "./ProfileEditor";
import { EmploymentEditor } from "./EmploymentEditor";
import { EducationEditor } from "./EducationEditor";
import { CertificationsEditor } from "./CertificationsEditor";
import { LinksEditor } from "./LinksEditor";
import { SkillsEditor } from "./SkillsEditor";
import { LanguagesEditor } from "./LanguagesEditor";
import { HobbiesEditor } from "./HobbiesEditor";
import { ResumeSelector } from "./ResumeSelector";
import { TemplateSelector } from "./TemplateSelector";

interface Props {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
  onReset: () => void;
  templateId: string;
  onTemplateChange: (id: string) => void;
  resumes: SavedResume[];
  activeId: string;
  onSwitch: (id: string) => void;
  onCreate: () => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onRename: (id: string, name: string) => void;
  onImport: (data: ResumeData, name: string) => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
}

export function Editor({
  data, onChange, onReset,
  templateId, onTemplateChange,
  resumes, activeId, onSwitch, onCreate, onDuplicate, onDelete, onRename, onImport,
  canUndo, canRedo, onUndo, onRedo,
}: Props) {
  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-base font-bold text-gray-900">Resume Builder</h1>
        <div className="flex items-center gap-2">
          {/* Undo/Redo */}
          <button type="button" onClick={onUndo} disabled={!canUndo} title="Undo (Ctrl+Z)"
            className="p-1.5 rounded text-gray-400 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors hover:bg-gray-100">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
            </svg>
          </button>
          <button type="button" onClick={onRedo} disabled={!canRedo} title="Redo (Ctrl+Shift+Z)"
            className="p-1.5 rounded text-gray-400 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors hover:bg-gray-100">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 10H11a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6" />
            </svg>
          </button>
          <button type="button" onClick={() => { if (confirm("Reset all data?")) onReset(); }}
            className="text-xs text-gray-400 hover:text-red-500 transition-colors ml-1">
            Reset
          </button>
        </div>
      </div>

      {/* Resume selector */}
      <ResumeSelector
        resumes={resumes} activeId={activeId}
        onSwitch={onSwitch} onCreate={onCreate}
        onDuplicate={onDuplicate} onDelete={onDelete} onRename={onRename}
        onImport={onImport}
      />

      {/* Template selector */}
      <TemplateSelector templateId={templateId} onChange={onTemplateChange} />

      <div className="border-t border-gray-100 pt-3 space-y-3">
        <PersonalDetailsEditor data={data.personalDetails} onChange={(personalDetails) => onChange({ ...data, personalDetails })} />
        <ProfileEditor value={data.profile} onChange={(profile) => onChange({ ...data, profile })} />
        <EmploymentEditor entries={data.employmentHistory} onChange={(employmentHistory) => onChange({ ...data, employmentHistory })} />
        <EducationEditor entries={data.education} onChange={(education) => onChange({ ...data, education })} />
        <CertificationsEditor certifications={data.certifications} onChange={(certifications) => onChange({ ...data, certifications })} />
        <LinksEditor links={data.links} onChange={(links) => onChange({ ...data, links })} />
        <SkillsEditor skills={data.skills} onChange={(skills) => onChange({ ...data, skills })} />
        <LanguagesEditor languages={data.languages} onChange={(languages) => onChange({ ...data, languages })} />
        <HobbiesEditor hobbies={data.hobbies} onChange={(hobbies) => onChange({ ...data, hobbies })} />
      </div>
    </div>
  );
}
