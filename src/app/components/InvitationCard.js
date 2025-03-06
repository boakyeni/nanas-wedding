'use client'
import { useState, useEffect } from 'react';
import { Plane, Heart } from 'lucide-react';
import Image from 'next/image';

// Boarding Pass Card Component
const InvitationCard = () => {
    // Store random opacity values in state
    const [barcodeOpacities, setBarcodeOpacities] = useState([]);
    // Track if we're on the client
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        // This only runs on the client after hydration
        setIsClient(true);
        // Generate random opacities on the client side only
        const opacities = Array(20).fill().map(() => Math.random() * 0.5 + 0.5);
        setBarcodeOpacities(opacities);
    }, []);
    return (
        <div className="relative w-full flex flex-col rounded-3xl">
            {/* Top Ticket Section */}
            <div className="flex flex-col items-center bg-gradient-to-r w-full aspect-[8/2] from-white via-amber-50/75 to-white rounded-t-3xl border border-amber-200 border-b-0 pt-2 shadow-sm backdrop-blur-sm">
                <p className='mx-auto font-montserrat font-thin text-violet-900 text-2xl'>NOW BOARDING!</p>
                <p className='mx-auto font-montserrat font-thin text-stone-500 text-lg'> <span className='font-tangerine text-stone-400 text-3xl pr-2'>for</span> ACCRA</p>
            </div>

            {/* Bottom Ticket Section */}
            <div className="[border-top-style:dashed] bg-gradient-to-r from-white via-amber-50/75 to-white rounded-b-3xl border border-amber-200 p-4 shadow-lg backdrop-blur-sm">
                <div className="relative z-10">
                    {/* <div className="text-stone-400 text-xs tracking-wider mb-2">
                        BOARDING PASS
                    </div> */}
                    <div className="text-violet-950 text-2xl text-center font-tangerine mb-1 [text-shadow:_0_1px_1px_rgb(251,191,36,0.2)]">
                        Save The Date
                    </div>
                    <div className="text-stone-400 text-xs uppercase tracking-wider mb-2 text-center pb-8">
                        JOIN US TO CELEBRATE OUR GREATEST ADVENTURE
                    </div>
                    {/* <div className="flex items-center gap-2 mb-2">
                        <div className="bg-stone-50 rounded-full p-1">
                            <Heart size={12} className="text-amber-600" />
                        </div>
                        <div className="flex-1 border-t border-dashed border-stone-200" />
                        <div className="text-stone-400">
                            <Plane size={12} />
                        </div>
                    </div> */}
                    <div className="relative flex justify-between text-2xl font-tangerine text-violet-950 mb-1 items-center">
                        <p className="z-10">Nana Serwaa</p>
                        <div className="absolute inset-0 flex justify-center items-center">

                            <div className="relative w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48">
                                <Image
                                    src="/n_w.png"
                                    alt="N&W"
                                    fill
                                    sizes="(max-width: 1024px) 160px, 384px"
                                    className="object-contain"
                                    quality={100}
                                    priority
                                />
                            </div>
                        </div>
                        <p className="z-10">Abdul Wahab</p>
                    </div>
                    {/* <div className="text-2xl font-tangerine text-violet-950 mb-1 text-right">
                        Abdul Wahab
                    </div> */}
                    <div className="text-stone-500 italic text-sm">
                        Accra, Ghana
                    </div>
                    <div className="text-violet-950 mb-4 text-sm font-montserrat">
                        January 3, 2026
                    </div>

                    <div className="text-center text-stone-400 text-xs mb-2">
                        FORMAL INVITATION TO FOLLOW
                    </div>

                    {/* Barcode-like design - now using pre-generated values */}
                    <div className="flex justify-center gap-0.5">
                        {isClient && barcodeOpacities.map((opacity, i) => (
                            <div
                                key={i}
                                className="h-6 w-0.5 bg-gradient-to-b from-stone-200 via-amber-100 to-stone-200"
                                style={{ opacity }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InvitationCard;