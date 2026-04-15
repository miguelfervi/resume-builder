"use client";

import { useState } from "react";
import { useResume } from "@/app/hooks/use-resume";
import { useKeyboardShortcuts } from "@/app/hooks/use-keyboard-shortcuts";
import { Editor } from "@/app/components/editor/Editor";
import { ResumePreview } from "@/app/components/preview/ResumePreview";
import { A4Container } from "@/app/components/preview/A4Container";
import { FullPagePreviewModal } from "@/app/components/preview/FullPagePreviewModal";
import { PdfDownloadButton } from "@/app/components/pdf/PdfDownloadButton";

export default function Home() {
  const {
    data, setData, templateId, setTemplateId,
    resumes, activeResume, isHydrated, resetData,
    switchResume, createResume, duplicateResume, deleteResume, renameResume,
    undo, redo, canUndo, canRedo,
  } = useResume();

  const [showModal, setShowModal] = useState(false);

  useKeyboardShortcuts({ undo, redo });

  if (!isHydrated) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Editor panel */}
      <div className="w-[560px] flex-shrink-0 h-full overflow-y-auto bg-white border-r border-gray-200 p-4">
        <Editor
          data={data}
          onChange={setData}
          onReset={resetData}
          templateId={templateId}
          onTemplateChange={setTemplateId}
          resumes={resumes}
          activeId={activeResume.id}
          onSwitch={switchResume}
          onCreate={createResume}
          onDuplicate={duplicateResume}
          onDelete={deleteResume}
          onRename={renameResume}
          canUndo={canUndo}
          canRedo={canRedo}
          onUndo={undo}
          onRedo={redo}
        />
      </div>

      {/* Preview panel */}
      <div className="flex-1 h-full overflow-y-auto flex flex-col items-center py-6 px-4 gap-4">
        <div className="w-full max-w-2xl flex items-center justify-between">
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors border border-gray-200 rounded-lg px-3 py-2 bg-white hover:border-gray-300"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Full Preview
          </button>
          <PdfDownloadButton data={data} templateId={templateId} />
        </div>

        <div className="w-full max-w-2xl">
          <A4Container>
            <ResumePreview data={data} templateId={templateId} />
          </A4Container>
        </div>

        <p className="text-xs text-gray-400 pb-4">
          Data is saved automatically in your browser
        </p>
      </div>

      {showModal && (
        <FullPagePreviewModal data={data} templateId={templateId} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
}
