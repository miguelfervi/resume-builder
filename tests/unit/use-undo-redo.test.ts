import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useUndoRedo } from "@/app/hooks/use-undo-redo";

// Suppress the "use client" directive warning in test output
vi.mock("react", async () => await import("react"));

describe("useUndoRedo — initial state", () => {
  it("returns the initial value", () => {
    const { result } = renderHook(() => useUndoRedo(42));
    expect(result.current.value).toBe(42);
  });

  it("canUndo and canRedo are false initially", () => {
    const { result } = renderHook(() => useUndoRedo("hello"));
    expect(result.current.canUndo).toBe(false);
    expect(result.current.canRedo).toBe(false);
  });
});

describe("useUndoRedo — setValue", () => {
  it("updates value immediately with a direct value", () => {
    const { result } = renderHook(() => useUndoRedo(0));
    act(() => result.current.setValue(5));
    expect(result.current.value).toBe(5);
  });

  it("updates value with a functional updater", () => {
    const { result } = renderHook(() => useUndoRedo(10));
    act(() => result.current.setValue((prev) => prev + 1));
    expect(result.current.value).toBe(11);
  });

  it("sequential updates accumulate", () => {
    const { result } = renderHook(() => useUndoRedo(0));
    act(() => result.current.setValue(1));
    act(() => result.current.setValue(2));
    act(() => result.current.setValue(3));
    expect(result.current.value).toBe(3);
  });
});

describe("useUndoRedo — undo / redo after debounce", () => {
  // How the debounce snapshot works:
  // setValue(x) updates present immediately.
  // After 600ms of inactivity the timer fires and pushes the CURRENT present to past.
  // This means to get a meaningful undo you need:
  //   1. setValue("b") + debounce fires → past=["b"], present="b"
  //   2. setValue("c") WITHOUT firing debounce → past=["b"], present="c"
  //   3. undo() → pops "b" from past → present="b" ✓

  it("undo reverts to the last debounce snapshot", async () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useUndoRedo("a"));

    // First change + debounce → creates checkpoint "b" in past
    act(() => result.current.setValue("b"));
    act(() => vi.advanceTimersByTime(700)); // past=["b"], present="b"

    // Second change, no debounce fire yet
    act(() => result.current.setValue("c")); // past=["b"], present="c"

    expect(result.current.canUndo).toBe(true);
    act(() => result.current.undo()); // pops "b" → present="b"
    expect(result.current.value).toBe("b");

    vi.useRealTimers();
  });

  it("redo restores the undone value", async () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useUndoRedo("a"));

    act(() => result.current.setValue("b"));
    act(() => vi.advanceTimersByTime(700)); // checkpoint "b" in past

    act(() => result.current.setValue("c")); // present="c", no debounce

    act(() => result.current.undo()); // present="b", future=["c"]
    expect(result.current.canRedo).toBe(true);
    act(() => result.current.redo()); // present="c"
    expect(result.current.value).toBe("c");

    vi.useRealTimers();
  });

  it("canRedo becomes false after a new setValue", async () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useUndoRedo("a"));

    act(() => result.current.setValue("b"));
    act(() => vi.advanceTimersByTime(700)); // checkpoint "b" in past

    act(() => result.current.setValue("c")); // present="c"
    act(() => result.current.undo()); // present="b", future=["c"]
    expect(result.current.canRedo).toBe(true);

    act(() => result.current.setValue("d")); // clears future
    expect(result.current.canRedo).toBe(false);

    vi.useRealTimers();
  });
});

describe("useUndoRedo — reset", () => {
  it("reset clears history and sets new value", async () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useUndoRedo("a"));

    act(() => result.current.setValue("b"));
    act(() => vi.advanceTimersByTime(700));

    act(() => result.current.reset("fresh"));
    expect(result.current.value).toBe("fresh");
    expect(result.current.canUndo).toBe(false);
    expect(result.current.canRedo).toBe(false);

    vi.useRealTimers();
  });
});

describe("useUndoRedo — undo with no history", () => {
  it("undo does nothing when there is no history", () => {
    const { result } = renderHook(() => useUndoRedo("initial"));
    act(() => result.current.undo());
    expect(result.current.value).toBe("initial");
  });

  it("redo does nothing when there is nothing to redo", () => {
    const { result } = renderHook(() => useUndoRedo("initial"));
    act(() => result.current.redo());
    expect(result.current.value).toBe("initial");
  });
});
