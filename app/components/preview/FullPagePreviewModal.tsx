"use client";

import { useEffect } from "react";
import { ResumeData } from "@/app/types/resume";
import { ResumePreview } from "./ResumePreview";
import { A4Container } from "./A4Container";

interface Props {
  data: ResumeData;
  templateId: string;
  onClose: () => void;
}

export function FullPagePreviewModal({ data, templateId, onClose }: Props) {
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 overflow-y-auto py-8 px-4">
      <div className="relative w-full max-w-3xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute -top-10 right-0 text-white/70 hover:text-white transition-colors flex items-center gap-1.5 text-sm"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
          Close (Esc)
        </button>
        <A4Container>
          <ResumePreview data={data} templateId={templateId} />
        </A4Container>
      </div>
    </div>
  );
}
