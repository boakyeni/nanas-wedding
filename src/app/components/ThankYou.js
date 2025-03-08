'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const ThankYou = () => {
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
      
      setCountdown({ days, hours, minutes });
    };
    
    updateCountdown();
    const timer = setInterval(updateCountdown, 60000); // Update every minute
    
    return () => clearInterval(timer);
  }, []);
  
  return (
    <div className="p-12 text-center">
      <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 className="text-2xl font-serif text-gray-800 mb-4">Thank You!</h2>
      <p className="text-gray-600 mb-8">
        Your RSVP has been received!
      </p>
      
      {/* Countdown section from the second component */}
      {countdown && (
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-700 mb-4">Wedding Countdown</h3>
          <div className="flex justify-center gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-800">{countdown.days}</div>
              <div className="text-sm text-gray-500">Days</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-800">{countdown.hours}</div>
              <div className="text-sm text-gray-500">Hours</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-800">{countdown.minutes}</div>
              <div className="text-sm text-gray-500">Minutes</div>
            </div>
          </div>
        </div>
      )}
      
      <div className="text-purple-600 text-sm">
        <p>Please save this information for your records:</p>
        <p className="mt-4 font-medium">Date: January 3, 2026</p>
        <p className="font-medium">Location: East Legon, Accra, Ghana</p>
        <p className="mt-4">A reminder will be sent to your email address in autumn.</p>
      </div>
    </div>
  );
};

export default ThankYou;