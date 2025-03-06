'use client'
import React, { useEffect, useRef } from 'react';
import { Plane, Heart } from 'lucide-react';

const FlipBook = () => {
  const bookRef = useRef(null);

  useEffect(() => {
    // Initialize turn.js
    const loadTurnJs = async () => {
      if (typeof window !== 'undefined') {
        // We need to load jQuery first since turn.js depends on it
        const $ = await import('jquery');
        window.jQuery = $;
        // Now load turn.js
        await import('turn.js');
        
        $(bookRef.current).turn({
          width: 800,
          height: 600,
          autoCenter: true,
          display: 'double',
          acceleration: true,
          gradients: true,
          elevation: 50,
          when: {
            turning: function(e, page, view) {
              // Optional: Add custom behavior during page turn
            },
            turned: function(e, page) {
              // Optional: Add custom behavior after page turn
            }
          }
        });
      }
    };

    loadTurnJs();

    // Cleanup
    return () => {
      if (typeof window !== 'undefined' && window.jQuery) {
        window.jQuery(bookRef.current).turn('destroy');
      }
    };
  }, []);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-stone-100 p-8">
      <div className="book-container">
        <div ref={bookRef} className="book">
          {/* Cover */}
          <div className="hard">
            <div className="h-full w-full bg-gradient-to-br from-violet-100 to-amber-50 p-8 flex flex-col items-center justify-center">
              <h1 className="text-4xl font-serif text-violet-900 mb-4">Our Wedding</h1>
              <p className="text-xl text-stone-600 italic">Nana & Abdul</p>
              <div className="mt-8">
                <Heart className="text-amber-600 w-12 h-12" />
              </div>
            </div>
          </div>

          {/* Save The Date Page */}
          <div className="p-4">
            <div className="h-full w-full bg-gradient-to-br from-amber-50 via-stone-50 to-amber-100 p-6 flex items-center justify-center">
              <div className="w-full max-w-sm">
                {/* Top Ticket Section */}
                <div className="flex flex-col items-center bg-white w-full h-32 rounded-t-3xl border border-amber-200 border-b-0 pt-4">
                  <p className="font-sans font-thin text-violet-900 text-3xl">BOARDING PASS</p>
                  <p className="font-sans font-thin text-stone-400 text-xl">ACCRA</p>
                </div>

                {/* Bottom Ticket Section */}
                <div className="bg-white rounded-b-3xl border border-amber-200 p-6">
                  <div className="relative">
                    <div className="text-stone-400 text-sm tracking-wider mb-4">
                      BOARDING PASS
                    </div>
                    <div className="text-violet-950 text-3xl font-serif mb-2">
                      Save The Date
                    </div>
                    <div className="text-stone-400 text-sm uppercase tracking-wider mb-4">
                      JOIN US TO CELEBRATE OUR GREATEST ADVENTURE
                    </div>
                    <div className="flex items-center gap-2 mb-4">
                      <Heart size={16} className="text-amber-600" />
                      <div className="flex-1 border-t border-dashed border-stone-200" />
                      <Plane size={16} className="text-stone-400" />
                    </div>
                    <div className="text-2xl font-serif text-violet-950 mb-4">
                      January 3, 2026
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Details Page */}
          <div className="p-4">
            <div className="h-full w-full bg-gradient-to-br from-stone-50 to-amber-50 p-8 flex flex-col justify-center">
              <h2 className="text-3xl font-serif text-violet-900 mb-6">The Details</h2>
              <div className="space-y-4 text-stone-600">
                <p className="text-lg">Ceremony & Reception</p>
                <p>Saturday, January 3, 2026</p>
                <p>4:00 PM</p>
                <p>Kempinski Hotel</p>
                <p>Accra, Ghana</p>
              </div>
            </div>
          </div>

          {/* Back Cover */}
          <div className="hard">
            <div className="h-full w-full bg-gradient-to-br from-amber-50 to-stone-50 p-8 flex items-center justify-center">
              <p className="text-2xl text-stone-600 italic">More details to come...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlipBook;