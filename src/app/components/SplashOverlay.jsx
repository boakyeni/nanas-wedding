"use client";

import React from "react";
import { useSearchParams } from "next/navigation";

export default function SplashOverlay({
    initialInvitee = '',
    baseMessage = "You are formally invited",
    delay = 2000,
    fadeMs = 1000,
    showOnce = "session", // "session" | "local" | "off"
    storageKey = "hasSeenSplash:v1", // same key, no breaking change
    nameParam = "name",
}) {
    const searchParams = useSearchParams();
    const [render, setRender] = React.useState(false);
    const [visible, setVisible] = React.useState(false);

    // derive display message
    const sp = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
    const invitee = (initialInvitee || sp?.get(nameParam) || "").trim();
    const heading = invitee ? `${baseMessage}, ${invitee}` : baseMessage;

    // storage backend
    const store = React.useMemo(() => {
        if (showOnce === "local")
            return typeof window !== "undefined" ? window.localStorage : null;
        if (showOnce === "session")
            return typeof window !== "undefined" ? window.sessionStorage : null;
        return null;
    }, [showOnce]);

    React.useEffect(() => {
        let t1, t2;
        const alreadySeen = (() => {
            try {
                return store?.getItem(storageKey) === "1";
            } catch {
                return false;
            }
        })();
        if (alreadySeen) return;

        // lock scroll
        if (typeof document !== "undefined") {
            document.body.style.overflow = "hidden";
        }

        setRender(true);
        const raf = requestAnimationFrame(() => setVisible(true));

        t1 = setTimeout(() => {
            setVisible(false);
            try {
                store?.setItem(storageKey, "1");
            } catch { }
        }, delay);

        t2 = setTimeout(() => {
            setRender(false);
            // unlock scroll
            if (typeof document !== "undefined") {
                document.body.style.overflow = "";
            }
        }, delay + fadeMs + 50);

        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
            cancelAnimationFrame(raf);
        };
    }, [delay, fadeMs, storageKey, store]);

    if (!render) return null;

    return (
        <div
            aria-hidden
            className={`fixed inset-0 z-[9999] grid place-items-center transition-opacity ease-out ${visible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                }`}
            style={{
                transitionDuration: `${fadeMs}ms`,
                background: `
          radial-gradient(150% 100% at 50% 20%, rgba(0,0,0,0.65), transparent 70%),
          linear-gradient(135deg,#2e003e,#4b0c5d,#1a001f)
        `,
            }}
        >
            <div className="mx-6 max-w-2xl w-full">
                <div className="relative overflow-hidden rounded-[2rem] border border-white/20 bg-white/10 backdrop-blur-xl px-10 py-14 text-center shadow-[0_35px_120px_rgba(0,0,0,0.7)]">
                    {/* top gold accent */}
                    {/* <div className="absolute inset-x-0 top-0 h-[4px] bg-gradient-to-r from-[#b98c45] via-[#f6d594] to-[#b98c45]" /> */}

                    {/* corner flourishes */}
                    <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-[#f5d78f]/70 rounded-tl-xl" />
                    <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-[#f5d78f]/70 rounded-tr-xl" />
                    <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-[#f5d78f]/70 rounded-bl-xl" />
                    <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-[#f5d78f]/70 rounded-br-xl" />

                    {/* crest circle */}
                    <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-white/10 ring-2 ring-[#f6d594]/40 shadow-lg">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-[#b98c45] via-[#f6d594] to-[#b98c45] shadow-inner" />
                    </div>

                    {/* heading */}
                    <h1 className="text-5xl sm:text-6xl font-tangerine font-semibold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-[#fff9e6] via-[#ffe8a3] to-[#f0d27c] drop-shadow-[0_3px_8px_rgba(0,0,0,0.5)]">
                        {baseMessage}
                        {invitee && (
                            <span className="block mt-4">{invitee}</span>
                        )}
                    </h1>

                    {/* subheading */}
                    {invitee && (
                        <p className="mt-5 text-lg sm:text-xl font-montserrat text-white/85">
                            We look forward to celebrating with you.
                        </p>
                    )}

                    {/* divider */}
                    <div className="mx-auto my-8 h-px w-48 bg-gradient-to-r from-transparent via-[#f5d78f] to-transparent opacity-90" />

                    {/* footer */}
                    <p className="text-sm sm:text-base text-white/70 tracking-wide italic">
                        loading the experience…
                    </p>

                    {/* shimmer sweep */}
                    <div className="absolute inset-0 -skew-x-12 opacity-0 animate-[shine_3s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                </div>
            </div>

            {/* sparkles */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {Array.from({ length: 25 }).map((_, i) => {
                    const size = Math.random() * 3 + 2;
                    const left = Math.random() * 100;
                    const top = Math.random() * 100;
                    const duration = 3 + Math.random() * 4;
                    return (
                        <div
                            key={i}
                            className="absolute rounded-full bg-white"
                            style={{
                                width: size,
                                height: size,
                                left: `${left}%`,
                                top: `${top}%`,
                                opacity: 0.8,
                                animation: `twinkle ${duration}s ease-in-out infinite`,
                            }}
                        />
                    );
                })}
            </div>

            <style jsx>{`
        @keyframes shine {
          0% {
            opacity: 0;
            transform: translateX(-100%) skewX(-12deg);
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translateX(100%) skewX(-12deg);
          }
        }
        @keyframes twinkle {
          0%,
          100% {
            opacity: 0;
            transform: scale(0.8);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
        }
      `}</style>
        </div>
    );
}
