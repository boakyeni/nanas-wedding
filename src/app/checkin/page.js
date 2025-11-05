'use client';

import React, { useEffect, useMemo, useState, useCallback } from 'react';
import Fuse from 'fuse.js';
import { AnimatePresence, motion, MotionConfig } from 'framer-motion';

const VENUE_NAME = "The Underbridge";
const VENUE_ADDRESS = "2a Justice Azu Crabbe St, Accra, Ghana";
const MAPS_URL = "https://maps.app.goo.gl/bPWBdS54viRJZrPg9";
const WEBSITE_URL = "https://nanaandwahabwedding.com/invitation";
const GUIDE_URL = "https://nanaandwahabwedding.com/guide";
const RSVP_LINK = "https://nanaandwahabwedding.com/checkin";

const API = {
    getGuest: (id) => `/api/guests/${id}`,
    guests: '/api/guests',
    patchGuest: (id) => `/api/guests/${id}`,
    sendConfirmations: (id) => `/api/guests/${id}/send_confirmations`,
};

async function jsonFetch(url, init) {
    const res = await fetch(url, {
        ...init,
        headers: {
            ...(init?.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
        },
        cache: 'no-store',
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
}

const fade = {
    initial: { opacity: 0, y: 16, filter: 'blur(4px)' },
    animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
    exit: { opacity: 0, y: -16, filter: 'blur(4px)' },
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1.0] },
};

const fadeParent = {
    animate: { transition: { staggerChildren: 0.06, delayChildren: 0.04 } },
};
const fadeItem = {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

function safeTrim(s) {
    return (typeof s === 'string' ? s : '').trim();
}
function safeName(g) {
    const dn = safeTrim(g.displayName);
    if (dn) return dn;
    const first = safeTrim(g.firstName);
    const last = safeTrim(g.lastName);
    const combo = [first, last].filter(Boolean).join(' ').trim();
    return combo;
}

const isEmail = (s) => /^\S+@\S+\.\S+$/.test(s);
const isPhone = (s) => /^[+()\-\s\d]{6,}$/.test(s);

export default function CheckinPage() {
    const [guests, setGuests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [selected, setSelected] = useState(null);
    const [partyMembers, setPartyMembers] = useState([]);
    const [saving, setSaving] = useState(false);
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');



    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                const data = await jsonFetch(API.guests);
                const cleaned = Array.isArray(data)
                    ? data.map(g => ({
                        ...g,
                        displayName: safeTrim(g.displayName),
                        firstName: safeTrim(g.firstName),
                        lastName: safeTrim(g.lastName),
                        email: safeTrim(g.email),
                        partyLabel: safeTrim(g.partyLabel),
                        phone: safeTrim(g.phone),
                    }))
                    : [];
                setGuests(cleaned);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const searchableGuests = useMemo(() => guests.filter(g => safeName(g)), [guests]);

    const fuse = useMemo(() => {
        if (!searchableGuests.length) return null;
        return new Fuse(searchableGuests, {
            includeScore: true,
            threshold: 0.3,
            distance: 250,
            ignoreLocation: true,
            keys: [
                { name: 'displayName', getFn: (obj) => safeName(obj) },
                'firstName',
                'lastName',
                'email',
            ],
        });
    }, [searchableGuests]);

    const results = useMemo(() => {
        const q = searchTerm.trim();
        if (!q || !fuse) return [];
        return fuse.search(q).map(r => r.item).slice(0, 8);
    }, [searchTerm, fuse]);

    function handleSearch() {
        setSearchTerm(query);
    }

    function handleKeyDown(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSearch();
        }
    }
    useEffect(() => {
        if (!selected) return;
        setEmail(safeTrim(selected.email));
        setPhone(safeTrim(selected.phone));
    }, [selected]);

    useEffect(() => {
        if (!selected) return;
        if (!selected.partyId) {
            setPartyMembers([selected]);
            return;
        }
        setPartyMembers(guests.filter(g => g.partyId === selected.partyId));
    }, [selected, guests]);

    async function setAttendance(guestId, attending) {
        setSaving(true);
        try {
            setPartyMembers(members =>
                members.map(m => (m.id === guestId ? { ...m, attending } : m))
            );
            await jsonFetch(API.patchGuest(guestId), {
                method: 'PATCH',
                body: JSON.stringify({ attending }),
            });
        } catch {
            alert('Failed to save response');
        } finally {
            setSaving(false);
        }
    }

    const everyoneAnswered = partyMembers.every(
        m => m.attending !== null && m.attending !== undefined
    );

    const selectedNeedsContact = useMemo(() => {
        if (!selected) return false;

        const upToDate = partyMembers.find(m => m.id === selected.id);
        if (!upToDate) return false;

        return (
            upToDate.attending === true &&
            !safeTrim(upToDate.email) &&
            !safeTrim(upToDate.phone)
        );
    }, [selected, partyMembers]);
    const canContinue = everyoneAnswered && (!selectedNeedsContact || (isEmail(email) || isPhone(phone)));


    function saveNameCookie(name) {
        document.cookie = `rsvp_name=${encodeURIComponent(name)}; Path=/; Max-Age=${60 * 60 * 24 * 30}`;
    }

    function chooseGuest(g) {
        setSelected(g);
        const dn = safeName(g);
        const prevName = sessionStorage.getItem('inviteeName');
        if (prevName !== dn) {
            try {
                sessionStorage.removeItem('weddingSplash:v1');
            } catch {
                document.cookie = 'weddingSplash:v1=0; Path=/';
            }
        }
        sessionStorage.setItem('inviteeName', dn);
        saveNameCookie(dn);
    }

    const continueToSite = useCallback(async () => {
        if (!selected?.id) return;
        const dn = selected ? safeName(selected) : '';
        if (selectedNeedsContact) {
            const eOK = email && isEmail(email);
            const pOK = phone && isPhone(phone);

            if (!eOK && !pOK) {
                alert('Please provide a valid email or phone.');
                return;
            }
        }
        const body = {
            send_email_if_needed: true,
            send_whatsapp_if_needed: true,
            email_payload: {
                // guest_name is not required by your route since you use display_name,
                // but harmless to include; backend will ignore/override if desired.
                guest_name: dn,
                venue_name: VENUE_NAME,
                venue_address: VENUE_ADDRESS,
                maps_url: MAPS_URL,
                website_url: WEBSITE_URL,
                guide_url: GUIDE_URL,
                // reply_to, subject are optional; add if you use them.
            },
            whatsapp_payload: {
                guest_name: dn,
                // attending omitted -> server uses DB value
                rsvp_link: RSVP_LINK,
            },
        };
        const eVal = email?.trim();
        const pVal = phone?.trim();
        if (eVal && isEmail(eVal)) body.email = eVal;
        if (pVal && isPhone(pVal)) body.phone = pVal;


        try {
            await jsonFetch(API.sendConfirmations(selected.id), {
                method: 'POST',
                body: JSON.stringify(body),
            });
            // no local state sync needed since you're redirecting
        } catch (err) {
            alert('Failed to save your contact info. Please try again.');
            return;
        }

        sessionStorage.setItem('inviteeName', dn);
        saveNameCookie(dn);
        sessionStorage.setItem('lastRoute', window.location.pathname);
        window.location.href = '/';
    }, [selected, email, phone, selectedNeedsContact]);

    const skipCheckin = useCallback(() => {
        const dn = selected ? safeName(selected) : '';
        const prevName = sessionStorage.getItem('inviteeName');
        if (dn) {
            if (prevName !== dn) {
                try {
                    sessionStorage.removeItem('weddingSplash:v1');
                } catch {
                    document.cookie = 'weddingSplash:v1=0; Path=/';
                }
            }
            sessionStorage.setItem('inviteeName', dn);
            saveNameCookie(dn);
        }
        sessionStorage.setItem('lastRoute', window.location.pathname);
        window.location.href = '/';
    }, [selected]);

    return (
        <MotionConfig reducedMotion="user" suppressHydrationWarning>
            <div className="min-h-screen bg-[#f8f6f2] text-[#3d2e1e] flex flex-col items-center font-[Montserrat]">
                <motion.header {...fade} className="mt-16 sm:mt-20 mb-10 sm:mb-12 space-y-2">
                    {/* <h1 className="text-5xl sm:text-6xl flex flex-col md:flex-row font-crimson tracking-wide p-3 leading-none text-transparent bg-clip-text text-gradient-gold">
                        <p className="mr-2">Nimako</p>
                        <p className="text-center font-parisienne">&</p>
                        <p className="ml-2 text-right">Bandau</p>
                    </h1> */}
                    <div className="mb-5 inline-flex items-center gap-2 text-[clamp(1rem,4vw,2rem)] md:text-[clamp(1.5rem,3vw,3rem)] tracking-[0.18em] uppercase text-gradient-gold whitespace-nowrap">
                        <span className="h-[1px] w-6 bg-amber-200/40" />
                        Nana-Serwaa & Abdul Wahab
                        <span className="h-[1px] w-6 bg-amber-200/40" />
                    </div>


                    <p className="text-center text-sm sm:text-base italic tracking-wide text-[#6b5a43] font-[Crimson_Text]">
                        A celebration of love & togetherness
                    </p>
                </motion.header>

                <div className="w-full max-w-xl px-6 pb-16">
                    <AnimatePresence mode="wait">
                        {!selected && (
                            <motion.section key="search" {...fade} className="flex flex-col gap-4 items-stretch">
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        handleSearch();
                                    }}
                                    className="flex gap-2"
                                >
                                    <input
                                        autoFocus
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        placeholder="Type your name…"
                                        className="flex-1 rounded-xl border border-[#d7cbb0] bg-white/70 backdrop-blur px-4 py-2.5 text-[#3d2e1e] shadow-sm focus:outline-none focus:ring-2 focus:ring-[rgba(178,144,67,0.35)] focus:border-[#b29043] transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleSearch}
                                        className="px-5 py-2.5 rounded-xl text-white font-medium hover:bg-[#a3823b] transition"
                                        style={{ background: "linear-gradient(to right, #b29043, #f1c27d, #b29043)" }}
                                    >
                                        Search
                                    </button>
                                </form>

                                {loading && (
                                    <p className="text-center text-sm text-[#7e6c52]">Loading guest list…</p>
                                )}

                                {!loading && searchTerm && results.length === 0 && (
                                    <motion.div {...fade} className="p-3 text-sm text-amber-900 bg-amber-50/90 border border-amber-200 rounded-lg">
                                        We couldn’t find your name.<br />
                                        Try a shorter search (e.g. “John Apple”).<br />
                                        If still missing, please contact the bridal party.
                                    </motion.div>
                                )}

                                {!!results.length && (
                                    <motion.ul
                                        variants={fadeParent}
                                        initial="initial"
                                        animate="animate"
                                        className="divide-y border border-[#e9e1cf] rounded-xl bg-elegant-white shadow-soft overflow-hidden"
                                    >
                                        {results.map((g, idx) => (
                                            <motion.li
                                                key={g.id ?? idx}
                                                variants={fadeItem}
                                                onClick={() => chooseGuest(g)}
                                                className="p-3 cursor-pointer hover:bg-white/70 transition-colors"
                                            >
                                                <div className="font-medium">{safeName(g)}</div>
                                                {g.partyLabel && (
                                                    <div className="text-xs text-[#7e6c52] mt-0.5">{g.partyLabel}</div>
                                                )}
                                            </motion.li>
                                        ))}
                                    </motion.ul>
                                )}
                            </motion.section>
                        )}

                        {selected && (
                            <motion.section key="party" {...fade} className="space-y-6">
                                <button
                                    onClick={() => setSelected(null)}
                                    className="text-sm underline text-[#6b5a43] hover:text-[#3d2e1e] transition-colors"
                                >
                                    ← Change name
                                </button>

                                <div className="rounded-2xl border border-[#e9e1cf] bg-elegant-white shadow-soft overflow-hidden">
                                    <div className="p-4 border-b bg-white/60">
                                        <div className="font-semibold tracking-wide text-[#3d2e1e]">
                                            Confirm attendance for {selected.partyLabel || safeName(selected)}
                                        </div>
                                        <p className="text-xs text-[#7e6c52] mt-1">
                                            Tap Yes/No for each person. Saves automatically. Deadline: <span className='font-bold'>December 5th</span>
                                        </p>
                                    </div>

                                    <ul>
                                        {partyMembers.map((m) => (
                                            <li
                                                key={m.id}
                                                className="p-3 flex items-center justify-between border-t first:border-t-0 border-[#eee6d6]"
                                            >
                                                <div>
                                                    <div className="font-medium">{safeName(m)}</div>
                                                </div>
                                                <div className="flex gap-3">
                                                    <CircleOption
                                                        label="Yes"
                                                        selected={m.attending === true}
                                                        onClick={() => setAttendance(m.id, true)}
                                                        disabled={saving}
                                                    />
                                                    <CircleOption
                                                        label="No"
                                                        selected={m.attending === false}
                                                        onClick={() => setAttendance(m.id, false)}
                                                        disabled={saving}
                                                    />
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <motion.div {...fade} className="flex flex-col items-center gap-3 pt-2">
                                    <AnimatePresence initial={false}>
                                        {selectedNeedsContact && (
                                            <motion.div
                                                {...fade}
                                                exit={{ opacity: 0, y: -12, filter: 'blur(4px)' }}
                                                className="w-full rounded-2xl border border-[#e9e1cf] bg-white/80 shadow-soft p-4">
                                                <div className="font-semibold text-[#3d2e1e]">Add your contact details</div>
                                                <p className="text-xs text-[#7e6c52] mt-1">
                                                    Please provide <span className="font-semibold">email or WhatsApp phone #</span>.
                                                </p>

                                                <div className="mt-3 border border-[#eee6d6] rounded-xl p-3">
                                                    <div className="text-sm font-medium mb-2">{safeName(selected)}</div>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                        <div className="flex flex-col">
                                                            <label className="text-xs text-[#7e6c52] mb-1">Email</label>
                                                            <input
                                                                type="email"
                                                                inputMode="email"
                                                                value={email}
                                                                onChange={(e) => setEmail(e.target.value)}
                                                                placeholder="name@example.com"
                                                                className={`rounded-lg border px-3 py-2 bg-white/80 focus:outline-none focus:ring-2 transition ${email && !isEmail(email) ? 'border-red-300 ring-red-200' : 'border-[#d7cbb0] focus:ring-[rgba(178,144,67,0.35)]'
                                                                    }`}
                                                            />
                                                            {email && !isEmail(email) && (
                                                                <span className="text-xs text-red-600 mt-1">Please enter a valid email.</span>
                                                            )}
                                                        </div>

                                                        <div className="flex flex-col">
                                                            <label className="text-xs text-[#7e6c52] mb-1">Phone</label>
                                                            <input
                                                                type="tel"
                                                                inputMode="tel"
                                                                value={phone}
                                                                onChange={(e) => setPhone(e.target.value)}
                                                                placeholder="+1 (555) 123-4567"
                                                                className={`rounded-lg border px-3 py-2 bg-white/80 focus:outline-none focus:ring-2 transition ${phone && !isPhone(phone) ? 'border-red-300 ring-red-200' : 'border-[#d7cbb0] focus:ring-[rgba(178,144,67,0.35)]'
                                                                    }`}
                                                            />
                                                            {phone && !isPhone(phone) && (
                                                                <span className="text-xs text-red-600 mt-1">Enter a phone number (digits and +()- allowed).</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                    <motion.button
                                        whileHover={{
                                            scale: canContinue ? 1.015 : 1,
                                            boxShadow: canContinue ? '0 0 22px rgba(178,144,67,0.35)' : 'none',
                                        }}
                                        whileTap={{ scale: canContinue ? 0.985 : 1 }}
                                        onClick={continueToSite}
                                        disabled={!canContinue}
                                        className={`px-6 py-3 rounded-xl text-white text-lg shadow-soft font-medium transition-all ${everyoneAnswered ? 'purple-royal-gradient' : 'bg-gray-400'
                                            } disabled:opacity-60`}
                                    >
                                        Continue to Wedding Website
                                    </motion.button>

                                    <button
                                        onClick={skipCheckin}
                                        className="text-sm underline text-[#6b5a43] hover:text-[#3d2e1e] transition-colors"
                                    >
                                        Skip for now
                                    </button>
                                </motion.div>
                            </motion.section>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </MotionConfig>
    );
}

function CircleOption({ label, selected, onClick, disabled }) {
    return (
        <motion.button
            type="button"
            onClick={onClick}
            disabled={disabled}
            whileHover={{ scale: disabled ? 1 : 1.05 }}
            whileTap={{ scale: disabled ? 1 : 0.97 }}
            className={`flex items-center gap-2 px-3 py-2 rounded-full border transition-all ${selected
                ? 'border-[#5a358a] bg-[#f5f0ff]'
                : 'border-[#c9bda6] bg-white'
                } disabled:opacity-60 shadow-sm hover:shadow`}
        >
            <span
                className={`h-4 w-4 rounded-full border transition-all ${selected
                    ? 'bg-[#5a358a] border-[#5a358a]'
                    : 'border-[#8d7f66] bg-white'
                    }`}
            />
            <span className="text-sm">{label}</span>
        </motion.button>
    );
}
