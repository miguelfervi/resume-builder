import { describe, it, expect, vi, afterEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useKeyboardShortcuts } from "@/app/hooks/use-keyboard-shortcuts";

vi.mock("react", async () => await import("react"));

function keyDown(key: string, opts: Partial<KeyboardEventInit> = {}, target: EventTarget = document) {
  target.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, ...opts }));
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("useKeyboardShortcuts", () => {
  it("Ctrl+Z calls undo", () => {
    const undo = vi.fn();
    renderHook(() => useKeyboardShortcuts({ undo, redo: vi.fn() }));
    keyDown("z", { ctrlKey: true });
    expect(undo).toHaveBeenCalledOnce();
  });

  it("Meta+Z (Mac) calls undo", () => {
    const undo = vi.fn();
    renderHook(() => useKeyboardShortcuts({ undo, redo: vi.fn() }));
    keyDown("z", { metaKey: true });
    expect(undo).toHaveBeenCalledOnce();
  });

  it("Ctrl+Shift+Z calls redo", () => {
    const redo = vi.fn();
    renderHook(() => useKeyboardShortcuts({ undo: vi.fn(), redo }));
    keyDown("z", { ctrlKey: true, shiftKey: true });
    expect(redo).toHaveBeenCalledOnce();
    expect(redo).not.toHaveBeenCalledWith(expect.anything()); // not undo
  });

  it("Ctrl+Y calls redo", () => {
    const redo = vi.fn();
    renderHook(() => useKeyboardShortcuts({ undo: vi.fn(), redo }));
    keyDown("y", { ctrlKey: true });
    expect(redo).toHaveBeenCalledOnce();
  });

  it("does nothing without a modifier key", () => {
    const undo = vi.fn();
    const redo = vi.fn();
    renderHook(() => useKeyboardShortcuts({ undo, redo }));
    keyDown("z");
    expect(undo).not.toHaveBeenCalled();
    expect(redo).not.toHaveBeenCalled();
  });

  it("ignores Ctrl+Z when the target is an input", () => {
    const undo = vi.fn();
    renderHook(() => useKeyboardShortcuts({ undo, redo: vi.fn() }));
    const input = document.createElement("input");
    document.body.appendChild(input);
    keyDown("z", { ctrlKey: true }, input);
    expect(undo).not.toHaveBeenCalled();
    input.remove();
  });

  it("ignores Ctrl+Z when the target is a textarea", () => {
    const undo = vi.fn();
    renderHook(() => useKeyboardShortcuts({ undo, redo: vi.fn() }));
    const textarea = document.createElement("textarea");
    document.body.appendChild(textarea);
    keyDown("z", { ctrlKey: true }, textarea);
    expect(undo).not.toHaveBeenCalled();
    textarea.remove();
  });

  it("removes the listener on unmount", () => {
    const undo = vi.fn();
    const { unmount } = renderHook(() => useKeyboardShortcuts({ undo, redo: vi.fn() }));
    unmount();
    keyDown("z", { ctrlKey: true });
    expect(undo).not.toHaveBeenCalled();
  });
});
