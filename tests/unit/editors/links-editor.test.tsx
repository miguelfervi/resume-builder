import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { LinksEditor } from "@/app/components/editor/LinksEditor";
import { LinkEntry } from "@/app/types/resume";

vi.mock("@/app/components/editor/SortableList", () => ({
  SortableList: ({ items, renderItem }: any) => items.map(renderItem),
}));
vi.mock("@/app/components/editor/CollapsibleSection", () => ({
  CollapsibleSection: ({ children }: any) => children,
}));

const link = (overrides: Partial<LinkEntry> = {}): LinkEntry => ({
  id: "link-1", label: "LinkedIn", url: "https://linkedin.com", ...overrides,
});

describe("LinksEditor", () => {
  it("renders existing links", () => {
    render(<LinksEditor links={[link()]} onChange={vi.fn()} />);
    expect(screen.getByDisplayValue("LinkedIn")).toBeInTheDocument();
    expect(screen.getByDisplayValue("https://linkedin.com")).toBeInTheDocument();
  });

  it("add link calls onChange with a new empty entry", () => {
    const onChange = vi.fn();
    render(<LinksEditor links={[]} onChange={onChange} />);
    fireEvent.click(screen.getByText("+ Add link"));
    const [result] = onChange.mock.calls[0];
    expect(result).toHaveLength(1);
    expect(result[0].label).toBe("");
    expect(result[0].url).toBe("");
  });

  it("editing label calls onChange with updated label", () => {
    const onChange = vi.fn();
    render(<LinksEditor links={[link()]} onChange={onChange} />);
    fireEvent.change(screen.getByDisplayValue("LinkedIn"), { target: { value: "GitHub" } });
    expect(onChange).toHaveBeenCalledWith([{ id: "link-1", label: "GitHub", url: "https://linkedin.com" }]);
  });

  it("editing url calls onChange with updated url", () => {
    const onChange = vi.fn();
    render(<LinksEditor links={[link()]} onChange={onChange} />);
    fireEvent.change(screen.getByDisplayValue("https://linkedin.com"), { target: { value: "https://github.com" } });
    expect(onChange).toHaveBeenCalledWith([{ id: "link-1", label: "LinkedIn", url: "https://github.com" }]);
  });

  it("remove button calls onChange without that link", () => {
    const onChange = vi.fn();
    const links = [link({ id: "l1" }), link({ id: "l2", label: "GitHub" })];
    render(<LinksEditor links={links} onChange={onChange} />);
    fireEvent.click(screen.getAllByRole("button")[0]);
    const [result] = onChange.mock.calls[0];
    expect(result.find((l: LinkEntry) => l.id === "l1")).toBeUndefined();
    expect(result.find((l: LinkEntry) => l.id === "l2")).toBeDefined();
  });
});
