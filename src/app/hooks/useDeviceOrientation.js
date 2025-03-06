'use client'
import { useState, useEffect } from 'react';

const useDeviceOrientation = (motionEnabled = false) => {
  const [orientation, setOrientation] = useState({ beta: 0, gamma: 0 });

  useEffect(() => {
    // Only add event listener if motion is enabled
    if (!motionEnabled) return;

    const handleOrientation = (event) => {
      setOrientation({
        beta: event.beta || 0,  // Front/back tilt
        gamma: event.gamma || 0 // Left/right tilt
      });
    };

    // Add the event listener
    window.addEventListener('deviceorientation', handleOrientation, true);

    // Clean up
    return () => {
      window.removeEventListener('deviceorientation', handleOrientation, true);
    };
  }, [motionEnabled]);

  return orientation;
};

export default useDeviceOrientation;