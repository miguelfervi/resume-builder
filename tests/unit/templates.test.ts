import { describe, it, expect } from "vitest";
import { TEMPLATES, getTemplate } from "@/app/lib/templates";

describe("TEMPLATES", () => {
  it("exports exactly 3 templates", () => {
    expect(TEMPLATES).toHaveLength(3);
  });

  it("each template has required fields", () => {
    for (const t of TEMPLATES) {
      expect(t.id).toBeTruthy();
      expect(t.name).toBeTruthy();
      expect(t.sidebarColor).toMatch(/^#/);
      expect(t.sidebarTextColor).toMatch(/^#/);
      expect(t.accentColor).toMatch(/^#/);
      expect(["sidebar-right", "sidebar-left", "single-column"]).toContain(t.layout);
    }
  });

  it("includes classic, modern and minimal templates", () => {
    const ids = TEMPLATES.map((t) => t.id);
    expect(ids).toContain("classic");
    expect(ids).toContain("modern");
    expect(ids).toContain("minimal");
  });

  it("classic has sidebar-right layout", () => {
    const t = TEMPLATES.find((t) => t.id === "classic")!;
    expect(t.layout).toBe("sidebar-right");
  });

  it("modern has sidebar-left layout", () => {
    const t = TEMPLATES.find((t) => t.id === "modern")!;
    expect(t.layout).toBe("sidebar-left");
  });

  it("minimal has single-column layout", () => {
    const t = TEMPLATES.find((t) => t.id === "minimal")!;
    expect(t.layout).toBe("single-column");
  });
});

describe("getTemplate", () => {
  it("returns the correct template by id", () => {
    expect(getTemplate("classic").id).toBe("classic");
    expect(getTemplate("modern").id).toBe("modern");
    expect(getTemplate("minimal").id).toBe("minimal");
  });

  it("falls back to the first template for unknown id", () => {
    const fallback = getTemplate("unknown-id");
    expect(fallback.id).toBe(TEMPLATES[0].id);
  });

  it("falls back to the first template for empty string", () => {
    const fallback = getTemplate("");
    expect(fallback.id).toBe(TEMPLATES[0].id);
  });
});
