'use client'
import React, { useState, useEffect } from 'react';

const EnableMotionButton = ({ onEnabled }) => {
  const [permissionState, setPermissionState] = useState('unknown'); // 'unknown', 'requested', 'granted', 'denied'
  
  // Check if device orientation is supported at all
  const [isSupported, setIsSupported] = useState(false);
  
  useEffect(() => {
    // Check if device orientation events are supported
    const isOrientationSupported = 'DeviceOrientationEvent' in window;
    setIsSupported(isOrientationSupported);
    
    // If iOS 13+ device (requires permission)
    const requiresPermission = 
      typeof DeviceOrientationEvent !== 'undefined' && 
      typeof DeviceOrientationEvent.requestPermission === 'function';
    
    // If doesn't require permission and is supported, auto-enable
    if (isOrientationSupported && !requiresPermission) {
      setPermissionState('granted');
      onEnabled(true);
    }
  }, [onEnabled]);
  
  const requestPermission = async () => {
    setPermissionState('requested');
    
    // For iOS 13+ devices that require permission
    if (typeof DeviceOrientationEvent !== 'undefined' && 
        typeof DeviceOrientationEvent.requestPermission === 'function') {
      try {
        const response = await DeviceOrientationEvent.requestPermission();
        
        if (response === 'granted') {
          setPermissionState('granted');
          onEnabled(true);
        } else {
          setPermissionState('denied');
          onEnabled(false);
        }
      } catch (error) {
        console.error('Permission request error:', error);
        setPermissionState('error');
        onEnabled(false);
      }
    } else {
      // For non-iOS devices, just enable
      setPermissionState('granted');
      onEnabled(true);
    }
  };
  
  // If not supported, don't show the button
  if (!isSupported) {
    return null;
  }
  
  // If permission already granted, don't show the button
  if (permissionState === 'granted') {
    return null;
  }
  
  return (
    <button
      onClick={requestPermission}
      className="absolute top-4 right-4 z-50 px-4 py-2 bg-purple-600 text-white rounded-lg shadow-lg hover:bg-purple-700 transition-colors"
      disabled={permissionState === 'requested'}
    >
      {permissionState === 'requested' ? 'Requesting...' : 'Enable Motion Effects'}
    </button>
  );
};

export default EnableMotionButton;