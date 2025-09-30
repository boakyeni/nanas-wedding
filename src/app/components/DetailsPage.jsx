// DetailsPage.jsx
"use client";
import React from "react";

export default function DetailsPage({
  gold = "from-[#b29043] via-[#f1c27d] to-[#b29043]",
  details = {
    date: "Jan. 3rd 2026",
    time: "1:00 PM",
    venue: "The UnderBridge by Accra Luxury Apartments",
    address: "Airport Residential Area, Accra",
    dressCode: "Formal",
    reception: "Reception to follow",
    notes: "Adults-only ceremony & reception, please.",
  },
  actions = {
    rsvpUrl: "/rsvp",
  },
}) {
  return (
    <div className="px-4 sm:px-6 pb-10">
      {/* Heading */}
      <div className="text-center mb-8 mt-4">
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight flex justify-around">
          <span className={`flex flex-row m-auto bg-clip-text text-transparent bg-gradient-to-b ${gold}`}>
            <span className="font-tangerine align-top  pb-5">The</span> <p className="pt-5 font-mono">DETAILS</p>
          </span>
        </h2>
      </div>

      {/* Blocks */}
      <div className="mt-6 space-y-6">
        <DetailBlock label="Dress Code" lines={[details.dressCode,"Gold and Navy accents"]} />
        <DetailBlock label="When" lines={[`${details.date}`, `${details.time}`]} />
        <DetailBlock label="Where" lines={[details.venue]} />
        <DetailBlock label="Reception" lines={[details.reception]} />
        {details.notes && <DetailBlock label="Notes" lines={[details.notes]} />}
        <DetailBlock label="Restrictions" lines={["We kindly request that guests avoid wearing white, ivory, champagne or beige to the wedding."]} />
      </div>

      {/* Actions */}
<div className="mt-8 grid grid-cols-2 gap-4">
  <ActionButton href="/guide" label="Wedding Guide" gradient="purple-royal-gradient" />
  <ActionButton href={actions.rsvpUrl} label="RSVP" gradient="gold-gradient" />
</div>
    </div>
  );
}

function DetailBlock({ label, lines = []}) {
  return (
    <div className="py-2 font-crimson">
      <div className="text-xl tracking-[0.25em] text-neutral-500 uppercase float-right">{label}</div>
      <div className={`mt-1 ml-1 text-[15px] sm:text-base w-[50%] text-neutral-800 leading-snug space-y-0.5`}>
        {lines.map((line, i) => (
          <div key={i}>{line}</div>
        ))}
      </div>
    </div>
  );
}

function ActionButton({ href, label, icon = null, gradient = "purple-royal-gradient", newTab = false }) {
  const rel = newTab ? "noopener noreferrer" : undefined;
  const target = newTab ? "_blank" : undefined;

  return (
    <a
      href={href}
      target={target}
      rel={rel}
      aria-label={label}
      className={[
        // layout: fills half the row via grid; big tap target
        "group relative flex h-16 sm:h-20 items-center justify-center rounded-2xl",
        // look & feel
        "text-white font-semibold tracking-tight",
        gradient,
        // affordance: shadow + ring + subtle hover/active
        "shadow-lg ring-1 ring-white/20",
        "transition-transform duration-150 ease-out",
        "hover:scale-[1.02] active:scale-95",
        "focus:outline-none focus-visible:ring-4 focus-visible:ring-white/40",
        "cursor-pointer select-none"
      ].join(" ")}
    >
      {/* gentle sheen on hover for “tap me” hint */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl bg-white/10 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
      />
      {/* content */}
      <span className="relative z-10 flex items-center gap-2">
        {icon ? <span className="text-xl">{icon}</span> : null}
        <span>{label}</span>
        {/* subtle nudge arrow (moves a hair on hover) */}
        <svg
          className="h-4 w-4 translate-x-0 transition-transform duration-200 group-hover:translate-x-0.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </a>
  );
}

