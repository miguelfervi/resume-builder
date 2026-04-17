"use client";

import { useRef, useState } from "react";
import { PhotoCropModal } from "./PhotoCropModal";

interface Props {
  photoUrl: string;
  onChange: (photoUrl: string) => void;
}

export function PhotoUpload({ photoUrl, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [rawDataUrl, setRawDataUrl] = useState<string | null>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setRawDataUrl(ev.target?.result as string);
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  function handleApply(cropped: string) {
    onChange(cropped);
    setRawDataUrl(null);
  }

  return (
    <>
      <div className="flex items-center gap-4">
        <div
          onClick={() => inputRef.current?.click()}
          className="w-16 h-16 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer overflow-hidden hover:border-blue-400 transition-colors flex-shrink-0"
        >
          {photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photoUrl} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="text-xs text-blue-600 hover:text-blue-800 font-medium text-left"
          >
            {photoUrl ? "Change photo" : "Upload photo"}
          </button>
          {photoUrl && (
            <>
              <button
                type="button"
                onClick={() => setRawDataUrl(photoUrl)}
                className="text-xs text-gray-500 hover:text-gray-700 text-left"
              >
                Adjust
              </button>
              <button
                type="button"
                onClick={() => onChange("")}
                className="text-xs text-red-500 hover:text-red-700 text-left"
              >
                Remove
              </button>
            </>
          )}
          <p className="text-[10px] text-gray-400">JPG, PNG · drag &amp; position in circle</p>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {rawDataUrl && (
        <PhotoCropModal
          rawDataUrl={rawDataUrl}
          onApply={handleApply}
          onCancel={() => setRawDataUrl(null)}
        />
      )}
    </>
  );
}
