'use client'
import { useState, useEffect } from 'react';

const Countdown = () => {
    const [countdown, setCountdown] = useState(null);

    // Calculate time remaining until the wedding date
    useEffect(() => {
        const weddingDate = new Date('2026-01-03T16:00:00'); // Set your wedding date here

        const updateCountdown = () => {
            const now = new Date();
            const difference = weddingDate - now;

            // If wedding day has passed
            if (difference < 0) {
                setCountdown({ days: 0, hours: 0, minutes: 0 });
                return;
            }

            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);

            setCountdown({ days, hours, minutes, seconds });
        };

        updateCountdown();
        const timer = setInterval(updateCountdown, 1000); // Update every minute

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="p-6 md:p-12 text-center">
            {countdown && (
                <div className="mx-auto inline-block w-full max-w-xl px-6 py-6 bg-white/10 backdrop-blur-sm border border-[#bfa76a] rounded-2xl shadow-xl">
                    <h3 className="text-lg md:text-xl font-serif text-gradient-gold bg-clip-text text-transparent mb-6 tracking-wide uppercase">
                        Wedding Countdown
                    </h3>
                    <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8">
                        {['Days', 'Hours', 'Minutes', 'Seconds'].map((label) => {
                            const value = countdown[label.toLowerCase()];
                            return (
                                <div key={label} className="text-center w-20 sm:w-24">
                                    <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-amber-200 drop-shadow-md">
                                        {value}
                                    </div>
                                    <div className="text-xs sm:text-sm tracking-wide text-amber-100 uppercase">
                                        {label}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    )
};

export default Countdown;