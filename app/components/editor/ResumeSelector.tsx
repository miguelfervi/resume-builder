"use client";

import { useState, useRef, useEffect } from "react";
import { SavedResume } from "@/app/types/resume";

interface Props {
  resumes: SavedResume[];
  activeId: string;
  onSwitch: (id: string) => void;
  onCreate: () => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onRename: (id: string, name: string) => void;
}

export function ResumeSelector({ resumes, activeId, onSwitch, onCreate, onDuplicate, onDelete, onRename }: Props) {
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const active = resumes.find((r) => r.id === activeId) ?? resumes[0];

  function startRename(r: SavedResume) {
    setEditingId(r.id);
    setEditingName(r.name);
  }

  function commitRename() {
    if (editingId && editingName.trim()) onRename(editingId, editingName.trim());
    setEditingId(null);
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 hover:border-gray-300 bg-white transition-colors"
      >
        <div className="flex items-center gap-2 min-w-0">
          <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
          <span className="truncate font-medium">{active?.name ?? "My Resume"}</span>
        </div>
        <svg className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
          <div className="max-h-48 overflow-y-auto">
            {resumes.map((r) => (
              <div
                key={r.id}
                className={`flex items-center gap-2 px-3 py-2 hover:bg-gray-50 transition-colors ${r.id === activeId ? "bg-blue-50" : ""}`}
              >
                {editingId === r.id ? (
                  <input
                    autoFocus
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    onBlur={commitRename}
                    onKeyDown={(e) => { if (e.key === "Enter") commitRename(); if (e.key === "Escape") setEditingId(null); }}
                    className="flex-1 text-sm border border-blue-400 rounded px-1.5 py-0.5 focus:outline-none"
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <button type="button" className="flex-1 text-left text-sm text-gray-700 truncate"
                    onClick={() => { onSwitch(r.id); setOpen(false); }}>
                    {r.name}
                    {r.id === activeId && <span className="ml-2 text-[10px] text-blue-500 font-medium">active</span>}
                  </button>
                )}
                <button type="button" title="Rename" onClick={(e) => { e.stopPropagation(); startRename(r); }}
                  className="text-gray-300 hover:text-gray-500 transition-colors flex-shrink-0">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
                <button type="button" title="Duplicate" onClick={(e) => { e.stopPropagation(); onDuplicate(r.id); setOpen(false); }}
                  className="text-gray-300 hover:text-gray-500 transition-colors flex-shrink-0">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
                {resumes.length > 1 && (
                  <button type="button" title="Delete" onClick={(e) => { e.stopPropagation(); if (confirm(`Delete "${r.name}"?`)) { onDelete(r.id); setOpen(false); } }}
                    className="text-gray-300 hover:text-red-400 transition-colors flex-shrink-0">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
          <div className="border-t border-gray-100 p-2">
            <button type="button" onClick={() => { onCreate(); setOpen(false); }}
              className="w-full text-left text-xs text-blue-500 hover:text-blue-700 font-medium px-2 py-1.5 rounded hover:bg-blue-50 transition-colors">
              + New resume
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
