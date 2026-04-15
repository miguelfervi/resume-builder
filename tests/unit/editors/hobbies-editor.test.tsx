import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { HobbiesEditor } from "@/app/components/editor/HobbiesEditor";

vi.mock("@/app/components/editor/SortableList", () => ({
  SortableList: ({ items, renderItem }: any) => items.map(renderItem),
}));
vi.mock("@/app/components/editor/CollapsibleSection", () => ({
  CollapsibleSection: ({ children }: any) => children,
}));

describe("HobbiesEditor", () => {
  it("renders existing hobbies", () => {
    render(<HobbiesEditor hobbies={["Hiking", "Reading"]} onChange={vi.fn()} />);
    expect(screen.getByDisplayValue("Hiking")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Reading")).toBeInTheDocument();
  });

  it("add hobby calls onChange with a new empty string appended", () => {
    const onChange = vi.fn();
    render(<HobbiesEditor hobbies={["Hiking"]} onChange={onChange} />);
    fireEvent.click(screen.getByText("+ Add hobby"));
    expect(onChange).toHaveBeenCalledWith(["Hiking", ""]);
  });

  it("editing a hobby value calls onChange with the updated string", () => {
    const onChange = vi.fn();
    render(<HobbiesEditor hobbies={["Hiking"]} onChange={onChange} />);
    fireEvent.change(screen.getByDisplayValue("Hiking"), { target: { value: "Swimming" } });
    expect(onChange).toHaveBeenCalledWith(["Swimming"]);
  });

  it("remove button calls onChange without that hobby", () => {
    const onChange = vi.fn();
    render(<HobbiesEditor hobbies={["Hiking", "Reading"]} onChange={onChange} />);
    fireEvent.click(screen.getAllByRole("button")[0]);
    const [result] = onChange.mock.calls[0];
    expect(result).not.toContain("Hiking");
    expect(result).toContain("Reading");
  });

  it("remove works on the second hobby", () => {
    const onChange = vi.fn();
    render(<HobbiesEditor hobbies={["Hiking", "Reading"]} onChange={onChange} />);
    fireEvent.click(screen.getAllByRole("button")[1]);
    const [result] = onChange.mock.calls[0];
    expect(result).toContain("Hiking");
    expect(result).not.toContain("Reading");
  });

  it("renders empty list without crashing", () => {
    render(<HobbiesEditor hobbies={[]} onChange={vi.fn()} />);
    expect(screen.getByText("+ Add hobby")).toBeInTheDocument();
  });
});
