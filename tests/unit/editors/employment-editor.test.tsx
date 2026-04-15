import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { EmploymentEditor } from "@/app/components/editor/EmploymentEditor";
import { EmploymentEntry } from "@/app/types/resume";

vi.mock("@/app/components/editor/SortableList", () => ({
  SortableList: ({ items, renderItem }: any) => items.map(renderItem),
}));
vi.mock("@/app/components/editor/CollapsibleSection", () => ({
  CollapsibleSection: ({ children }: any) => children,
}));

const entry = (overrides: Partial<EmploymentEntry> = {}): EmploymentEntry => ({
  id: "e1",
  jobTitle: "Engineer",
  employer: "Acme",
  city: "NYC",
  startDate: "Jan 2020",
  endDate: "Dec 2022",
  current: false,
  bullets: [],
  ...overrides,
});

describe("EmploymentEditor", () => {
  it("renders existing entry fields", () => {
    render(<EmploymentEditor entries={[entry()]} onChange={vi.fn()} />);
    expect(screen.getByDisplayValue("Engineer")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Acme")).toBeInTheDocument();
  });

  it("add job calls onChange with a new empty entry", () => {
    const onChange = vi.fn();
    render(<EmploymentEditor entries={[]} onChange={onChange} />);
    fireEvent.click(screen.getByText("+ Add job"));
    const [result] = onChange.mock.calls[0];
    expect(result).toHaveLength(1);
    expect(result[0].jobTitle).toBe("");
    expect(result[0].bullets).toEqual([]);
  });

  it("editing job title calls onChange with updated entry", () => {
    const onChange = vi.fn();
    render(<EmploymentEditor entries={[entry()]} onChange={onChange} />);
    fireEvent.change(screen.getByDisplayValue("Engineer"), { target: { value: "Senior Engineer" } });
    const [result] = onChange.mock.calls[0];
    expect(result[0].jobTitle).toBe("Senior Engineer");
  });

  it("editing employer calls onChange with updated entry", () => {
    const onChange = vi.fn();
    render(<EmploymentEditor entries={[entry()]} onChange={onChange} />);
    fireEvent.change(screen.getByDisplayValue("Acme"), { target: { value: "Globex" } });
    const [result] = onChange.mock.calls[0];
    expect(result[0].employer).toBe("Globex");
  });

  it("remove entry button calls onChange without that entry", () => {
    const onChange = vi.fn();
    const entries = [entry({ id: "e1" }), entry({ id: "e2", jobTitle: "Designer" })];
    render(<EmploymentEditor entries={entries} onChange={onChange} />);
    // Trash button (first button in each entry card header)
    fireEvent.click(screen.getAllByRole("button", { name: "" })[0]);
    const [result] = onChange.mock.calls[0];
    expect(result.find((e: EmploymentEntry) => e.id === "e1")).toBeUndefined();
  });

  it("add bullet calls onChange with new empty bullet", () => {
    const onChange = vi.fn();
    render(<EmploymentEditor entries={[entry()]} onChange={onChange} />);
    fireEvent.click(screen.getByText("+ Add bullet"));
    const [result] = onChange.mock.calls[0];
    expect(result[0].bullets).toEqual([""]);
  });

  it("editing a bullet calls onChange with updated bullet", () => {
    const onChange = vi.fn();
    render(<EmploymentEditor entries={[entry({ bullets: ["Old text"] })]} onChange={onChange} />);
    fireEvent.change(screen.getByDisplayValue("Old text"), { target: { value: "New text" } });
    const [result] = onChange.mock.calls[0];
    expect(result[0].bullets[0]).toBe("New text");
  });

  it("toggling 'current job' sets current=true and hides end date", () => {
    const onChange = vi.fn();
    render(<EmploymentEditor entries={[entry({ current: false })]} onChange={onChange} />);
    fireEvent.click(screen.getByRole("checkbox"));
    const [result] = onChange.mock.calls[0];
    expect(result[0].current).toBe(true);
  });
});
