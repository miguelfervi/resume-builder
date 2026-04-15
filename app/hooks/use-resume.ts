"use client";

import { useEffect, useCallback } from "react";
import { ResumeData, AppState, SavedResume } from "@/app/types/resume";
import { createBlankResumeData } from "@/app/lib/default-data";
import { loadAppState, saveAppState, clearAppState, createInitialAppState } from "@/app/lib/storage";
import { useUndoRedo } from "./use-undo-redo";

function createInitial(): AppState {
  return loadAppState() ?? createInitialAppState();
}

export function useResume() {
  const { value: appState, setValue: setAppState, undo, redo, reset, canUndo, canRedo } = useUndoRedo<AppState>(
    createInitialAppState()
  );
  const isHydrated = appState !== null;

  // Hydrate from localStorage once
  useEffect(() => {
    const saved = createInitial();
    reset(saved);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-save debounced
  useEffect(() => {
    const timeout = setTimeout(() => saveAppState(appState), 500);
    return () => clearTimeout(timeout);
  }, [appState]);

  const activeResume: SavedResume = appState.resumes.find((r) => r.id === appState.activeResumeId) ?? appState.resumes[0];

  const setData = useCallback((data: ResumeData) => {
    setAppState((prev: AppState) => ({
      ...prev,
      resumes: prev.resumes.map((r) =>
        r.id === prev.activeResumeId ? { ...r, data } : r
      ),
    }));
  }, [setAppState]);

  const setTemplateId = useCallback((templateId: string) => {
    setAppState((prev: AppState) => ({
      ...prev,
      resumes: prev.resumes.map((r) =>
        r.id === prev.activeResumeId ? { ...r, templateId } : r
      ),
    }));
  }, [setAppState]);

  const switchResume = useCallback((id: string) => {
    setAppState((prev: AppState) => ({ ...prev, activeResumeId: id }));
  }, [setAppState]);

  const createResume = useCallback((name = "New Resume") => {
    const now = new Date().toISOString();
    const resume: SavedResume = {
      id: crypto.randomUUID(),
      name,
      templateId: "classic",
      data: createBlankResumeData(),
      createdAt: now,
      updatedAt: now,
    };
    setAppState((prev: AppState) => ({
      activeResumeId: resume.id,
      resumes: [...prev.resumes, resume],
    }));
  }, [setAppState]);

  const duplicateResume = useCallback((id: string) => {
    setAppState((prev: AppState) => {
      const source = prev.resumes.find((r) => r.id === id);
      if (!source) return prev;
      const now = new Date().toISOString();
      const copy: SavedResume = {
        ...source,
        id: crypto.randomUUID(),
        name: `${source.name} (copy)`,
        createdAt: now,
        updatedAt: now,
      };
      return { activeResumeId: copy.id, resumes: [...prev.resumes, copy] };
    });
  }, [setAppState]);

  const deleteResume = useCallback((id: string) => {
    setAppState((prev: AppState) => {
      const resumes = prev.resumes.filter((r) => r.id !== id);
      if (resumes.length === 0) {
        const fresh = createInitialAppState();
        return fresh;
      }
      const activeResumeId = prev.activeResumeId === id ? resumes[0].id : prev.activeResumeId;
      return { activeResumeId, resumes };
    });
  }, [setAppState]);

  const renameResume = useCallback((id: string, name: string) => {
    setAppState((prev: AppState) => ({
      ...prev,
      resumes: prev.resumes.map((r) => (r.id === id ? { ...r, name } : r)),
    }));
  }, [setAppState]);

  const resetData = useCallback(() => {
    clearAppState();
    reset(createInitialAppState());
  }, [reset]);

  return {
    appState,
    activeResume,
    data: activeResume.data,
    templateId: activeResume.templateId,
    resumes: appState.resumes,
    isHydrated,
    setData,
    setTemplateId,
    switchResume,
    createResume,
    duplicateResume,
    deleteResume,
    renameResume,
    resetData,
    undo,
    redo,
    canUndo,
    canRedo,
  };
}
