'use client';

import { useEffect, useMemo, useState } from 'react';

function diffParts(target) {
  const now = Date.now();
  const end = target.getTime();
  const d = Math.max(0, end - now);
  const days = Math.floor(d / 86400000);
  const hours = Math.floor((d % 86400000) / 3600000);
  const minutes = Math.floor((d % 3600000) / 60000);
  const seconds = Math.floor((d % 60000) / 1000);
  return { days, hours, minutes, seconds };
}

const pad = (n) => (n < 10 ? `0${n}` : `${n}`);

export default function Countdown({
  date = '2026-01-03T16:00:00Z', // wedding date in UTC
  title = 'Wedding Countdown',
  couple = 'Nana Serwaa & Abdul Wahab',
  tzNote = 'Accra, Ghana',
}) {
  const target = useMemo(() => new Date(date), [date]); // UTC via 'Z'

  // Mount gating to avoid SSR/CSR mismatch
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Timer state only after mount
  const [t, setT] = useState(null);
  useEffect(() => {
    if (!mounted) return;
    const tick = () => setT(diffParts(target));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [mounted, target]);

  // Format the date only on the client to avoid hydration mismatch
  const displayDate = useMemo(() => {
    if (!mounted) return '';
    try {
      return target.toLocaleDateString('en-GB', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'Africa/Accra',
      });
    } catch {
      // Fallback if Intl/timezone not available
      return target.toUTCString().slice(0, 16);
    }
  }, [mounted, target]);

  const isPast = t && Object.values(t).every((v) => v === 0);
  const isToday =
    t &&
    // compare calendar date in Accra on client only
    new Intl.DateTimeFormat('en-GB', { timeZone: 'Africa/Accra', year: 'numeric', month: '2-digit', day: '2-digit' })
      .format(target) ===
    new Intl.DateTimeFormat('en-GB', { timeZone: 'Africa/Accra', year: 'numeric', month: '2-digit', day: '2-digit' })
      .format(new Date()) &&
    !isPast;

  return (
    <div className="px-6 py-10 md:px-12 md:py-16 text-neutral-800">
      <div className="mx-auto max-w-2xl rounded-3xl border border-[#bfa76a]/40 bg-gradient-to-b from-white/5 to-white/[3%] backdrop-blur-sm shadow-[0_8px_40px_-20px_rgba(0,0,0,0.4)]">
        {/* Header */}
        <div className="px-8 pt-8 text-center">
          <div className="inline-flex items-center gap-2 text-xs tracking-[0.18em] uppercase text-gradient-gold">
            <span className="h-[1px] w-6 bg-amber-200/40" />
            {couple}
            <span className="h-[1px] w-6 bg-amber-200/40" />
          </div>

          <h3 className="mt-3 font-serif text-[28px] leading-tight ">{title}</h3>

          <p className="mt-2 text-xs" suppressHydrationWarning>
            {mounted ? displayDate : ''} {mounted && '•'} {tzNote}
          </p>
        </div>

        {/* Counter */}
        <div className="px-5 pb-8 pt-6 sm:px-8">
          {mounted && t && !isPast && (
            <div className="mx-auto grid max-w-lg grid-cols-4 gap-3 sm:gap-4">
              {[
                { label: 'Days', value: t.days },
                { label: 'Hours', value: t.hours },
                { label: 'Minutes', value: t.minutes },
                { label: 'Seconds', value: t.seconds },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="rounded-2xl border border-white/10 bg-amber-50/5 px-3 py-4 text-center"
                >
                  <div className="font-[650] tracking-tight text-3xl sm:text-4xl md:text-5xl ">
                    {label === 'Days' ? value : pad(value)}
                  </div>
                  <div className="mt-1 text-[10px] sm:text-xs uppercase tracking-[0.22em] ">
                    {label}
                  </div>
                </div>
              ))}
            </div>
          )}

          {mounted && t && isToday && (
            <div className="mx-auto max-w-md text-center text-neutral-800">
              <div className="mt-2 rounded-2xl border border-amber-200/30 bg-amber-50/5 px-6 py-5">
                <p className="font-serif text-lg ">It’s today 🤍</p>
                <p className="mt-1 text-sm ">We can’t wait to celebrate with you.</p>
              </div>
            </div>
          )}

          {mounted && t && isPast && (
            <div className="mx-auto max-w-md text-center">
              <div className="mt-2 rounded-2xl border border-amber-200/30 bg-amber-50/5 px-6 py-5">
                <p className="font-serif text-lg ">We’re married!</p>
                <p className="mt-1 text-sm ">Thank you for being part of our day.</p>
              </div>
            </div>
          )}
        </div>

        {/* Bottom divider */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-[#bfa76a]/50 to-transparent" />
      </div>
    </div>
  );
}
