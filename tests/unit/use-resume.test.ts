import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useResume } from "@/app/hooks/use-resume";

vi.mock("react", async () => await import("react"));

beforeEach(() => {
  localStorage.clear();
  vi.useFakeTimers();
});

afterEach(() => {
  vi.runAllTimers();
  vi.useRealTimers();
});

async function setup() {
  const hook = renderHook(() => useResume());
  await act(async () => { vi.runAllTimers(); });
  return hook;
}

// ---------------------------------------------------------------------------
describe("useResume — initial state", () => {
  it("starts with one resume named My Resume", async () => {
    const { result } = await setup();
    expect(result.current.resumes).toHaveLength(1);
    expect(result.current.resumes[0].name).toBe("My Resume");
  });

  it("isHydrated is true immediately", async () => {
    const { result } = await setup();
    expect(result.current.isHydrated).toBe(true);
  });

  it("active resume data is blank on fresh start", async () => {
    const { result } = await setup();
    expect(result.current.data.personalDetails.fullName).toBe("");
    expect(result.current.data.employmentHistory).toEqual([]);
  });

  it("default template is classic", async () => {
    const { result } = await setup();
    expect(result.current.templateId).toBe("classic");
  });

  it("canUndo and canRedo are false initially", async () => {
    const { result } = await setup();
    expect(result.current.canUndo).toBe(false);
    expect(result.current.canRedo).toBe(false);
  });
});

// ---------------------------------------------------------------------------
describe("useResume — setData", () => {
  it("updates the active resume data", async () => {
    const { result } = await setup();
    act(() => result.current.setData({ ...result.current.data, profile: "Hello" }));
    expect(result.current.data.profile).toBe("Hello");
  });

  it("does not affect other resumes", async () => {
    const { result } = await setup();
    const firstId = result.current.activeResume.id;
    act(() => result.current.createResume("B"));
    act(() => result.current.setData({ ...result.current.data, profile: "B profile" }));

    act(() => result.current.switchResume(firstId));
    expect(result.current.data.profile).toBe("");
  });
});

// ---------------------------------------------------------------------------
describe("useResume — setTemplateId", () => {
  it("updates the active resume template", async () => {
    const { result } = await setup();
    act(() => result.current.setTemplateId("modern"));
    expect(result.current.templateId).toBe("modern");
  });

  it("does not affect other resumes", async () => {
    const { result } = await setup();
    const firstId = result.current.activeResume.id;
    act(() => result.current.createResume("B"));
    act(() => result.current.setTemplateId("minimal"));

    act(() => result.current.switchResume(firstId));
    expect(result.current.templateId).toBe("classic");
  });
});

// ---------------------------------------------------------------------------
describe("useResume — createResume", () => {
  it("adds a new resume and makes it active", async () => {
    const { result } = await setup();
    act(() => result.current.createResume("New CV"));
    expect(result.current.resumes).toHaveLength(2);
    expect(result.current.activeResume.name).toBe("New CV");
  });

  it("uses default name 'New Resume' when no name given", async () => {
    const { result } = await setup();
    act(() => result.current.createResume());
    expect(result.current.activeResume.name).toBe("New Resume");
  });

  it("new resume comes with default sample data", async () => {
    const { result } = await setup();
    act(() => result.current.createResume());
    expect(result.current.data.personalDetails.fullName).toBe("Alex Johnson");
  });

  it("new resume defaults to classic template", async () => {
    const { result } = await setup();
    act(() => result.current.setTemplateId("modern")); // change active first
    act(() => result.current.createResume());
    expect(result.current.templateId).toBe("classic");
  });
});

// ---------------------------------------------------------------------------
describe("useResume — switchResume", () => {
  it("changes the active resume", async () => {
    const { result } = await setup();
    const firstId = result.current.activeResume.id;
    act(() => result.current.createResume("B"));

    act(() => result.current.switchResume(firstId));
    expect(result.current.activeResume.id).toBe(firstId);
  });
});

// ---------------------------------------------------------------------------
describe("useResume — duplicateResume", () => {
  it("creates a copy with '(copy)' in the name", async () => {
    const { result } = await setup();
    act(() => result.current.duplicateResume(result.current.activeResume.id));
    expect(result.current.resumes).toHaveLength(2);
    expect(result.current.resumes[1].name).toContain("(copy)");
  });

  it("copy becomes the active resume", async () => {
    const { result } = await setup();
    const origId = result.current.activeResume.id;
    act(() => result.current.duplicateResume(origId));
    expect(result.current.activeResume.id).not.toBe(origId);
  });

  it("copy has the same data as the original", async () => {
    const { result } = await setup();
    act(() => result.current.setData({ ...result.current.data, profile: "My profile" }));
    act(() => result.current.duplicateResume(result.current.activeResume.id));
    expect(result.current.data.profile).toBe("My profile");
  });

  it("does nothing for an unknown id", async () => {
    const { result } = await setup();
    act(() => result.current.duplicateResume("unknown-id"));
    expect(result.current.resumes).toHaveLength(1);
  });
});

// ---------------------------------------------------------------------------
describe("useResume — deleteResume", () => {
  it("removes the resume from the list", async () => {
    const { result } = await setup();
    act(() => result.current.createResume("B"));
    const bId = result.current.activeResume.id;

    act(() => result.current.deleteResume(bId));
    expect(result.current.resumes).toHaveLength(1);
    expect(result.current.resumes.find((r) => r.id === bId)).toBeUndefined();
  });

  it("switches active when the active resume is deleted", async () => {
    const { result } = await setup();
    const firstId = result.current.activeResume.id;
    act(() => result.current.createResume("B"));
    act(() => result.current.switchResume(firstId));

    act(() => result.current.deleteResume(firstId));
    expect(result.current.activeResume.id).not.toBe(firstId);
  });

  it("deleting the last resume resets to a fresh blank resume", async () => {
    const { result } = await setup();
    const id = result.current.activeResume.id;
    act(() => result.current.deleteResume(id));

    expect(result.current.resumes).toHaveLength(1);
    expect(result.current.activeResume.id).not.toBe(id);
    expect(result.current.data.personalDetails.fullName).toBe("");
  });
});

// ---------------------------------------------------------------------------
describe("useResume — renameResume", () => {
  it("updates the resume name", async () => {
    const { result } = await setup();
    act(() => result.current.renameResume(result.current.activeResume.id, "Awesome CV"));
    expect(result.current.activeResume.name).toBe("Awesome CV");
  });

  it("does not rename other resumes", async () => {
    const { result } = await setup();
    const firstId = result.current.activeResume.id;
    act(() => result.current.createResume("B"));
    act(() => result.current.renameResume(firstId, "Renamed A"));

    const a = result.current.resumes.find((r) => r.id === firstId)!;
    expect(a.name).toBe("Renamed A");
    expect(result.current.activeResume.name).toBe("B");
  });
});

// ---------------------------------------------------------------------------
describe("useResume — resetData", () => {
  it("resets to one blank resume and clears localStorage", async () => {
    const { result } = await setup();
    act(() => result.current.createResume("B"));
    expect(result.current.resumes).toHaveLength(2);

    act(() => result.current.resetData());

    expect(result.current.resumes).toHaveLength(1);
    expect(result.current.data.personalDetails.fullName).toBe("");
    expect(localStorage.getItem("resume-builder-state")).toBeNull();
  });

  it("clears undo history", async () => {
    const { result } = await setup();
    act(() => result.current.setData({ ...result.current.data, profile: "test" }));
    act(() => vi.advanceTimersByTime(700)); // trigger debounce snapshot
    expect(result.current.canUndo).toBe(true);

    act(() => result.current.resetData());
    expect(result.current.canUndo).toBe(false);
  });
});

// ---------------------------------------------------------------------------
describe("useResume — undo / redo", () => {
  it("canUndo becomes true after a debounce snapshot", async () => {
    const { result } = await setup();
    act(() => result.current.setData({ ...result.current.data, profile: "v1" }));
    act(() => vi.advanceTimersByTime(700));
    expect(result.current.canUndo).toBe(true);
  });

  it("undo reverts to the last snapshot", async () => {
    const { result } = await setup();
    act(() => result.current.setData({ ...result.current.data, profile: "v1" }));
    act(() => vi.advanceTimersByTime(700));
    act(() => result.current.setData({ ...result.current.data, profile: "v2" }));

    act(() => result.current.undo());
    expect(result.current.data.profile).toBe("v1");
  });

  it("redo re-applies the undone change", async () => {
    const { result } = await setup();
    act(() => result.current.setData({ ...result.current.data, profile: "v1" }));
    act(() => vi.advanceTimersByTime(700));
    act(() => result.current.setData({ ...result.current.data, profile: "v2" }));
    act(() => result.current.undo());
    act(() => result.current.redo());
    expect(result.current.data.profile).toBe("v2");
  });
});
