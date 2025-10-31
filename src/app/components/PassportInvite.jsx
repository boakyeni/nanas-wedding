"use client";

import React from "react";
import Image from "next/image";
import DetailsPage from "./DetailsPage";
import ThreeBackground from "./ThreeBackground_Contained";
import { useState } from "react";
import useDeviceOrientation from "../hooks/useDeviceOrientation";
import NamesWithFlorals from "./NamesWithFlorals";

export default function PassportInvite({
    couple = { bride: "Nana-Serwaa", groom: "Abdul Wahab" },
    meta = {
        type: "WEDDING",
        code: "GHANA",
        passportNo: "1234XY",
        date: "Jan. 3rd 2026",
        time: "1 PM",
        destination: "Accra, Ghana",
    },
    titleTop = "PASSPORT TO WEDDING",
    subtitle = "Please join us to celebrate the wedding of",
    photoUrl = "n_w2.jpeg",
    worldSvg = null,
}) {
    const gold = "from-[#b29043] via-[#f1c27d] to-[#b29043]";
    const [motionEnabled, setMotionEnabled] = useState(false);

    const orientation = useDeviceOrientation(motionEnabled);
    const deviceOrientation = { beta: orientation.beta, gamma: orientation.gamma };

    return (
        <section className="w-full bg-[#f8f6f2] rounded-[28px]">
            <div className="relative mx-auto w-full sm:max-w-md md:max-w-lg rounded-[28px]" >

                {/* Top gold band */}
                <div
                    className={`sticky top-0 bg-gradient-to-b purple-royal-gradient text-white py-5 px-3 sm:px-4 z-20`}
                >
                    <p className="text-center tracking-[0.25em] text-xl font-crimson font-medium text-gradient-gold">
                        {titleTop.toUpperCase()}
                    </p>
                </div>

                {/* Subtitle */}
                <p className="mt-5 text-[11px] tracking-widest text-neutral-600 text-center">
                    {subtitle.toUpperCase()}
                </p>

                {/* Names */}
                {/* <h1 className="my-5 text-center text-5xl md:text-5xl font-tangerine tracking-tight max-md:flex max-md:flex-col">
                    <span className={`bg-clip-text text-transparent bg-gradient-to-b ${gold}`}>
                        {couple.bride}
                    </span>
                    <span className="max-md:pb-3 md:mx-3 text-neutral-400 text-3xl">&amp;</span>
                    <span className={`pr-4 bg-clip-text text-transparent bg-gradient-to-b ${gold}`}>
                        {couple.groom}
                    </span>
                </h1> */}
                <NamesWithFlorals couple={couple} gold={gold} />

<div className="w-full overflow-x-hidden">
  <div className="relative inline-block mx-auto overflow-hidden">
    <div className="[&>svg]:block [&>svg]:w-full [&>svg]:h-auto [&>svg]:max-w-full">
      {worldSvg ? worldSvg : <PlaceholderWorld />}
    </div>

    <div className="absolute inset-0 pointer-events-none">
      <ThreeBackground
        deviceOrientation={deviceOrientation}
        motionEnabled={motionEnabled}
        // Optional tweaks:
        // arcHeight={0.3}
        // speed={0.06}
        // start={{ lon: -118.2437, lat: 34.0522 }}
        // end={{ lon: -0.1870,    lat:  5.6037 }}
      />
    </div>
  </div>
</div>

                {/* Book-gutter divider (clean & realistic) */}
                <div className="relative my-6 h-8 w-full">
                    {/* concave sink */}
                    <div className="absolute inset-0
       bg-[linear-gradient(to_bottom,transparent,rgba(0,0,0,0.22),transparent)]
       [mask-image:linear-gradient(to_right,transparent,black,transparent)]" />
                    {/* center seam */}
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
       h-px w-11/12 bg-black/30
       [mask-image:linear-gradient(to_right,transparent,black,transparent)]" />
                    {/* subtle specular highlight */}
                    <div className="absolute left-1/2 top-[calc(50%-1px)] -translate-x-1/2
       h-px w-2/3 bg-white/60 blur-[0.5px]
       [mask-image:linear-gradient(to_right,transparent,black,transparent)]" />
                </div>

                <div className="mx-2 relative overflow-hidden rounded-xl">
                    {/* Faded background world map */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Image
                            src="/world-map_3.svg"
                            alt="World map faded background"
                            fill
                            className="object-contain opacity-30 pointer-events-none select-none"
                        />
                    </div>
                    <div className="relative z-10">
                        {/* 3 small fields */}
                        <div className="mt-5 grid grid-cols-3 gap-3 text-[11px] font-crimson">
                            <InlineField label="TYPE" value={meta.type} />
                            <InlineField label="CODE" value={meta.code} />
                            <InlineField label="PASSPORT NO" value={meta.passportNo} />
                        </div>

                        {/* Two-column layout: photo left, data right */}
                        <div className="mt-5 grid grid-cols-3 gap-4 items-start">
                            {/* Photo */}
                            <div className="col-span-1">
                                {photoUrl ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={photoUrl}
                                        alt="Couple"
                                        className="w-full h-full object-cover aspect-square rounded-xl"
                                    />
                                ) : (
                                    <div className="aspect-square rounded-xl bg-neutral-200/40 flex items-center justify-center text-[11px] text-neutral-500">
                                        Photo
                                    </div>
                                )}
                            </div>

                            {/* Data */}
                            <div className="col-span-2 flex flex-col gap-2 font-crimson">
                                <LabelRow label="DATE" value={meta.date} />
                                <LabelRow label="TIME" value={meta.time} />
                                <LabelRow label="DESTINATION" value={meta.destination} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom stamp line */}
                <div className="mt-8">
                    <div className="h-px w-full bg-neutral-300/60" />
                    <div className="mt-2 flex items-center justify-center gap-2 text-[10px] tracking-widest text-neutral-500">
                        <span className="inline-block h-[10px] w-[10px] rounded-full bg-neutral-300" />
                        <span>CHEERS TO THE LOVELY COUPLE</span>
                        <span className="inline-block h-[10px] w-[10px] rounded-full bg-neutral-300" />
                    </div>
                    <div className="mt-2 h-px w-full " />
                </div>
                <DetailsPage />
            </div>
        </section>
    );
}

/* ---------- sub-components ---------- */

function InlineField({ label, value }) {
    return (
        <div className="flex flex-col">
            <span className="text-[10px] tracking-widest text-neutral-500">{label}</span>
            <span className="text-sm font-medium text-neutral-800">{value}</span>
        </div>
    );
}

function LabelRow({ label, value, className = "" }) {
    return (
        <div className={`flex flex-col ${className}`}>
            <span className="text-[10px] tracking-widest text-neutral-500">{label}</span>
            <span className="text-[15px] sm:text-base font-medium text-neutral-800 leading-snug">
                {value}
            </span>
        </div>
    );
}

function PlaceholderWorld() {
    return (
        <div className="w-full h-full flex items-center justify-center">
            <Image src="/world-map-whp2.svg" width={640} height={360} alt="World map with heart pin on ghana" />
        </div>
    );
}
