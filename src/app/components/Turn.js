// app/components/Turn.js
'use client';

import React, { useEffect, useRef } from 'react';

const Turn = ({ children }) => {
  const bookRef = useRef(null);

  // Handler to determine tap position and trigger a page turn
  const handleTap = (e) => {
    if (!bookRef.current || !window.jQuery) return;

    const $book = window.jQuery(bookRef.current);
    const totalPages = $book.turn('pages');
    const currentPage = $book.turn('page');

    if (currentPage < totalPages) {
      $book.turn('next');
    } else {
      $book.turn('page', 1); // wrap to first page
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
              width: 300,
              height: 450,
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
<div className="w-full min-h-screen flex items-center justify-center bg-white p-4 relative">
  {/* Book shadow/back layer */}
  <div className="absolute z-0 translate-x-2 translate-y-2 w-[300px] h-[450px] bg-stone-300 rounded-r-3xl rounded-l-lg" />

  {/* Actual book on top */}
  <div
    ref={bookRef}
    className="magazine z-10 rounded-r-3xl rounded-l-md"
    onClick={handleTap}
    style={{
      cursor: 'pointer',
      perspective: '1500px',
    }}
  >
    {React.Children.map(children, (child) => (
      <div className="relative w-full h-full bg-white rounded-r-3xl rounded-l-md  overflow-hidden">
        {child}
      </div>
    ))}
  </div>
</div>

  );
};

export default Turn;
