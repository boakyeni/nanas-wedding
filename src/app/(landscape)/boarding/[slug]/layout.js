'use client'; // Ensures this runs on the client side
import styles from './layout.module.css';
import RotatePhoneAnimation from '../_components/RotatePhoneAnimation';

import { useEffect, useState } from 'react';

export default function LandscapeLayout({ children }) {
    const [isMobile, setIsMobile] = useState(null);
    const [isLandscape, setIsLandscape] = useState(null);
    const [helpText, setHelpText] = useState(false);

    function enterFullScreen() {
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
            document.documentElement.webkitRequestFullscreen(); // For Safari
        } else if (document.documentElement.msRequestFullscreen) {
            document.documentElement.msRequestFullscreen(); // For IE11
        }
    }

    useEffect(() => {
        const timer = setTimeout(() => setHelpText(true), 5000);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        // Detect if the device is mobile
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        const mobileRegex = /Mobi|Android|iPhone|iPad|iPod/i;
        setIsMobile(mobileRegex.test(userAgent));

        // Check initial orientation
        setIsLandscape(window.innerWidth > window.innerHeight);

        // Listen for orientation changes
        const handleResize = () => {
            setIsLandscape(window.innerWidth > window.innerHeight);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    if (isMobile === null || isLandscape === null) {
        return null
    }

    if (isMobile && !isLandscape) {
        return (
            <div className={styles.orientationContainer}>
                <div className={styles.orientationPrompt}>
                    <p className={styles.promptText}>Please rotate your device to landscape mode.</p>
                    <RotatePhoneAnimation />
                    <p className={`${styles.promptTextFadeIn} ${helpText ? 'opacity-100' : 'opacity-0'}`}>
                        You may need to turn off portrait orientation lock
                    </p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}