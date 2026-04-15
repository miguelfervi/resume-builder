"use client";

import { useState, useRef, useCallback } from "react";

const MAX_HISTORY = 50;
const DEBOUNCE_MS = 600;

interface History<T> {
  past: T[];
  present: T;
  future: T[];
}

type Updater<T> = T | ((prev: T) => T);

function resolve<T>(updater: Updater<T>, prev: T): T {
  return typeof updater === "function" ? (updater as (p: T) => T)(prev) : updater;
}

export function useUndoRedo<T>(initialValue: T) {
  const [history, setHistory] = useState<History<T>>({
    past: [],
    present: initialValue,
    future: [],
  });

  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Track whether a debounced snapshot is pending
  const snapshotPending = useRef(false);

  const setValue: (updater: Updater<T>) => void = useCallback((updater: Updater<T>) => {
    setHistory((prev) => {
      const next = resolve(updater, prev.present);

      // Start/restart debounce for creating a history snapshot
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      snapshotPending.current = true;
      debounceTimer.current = setTimeout(() => {
        if (!snapshotPending.current) return;
        snapshotPending.current = false;
        setHistory((h) => ({
          past: [...h.past, h.present].slice(-MAX_HISTORY),
          present: h.present,
          future: [],
        }));
      }, DEBOUNCE_MS);

      // Update present immediately for UI responsiveness
      return { past: prev.past, present: next, future: [] };
    });
  }, []);

  const undo = useCallback(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
      snapshotPending.current = false;
    }
    setHistory((prev) => {
      if (prev.past.length === 0) return prev;
      const past = [...prev.past];
      const present = past.pop()!;
      return { past, present, future: [prev.present, ...prev.future] };
    });
  }, []);

  const redo = useCallback(() => {
    setHistory((prev) => {
      if (prev.future.length === 0) return prev;
      const [present, ...future] = prev.future;
      return { past: [...prev.past, prev.present], present, future };
    });
  }, []);

  const reset = useCallback((value: T) => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    snapshotPending.current = false;
    setHistory({ past: [], present: value, future: [] });
  }, []);

  return {
    value: history.present,
    setValue,
    undo,
    redo,
    reset,
    canUndo: history.past.length > 0,
    canRedo: history.future.length > 0,
  };
}
