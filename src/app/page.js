// app/page.js
'use client';

import dynamic from 'next/dynamic';
import { Plane, Heart } from 'lucide-react';
import Countdown from './components/Countdown';
import Image from 'next/image';

const Turn = dynamic(() => import('./components/Turn'), {
  ssr: false
});

const gradientGoldHover =
  'text-transparent bg-clip-text bg-white hover:bg-[linear-gradient(to_bottom,#b29043,#f1c27d,#b29043,#f1c27d,#b29043)] transition';

export default function Home() {
  return (
    <>
      <div className='flex flex-col items-center'>
        <header className="w-full px-6 py-4 flex items-center justify-between bg-gradient-to-br from-[#2e003e] via-[#4b0c5d] to-[#1a001f] text-white shadow-md">
          <div className="text-xl font-serif tracking-wide text-gradient-gold bg-clip-text text-transparent">
            N & W
          </div>
          <nav className="space-x-4 hidden sm:flex">
            <a href="#" className={gradientGoldHover}>Home</a>
            <a href="#" className={gradientGoldHover}>RSVP</a>
            <a href="#" className={gradientGoldHover}>Details</a>
          </nav>
          <button className="sm:hidden text-2xl">&#9776;</button> {/* Mobile menu icon */}
        </header>
        <Turn>
          <div className='h-full'>
            <div className="rounded-r-3xl rounded-l-md p-8 flex flex-col items-center h-full bg-gradient-to-br from-[#2e003e] via-[#4b0c5d] to-[#1a001f]">
              <div className='flex flex-col justify-around h-full'>
                <h1 className="text-4xl font-serif text-gradient-gold bg-clip-text text-transparent mb-4">PASSPORT</h1>
                <div>
                  <p className="text-xl text-gradient-gold italic">Tap to View</p>
                  <p className="text-xl text-gradient-gold italic">Your Passport</p>
                </div>
                <div className="mt-8">
                  {/* <Heart className="text-amber-600 w-12 h-12" /> */}
                </div>
              </div>

            </div>
          </div>

          <div>
            <div className="p-8 flex flex-col items-center justify-center h-full bg-white">
              <p className="text-2xl text-stone-600">Page 2</p>
            </div>
          </div>

          <div>
            <div className="p-8 flex flex-col items-center justify-center h-full bg-white">
              <p className="text-2xl text-stone-600">Page 3</p>
            </div>
          </div>

          <div>
            <div className="p-8 flex flex-col items-center justify-center h-full bg-white">
              <p className="text-2xl text-stone-600">Page 4</p>
            </div>
          </div>
        </Turn>
        <div className="dark-royal-gradient w-full flex flex-col">
          <div className='flex flex-row justify-around'>
            <Image
              src="/world-map-whp.svg"
              alt="N&W"
              width={800}
              height={800}
              className="object-contain"
              quality={100}
              priority
            />
          </div>
          <Countdown />
        </div>

        
      </div>
    </>
  );
}