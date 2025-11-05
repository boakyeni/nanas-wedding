"use client";

import React, { useState } from "react";

/** -------------------------------------------
 *  Helpers (icons + tiny utilities)
 *  ------------------------------------------*/

const Section = ({ id, title, children }) => (
    <section id={id} className="scroll-mt-24">
        <h2 className="text-xl font-semibold">{title}</h2>
        <div className="mt-3">{children}</div>
    </section>
);

const Kbd = ({ children }) => (
    <kbd className="px-1.5 py-[1px] rounded-md border bg-white/70 text-[12px]">
        {children}
    </kbd>
);

const ArrowRight = (props) => (
    <svg viewBox="0 0 24 24" fill="none" className={props.className || "h-4 w-4"}>
        <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const Chevron = ({ open }) => (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
        <path
            d={open ? "M6 15l6-6 6 6" : "M6 9l6 6 6-6"}
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

/** Gradient pill (mobile-friendly, consistent size) */
function Pill({
    children,
    selected = false,
    size = "sm", // "sm" | "md"
    className = "",
}) {
    const base =
        "inline-flex items-center justify-center rounded-full text-white font-medium shadow-sm active:scale-95 transition";
    const grad = selected ? "purple-royal-gradient" : "dark-royal-gradient";
    const sizing =
        size === "md"
            ? "min-w-[96px] h-9 px-4 text-[13px] tracking-wide"
            : "min-w-[72px] h-8 px-3 text-xs tracking-wide";
    return (
        <span className={`${base} ${grad} ${sizing} ${className}`}>
            {children}
        </span>
    );
}

const InfoRow = ({ label, value }) => (
    <div className="flex items-start justify-between gap-3 py-2">
        <span className="text-[13px] text-neutral-600">{label}</span>
        <span className="text-[14px] font-medium text-neutral-900">{value}</span>
    </div>
);

const ExternalLink = ({ href, children }) => (
    <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 underline underline-offset-2"
    >
        {children} <ArrowRight />
    </a>
);

/** copy to clipboard (for phone numbers, codes) */
function Copyable({ text, children }) {
    const [copied, setCopied] = useState(false);
    return (
        <button
            type="button"
            onClick={async () => {
                try {
                    await navigator.clipboard.writeText(text);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 1200);
                } catch { }
            }}
            className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-neutral-100 text-[13px]"
            title="Copy"
        >
            {children}
            <span
                className={`transition-opacity ${copied ? "opacity-100" : "opacity-0"}`}
            >
                ✓
            </span>
        </button>
    );
}

/** Maps links (supports pasted URLs or coords fallback) */
function MapLinks({ coords, className = "" }) {
    if (!coords) return null;
    const { lat, lng, label, placeId, appleUrl, googleUrl } = coords;
    const encodedLabel = label ? encodeURIComponent(label) : "";
    const appleBuilt = `https://maps.apple.com/?ll=${lat},${lng}${encodedLabel ? `&q=${encodedLabel}` : ""
        }`;
    const googleBuilt = placeId
        ? `https://www.google.com/maps/search/?api=1&query_place_id=${encodeURIComponent(
            placeId
        )}`
        : `https://maps.google.com/?q=${lat},${lng}${encodedLabel ? `(${encodedLabel})` : ""
        }`;

    const appleHref = appleUrl || appleBuilt;
    const googleHref = googleUrl || googleBuilt;

    return (
        <div className={`flex flex-wrap gap-2 ${className}`}>
            <a
                href={googleHref}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-[#4285F4] text-white text-[13px] shadow"
            >
                Google Maps
            </a>
        </div>
    );
}

/** simple accordion */
function Accordion({ items }) {
    const [open, setOpen] = useState(items[0]?.id || null);
    return (
        <div className="divide-y divide-neutral-200 rounded-2xl border border-neutral-200 bg-white/80 overflow-hidden">
            {items.map((it) => {
                const isOpen = open === it.id;
                return (
                    <div key={it.id}>
                        <button
                            className="w-full px-4 py-3 flex items-center justify-between gap-3 text-left"
                            onClick={() => setOpen(isOpen ? null : it.id)}
                        >
                            <span className="font-medium">{it.title}</span>
                            <Chevron open={isOpen} />
                        </button>
                        <div
                            className={`px-4 pt-0 pb-4 text-[14px] text-neutral-800 transition-all ${isOpen ? "block" : "hidden"
                                }`}
                        >
                            {it.content}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

/** -------------------------------------------
 *  Page data (edit these arrays as you like)
 *  ------------------------------------------*/

const quickNav = [
    { id: "visa", label: "Visa" },
    { id: "hotels", label: "Hotels" },
    { id: "money", label: "Money" },
    { id: "connectivity", label: "SIM & Data" },
    
    { id: "transport", label: "Transport" },
    { id: "apps", label: "Apps" },
    
    { id: "packing", label: "Packing" },
    { id: "safety", label: "Safety" },
    { id: "faq", label: "FAQ" },
];

/** sample hotels — replace with your real picks and links */
const hotels = [
    {
        name: "AirBnB",
        area: "",
        tags: ["Serviced-Apartments"],
        image: "airbnb-logo.png",
        links: [{ label: "Website", url: "https://www.airbnb.com/" }],
        notes: "PLEASE NOTE: filter by GUEST FAVORITE when looking, always choose a host with many reviews, and confirm the address is actually where you booked after booking.",
    },
    {
        name: "Kempinski Hotel Gold Coast City",
        area: "Ridge, Accra",
        tags: ["Pool", "Spa", "5★"],
        phone: "+233 302 746 000",
        image: "kp.jpg",
        links: [{ label: "Website", url: "https://www.kempinski.com/en/accra" }],
        coords: { lat: 5.5566, lng: -0.1973, label: "Kempinski Accra" },
        notes: "Central, business-district location. Good for groups.",
    },
    {
        name: "Movenpick Ambassador Hotel Accra",
        area: "Accra",
        tags: ["Central", "5★"],
        phone: "+233 30 221 0630",
        image: "mah.jpg",
        links: [{ label: "Website", url: "https://movenpick.accor.com/en/africa/ghana/accra/moevenpick-ambassador-hotel-accra.html" }],
        coords: { lat: 5.5832, lng: -0.1518, label: "Movenpick Ambassador Hotel", googleUrl: "https://maps.app.goo.gl/2jHY1jkKessC1Btm9" },
        notes: "Ensure to book Accra location",
    },
    {
        name: "Number One Oxford Street",
        area: "Osu, Accra",
        tags: ["Central", "5★"],
        phone: "+233 59 692 0856",
        image: "oxford1.webp",
        links: [{ label: "Instagram", url: "https://www.instagram.com/no1oxfordstreet/?hl=en" }, { label: "Website", url: "https://1oxfordstreetaccra.com/" }],
        coords: { lat: 5.5607, lng: -0.1852, label: "No1 Oxford", googleUrl: "https://maps.app.goo.gl/eSXPpqiPgJVgKxpq5" },
        notes: "",
    },
    {
        name: "The Pelican Hotel",
        area: "Cantoments, Accra",
        tags: ["Central", "5★"],
        phone: "+233 59 692 0856",
        image: "pelican.jpg",
        links: [{ label: "Instagram", url: "https://www.instagram.com/thepelicanhotelaccra/?hl=en" }, { label: "Website", url: "https://www.thepelicanhotel.com/" }],
        coords: { lat: 5.5607, lng: -0.1852, label: "No1 Oxford", googleUrl: "https://maps.app.goo.gl/rYjst5RdWTej6gw87" },
        notes: "",
    },
        {
        name: "Kwarleyz",
        area: "Airport Residental, Accra",
        tags: ["Serviced-Apartments", "4★"],
        phone: "+233242439550",
        image: "kwarleyz.jpg",
        links: [{ label: "Instagram", url: "https://www.instagram.com/kwarleyzresidence/" }, { label: "Website", url: "https://kwarleyzresidence.com/" }],
        coords: { lat: 5.5607, lng: -0.1852, label: "No1 Oxford", googleUrl: "https://maps.app.goo.gl/h49LyQmmZdfycgNq7" },
        notes: "",
    },
    {
        name: "Fiesta Residences",
        area: "Cantoments, Accra",
        tags: ["Serviced-Apartments", "4★"],
        phone: "+233 30 274 0811",
        image: "fr.jpg",
        links: [{ label: "Website", url: "https://fiestaresidences.com/" }],
        coords: { lat: 5.5607, lng: -0.1852, label: "Fiesta Residences", googleUrl: "https://maps.app.goo.gl/zKBbXRecPhr1mZ8y6" },
        notes: "Great for longer stays; Ideal Location near Jubilee House",
    },
      {
        name: "Fiesta Royale Hotel",
        area: "Airport Residental, Accra",
        tags: ["Chalets", "4★"],
        image: "frh.jpg",
        phone: "+233 30 274 0811",
        links: [{ label: "Website", url: "https://fiestahospitality.com/" }],
        coords: { lat: 5.5607, lng: -0.1852, label: "Fiesta Royale Hotel", googleUrl: "https://maps.app.goo.gl/5q7QQ8k2mwPT3ZyDA" },
        notes: "Close to Accra Mall",
      },
    {
        name: "Lancaster Accra",
        area: "Airport Residental, Accra",
        tags: ["Pool", "4★"],
        image: "lh.jpg",
        phone: "+233 030 221 3161",
        links: [{ label: "Website", url: "https://lancasteraccra.com/" }],
        coords: { lat: 5.5607, lng: -0.1852, label: "Lancaster Accra", googleUrl: "https://maps.app.goo.gl/y3FEPUVrX78hNGHdA" },
        notes: "Proximity to Airport",
    },
        {
        name: "The African Reagent",
        area: "Airport Residental, Accra",
        tags: ["Pool", "4★"],
        image: "ar.jpg",
        phone: "+233591249521",
        links: [{ label: "Website", url: "https://www.theafricanregenthotel.com/" }],
        coords: { lat: 5.5607, lng: -0.1852, label: "Lancaster Accra", googleUrl: "https://maps.app.goo.gl/sRbeXGxGxi4f9mBR6" },
        notes: "Proximity to Airport",
    },
            {
        name: "La Palm Royal Beach Hotel",
        area: "La, Accra",
        tags: ["Pool", "4★"],
        image: "lapalm.jpg",
        phone: "+233302215111",
        links: [{ label: "Website", url: "https://lapalmroyalbeachhotel.com-accra.com/" }],
        coords: { lat: 5.5607, lng: -0.1852, label: "Lancaster Accra", googleUrl: "https://maps.app.goo.gl/J5bTsFtvoHmuMJLBA" },
        notes: "Beach Hotel",
    },
                {
        name: "La Villa Boutique",
        area: "Cantoments, Accra",
        tags: ["Pool", "3★"],
        image: "lvb1.jpeg",
        phone: "+233302730335",
        links: [{ label: "Website", url: "https://lavillaghana.com/" }],
        coords: { lat: 5.5607, lng: -0.1852, label: "Lancaster Accra", googleUrl: "https://maps.app.goo.gl/gh3CSTzRd4QAi1t46" },
        notes: "Beach Hotel",
    },
];

/** suggested apps */
const appList = [
    {
        name: "Uber / Bolt",
        blurb: "Door-to-door rides. Cash or card depending on driver.",
        stores: [
            { label: "iOS", url: "https://apps.apple.com/us/app/uber/id368677368" },
            {
                label: "Android",
                url: "https://play.google.com/store/apps/details?id=com.ubercab",
            },
        ],
    },
    {
        name: "Google Maps",
        blurb: "Best for navigation around Accra; download offline maps.",
        stores: [
            {
                label: "iOS",
                url: "https://apps.apple.com/us/app/google-maps/id585027354",
            },
            {
                label: "Android",
                url: "https://play.google.com/store/apps/details?id=com.google.android.apps.maps",
            },
        ],
    },
    {
        name: "Glovo / Jumia Food",
        blurb: "Food & grocery delivery. Good for late nights.",
        stores: [{ label: "Glovo", url: "https://glovoapp.com/" }],
    },
    {
        name: "XE Currency",
        blurb: "Quick conversions; works offline for recent rates.",
        stores: [
            {
                label: "iOS",
                url: "https://apps.apple.com/us/app/xe-currency-converter-rates/id315241195",
            },
            {
                label: "Android",
                url: "https://play.google.com/store/apps/details?id=com.xe.currency",
            },
        ],
    },
];

/** -------------------------------------------
 *  Page
 *  ------------------------------------------*/

export default function WeddingGuidePage() {
    return (
        <main className="mx-auto max-w-screen-sm sm:max-w-screen-md lg:max-w-screen-lg p-4 sm:p-6 text-neutral-900 font-montserrat">
            {/* Header */}
            <header className="sticky top-0 z-30 -mx-4 sm:-mx-6 px-4 sm:px-6 py-3 bg-[rgba(248,246,242,0.85)] backdrop-blur supports-[backdrop-filter]:bg-[rgba(248,246,242,0.65)] border-b border-neutral-200/60">
                <div className="flex items-center justify-between gap-3">
                    <h1 className="text-lg font-semibold tracking-tight">
                        Wedding Guide: All You Need to Know
                    </h1>
                    <a href="/" className="text-[13px] underline">
                        Back
                    </a>
                </div>
                {/* Quick section nav (horizontal scroll on mobile) */}
                <nav className="mt-2 flex gap-2 overflow-x-auto no-scrollbar">
                    {quickNav.map((s) => (
                        <a key={s.id} href={`#${s.id}`} className="shrink-0">
                            <Pill size="sm">{s.label}</Pill>
                        </a>
                    ))}
                </nav>
            </header>

            <div className="mt-5 space-y-10">
                {/* VISAS */}
                <Section id="visa" title="Visa & Entry">
                    <div className="rounded-2xl border border-neutral-200 bg-white/80 p-4">
                        <p className="text-[14px]">
                            Requirements vary by nationality. Many travelers need to apply in
                            advance; some can obtain an e-visa or visa on arrival with
                            pre-approval. Always confirm with your country’s Ghana consulate
                            or official portal before booking.
                        </p>
                        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="rounded-xl border border-neutral-200 p-3">
                                <h3 className="font-medium">What you’ll typically need</h3>
                                <ul className="mt-2 list-disc pl-5 text-[14px] space-y-1">
                                    <li>Passport valid 6+ months</li>
                                    <li>Return/onward ticket</li>
                                    <li>Accommodation address</li>
                                    <li>Yellow fever vaccination card</li>
                                </ul>
                            </div>
                            <div className="rounded-xl border border-neutral-200 p-3">
                                <h3 className="font-medium">Timing tips</h3>
                                <ul className="mt-2 list-disc pl-5 text-[14px] space-y-1">
                                    <li>Apply early (4–6 weeks is safe).</li>
                                    <li>Bring printed copies of confirmations.</li>
                                    <li>Keep digital scans in your phone (Files/Drive).</li>
                                </ul>
                            </div>
                        </div>

                        <div className="mt-3 text-[14px]">
                            <ExternalLink href="https://www.ghanaembassy.org/">
                                Official Embassy/High Commission links
                            </ExternalLink>
                        </div>
                    </div>
                </Section>

                                {/* HOTELS */}
                <Section id="hotels" title="Where to Stay (close to venues)">
                    <h1>Preferred Neighborhoods: Cantoments, East Legon, Airport Residential, and the general area</h1>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {hotels.map((h) => (
                            <div
                                key={h.name}
                                className="rounded-2xl border border-neutral-200 bg-white overflow-hidden"
                            >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={h.image}
                                    alt={h.name}
                                    className="w-full aspect-[16/10] object-cover"
                                />
                                <div className="p-4">
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <h3 className="font-semibold">{h.name}</h3>
                                            <p className="text-[13px] text-neutral-600">{h.area}</p>
                                        </div>
                                        <div className="flex gap-1.5 flex-wrap justify-end">
                                            {h.tags.map((t) => (
                                                <Pill key={t} size="sm">
                                                    {t}
                                                </Pill>
                                            ))}
                                        </div>
                                    </div>
                                    {h.notes && <p className="mt-2 text-[14px]">{h.notes}</p>}

                                    <div className="mt-3 flex flex-wrap items-center gap-2">
                                        <MapLinks coords={h.coords} />
                                        {h.phone && (
                                            <Copyable text={h.phone}>
                                                <a
                                                    href={`tel:${h.phone.replace(/[^\d+]/g, "")}`}
                                                    className="underline text-[13px]"
                                                >
                                                    {h.phone}
                                                </a>
                                            </Copyable>
                                        )}
                                        {h.links?.map((l) => (
                                            <ExternalLink key={l.url} href={l.url}>
                                                {l.label}
                                            </ExternalLink>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Section>

                                {/* MONEY */}
                <Section id="money" title="Money & Payments">
                    <div className="rounded-2xl border border-neutral-200 bg-white/80 p-4">
                        <div className="grid sm:grid-cols-2 gap-3">
                            <div className="rounded-xl border border-neutral-200 p-3">
                                <h3 className="font-medium">Cards & cash</h3>
                                <ul className="mt-2 list-disc pl-5 text-[14px] space-y-1">
                                    <li>Cards accepted at hotels and many restaurants.</li>
                                    <li>Carry some cash for markets & taxis.</li>
                                    <li>Use ATMs at known banks; avoid random kiosks.</li>
                                </ul>
                            </div>
                            <div className="rounded-xl border border-neutral-200 p-3">
                                <h3 className="font-medium">ATMs & rates</h3>
                                <ul className="mt-2 list-disc pl-5 text-[14px] space-y-1">
                                    <li>Withdraw larger amounts less often to reduce fees.</li>
                                    <li>
                                        Use a travel card without foreign transaction fees if
                                        possible.
                                    </li>
                                    <li>Keep small bills for tips.</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </Section>

                {/* CONNECTIVITY */}
                <Section id="connectivity" title="SIM & Data (Staying Connected)">
                    <Accordion
                        items={[
                            {
                                id: "sim-quick",
                                title: "Quick Start (most travelers)",
                                content: (
                                    <div className="space-y-2">
                                        <p>
                                            Bring a <strong>GSM unlocked phone</strong>. Visit MTN at Accra mall with your passport to purchase a sim card.
                                        </p>
                                        <ul className="list-disc pl-5 space-y-1">
                                            <li>
                                                Have your passport ready; some kiosks will also ask for
                                                a local contact.
                                            </li>
                                            <li>
                                                If you have an ECOWAS/Ghana card or a friend with one, bring it/them — speeds up
                                                registration.
                                            </li>
                                            <li>
                                                Consider eSIM if your device supports it (check carrier
                                                sites).
                                            </li>
                                            <li>
                                                BLU phones are a great cheap option on amazon G35 starts at $60. Please ensure it is GSM unlocked.
                                            </li>
                                        </ul>
                                    </div>
                                ),
                            },
                            {
                                id: "sim-without-id",
                                title: "No ECOWAS card? What to do",
                                content: (
                                    <div className="space-y-2">
                                        <p>
                                            You can still register with your passport at most carrier
                                            shops (MTN, Vodafone).
                                        </p>
                                        <p className="text-[13px] text-neutral-600">
                                            Note: processes change — ask the clerk for the simplest
                                            tourist package.
                                        </p>
                                    </div>
                                ),
                            },
                            {
                                id: "sim-apps",
                                title: "Data-saving & offline tips",
                                content: (
                                    <ul className="list-disc pl-5 space-y-1">
                                        <li>
                                            Download <strong>offline maps</strong> in Google Maps.
                                        </li>
                                        <li>Set photos to <strong>upload on Wi-Fi only</strong>.</li>
                                        <li>
                                            Use <Kbd>Low Data Mode</Kbd> / <Kbd>Data Saver</Kbd> on
                                            iOS/Android.
                                        </li>
                                    </ul>
                                ),
                            },
                        ]}
                    />
                </Section>



                {/* TRANSPORT */}
                <Section id="transport" title="Transport & Getting Around">
                    <Accordion
                        items={[
                            {
                                id: "rideshare",
                                title: "Ride-hailing (Uber/Bolt)",
                                content: (
                                    <div className="space-y-2">
                                        <p>
                                            Fastest way to move around the city. Share your trip
                                            status with friends, especially late night.
                                        </p>
                                        <ul className="list-disc pl-5">
                                            <li>
                                                Pin your pickup carefully (some streets are unnamed).
                                            </li>
                                            <li>Cash vs card varies by driver — carry small notes.</li>
                                        </ul>
                                    </div>
                                ),
                            },
                            {
                                id: "taxis",
                                title: "Taxis & hotel cars",
                                content: (
                                    <div>
                                        <p>
                                            Hotel cars cost more but are fixed-rate & convenient for
                                            events and airport runs.
                                        </p>
                                    </div>
                                ),
                            },
                            {
                                id: "late",
                                title: "Late-night tips",
                                content: (
                                    <ul className="list-disc pl-5">
                                        <li>Travel in pairs/groups; share live location.</li>
                                        <li>Confirm destination before starting the trip.</li>
                                    </ul>
                                ),
                            },
                        ]}
                    />
                </Section>

                {/* APPS */}
                <Section id="apps" title="Useful Apps">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {appList.map((a) => (
                            <div
                                key={a.name}
                                className="rounded-2xl border border-neutral-200 bg-white/80 p-4"
                            >
                                <div className="flex items-center justify-between">
                                    <h3 className="font-medium">{a.name}</h3>
                                    <Pill size="sm" selected>
                                        Install
                                    </Pill>
                                </div>
                                <p className="mt-1 text-[14px] text-neutral-700">{a.blurb}</p>
                                <div className="mt-2 flex flex-wrap gap-2 text-[13px]">
                                    {a.stores.map((s) => (
                                        <ExternalLink key={s.label} href={s.url}>
                                            {s.label}
                                        </ExternalLink>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </Section>



                {/* PACKING */}
                <Section id="packing" title="What to Pack">
                    <div className="rounded-2xl border border-neutral-200 bg-white/80 p-4">
                        <div className="grid sm:grid-cols-2 gap-3">
                            <div className="rounded-xl border border-neutral-200 p-3">
                                <h3 className="font-medium">Essentials</h3>
                                <ul className="mt-2 list-disc pl-5 text-[14px] space-y-1">
                                    <li>Yellow fever card</li>
                                    <li>Light, breathable outfits + one dressy look</li>
                                    <li>
                                        <span className="underline">
                                            <a
                                                href="https://www.cvs.com/shop/imodium-multisymptom-relief-6-ct-prodid-655643?skuId=655643&cgaa=QWxsb3dHb29nbGVUb0FjY2Vzc0NWU1BhZ2Vz&cid=ps_dh_pla&gclsrc=aw.ds&gad_source=4&gad_campaignid=21054315279&gclid=Cj0KCQjwuKnGBhD5ARIsAD19RsZFqrvHB8yixSFz-stYr2XpntyQ4K8z-p-nG4Gd0jhPoS_Bys014oAaArCxEALw_wcB"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                Imodium (Loperamide HCL)
                                            </a>
                                        </span>
                                        <ul className="list-disc pl-5 mt-1">
                                            <li>Trust us, you need this</li>
                                            <li>Recommended to purchase in US, may or may not be available at Panacea Pharmacy at Spintex Melcom</li>
                                        </ul>
                                    </li>
                                    <li>Mosquito repellent</li>
                                    <li>Comfortable walking shoes / sandals</li>
                                    <li>Power adapter (Type D/G), portable charger</li>
                                </ul>
                            </div>
                            <div className="rounded-xl border border-neutral-200 p-3">
                                <h3 className="font-medium">Nice-to-have</h3>
                                <ul className="mt-2 list-disc pl-5 text-[14px] space-y-1">
                                    <li>Small umbrella / light rain jacket</li>
                                    <li>Rehydration salts / basic meds</li>
                                    <a className="underline" href="https://www.amazon.com/Mophie-Powerstation-000mAh-Power-Bank/dp/B0DY2JYCG1/ref=sr_1_1_sspa?dib=eyJ2IjoiMSJ9.CxXsMIu2K6wBJAQJOBDXF7xNnyyYjg2ulTHppdgDDAxl8DZZvYgfqoQOpBUoZMi5EYfJyPqCPjRtAMWa21bU_sscFo4NL9OJGYcG65WM82K3wegbCNkDmj9D6wA9Xsgj8TRqoWK6CTmv4yp-4dE3mEMQWvTwTSFZ99JXxfB9uFgwcX4Jg4OZ5n_AGtf0SHvoYgmpj6k1VMMr2UlUfFplgkoOi4qkfqAn4cwUqTz2BWA.W_80ejWZhCiMN76_Jr1ODkq71wbN06pSSHkmLv4pYY0&dib_tag=se&hvadid=695135908028&hvdev=c&hvexpln=67&hvlocphy=1014389&hvnetw=g&hvocijid=7641990475612403820--&hvqmt=e&hvrand=7641990475612403820&hvtargid=kwd-588867239511&hydadcr=22197_13463224&keywords=mophie%2Bpower%2Bbank%2B20000mah&mcid=9f0e47e1586c308e814e8664887c477e&qid=1758154876&sr=8-1-spons&sp_csd=d2lkZ2V0TmFtZT1zcF9hdGY&th=1">
                                        <li>Power Bank</li>
                                    </a>
                                    <a className="underline" href="https://www.amazon.com/Handheld-VersionTECH-Rechargeable-Household-Traveling/dp/B01HGI0S6O/ref=sr_1_1?crid=2H29DYG4KGW96&dib=eyJ2IjoiMSJ9.huYIuRuZzBKZ6T_SBCioaIMnL-YP1ZuhRYrsJwSlUdhi3Cueu_xSeAeUAuiHbrF_VA6R5x6Re38PHtoMx_AGVPPvHQxTJYLPaSao9MPubJcZj_hvzu1vZCRz8GnMyK0vjnztAY_u58fb3z3Ur-i3aLMcZeG-Sk-fMLWtIZjvuKsuyFt8PNmVhNgSCmq7v5ifNBJ9DY4JZHgFhKX_V1WLkOKhYn2e9l_I43IxB8me94-7WXqK9RTAQsumcC7qRBwUSa3uvx3DjLlV_EmyMbcajoDdvQU2txkZ_KLp5wv-VSw.XisFa6EzohmAx-T-SRhEj9Q4_w8d2U10JNaVaTpuXRY&dib_tag=se&keywords=version%2Btech&qid=1762137540&sprefix=version%2Btec%2Caps%2C188&sr=8-1&th=1">
                                        <li>Portable Fan</li>
                                    </a>

                                </ul>
                            </div>
                        </div>
                    </div>
                </Section>

                {/* SAFETY */}
                <Section id="safety" title="Health & Safety">
                    <Accordion
                        items={[
                            {
                                id: "health",
                                title: "Health basics",
                                content: (
                                    <ul className="list-disc pl-5 space-y-1">
                                        <li>Drink <span className="font-bold">wrapped cap</span> bottled/filtered water.</li>
                                        <li>Use sunscreen; it’s sunny and humid.</li>
                                        <li>
                                            If you take meds, bring enough + prescriptions.
                                        </li>
                                    </ul>
                                ),
                            },
                            {
                                id: "safetycity",
                                title: "City tips",
                                content: (
                                    <ul className="list-disc pl-5 space-y-1">
                                        <li>
                                            Avoid flashing valuables; keep phones secure in crowds.
                                        </li>
                                        <li>Use ride-hailing at night; share your trip.</li>
                                    </ul>
                                ),
                            },
                            {
                                id: "emergency",
                                title: "Emergency contacts",
                                content: (
                                    <div className="space-y-2">
                                        <InfoRow
                                            label="General emergency"
                                            value={<Copyable text="112">112</Copyable>}
                                        />
                                        <InfoRow
                                            label="Nearest hospital (example)"
                                            value="Nyaho Medical Centre"
                                        />
                                        <InfoRow
                                            label="Bride’s point of contact"
                                            value={
                                                <Copyable text="+233 55 000 0000">
                                                    +233 55 000 0000
                                                </Copyable>
                                            }
                                        />
                                        <InfoRow
                                            label="Groom’s point of contact"
                                            value={
                                                <Copyable text="+233 55 111 1111">
                                                    +233 55 111 1111
                                                </Copyable>
                                            }
                                        />
                                    </div>
                                ),
                            },
                        ]}
                    />
                </Section>

                {/* FAQ */}
                <Section id="faq" title="FAQ">
                    <Accordion
                        items={[
                            {
                                id: "deadline",
                                title: "What is the RSVP deadline?",
                                content: (
                                    <p>
                                        Please RSVP or select attending status by December 1st, so we can have an accurate headcount.
                                    </p>
                                ),
                            },
                            {
                                id: "rsvp",
                                title: "What if I didn't RSVP in time?",
                                content: (
                                    <p>
                                        If we do not receive your RSVP or attending status by December 1st, it will automativally be marked as a "No". 
                                        We will miss celebrating with you but it is imperative we provide our vendors with a final guest count within the
                                        time they have given us. Thank you for understanding.
                                    </p>
                                ),
                            },
                            {
                                id: "parking",
                                title: "Where should I park?",
                                content: (
                                    <p>
                                        The venue has plenty of free parking.
                                    </p>
                                ),
                            },
                            {
                                id: "outdoors",
                                title: "Is the wedding indoors or outdoors?",
                                content: (
                                    <p>
                                        Ceremony will be outdoors. The reception will be indoors.
                                    </p>
                                ),
                            },
                            {
                                id: "dress",
                                title: "What should I wear?",
                                content: (
                                    <p>
                                        Smart casual for most events; the wedding ceremony will
                                        specify dress code on the invite. Light fabrics recommended.
                                    </p>
                                ),
                            },
                            {
                                id: "weather",
                                title: "What’s the weather like?",
                                content: (
                                    <p>
                                        Warm and humid. Expect highs in the 80s°F (upper 20s°C).
                                        Pack breathable clothing and stay hydrated.
                                    </p>
                                ),
                            },
                            {
                                id: "power",
                                title: "Do I need a power adapter?",
                                content: (
                                    <p>
                                        Yes — outlets are commonly Type D & G, 230V. Bring a
                                        universal adapter and a small power strip if you have
                                        devices.
                                    </p>
                                ),
                            },
                        ]}
                    />
                </Section>

                {/* Footer CTA */}
                <div className="rounded-2xl border border-neutral-200 bg-white/80 p-4 text-center">
                    <p className="text-[14px]">Questions not covered here?</p>
                    <div className="mt-2 flex items-center justify-center gap-3">
                        <a
                            href="mailto:wedding@example.com"
                            className="px-4 py-2 rounded-lg bg-neutral-900 text-white text-sm"
                        >
                            Email Us
                        </a>
                        <a
                            href="https://instagram.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 rounded-lg text-white text-sm purple-royal-gradient"
                        >
                            Instagram
                        </a>
                    </div>
                </div>
            </div>
        </main>
    );
}
