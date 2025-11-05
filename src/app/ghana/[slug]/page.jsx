import React from "react";
import { ghanaActivities } from "@/app/data/ghanaActivities";

// Basic currency formatting for GHS
function formatGHS(n) {
  try {
    return new Intl.NumberFormat("en-GH", {
      style: "currency",
      currency: "GHS",
      maximumFractionDigits: 0,
    }).format(n);
  } catch {
    return `₵${Math.round(n)}`;
  }
}

// Platform-aware Maps URL (runs client-side only for UA check)
function buildMapsHref(activity) {
  if (!activity.coordinates) return undefined;
  const { lat, lng, label } = activity.coordinates;
  const labelEnc = label ? encodeURIComponent(label) : `${lat},${lng}`;
  if (typeof navigator !== "undefined" && /iPhone|iPad|iPod/i.test(navigator.userAgent)) {
    return `https://maps.apple.com/?ll=${lat},${lng}&q=${labelEnc}`;
  }
  return `https://maps.google.com/?q=${labelEnc}`;
}

export default function ActivityDetailPage({ params }) {
  const slug = decodeURIComponent(params?.slug);
  const activity = ghanaActivities.find((a) => a.slug === slug);

  if (!activity) {
    return (
      <main className="mx-auto max-w-screen-sm p-6">
        <h1 className="text-2xl font-semibold">Not found</h1>
        <p className="mt-2 ">That activity doesn’t exist. Go back to the list.</p>
        <a href="/#activities" className="mt-4 inline-block underline">Home</a>
      </main>
    );
  }

  const mapsHref = buildMapsHref(activity);

  return (
    <main className="mx-auto max-w-screen-sm p-6 text-neutral-900">
      <h1 className="text-2xl font-semibold">{activity.title}</h1>
      {activity.area && <p className="mt-1 ">{activity.area}</p>}

      {/* Hero */}
      <div className="mt-4 overflow-hidden rounded-2xl">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={activity.image} alt={activity.title} className="w-full object-cover aspect-[16/9]" />
      </div>

      {/* About */}
      <section className="mt-6">
        <h2 className="text-xl font-semibold">About</h2>
        <p className="mt-2 ">{activity.blurb}</p>
      </section>

      {/* Costs */}
      {activity.costs?.length > 0 && (
        <section className="mt-6">
          <h2 className="text-xl font-semibold">Estimated Costs</h2>
          <div className="mt-3 space-y-2">
            {activity.costs.map((c, i) => (
              <div key={i} className="flex items-center justify-between rounded-xl border border-neutral-200/70 bg-white/80 px-4 py-3 shadow-sm">
                <span className="text-[13px] ">
                  {c.label}{c.per ? ` (${c.per})` : ""}
                </span>
                <span className="text-[14px] font-semibold">
                  {formatGHS(c.amount)}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Transport */}
      {activity.transport?.length > 0 && (
        <section className="mt-6">
          <h2 className="text-xl font-semibold">Getting There</h2>
          <ul className="mt-3 space-y-3">
            {activity.transport.map((t, i) => (
              <li key={i} className="rounded-xl border border-neutral-200/70 bg-white/80 px-4 py-3 shadow-sm">
                <p className="text-[12px] uppercase tracking-wider ">{t.mode}</p>
                <p className="text-[14px]  mt-0.5">{t.advice}</p>
                {t.bestTime && <p className="text-[12px]  mt-0.5">Best: {t.bestTime}</p>}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Best Time */}
      {activity.bestTime && (
        <section className="mt-6">
          <h2 className="text-xl font-semibold">Best Time</h2>
          <p className="mt-2 ">{activity.bestTime}</p>
        </section>
      )}

      {/* Links */}
      {activity.links?.length > 0 && (
        <section className="mt-6">
          <h2 className="text-xl font-semibold">Links</h2>
          <ul className="mt-3 grid gap-2">
            {activity.links.map((l, i) => (
              <li key={i}>
                <a
                  href={l.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 underline text-[14px]"
                >
                  <span>{l.label}</span>
                  <span aria-hidden>↗</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Maps CTA */}
      {mapsHref && (
        <div className="mt-8">
          <a
            href={mapsHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block py-3 px-6 rounded-xl text-white font-semibold tracking-tight shadow-lg bg-gradient-to-r from-[#b29043] via-[#f1c27d] to-[#b29043]"
          >
            Open in Maps
          </a>
        </div>
      )}

      {/* Back */}
      <div className="mt-6">
        <a href="/#activities" className="underline">← Back to list</a>
      </div>
    </main>
  );
}
