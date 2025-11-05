"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { ghanaActivities } from "@/app/data/ghanaActivities";

/* ---------- helpers ---------- */

function priceLevel(input) {
    if (input == null) return "";

    // allow passing a number or a string
    const str = String(input).trim();

    // if it's already dollar signs, just return it
    if (/^\$+$/.test(str)) return str;

    // try to parse a number
    const num = parseFloat(str.replace(/[^\d.]/g, ""));
    if (isNaN(num)) return "";

    // map numeric ranges to $ signs (tweak thresholds however you want)
    if (num <= 10) return "$";
    if (num <= 50) return "$$";
    if (num <= 150) return "$$$";
    return "$$$$";
}

function getInstagramUrl(links = []) {
    const ig = links.find((l) => l.label?.toLowerCase() === "instagram");
    return ig ? ig.url : null;
}
function getWebsiteUrl(links = []) {
    const ig = links.find((l) => l.label?.toLowerCase() === "website");
    return ig ? ig.url : null;
}

function sanitizeTel(phone) {
    if (!phone) return null;
    const digits = String(phone).replace(/[^\d+]/g, "");
    return digits || null;
}

/** Prefer phone-copied URLs when present; otherwise fall back to coords/label/placeId */
function MapLinks({ coords, className = "" }) {
    if (!coords) return null;
    const {
        lat,
        lng,
        label,
        placeId,
        appleUrl: appleDirect,
        googleUrl: googleDirect,
    } = coords;

    const encodedLabel = label ? encodeURIComponent(label) : "";
    const appleBuilt = `https://maps.apple.com/?ll=${lat},${lng}${encodedLabel ? `&q=${encodedLabel}` : ""
        }`;
    const googleBuilt = placeId
        ? `https://www.google.com/maps/search/?api=1&query_place_id=${encodeURIComponent(
            placeId
        )}`
        : `https://maps.google.com/?q=${lat},${lng}${encodedLabel ? `(${encodedLabel})` : ""
        }`;

    const appleHref = appleDirect || appleBuilt;
    const googleHref = googleDirect || googleBuilt;

    return (
        <span className={`inline-flex flex-wrap gap-2 ${className}`}>
            <a
                href={googleHref}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-[#4285F4] text-white text-[13px] font-medium shadow"
            >
                Google Maps
            </a>
        </span>
    );
}

/* ---------- page ---------- */

export default function CollectionPage() {
    const params = useParams();
    const slug = decodeURIComponent((params?.slug ?? "").toString());

    const collection =
        ghanaActivities.find(
            (a) => a.slug === slug && Array.isArray(a.locations)
        ) || null;

    if (!collection) {
        return (
            <main className="mx-auto max-w-screen-lg p-6">
                <h1 className="text-2xl font-semibold">Not found</h1>
                <p className="mt-2 text-neutral-600">That collection doesn't exist.</p>
                <a href="/#activities" className="mt-4 inline-block underline">
                    ← Back to list
                </a>
            </main>
        );
    }

    const allTags = useMemo(() => {
        const s = new Set();
        collection.locations.forEach((l) =>
            (l.tags || []).forEach((t) => s.add(t))
        );
        return Array.from(s).sort();
    }, [collection]);

    const [query, setQuery] = useState("");
    const [tag, setTag] = useState(null);
    const [activeId, setActiveId] = useState(collection.locations[0]?.id);

    const filtered = useMemo(() => {
        return collection.locations.filter((l) => {
            const matchesTag = !tag || (l.tags || []).includes(tag);
            const matchesQ =
                !query ||
                `${l.name} ${l.area} ${l.blurb}`
                    .toLowerCase()
                    .includes(query.toLowerCase());
            return matchesTag && matchesQ;
        });
    }, [collection.locations, query, tag]);

    // Keep activeId valid when filters/search change
    useEffect(() => {
        if (!filtered.some((l) => l.id === activeId)) {
            setActiveId(filtered[0]?.id);
        }
    }, [filtered, activeId]);

    const active =
        filtered.find((l) => l.id === activeId) || filtered[0] || null;

    return (
        <main className="mx-auto max-w-screen-xl p-4 sm:p-6 text-neutral-900">
            {/* Header */}
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold font-crimson">{collection.title}</h1>
                    {collection.subtitle && (
                        <p className="text-neutral-600 font-crimson">{collection.subtitle}</p>
                    )}
                </div>
                <a href="/#activities" className="underline text-sm">
                    ← Back to list
                </a>
            </div>

            {/* Controls */}
            <div className="mt-4 flex flex-wrap items-center gap-2">
<div className="flex-1 min-w-[220px]">
  {/* Gradient ring with lighter purple → gold */}
  <div
    className="rounded-xl p-[2px]"
    style={{
      background: "linear-gradient(135deg, #6d28d9, #E9D8A6)", // light purple → gold
    }}
  >
    <input
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Search spots, areas, vibe…"
      className="w-full rounded-[10px] bg-white px-4 py-2 text-[14px] text-neutral-900 shadow-sm 
                 focus:outline-none focus:ring-2 focus:ring-[#E9D8A6]/60"
    />
  </div>
</div>

                {/* Tag filters */}
                <div className="flex gap-2 overflow-x-auto no-scrollbar">
                    <button
                        onClick={() => setTag(null)}
                        className={`h-[40px] min-w-[90px] rounded-full text-sm ${tag ? "bg-neutral-200" : "purple-royal-gradient text-white"
                            }`}
                    >
                        All
                    </button>
                    {allTags.map((t) => (
                        <button
                            key={t}
                            onClick={() => setTag(t)}
                            className={`h-[40px] min-w-[90px] rounded-full text-sm ${tag === t ? "purple-royal-gradient text-white" : "bg-neutral-200"
                                }`}
                        >
                            {t}
                        </button>
                    ))}
                </div>
            </div>

            {/* Layout: mobile single column; lg+ two columns (list + detail) */}
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* List */}
                <div className="lg:col-span-5 lg:max-h-[calc(100vh-220px)] lg:overflow-auto lg:pr-2">
                    {filtered.length === 0 && (
                        <div className="rounded-xl border border-neutral-200 bg-white/60 p-6 text-center text-neutral-600">
                            No spots match your filters.
                        </div>
                    )}

                    <div className="grid sm:grid-cols-2 lg:grid-cols-1 gap-4">
                        {filtered.map((l) => {
                            const isActive = active && active.id === l.id;
                            const ig = getInstagramUrl(l?.links);
                            const tel = sanitizeTel(l.phone);
                            const website = getWebsiteUrl(l?.links)

                            return (
                                <div key={l.id} className="flex flex-col font-montserrat">
                                    <button
                                        onClick={() => setActiveId(l.id)}
                                        aria-expanded={isActive}
                                        className={`text-left rounded-2xl overflow-hidden border shadow-sm transition ring-1 ring-black/5 ${isActive
                                            ? "bg-white border-neutral-300"
                                            : "bg-white/80 border-neutral-200 hover:border-neutral-300"
                                            }`}
                                    >
                                        {/* image */}
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={l.image}
                                            alt={l.name}
                                            className="w-full aspect-[16/10] object-cover"
                                        />

                                        <div className="p-4">
                                            <div className="flex items-start justify-between gap-3">
                                                <div>
                                                    <h3 className="font-semibold">{l.name}</h3>
                                                    <p className="text-[13px] text-neutral-900">
                                                        {l.area}
                                                    </p>
                                                    {!collection.tags?.some(t => t.toLowerCase() === "food") && l.costs?.length > 0 && (
                                                        <div className="mt-1 text-xs text-neutral-900">
                                                            {l.costs.map((c, i) => (
                                                                <p key={i}>
                                                                    {c.label} · {priceLevel(c.amount)} {c.per ? ` · per ${c.per}` : ""}
                                                                </p>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                                {l.costs?.[0] && (
                                                    <span className="text-[12px] rounded-full bg-neutral-100 px-2 py-1">
                                                        {priceLevel(l.costs[0].amount)}
                                                    </span>
                                                )}
                                            </div>

                                            {l.tags?.length > 0 && (
                                                <div className="mt-2 flex flex-wrap gap-1">
                                                    {l.tags.slice(0, 3).map((t) => (
                                                        <span
                                                            key={t}
                                                            className="text-[11px] px-2 py-1 rounded-full bg-neutral-100"
                                                        >
                                                            {t}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}

                                            <p className="mt-2 text-[14px] text-neutral-700">
                                                {l.blurb}
                                            </p>

                                            {/* MOBILE: expanded details INSIDE the card */}
                                            <div
                                                className={`lg:hidden overflow-hidden transition-all duration-200`}
                                            >
                                                {l.bestTime && (
                                                    <p className="text-[13px] text-neutral-700">
                                                        <strong>Best time:</strong> {l.bestTime}
                                                    </p>
                                                )}

                                                {/* Actions row */}
                                                <div className="mt-2 flex flex-wrap items-center gap-2">
                                                    <MapLinks coords={l.coordinates} />
                                                    {ig && (
                                                        <a
                                                            href={ig}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#b29043] via-[#f1c27d] to-[#b29043] text-white text-[13px] font-medium shadow"
                                                            onClick={(e) => e.stopPropagation()}
                                                        >
                                                            Instagram
                                                        </a>
                                                    )}
                                                    {tel && (
                                                        <a
                                                            href={`tel:${tel}`}
                                                            className="px-3 py-1.5 rounded-lg bg-neutral-100 text-[13px] font-medium shadow ring-1 ring-black/5"
                                                            onClick={(e) => e.stopPropagation()}
                                                        >
                                                            {l.phone}
                                                        </a>
                                                    )}
                                                    {website && (
                                                        <a
                                                            href={website}
                                                            className="px-3 py-1.5 rounded-lg bg-neutral-100 text-[13px] font-medium shadow ring-1 ring-black/5"
                                                            onClick={(e) => e.stopPropagation()}
                                                        >
                                                            Website
                                                        </a>
                                                    )}
                                                </div>
                                            </div>

                                            {/* DESKTOP: minimal actions in list (optional) */}
                                            <div className="hidden lg:block">
                                                <MapLinks coords={l.coordinates} className="mt-3" />
                                            </div>
                                        </div>
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Detail preview (desktop only) */}
                <div className="lg:col-span-7 lg:block hidden">
                    {!active ? (
                        <div className="rounded-2xl border border-neutral-200 bg-white/60 p-6 text-neutral-600">
                            Select a spot to see details.
                        </div>
                    ) : (
                        <div className="rounded-2xl overflow-hidden border border-neutral-200 bg-white shadow-sm">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={active.image}
                                alt={active.name}
                                className="w-full aspect-[16/9] object-cover"
                            />
                            <div className="p-6">
                                <h2 className="text-xl font-semibold">{active.name}</h2>
                                <p className="text-neutral-900">{active.area}</p>
                                <p className="mt-3 text-neutral-800">{active.blurb}</p>

                                {active.bestTime && (
                                    <p className="mt-3 text-[14px] text-neutral-700">
                                        <strong>Best time:</strong> {active.bestTime}
                                    </p>
                                )}

                                {/* {active.costs?.length > 0 && (
                  <div className="mt-4 grid sm:grid-cols-2 gap-2">
                    {active.costs.map((c, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between rounded-xl border border-neutral-200 bg-white/80 px-4 py-3"
                      >
                        <span className="text-[13px] text-neutral-600">
                          {c.label}
                          {c.per ? ` (${c.per})` : ""}
                        </span>
                        <span className="text-[14px] font-semibold">
                          {priceLevel(c.amount)}
                        </span>
                      </div>
                    ))}
                  </div>
                )} */}

                                {/* Desktop actions */}
                                <div className="mt-4 flex flex-wrap items-center gap-2">
                                    <MapLinks coords={active.coordinates} />
                                    {getInstagramUrl(active?.links) && (
                                        <a
                                            href={getInstagramUrl(active?.links)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#b29043] via-[#f1c27d] to-[#b29043] text-white text-[13px] font-medium shadow"
                                        >
                                            Instagram
                                        </a>
                                    )}
                                    {sanitizeTel(active.phone) && (
                                        <a
                                            href={`tel:${sanitizeTel(active.phone)}`}
                                            className="px-3 py-1.5 rounded-lg bg-neutral-100 text-[13px] font-medium shadow ring-1 ring-black/5"
                                        >
                                            {active.phone}
                                        </a>
                                    )}
                                    {getWebsiteUrl(active?.links) && (
                                        <a
                                            href={getWebsiteUrl(active?.links)}
                                            className="px-3 py-1.5 rounded-lg bg-neutral-100 text-[13px] font-medium shadow ring-1 ring-black/5"
                                        >
                                            Website
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
