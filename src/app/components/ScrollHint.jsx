"use client";
import React from "react";

export default function ScrollHint({
  text = "Scroll to see passport",
  className = "",
}) {
  return (
    <div className={`flex flex-col items-center gap-1 h-[15svh] pt-1 ${className}`}>
      <span className="text-[11px] tracking-widest text-neutral-500 uppercase">
        {text}
      </span>
      <svg
        className="h-4 w-4 text-neutral-500 animate-[floaty_2.2s_ease-in-out_infinite]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6 9l6 6 6-6" />
      </svg>

      <style jsx>{`
        @keyframes floaty {
          0% {
            transform: translateY(0);
            opacity: 0.7;
          }
          50% {
            transform: translateY(6px);
            opacity: 1;
          }
          100% {
            transform: translateY(0);
            opacity: 0.7;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-[floaty_2.2s_ease-in-out_infinite] {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}
