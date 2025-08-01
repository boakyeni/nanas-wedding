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
      
      setCountdown({ days, hours, minutes });
    };
    
    updateCountdown();
    const timer = setInterval(updateCountdown, 60000); // Update every minute
    
    return () => clearInterval(timer);
  }, []);
  
  return (
    <div className="p-12 text-center">

      
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
        </div>)}
    </div>
      )
};

export default Countdown;