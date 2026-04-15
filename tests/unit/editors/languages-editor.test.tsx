import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { LanguagesEditor } from "@/app/components/editor/LanguagesEditor";
import { Language } from "@/app/types/resume";

vi.mock("@/app/components/editor/SortableList", () => ({
  SortableList: ({ items, renderItem }: any) => items.map(renderItem),
}));
vi.mock("@/app/components/editor/CollapsibleSection", () => ({
  CollapsibleSection: ({ children }: any) => children,
}));

const lang = (overrides: Partial<Language> = {}): Language => ({
  id: "l1", name: "English", level: 100, ...overrides,
});

describe("LanguagesEditor", () => {
  it("renders language name and level", () => {
    render(<LanguagesEditor languages={[lang()]} onChange={vi.fn()} />);
    expect(screen.getByDisplayValue("English")).toBeInTheDocument();
    expect(screen.getByRole("slider")).toHaveValue("100");
  });

  it("add language calls onChange with a new entry at level 75", () => {
    const onChange = vi.fn();
    render(<LanguagesEditor languages={[]} onChange={onChange} />);
    fireEvent.click(screen.getByText("+ Add language"));
    const [result] = onChange.mock.calls[0];
    expect(result).toHaveLength(1);
    expect(result[0].level).toBe(75);
  });

  it("editing name calls onChange with updated language", () => {
    const onChange = vi.fn();
    render(<LanguagesEditor languages={[lang()]} onChange={onChange} />);
    fireEvent.change(screen.getByDisplayValue("English"), { target: { value: "French" } });
    expect(onChange).toHaveBeenCalledWith([{ id: "l1", name: "French", level: 100 }]);
  });

  it("editing level calls onChange with updated level", () => {
    const onChange = vi.fn();
    render(<LanguagesEditor languages={[lang()]} onChange={onChange} />);
    fireEvent.change(screen.getByRole("slider"), { target: { value: "60" } });
    expect(onChange).toHaveBeenCalledWith([{ id: "l1", name: "English", level: 60 }]);
  });

  it("remove button calls onChange without that language", () => {
    const onChange = vi.fn();
    const langs = [lang({ id: "l1", name: "English" }), lang({ id: "l2", name: "Spanish" })];
    render(<LanguagesEditor languages={langs} onChange={onChange} />);
    fireEvent.click(screen.getAllByRole("button")[0]);
    const [result] = onChange.mock.calls[0];
    expect(result.find((l: Language) => l.id === "l1")).toBeUndefined();
  });
});
