"use client";

import { TEMPLATES } from "@/app/lib/templates";

interface Props {
  templateId: string;
  onChange: (id: string) => void;
}

const THUMBNAILS: Record<string, { left: string; right: string }> = {
  classic: { left: "bg-white", right: "bg-[#1e3a5f]" },
  modern:  { left: "bg-[#0d9488]", right: "bg-white" },
  minimal: { left: "bg-white", right: "bg-white" },
  ats:     { left: "bg-white", right: "bg-white" },
};

export function TemplateSelector({ templateId, onChange }: Props) {
  return (
    <div>
      <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-2">Template</p>
      <div className="flex gap-2">
        {TEMPLATES.map((t) => {
          const thumb = THUMBNAILS[t.id];
          const isActive = t.id === templateId;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onChange(t.id)}
              className={`flex-1 flex flex-col items-center gap-1.5 p-2 rounded-lg border-2 transition-colors ${
                isActive ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
              }`}
            >
              {/* Mini thumbnail */}
              <div className="w-full h-8 rounded overflow-hidden flex border border-gray-200">
                {t.layout === "sidebar-right" && (
                  <>
                    <div className={`flex-1 ${thumb.left}`} />
                    <div className={`w-5 ${thumb.right}`} />
                  </>
                )}
                {t.layout === "sidebar-left" && (
                  <>
                    <div className={`w-5 ${thumb.left}`} />
                    <div className={`flex-1 ${thumb.right}`} />
                  </>
                )}
                {t.layout === "single-column" && (
                  <div className="flex-1 bg-white flex flex-col justify-center p-1 gap-0.5">
                    <div className="h-1 w-2/3 bg-gray-800 rounded-full" />
                    <div className="h-0.5 w-1/2 bg-gray-300 rounded-full" />
                  </div>
                )}
                {t.layout === "ats" && (
                  <div className="flex-1 bg-white flex flex-col justify-start p-1 gap-0.5 pt-1.5">
                    <div className="h-1 w-1/2 bg-gray-900 rounded-sm" />
                    <div className="h-px w-full bg-gray-900 mt-0.5" />
                    <div className="h-0.5 w-full bg-gray-300 rounded-sm mt-0.5" />
                    <div className="h-0.5 w-5/6 bg-gray-300 rounded-sm" />
                    <div className="h-px w-full bg-gray-900 mt-0.5" />
                    <div className="h-0.5 w-2/3 bg-gray-300 rounded-sm mt-0.5" />
                  </div>
                )}
              </div>
              <span className={`text-[10px] font-medium ${isActive ? "text-blue-600" : "text-gray-500"}`}>{t.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
