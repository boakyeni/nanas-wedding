// app/page.js
'use client';
import React from 'react';
import dynamic from 'next/dynamic';
import { Plane, Heart } from 'lucide-react';
import Countdown from './components/Countdown';
import Image from 'next/image';
import DiagonalDivider from './components/divider/DiagonalDivider';
import MapWithLinks from './components/MapWithLinks';
import AnimatedPlaneDivider from './components/AnimatedPlaneDivider';
import Works from './components/works';
import Itinerary from './components/Itinerary';
import PassportInvite from './components/PassportInvite';
import PassportBook from './components/PassportBook';
import PassportCover from './components/PassportCover';
import ScrollHint from './components/ScrollHint';
import { ghanaActivities } from './data/ghanaActivities';
import ActivityCardStack from './components/ActivityCardStack';
import DressCodeCarousel from './components/DressCodeCarousel';
import SplashOverlay from './components/SplashOverlay';
import BridalParty from './components/BridalParty';
import RegistrySection from './components/RegistrySection';

// const Turn = dynamic(() => import('./components/Turn'), {
//   ssr: false
// });
const WeddingsMap = dynamic(() => import('./components/WeddingsMap'), { ssr: false })
const gradientGoldHover =
  'text-transparent bg-clip-text bg-white hover:bg-[linear-gradient(to_bottom,#b29043,#f1c27d,#b29043,#f1c27d,#b29043)] transition';

export default function Home({ searchParams }) {
  const name = React.use(searchParams).name || "";
  const slides = [
    { src: "/n_w.png", alt: "Arrival", caption: "We landed at dawn in Tulum." },
    { src: "/n_w.png", alt: "Beach",   caption: "Morning walks and quiet waves." },
    { src: "/n_w.png", alt: "Market",  caption: "Colors, music, fresh fruit." },
    { src: "/n_w.png", alt: "Evening", caption: "Golden hour on the shore." },
  ];

  const SCHEDULE = [
  {
    date: "We Do",
    events: [
      { time: "1:00 PM", name: "Ceremony", address: "The Underbridge"},
      { time: "3:00 PM", name: "Cocktail Hour", address: "The Underbridge" },
    ],
  },
  {
    date: "We Eat",
    events: [
      { time: "5:00 PM", name: "Dinner & Toasts", address: "Diverse buffet & vegetarian options provided" },
      { time: "till 10:00 PM", name: "DJ Dance Floor", address: "" },
    ],
  },
  {
    date: "We Party",
    events: [{ time: "till 12 AM", name: "After Party", address: "" }],
  },
];
const pictures = [
  "DSC00680","DSC00933","DSC00966","DSC00983","DSC01011",
  "DSC01040","DSC01064","DSC01071","DSC01103","DSC01145",
  "DSC01420","DSC01461","DSC01489","DSC02031","DSC02064","DSC02069",
];

  return (
    <>
      <div className='flex flex-col items-center'>
        {/* <header className="w-full px-6 py-4 flex items-center justify-between bg-gradient-to-br from-[#2e003e] via-[#4b0c5d] to-[#1a001f] text-white shadow-md">
          <div className="text-xl font-serif tracking-wide text-gradient-gold bg-clip-text text-transparent">
            N & W
          </div>
          <nav className="space-x-4 hidden sm:flex">
            <a href="#" className={gradientGoldHover}>Home</a>
            <a href="#" className={gradientGoldHover}>RSVP</a>
            <a href="#" className={gradientGoldHover}>Details</a>
          </nav>
          <button className="sm:hidden text-2xl">&#9776;</button> 
        </header> */}
        {/* Shows once per session; reads ?name= if present */}
      <SplashOverlay
      initialInvitee={name}
        baseMessage="You are formally invited"
        delay={7000}
        fadeMs={2000}
        showOnce="off"          // "local" for once-ever; "off" to always show; session default
        storageKey="weddingSplash:v1"
        nameParam="name"
      />
        <PassportCover/>
        <ScrollHint />
        <PassportInvite/>
        
        <BridalParty />
        <Itinerary schedule={SCHEDULE}/>
        <div className="mt-4">
        <DressCodeCarousel />
      </div>
        {/* <div className='bg-[#f8f6f2] h-[32px] w-full'>
          <AnimatedPlaneDivider />
        </div> */}
        {/* <PassportBook pictures={pictures} className='w-full' /> */}

        
        <ActivityCardStack id='activities' items={ghanaActivities} />
        {/* <div className='bg-[#f8f6f2] h-[32px] w-full'>
          <AnimatedPlaneDivider />
        </div> */}
        <RegistrySection />
        <div className='aspect-[3/5] mt-10'>
          <MapWithLinks 
          lat={5.631447071652913}
        lng={-0.15636782651750794}
        label="The UnderBridge by Accra Luxury Apartments"
        zoom={16}/>
        </div>
        
        {/* <Turn>
          <div className='h-full'>
            <div className="rounded-r-3xl rounded-l-md p-8 flex flex-col items-center h-full bg-gradient-to-br from-[#2e003e] via-[#4b0c5d] to-[#1a001f]">
              <div className='flex flex-col justify-around h-full'>
                <h1 className="text-4xl font-serif text-gradient-gold bg-clip-text text-transparent mb-4">PASSPORT</h1>
                <div>
                  <p className="text-xl text-gradient-gold italic">Tap to View</p>
                  <p className="text-xl text-gradient-gold italic">Your Passport</p>
                </div>
                <div className="mt-8">
                  <Heart className="text-amber-600 w-12 h-12" />
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
        </Turn> */}
        
        <div className=" w-full flex flex-col">
          
          
          <Countdown />
          
        </div>
        
        <Works/>
        <div className='flex flex-row justify-around bg-white'>
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
        
      </div>
      
      <DiagonalDivider/>
    </>
  );
}