import { ResumeData, AppState, SavedResume } from "@/app/types/resume";
import { createBlankResumeData } from "./default-data";

const STATE_KEY = "resume-builder-state";
const LEGACY_KEY = "resume-builder-data";

// Fill missing fields from older saved data
function migrateResumeData(raw: Partial<ResumeData>): ResumeData {
  const blank = createBlankResumeData();
  return {
    personalDetails: raw.personalDetails ?? blank.personalDetails,
    profile: raw.profile ?? blank.profile,
    employmentHistory: raw.employmentHistory ?? [],
    education: raw.education ?? [],
    certifications: raw.certifications ?? [],
    links: raw.links ?? [],
    skills: raw.skills ?? [],
    languages: raw.languages ?? [],
    hobbies: raw.hobbies ?? [],
  };
}

function makeSavedResume(data: ResumeData, name = "My Resume"): SavedResume {
  const now = new Date().toISOString();
  return { id: crypto.randomUUID(), name, templateId: "classic", data, createdAt: now, updatedAt: now };
}

function migrateFromLegacy(): AppState | null {
  const raw = localStorage.getItem(LEGACY_KEY);
  if (!raw) return null;
  try {
    const data = migrateResumeData(JSON.parse(raw) as Partial<ResumeData>);
    localStorage.removeItem(LEGACY_KEY);
    const resume = makeSavedResume(data);
    return { activeResumeId: resume.id, resumes: [resume] };
  } catch {
    return null;
  }
}

export function loadAppState(): AppState | null {
  if (typeof window === "undefined") return null;

  const raw = localStorage.getItem(STATE_KEY);
  if (raw) {
    try {
      const state = JSON.parse(raw) as AppState;
      // Migrate resume data fields in each saved resume
      state.resumes = state.resumes.map((r) => ({
        ...r,
        data: migrateResumeData(r.data),
      }));
      return state;
    } catch {
      return null;
    }
  }

  // Try legacy single-resume key
  return migrateFromLegacy();
}

export function saveAppState(state: AppState): void {
  const updated: AppState = {
    ...state,
    resumes: state.resumes.map((r) =>
      r.id === state.activeResumeId
        ? { ...r, updatedAt: new Date().toISOString() }
        : r
    ),
  };
  localStorage.setItem(STATE_KEY, JSON.stringify(updated));
}

export function clearAppState(): void {
  localStorage.removeItem(STATE_KEY);
}

export function createInitialAppState(): AppState {
  const resume = makeSavedResume(createBlankResumeData());
  return { activeResumeId: resume.id, resumes: [resume] };
}
