import React from 'react';
import { Plane, Heart } from 'lucide-react';
import Image from 'next/image';

const SaveTheDateTicket = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-stone-50 to-amber-100 px-6 flex pt-10 justify-center">

            {/* Overlay pattern for extra texture */}
            <div className="absolute inset-0 opacity-50 bg-[radial-gradient(circle_at_1px_1px,_rgb(251,191,36)_1px,_transparent_0)] [background-size:10px_10px]" />

            <div className="relative w-full max-w-sm flex flex-col">
                {/* Top Ticket Section - Smaller with photo */}
                <div className="flex flex-col items-center bg-gradient-to-r w-full aspect-[8/2] from-white via-amber-50/50 to-white rounded-3xl border border-amber-200 border-b-0 pt-4 shadow-sm backdrop-blur-sm">
                    <p className='mx-auto font-montserrat font-thin text-violet-900 text-3xl'>BOARDING PASS</p>
                    <p className='mx-auto font-montserrat font-thin text-stone-400 text-xl'>ACCRA</p>
                </div>

                {/* Bottom Ticket Section - Larger with main content */}
                <div className="[border-top-style:dashed] bg-gradient-to-r from-white via-amber-50/50 to-white rounded-3xl border border-amber-200 p-6 shadow-lg backdrop-blur-sm">
                    <div className="absolute inset-0 mt-16 flex items-center justify-center">
                        <Image src="/world-map.svg" alt="World map" width={400} height={400} />
                    </div>
                    <div className="relative z-10">
                        <div className=" text-stone-400 text-sm tracking-wider mb-4">
                            BOARDING PASS
                        </div>
                        <div className="text-violet-950 text-3xl font-parisienne mb-2 [text-shadow:_0_1px_1px_rgb(251,191,36,0.2)]">
                            Save The Date
                        </div>
                        <div className="text-stone-400 text-sm uppercase tracking-wider mb-4">
                            JOIN US TO CELEBRATE OUR GREATEST ADVENTURE
                        </div>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="bg-stone-50 rounded-full p-2">
                                <Heart size={16} className="text-amber-600" />
                            </div>
                            <div className="flex-1 border-t border-dashed border-stone-200" />
                            <div className="text-stone-400">
                                <Plane size={16} />
                            </div>
                        </div>
                        <div className="text-3xl font-parisienne text-violet-950 mb-1">
                            Nana Serwaa
                        </div>
                        <div className="text-3xl font-parisienne text-violet-950 mb-1 text-right">
                            Abdul Wahab
                        </div>
                        <div className=" text-stone-500 italic">
                            Accra, Ghana
                        </div>
                        <div className="text-violet-950 mb-6">
                            January 3, 2026
                        </div>

                        <div className="text-center text-stone-400 text-sm mb-4">
                            FORMAL INVITATION TO FOLLOW
                        </div>

                        {/* Barcode-like design */}
                        <div className="flex justify-center gap-1">
                            {[...Array(20)].map((_, i) => (
                                <div
                                    key={i}
                                    className="h-8 w-1 bg-gradient-to-b from-stone-200 via-amber-100 to-stone-200"
                                    style={{ opacity: Math.random() * 0.5 + 0.5 }}
                                />
                            ))}
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SaveTheDateTicket;