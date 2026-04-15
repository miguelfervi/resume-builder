import { describe, it, expect } from "vitest";
import { createBlankResumeData, createDefaultResumeData } from "@/app/lib/default-data";

describe("createBlankResumeData", () => {
  it("returns empty strings for all personalDetails fields", () => {
    const data = createBlankResumeData();
    expect(data.personalDetails.fullName).toBe("");
    expect(data.personalDetails.jobTitle).toBe("");
    expect(data.personalDetails.email).toBe("");
    expect(data.personalDetails.phone).toBe("");
    expect(data.personalDetails.address).toBe("");
    expect(data.personalDetails.photoUrl).toBe("");
  });

  it("returns empty string for profile", () => {
    const data = createBlankResumeData();
    expect(data.profile).toBe("");
  });

  it("returns empty arrays for all list sections", () => {
    const data = createBlankResumeData();
    expect(data.employmentHistory).toEqual([]);
    expect(data.education).toEqual([]);
    expect(data.certifications).toEqual([]);
    expect(data.links).toEqual([]);
    expect(data.skills).toEqual([]);
    expect(data.languages).toEqual([]);
    expect(data.hobbies).toEqual([]);
  });

  it("returns independent objects on each call", () => {
    const a = createBlankResumeData();
    const b = createBlankResumeData();
    a.personalDetails.fullName = "Test";
    expect(b.personalDetails.fullName).toBe("");
  });
});

describe("createDefaultResumeData", () => {
  it("returns fictional placeholder — not real personal data", () => {
    const data = createDefaultResumeData();
    expect(data.personalDetails.email).toContain("example.com");
    expect(data.personalDetails.phone).toContain("555");
    expect(data.personalDetails.fullName).not.toBe("");
  });

  it("has pre-filled employment history", () => {
    const data = createDefaultResumeData();
    expect(data.employmentHistory.length).toBeGreaterThan(0);
  });

  it("each employment entry has a unique id", () => {
    const data = createDefaultResumeData();
    const ids = data.employmentHistory.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("each skill has level between 0 and 100", () => {
    const data = createDefaultResumeData();
    for (const skill of data.skills) {
      expect(skill.level).toBeGreaterThanOrEqual(0);
      expect(skill.level).toBeLessThanOrEqual(100);
    }
  });
});
