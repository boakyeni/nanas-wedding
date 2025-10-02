// MapWithLinks.jsx
"use client";
import React, { useEffect, useMemo, useState } from "react";

export default function MapWithLinks({ lat, lng, label, zoom = 15 }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const encodedLabel = useMemo(() => (label ? encodeURIComponent(label) : ""), [label]);

  // Prefer coords for determinism; include label when present
  const embedUrl = useMemo(() => {
    if (lat != null && lng != null) {
      // Center on coords; q=label (if any) helps show the name
      const q = encodedLabel ? encodedLabel : `${lat},${lng}`;
      return `https://maps.google.com/maps?q=${q}&z=${zoom}&output=embed`;
    }
    // Fallback to label-only
    return `https://maps.google.com/maps?q=${encodedLabel}&z=${zoom}&output=embed`;
  }, [lat, lng, encodedLabel, zoom]);

  const googleMapsUrl = encodedLabel
    ? `https://maps.google.com/?q=${encodedLabel}`
    : `https://maps.google.com/?q=${lat},${lng}`;

  const appleMapsUrl = `https://maps.apple.com/?ll=${lat},${lng}${encodedLabel ? `&q=${encodedLabel}` : ""}`;

  return (
    <div className="w-full mx-auto" suppressHydrationWarning>
      <div className="text-center mb-8 mt-2">
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight flex justify-around">
          <span className={`flex flex-row m-auto bg-clip-text text-transparent bg-gradient-to-b text-gradient-gold`}>
            <span className="font-tangerine align-top  pb-5">The</span> <p className="pt-5 font-mono">DESTINATION</p>
          </span>
        </h2>
      </div>
      {/* Map container: SSR shows a skeleton; client swaps in the iframe */}
      <div className="w-full rounded-lg overflow-hidden shadow-lg h-[300px] sm:h-[400px] lg:h-[500px]">
        {mounted ? (
          <iframe
            key={embedUrl}              // ensures refresh if props change
            title={label || "Google Map"}
            src={embedUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        ) : (
          // SSR placeholder to avoid hydration mismatch on iOS WebKit
          <div className="h-full w-full bg-neutral-200/50 animate-pulse" aria-hidden />
        )}
      </div>

      {/* Buttons */}
      <div className="mt-6 flex flex-col sm:flex-row gap-4 font-semibold font-montserrat tracking-tighter">
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 text-center py-3 px-6 rounded-lg font-semibold font-montserrat tracking-tighter shadow-lg transition transform hover:scale-105 purple-royal-gradient"
        >
        <div className="flex flex-col text-white">
        <span>Open in Google</span> <span>Maps</span>
        </div>
        </a>
        <a
          href={appleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 text-center py-3 px-6 rounded-lg font-semibold shadow-lg transition transform hover:scale-105 purple-royal-gradient"
        >
          <div className="flex flex-col text-white">
        Open in Apple <span>Maps</span>
        </div>
        </a>
      </div>
    </div>
  );
}
