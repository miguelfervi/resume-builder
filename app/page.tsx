"use client";

import { useResume } from "@/app/hooks/use-resume";
import { Editor } from "@/app/components/editor/Editor";
import { ResumePreview } from "@/app/components/preview/ResumePreview";
import { PdfDownloadButton } from "@/app/components/pdf/PdfDownloadButton";

export default function Home() {
  const { data, setData, isHydrated, resetData } = useResume();

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
        <Editor data={data} onChange={setData} onReset={resetData} />
      </div>

      {/* Preview panel */}
      <div className="flex-1 h-full overflow-y-auto flex flex-col items-center py-6 px-4 gap-4">
        <div className="w-full max-w-2xl flex justify-end">
          <PdfDownloadButton data={data} />
        </div>
        <div className="w-full max-w-2xl shadow-xl">
          <ResumePreview data={data} />
        </div>
        <p className="text-xs text-gray-400 pb-4">
          Data is saved automatically in your browser
        </p>
      </div>
    </div>
  );
}
