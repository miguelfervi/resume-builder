"use client";

import { useRef } from "react";

interface Props {
  photoUrl: string;
  onChange: (photoUrl: string) => void;
}

function resizeImage(dataUrl: string, maxSize = 200): Promise<string> {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.onload = () => {
      const scale = Math.min(maxSize / img.width, maxSize / img.height, 1);
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/jpeg", 0.8));
    };
    img.src = dataUrl;
  });
}

export function PhotoUpload({ photoUrl, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const dataUrl = ev.target?.result as string;
      const resized = await resizeImage(dataUrl);
      onChange(resized);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  return (
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
          <button
            type="button"
            onClick={() => onChange("")}
            className="text-xs text-red-500 hover:text-red-700 text-left"
          >
            Remove
          </button>
        )}
        <p className="text-[10px] text-gray-400">JPG, PNG. Resized to 200×200px</p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
