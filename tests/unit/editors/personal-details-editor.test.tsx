import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { PersonalDetailsEditor } from "@/app/components/editor/PersonalDetailsEditor";
import { PersonalDetails } from "@/app/types/resume";

vi.mock("@/app/components/editor/CollapsibleSection", () => ({
  CollapsibleSection: ({ children }: any) => children,
}));
vi.mock("@/app/components/editor/PhotoUpload", () => ({
  PhotoUpload: () => null,
}));

const base: PersonalDetails = {
  fullName: "Jane Doe",
  jobTitle: "Engineer",
  email: "jane@example.com",
  phone: "+1 555 000",
  address: "New York",
  photoUrl: "",
};

describe("PersonalDetailsEditor", () => {
  it("renders all field values", () => {
    render(<PersonalDetailsEditor data={base} onChange={vi.fn()} />);
    expect(screen.getByDisplayValue("Jane Doe")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Engineer")).toBeInTheDocument();
    expect(screen.getByDisplayValue("jane@example.com")).toBeInTheDocument();
    expect(screen.getByDisplayValue("+1 555 000")).toBeInTheDocument();
    expect(screen.getByDisplayValue("New York")).toBeInTheDocument();
  });

  it("onChange called with updated fullName", () => {
    const onChange = vi.fn();
    render(<PersonalDetailsEditor data={base} onChange={onChange} />);
    fireEvent.change(screen.getByDisplayValue("Jane Doe"), { target: { value: "John" } });
    expect(onChange).toHaveBeenCalledWith({ ...base, fullName: "John" });
  });

  it("onChange called with updated jobTitle", () => {
    const onChange = vi.fn();
    render(<PersonalDetailsEditor data={base} onChange={onChange} />);
    fireEvent.change(screen.getByDisplayValue("Engineer"), { target: { value: "Manager" } });
    expect(onChange).toHaveBeenCalledWith({ ...base, jobTitle: "Manager" });
  });

  it("onChange called with updated email", () => {
    const onChange = vi.fn();
    render(<PersonalDetailsEditor data={base} onChange={onChange} />);
    fireEvent.change(screen.getByDisplayValue("jane@example.com"), { target: { value: "new@example.com" } });
    expect(onChange).toHaveBeenCalledWith({ ...base, email: "new@example.com" });
  });

  it("onChange called with updated phone", () => {
    const onChange = vi.fn();
    render(<PersonalDetailsEditor data={base} onChange={onChange} />);
    fireEvent.change(screen.getByDisplayValue("+1 555 000"), { target: { value: "+44 7000" } });
    expect(onChange).toHaveBeenCalledWith({ ...base, phone: "+44 7000" });
  });

  it("onChange called with updated address", () => {
    const onChange = vi.fn();
    render(<PersonalDetailsEditor data={base} onChange={onChange} />);
    fireEvent.change(screen.getByDisplayValue("New York"), { target: { value: "London" } });
    expect(onChange).toHaveBeenCalledWith({ ...base, address: "London" });
  });

  it("preserves all other fields when one is updated", () => {
    const onChange = vi.fn();
    render(<PersonalDetailsEditor data={base} onChange={onChange} />);
    fireEvent.change(screen.getByDisplayValue("Jane Doe"), { target: { value: "X" } });
    const [called] = onChange.mock.calls[0];
    expect(called.email).toBe("jane@example.com");
    expect(called.phone).toBe("+1 555 000");
  });
});
