"use client";

import { useRef, useState } from "react";

const DISPLAY = 240; // circle display size px
const OUTPUT = 600;  // canvas output px — 2.5× display for crisp hi-DPI rendering

interface Props {
  rawDataUrl: string;
  onApply: (cropped: string) => void;
  onCancel: () => void;
}

export function PhotoCropModal({ rawDataUrl, onApply, onCancel }: Props) {
  const imgRef = useRef<HTMLImageElement>(null);
  const dragRef = useRef<{ startX: number; startY: number; ox: number; oy: number } | null>(null);

  const [naturalSize, setNaturalSize] = useState({ w: 0, h: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  function onImgLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    setNaturalSize({ w: e.currentTarget.naturalWidth, h: e.currentTarget.naturalHeight });
  }

  // Cover scale: image fills the circle at zoom = 1
  const coverScale = naturalSize.w > 0
    ? Math.max(DISPLAY / naturalSize.w, DISPLAY / naturalSize.h)
    : 1;

  const renderedW = naturalSize.w * coverScale * zoom;
  const renderedH = naturalSize.h * coverScale * zoom;

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = { startX: e.clientX, startY: e.clientY, ox: offset.x, oy: offset.y };
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!dragRef.current) return;
    setOffset({
      x: dragRef.current.ox + (e.clientX - dragRef.current.startX),
      y: dragRef.current.oy + (e.clientY - dragRef.current.startY),
    });
  }

  function onPointerUp() {
    dragRef.current = null;
  }

  function onWheel(e: React.WheelEvent<HTMLDivElement>) {
    e.preventDefault();
    setZoom((z) => Math.min(3, Math.max(1, z - e.deltaY * 0.005)));
  }

  function apply() {
    const img = imgRef.current;
    if (!img) return;

    const ratio = OUTPUT / DISPLAY;
    const canvas = document.createElement("canvas");
    canvas.width = OUTPUT;
    canvas.height = OUTPUT;
    const ctx = canvas.getContext("2d")!;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    // Circular clip
    ctx.beginPath();
    ctx.arc(OUTPUT / 2, OUTPUT / 2, OUTPUT / 2, 0, Math.PI * 2);
    ctx.clip();

    // Same geometry as the display, scaled by ratio
    const dw = renderedW * ratio;
    const dh = renderedH * ratio;
    const cx = (DISPLAY / 2 + offset.x) * ratio;
    const cy = (DISPLAY / 2 + offset.y) * ratio;

    ctx.drawImage(img, cx - dw / 2, cy - dh / 2, dw, dh);
    onApply(canvas.toDataURL("image/jpeg", 0.95));
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-2xl p-6 flex flex-col items-center gap-4 shadow-2xl"
        style={{ width: 312 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center">
          <h3 className="text-sm font-semibold text-gray-800">Adjust photo</h3>
          <p className="text-[11px] text-gray-400 mt-0.5">Drag to reposition · scroll or slider to zoom</p>
        </div>

        {/* Circular viewport */}
        <div
          style={{
            width: DISPLAY,
            height: DISPLAY,
            borderRadius: "50%",
            overflow: "hidden",
            position: "relative",
            boxShadow: "0 0 0 4px #e5e7eb, 0 4px 24px rgba(0,0,0,0.18)",
            cursor: "grab",
            touchAction: "none",
            flexShrink: 0,
            backgroundColor: "#f3f4f6",
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onWheel={onWheel}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={imgRef}
            src={rawDataUrl}
            alt=""
            draggable={false}
            onLoad={onImgLoad}
            style={{
              position: "absolute",
              // Explicit pixel size — no CSS scaling ambiguity
              width: renderedW || "100%",
              height: renderedH || "auto",
              // Centered + user offset
              left: DISPLAY / 2 - renderedW / 2 + offset.x,
              top: DISPLAY / 2 - renderedH / 2 + offset.y,
              userSelect: "none",
              pointerEvents: "none",
              imageRendering: "auto",
            }}
          />
        </div>

        {/* Zoom slider */}
        <div className="flex items-center gap-3 w-full px-1">
          <span className="text-base text-gray-400 leading-none select-none">−</span>
          <input
            type="range"
            min={1}
            max={3}
            step={0.01}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="flex-1 accent-blue-500 h-1.5"
          />
          <span className="text-base text-gray-400 leading-none select-none">+</span>
        </div>

        {/* Buttons */}
        <div className="flex gap-2 w-full pt-1">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={apply}
            className="flex-1 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}
