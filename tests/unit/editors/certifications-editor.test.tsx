import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { CertificationsEditor } from "@/app/components/editor/CertificationsEditor";
import { CertificationEntry } from "@/app/types/resume";

vi.mock("@/app/components/editor/SortableList", () => ({
  SortableList: ({ items, renderItem }: any) => items.map(renderItem),
}));
vi.mock("@/app/components/editor/CollapsibleSection", () => ({
  CollapsibleSection: ({ children }: any) => children,
}));

const cert = (overrides: Partial<CertificationEntry> = {}): CertificationEntry => ({
  id: "c1", name: "AWS Developer", issuer: "Amazon", date: "2023", ...overrides,
});

describe("CertificationsEditor", () => {
  it("renders existing certification fields", () => {
    render(<CertificationsEditor certifications={[cert()]} onChange={vi.fn()} />);
    expect(screen.getByDisplayValue("AWS Developer")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Amazon")).toBeInTheDocument();
    expect(screen.getByDisplayValue("2023")).toBeInTheDocument();
  });

  it("add certification calls onChange with a new empty entry", () => {
    const onChange = vi.fn();
    render(<CertificationsEditor certifications={[]} onChange={onChange} />);
    fireEvent.click(screen.getByText("+ Add certification"));
    const [result] = onChange.mock.calls[0];
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("");
    expect(result[0].issuer).toBe("");
  });

  it("editing name calls onChange with updated entry", () => {
    const onChange = vi.fn();
    render(<CertificationsEditor certifications={[cert()]} onChange={onChange} />);
    fireEvent.change(screen.getByDisplayValue("AWS Developer"), { target: { value: "GCP Engineer" } });
    const [result] = onChange.mock.calls[0];
    expect(result[0].name).toBe("GCP Engineer");
  });

  it("editing issuer calls onChange with updated entry", () => {
    const onChange = vi.fn();
    render(<CertificationsEditor certifications={[cert()]} onChange={onChange} />);
    fireEvent.change(screen.getByDisplayValue("Amazon"), { target: { value: "Google" } });
    const [result] = onChange.mock.calls[0];
    expect(result[0].issuer).toBe("Google");
  });

  it("editing date calls onChange with updated entry", () => {
    const onChange = vi.fn();
    render(<CertificationsEditor certifications={[cert()]} onChange={onChange} />);
    fireEvent.change(screen.getByDisplayValue("2023"), { target: { value: "2024" } });
    const [result] = onChange.mock.calls[0];
    expect(result[0].date).toBe("2024");
  });

  it("remove button calls onChange without that certification", () => {
    const onChange = vi.fn();
    const certs = [cert({ id: "c1" }), cert({ id: "c2", name: "GCP" })];
    render(<CertificationsEditor certifications={certs} onChange={onChange} />);
    fireEvent.click(screen.getAllByRole("button")[0]);
    const [result] = onChange.mock.calls[0];
    expect(result.find((c: CertificationEntry) => c.id === "c1")).toBeUndefined();
    expect(result.find((c: CertificationEntry) => c.id === "c2")).toBeDefined();
  });
});
