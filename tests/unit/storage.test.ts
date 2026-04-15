import { describe, it, expect, beforeEach } from "vitest";
import { loadAppState, saveAppState, clearAppState, createInitialAppState } from "@/app/lib/storage";
import { AppState, ResumeData } from "@/app/types/resume";
import { createBlankResumeData } from "@/app/lib/default-data";

const STATE_KEY = "resume-builder-state";
const LEGACY_KEY = "resume-builder-data";

beforeEach(() => {
  localStorage.clear();
});

describe("createInitialAppState", () => {
  it("creates a single blank resume", () => {
    const state = createInitialAppState();
    expect(state.resumes).toHaveLength(1);
    expect(state.activeResumeId).toBe(state.resumes[0].id);
  });

  it("resume starts with blank personal details", () => {
    const state = createInitialAppState();
    const resume = state.resumes[0];
    expect(resume.data.personalDetails.fullName).toBe("");
    expect(resume.data.personalDetails.email).toBe("");
  });

  it("resume starts with empty section arrays", () => {
    const state = createInitialAppState();
    const { data } = state.resumes[0];
    expect(data.employmentHistory).toEqual([]);
    expect(data.education).toEqual([]);
    expect(data.skills).toEqual([]);
  });

  it("defaults to classic template", () => {
    const state = createInitialAppState();
    expect(state.resumes[0].templateId).toBe("classic");
  });

  it("generates distinct ids on each call", () => {
    const a = createInitialAppState();
    const b = createInitialAppState();
    expect(a.resumes[0].id).not.toBe(b.resumes[0].id);
    expect(a.activeResumeId).not.toBe(b.activeResumeId);
  });
});

describe("saveAppState / loadAppState", () => {
  it("persists and restores state", () => {
    const state = createInitialAppState();
    state.resumes[0].data.personalDetails.fullName = "Jane Doe";
    saveAppState(state);

    const loaded = loadAppState();
    expect(loaded).not.toBeNull();
    expect(loaded!.resumes[0].data.personalDetails.fullName).toBe("Jane Doe");
  });

  it("loadAppState returns null when nothing is saved", () => {
    expect(loadAppState()).toBeNull();
  });

  it("saveAppState updates updatedAt on the active resume", () => {
    const state = createInitialAppState();
    const before = state.resumes[0].updatedAt;
    // Advance time slightly
    state.resumes[0].updatedAt = new Date(0).toISOString();
    saveAppState(state);

    const loaded = loadAppState()!;
    expect(loaded.resumes[0].updatedAt).not.toBe(new Date(0).toISOString());
    expect(before).toBeDefined();
  });

  it("loadAppState migrates missing fields from old data", () => {
    const partial: Partial<ResumeData> = {
      personalDetails: { fullName: "Old User", jobTitle: "", email: "", phone: "", address: "", photoUrl: "" },
      employmentHistory: [],
    };
    const legacyState: AppState = {
      activeResumeId: "abc",
      resumes: [{ id: "abc", name: "CV", templateId: "classic", data: partial as ResumeData, createdAt: "", updatedAt: "" }],
    };
    localStorage.setItem(STATE_KEY, JSON.stringify(legacyState));

    const loaded = loadAppState()!;
    // Missing fields are filled with empty defaults
    expect(loaded.resumes[0].data.education).toEqual([]);
    expect(loaded.resumes[0].data.certifications).toEqual([]);
    expect(loaded.resumes[0].data.links).toEqual([]);
  });
});

describe("legacy migration", () => {
  it("migrates single-resume legacy key to AppState", () => {
    const data: ResumeData = {
      ...createBlankResumeData(),
      personalDetails: { fullName: "Legacy User", jobTitle: "", email: "", phone: "", address: "", photoUrl: "" },
    };
    localStorage.setItem(LEGACY_KEY, JSON.stringify(data));

    const loaded = loadAppState();
    expect(loaded).not.toBeNull();
    expect(loaded!.resumes[0].data.personalDetails.fullName).toBe("Legacy User");
    // Legacy key should be removed after migration
    expect(localStorage.getItem(LEGACY_KEY)).toBeNull();
  });

  it("returns null if legacy key contains invalid JSON", () => {
    localStorage.setItem(LEGACY_KEY, "not-valid-json{{{");
    expect(loadAppState()).toBeNull();
  });
});

describe("clearAppState", () => {
  it("removes state from localStorage", () => {
    const state = createInitialAppState();
    saveAppState(state);
    expect(localStorage.getItem(STATE_KEY)).not.toBeNull();

    clearAppState();
    expect(localStorage.getItem(STATE_KEY)).toBeNull();
  });

  it("loadAppState returns null after clear", () => {
    const state = createInitialAppState();
    saveAppState(state);
    clearAppState();
    expect(loadAppState()).toBeNull();
  });
});
