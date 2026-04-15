"use client";

import { useRef, useEffect, useState, ReactNode } from "react";

const PAGE_W = 794;
const PAGE_H = 1123;
const PAGE_GAP = 16; // px gap between pages

interface Props {
  children: ReactNode;
}

export function A4Container({ children }: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [totalHeight, setTotalHeight] = useState(PAGE_H);

  // Scale from available width
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setScale(entry.contentRect.width / PAGE_W);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Measure true content height at full A4 width (no scaling)
  useEffect(() => {
    const el = measureRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setTotalHeight(entry.contentRect.height);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const numPages = Math.max(1, Math.ceil(totalHeight / PAGE_H));

  return (
    <div ref={wrapperRef} style={{ width: "100%", position: "relative" }}>
      {/* Hidden div at real A4 width — measures content height without scaling */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          top: -99999,
          left: 0,
          width: PAGE_W,
          opacity: 0,
          pointerEvents: "none",
          zIndex: -1,
        }}
      >
        <div ref={measureRef}>{children}</div>
      </div>

      {/* One box per page */}
      <div style={{ display: "flex", flexDirection: "column", gap: PAGE_GAP }}>
        {Array.from({ length: numPages }, (_, i) => (
          <div
            key={i}
            style={{
              width: "100%",
              height: PAGE_H * scale,
              overflow: "hidden",
              position: "relative",
              backgroundColor: "#ffffff",
              boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
            }}
          >
            {/* Full content shifted upward so the correct "slice" is visible */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: PAGE_W,
                transform: `scale(${scale}) translateY(${-i * PAGE_H}px)`,
                transformOrigin: "top left",
              }}
            >
              {children}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
