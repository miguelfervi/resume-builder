"use client";

import { useRef, useEffect, useState, ReactNode } from "react";

const PAGE_W = 794;
const PAGE_H = 1123;
const SEP_H = 8;

interface Props {
  children: ReactNode;
  singlePage?: boolean;
}

export function A4Container({ children, singlePage = false }: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [naturalH, setNaturalH] = useState(PAGE_H);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const ro = new ResizeObserver(() => setScale(wrapper.offsetWidth / PAGE_W));
    ro.observe(wrapper);
    setScale(wrapper.offsetWidth / PAGE_W);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const inner = innerRef.current;
    if (!inner) return;
    const ro = new ResizeObserver(() => setNaturalH(inner.scrollHeight));
    ro.observe(inner);
    setNaturalH(inner.scrollHeight);
    return () => ro.disconnect();
  }, []);

  const finalScale = singlePage && naturalH > PAGE_H
    ? (PAGE_H / naturalH) * scale
    : scale;

  const numPages = singlePage ? 1 : Math.max(1, Math.ceil(naturalH / PAGE_H));
  const wrapperH = singlePage
    ? PAGE_H * scale
    : naturalH * scale + (numPages - 1) * SEP_H;

  return (
    <div ref={wrapperRef} style={{ width: "100%", position: "relative", height: wrapperH }}>
      <div
        ref={innerRef}
        style={{
          width: PAGE_W,
          transformOrigin: "top left",
          transform: `scale(${finalScale})`,
          backgroundColor: "#ffffff",
          boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
          position: "absolute",
          top: 0,
          left: 0,
        }}
      >
        {children}
      </div>

      {/* Page break indicators */}
      {!singlePage && Array.from({ length: numPages - 1 }, (_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: (i + 1) * PAGE_H * scale + i * SEP_H,
            left: 0,
            right: 0,
            height: SEP_H,
            backgroundColor: "#e5e7eb",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span style={{ fontSize: 9, color: "#9ca3af", userSelect: "none" }}>
            Page {i + 2}
          </span>
        </div>
      ))}
    </div>
  );
}
