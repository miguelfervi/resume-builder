import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { EducationEditor } from "@/app/components/editor/EducationEditor";
import { EducationEntry } from "@/app/types/resume";

vi.mock("@/app/components/editor/SortableList", () => ({
  SortableList: ({ items, renderItem }: any) => items.map(renderItem),
}));
vi.mock("@/app/components/editor/CollapsibleSection", () => ({
  CollapsibleSection: ({ children }: any) => children,
}));

const entry = (overrides: Partial<EducationEntry> = {}): EducationEntry => ({
  id: "edu-1",
  degree: "B.Sc. Computer Science",
  school: "State University",
  city: "Austin",
  startDate: "Sep 2018",
  endDate: "Jun 2022",
  description: "",
  ...overrides,
});

describe("EducationEditor", () => {
  it("renders existing entry fields", () => {
    render(<EducationEditor entries={[entry()]} onChange={vi.fn()} />);
    expect(screen.getByDisplayValue("B.Sc. Computer Science")).toBeInTheDocument();
    expect(screen.getByDisplayValue("State University")).toBeInTheDocument();
  });

  it("add education calls onChange with a new empty entry", () => {
    const onChange = vi.fn();
    render(<EducationEditor entries={[]} onChange={onChange} />);
    fireEvent.click(screen.getByText("+ Add education"));
    const [result] = onChange.mock.calls[0];
    expect(result).toHaveLength(1);
    expect(result[0].degree).toBe("");
    expect(result[0].school).toBe("");
  });

  it("editing degree calls onChange with updated entry", () => {
    const onChange = vi.fn();
    render(<EducationEditor entries={[entry()]} onChange={onChange} />);
    fireEvent.change(screen.getByDisplayValue("B.Sc. Computer Science"), { target: { value: "M.Sc. AI" } });
    const [result] = onChange.mock.calls[0];
    expect(result[0].degree).toBe("M.Sc. AI");
  });

  it("editing school calls onChange with updated entry", () => {
    const onChange = vi.fn();
    render(<EducationEditor entries={[entry()]} onChange={onChange} />);
    fireEvent.change(screen.getByDisplayValue("State University"), { target: { value: "MIT" } });
    const [result] = onChange.mock.calls[0];
    expect(result[0].school).toBe("MIT");
  });

  it("remove button calls onChange without that entry", () => {
    const onChange = vi.fn();
    const entries = [entry({ id: "edu-1" }), entry({ id: "edu-2", degree: "MBA" })];
    render(<EducationEditor entries={entries} onChange={onChange} />);
    fireEvent.click(screen.getAllByRole("button")[0]);
    const [result] = onChange.mock.calls[0];
    expect(result.find((e: EducationEntry) => e.id === "edu-1")).toBeUndefined();
    expect(result.find((e: EducationEntry) => e.id === "edu-2")).toBeDefined();
  });

  it("other fields are preserved when one is updated", () => {
    const onChange = vi.fn();
    render(<EducationEditor entries={[entry()]} onChange={onChange} />);
    fireEvent.change(screen.getByDisplayValue("B.Sc. Computer Science"), { target: { value: "MBA" } });
    const [result] = onChange.mock.calls[0];
    expect(result[0].school).toBe("State University");
    expect(result[0].city).toBe("Austin");
  });
});
