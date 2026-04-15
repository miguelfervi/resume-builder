"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import { ResumeData } from "@/app/types/resume";
import { ResumePdfDocument } from "../pdf/ResumePdfDocument";

// PDFViewer uses browser APIs — must be client-only
const PDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((m) => m.PDFViewer),
  { ssr: false, loading: () => (
    <div className="flex-1 flex items-center justify-center bg-gray-900">
      <div className="w-6 h-6 border-2 border-white/40 border-t-white rounded-full animate-spin" />
    </div>
  )}
);

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
    <div className="fixed inset-0 z-50 flex flex-col bg-black/90">
      {/* Topbar — always visible */}
      <div className="flex-shrink-0 flex items-center justify-between px-5 py-2.5 bg-gray-950/80 border-b border-white/10">
        <span className="text-xs text-white/40 tracking-wide uppercase">PDF Preview</span>
        <button
          type="button"
          onClick={onClose}
          className="flex items-center gap-1.5 text-sm text-white/60 hover:text-white transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
          Close (Esc)
        </button>
      </div>

      {/* PDF viewer fills the rest */}
      <div className="flex-1 overflow-hidden">
        <PDFViewer width="100%" height="100%" style={{ border: "none" }}>
          <ResumePdfDocument data={data} templateId={templateId} />
        </PDFViewer>
      </div>
    </div>
  );
}
