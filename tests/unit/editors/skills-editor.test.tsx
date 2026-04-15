import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SkillsEditor } from "@/app/components/editor/SkillsEditor";
import { Skill } from "@/app/types/resume";

vi.mock("@/app/components/editor/SortableList", () => ({
  SortableList: ({ items, renderItem }: any) => items.map(renderItem),
}));
vi.mock("@/app/components/editor/CollapsibleSection", () => ({
  CollapsibleSection: ({ children }: any) => children,
}));

const skill = (overrides: Partial<Skill> = {}): Skill => ({
  id: "s1", name: "React", level: 80, ...overrides,
});

describe("SkillsEditor", () => {
  it("renders skill name and level", () => {
    render(<SkillsEditor skills={[skill()]} onChange={vi.fn()} />);
    expect(screen.getByDisplayValue("React")).toBeInTheDocument();
    expect(screen.getByRole("slider")).toHaveValue("80");
  });

  it("renders multiple skills", () => {
    const skills = [skill({ id: "s1", name: "React" }), skill({ id: "s2", name: "Vue" })];
    render(<SkillsEditor skills={skills} onChange={vi.fn()} />);
    expect(screen.getByDisplayValue("React")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Vue")).toBeInTheDocument();
  });

  it("add skill calls onChange with a new entry at level 75", () => {
    const onChange = vi.fn();
    render(<SkillsEditor skills={[]} onChange={onChange} />);
    fireEvent.click(screen.getByText("+ Add skill"));
    const [result] = onChange.mock.calls[0];
    expect(result).toHaveLength(1);
    expect(result[0].level).toBe(75);
    expect(result[0].name).toBe("");
  });

  it("editing name calls onChange with updated skill", () => {
    const onChange = vi.fn();
    render(<SkillsEditor skills={[skill()]} onChange={onChange} />);
    fireEvent.change(screen.getByDisplayValue("React"), { target: { value: "Vue" } });
    expect(onChange).toHaveBeenCalledWith([{ id: "s1", name: "Vue", level: 80 }]);
  });

  it("editing level calls onChange with updated level", () => {
    const onChange = vi.fn();
    render(<SkillsEditor skills={[skill()]} onChange={onChange} />);
    fireEvent.change(screen.getByRole("slider"), { target: { value: "50" } });
    expect(onChange).toHaveBeenCalledWith([{ id: "s1", name: "React", level: 50 }]);
  });

  it("remove button calls onChange without that skill", () => {
    const onChange = vi.fn();
    const skills = [skill({ id: "s1", name: "React" }), skill({ id: "s2", name: "Vue" })];
    render(<SkillsEditor skills={skills} onChange={onChange} />);
    fireEvent.click(screen.getAllByRole("button")[0]);
    const [result] = onChange.mock.calls[0];
    expect(result.find((s: Skill) => s.id === "s1")).toBeUndefined();
    expect(result.find((s: Skill) => s.id === "s2")).toBeDefined();
  });

  it("renders the percentage label", () => {
    render(<SkillsEditor skills={[skill({ level: 90 })]} onChange={vi.fn()} />);
    expect(screen.getByText("90%")).toBeInTheDocument();
  });
});
