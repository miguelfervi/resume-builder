"use client";

import { useState, useEffect, useCallback } from "react";
import { ResumeData } from "@/app/types/resume";
import { createDefaultResumeData } from "@/app/lib/default-data";
import { loadResumeData, saveResumeData, clearResumeData } from "@/app/lib/storage";

export function useResume() {
  const [data, setData] = useState<ResumeData>(createDefaultResumeData);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const saved = loadResumeData();
    if (saved) setData(saved);
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    const timeout = setTimeout(() => saveResumeData(data), 500);
    return () => clearTimeout(timeout);
  }, [data, isHydrated]);

  const resetData = useCallback(() => {
    clearResumeData();
    setData(createDefaultResumeData());
  }, []);

  return { data, setData, isHydrated, resetData };
}
