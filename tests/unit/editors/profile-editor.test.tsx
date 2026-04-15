import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ProfileEditor } from "@/app/components/editor/ProfileEditor";

vi.mock("@/app/components/editor/CollapsibleSection", () => ({
  CollapsibleSection: ({ children }: any) => children,
}));

describe("ProfileEditor", () => {
  it("renders the current value in the textarea", () => {
    render(<ProfileEditor value="My summary" onChange={vi.fn()} />);
    expect(screen.getByDisplayValue("My summary")).toBeInTheDocument();
  });

  it("renders empty when value is empty string", () => {
    render(<ProfileEditor value="" onChange={vi.fn()} />);
    expect(screen.getByPlaceholderText(/professional summary/i)).toBeInTheDocument();
  });

  it("onChange called with new value when user types", () => {
    const onChange = vi.fn();
    render(<ProfileEditor value="" onChange={onChange} />);
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "Updated summary" } });
    expect(onChange).toHaveBeenCalledWith("Updated summary");
  });

  it("onChange called on each change event", () => {
    const onChange = vi.fn();
    render(<ProfileEditor value="a" onChange={onChange} />);
    const textarea = screen.getByRole("textbox");
    fireEvent.change(textarea, { target: { value: "ab" } });
    fireEvent.change(textarea, { target: { value: "abc" } });
    expect(onChange).toHaveBeenCalledTimes(2);
  });
});
