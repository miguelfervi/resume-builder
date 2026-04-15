import { ResumeData } from "@/app/types/resume";

const STORAGE_KEY = "resume-builder-data";

export function loadResumeData(): ResumeData | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as ResumeData;
  } catch {
    return null;
  }
}

export function saveResumeData(data: ResumeData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function clearResumeData(): void {
  localStorage.removeItem(STORAGE_KEY);
}
