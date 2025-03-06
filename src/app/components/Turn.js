// app/components/Turn.js
'use client';

import React, { useEffect, useRef } from 'react';

const Turn = ({ children }) => {
  const bookRef = useRef(null);

  // Handler to determine tap position and trigger a page turn
  const handleTap = (e) => {
    if (!bookRef.current) return;
    const rect = bookRef.current.getBoundingClientRect();
    const tapX = e.clientX - rect.left; // tap position relative to the container
    const midPoint = rect.width / 2;

    // If tap is in the left half, go to previous page; otherwise, next page.
    if (tapX < midPoint) {
      window.jQuery(bookRef.current).turn('previous');
    } else {
      window.jQuery(bookRef.current).turn('next');
    }
  };

  useEffect(() => {
    let timer;

    const initTurn = () => {
      if (
        typeof window !== 'undefined' &&
        window.jQuery &&
        bookRef.current
      ) {
        const $ = window.jQuery;

        // Destroy any previous instance if it exists.
        if ($(bookRef.current).data().turn) {
          $(bookRef.current).turn('destroy');
        }

        timer = setTimeout(() => {
          try {
            $(bookRef.current).turn({
              width: 800,
              height: 600,
              autoCenter: true,
              display: 'single',
              acceleration: true, // Disable acceleration to prevent some errors
              gradients: true,
              elevation: 50,
              duration: 1500, // Slower animation for better stability
              page: 1,
            });
          } catch (err) {
            console.error('Turn.js init error:', err);
          }
        }, 100);
      }
    };

    initTurn();

    return () => {
      clearTimeout(timer);
      if (
        typeof window !== 'undefined' &&
        window.jQuery &&
        bookRef.current
      ) {
        const $ = window.jQuery;
        if ($(bookRef.current).data().turn) {
          $(bookRef.current).turn('destroy');
        }
      }
    };
  }, []);

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-white p-4">
      <div
        ref={bookRef}
        className="magazine"
        onClick={handleTap}
        style={{ cursor: 'pointer' }} // Optional: shows pointer to indicate interactivity
      >
        {children}
      </div>
    </div>
  );
};

export default Turn;
