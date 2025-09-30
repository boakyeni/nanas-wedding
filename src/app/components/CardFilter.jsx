"use client";

import React, { useEffect, useRef, useState } from "react";

export default function CardFilter({
  categories = [],
  selectedCategory = null,
  setSelectedCategory = () => {},
  className = "absolute right-6 top-4 z-30",
}) {
  const [open, setOpen] = useState(false);
  const popRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const onDocClick = (e) => {
      if (!popRef.current) return;
      if (!popRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  // Press Escape to close
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div ref={popRef} className={className}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="relative h-10 w-10 rounded-full bg-white/85 backdrop-blur-md shadow ring-1 ring-black/10 flex items-center justify-center active:scale-95 transition"
        title="Filter"
      >
        <FilterIcon className="h-5 w-5 text-neutral-800" />
        {/* Tiny badge when filtered */}
        {selectedCategory && (
          <span className="absolute -top-1 -right-1 h-5 min-w-5 px-1 rounded-full bg-black  text-[10px] leading-5 text-center">
            {abbr(selectedCategory)}
          </span>
        )}
      </button>

      {/* Dropdown (absolute, same as your original) */}
      {open && (
        <div
          role="listbox"
          tabIndex={-1}
          className="absolute right-0 top-12 w-56 rounded-2xl bg-white/95 backdrop-blur-md shadow-xl ring-1 ring-black/10 p-2 space-y-1"
        >
          {/* Show all (only when filtered) */}
          {selectedCategory && (
            <button
              className="w-full text-left px-3 py-2 rounded-xl hover:bg-neutral-100 text-[14px] font-medium text-neutral-800"
              onClick={() => {
                setSelectedCategory(null);
                setOpen(false);
              }}
            >
              Show all
            </button>
          )}

          {/* Categories */}
          {categories.map((c) => {
            const active = selectedCategory === c;
            return (
              <button
                key={c}
                className={`w-full text-left px-3 py-2 rounded-xl text-[14px] text-neutral-800 ${
                  active ? "purple-royal-gradient text-white" : "hover:bg-neutral-100"
                }`}
                onClick={() => {
                  setSelectedCategory(c);
                  setOpen(false);
                }}
              >
                {c}
              </button>
            );
          })}

          {!categories.length && (
            <div className="px-3 py-2 text-[13px] text-neutral-600">
              No categories available
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ------- tiny helpers (same as your original) ------- */

// “Abbreviate” a category for the badge—first letter & any uppercase after spaces, e.g. “Night Life” -> “NL”
function abbr(s) {
  const parts = String(s).trim().split(/\s+/);
  if (!parts.length) return "";
  const chars = parts.map((p) => p[0].toUpperCase());
  return chars.slice(0, 2).join(""); // max 2 chars for a neat badge
}

function FilterIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        d="M4 6h16M7 12h10M10 18h4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
