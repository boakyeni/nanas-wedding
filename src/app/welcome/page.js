'use client'
import DigitalBoardingPass from "./_components/DigitalBoardingPass";
import SaveTheDateTicket from "./_components/DigitalBoardingPass2";
import Flipbook from "./_components/Flipbook";
import CoverPage from "./_components/CoverPage";

// Add this to your page file
import dynamic from 'next/dynamic';

// Dynamically import the FlipBook component with no SSR
const FlipBook = dynamic(() => import('./_components/Flipbook.js'), {
  ssr: false
});

export default function WelcomePage(){
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {/* <FlipBook width={400} height={600}/> */}
      <SaveTheDateTicket />
    </div>
    )
}