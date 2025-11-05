'use client'
import { useState, useEffect } from 'react';
import InvitationCard from '../components/InvitationCard';
import ThreeBackground from '../components/ThreeBackground';
import useDeviceOrientation from '../hooks/useDeviceOrientation';
import EnableMotionButton from '../components/EnableMotionButton';


const EnvelopeAnimation = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isCardPulled, setIsCardPulled] = useState(false);
    const [isCardCentered, setIsCardCentered] = useState(false);
    const [flapsFaded, setFlapsFaded] = useState(false);
    const { beta, gamma } = useDeviceOrientation();
    const [motionEnabled, setMotionEnabled] = useState(false);

    const orientation = useDeviceOrientation(motionEnabled);
    const deviceOrientation = { beta: orientation.beta, gamma: orientation.gamma };

    const [isMobile, setIsMobile] = useState(false);

    const [showIntroImage, setShowIntroImage] = useState(true);
    const [introImageOpacity, setIntroImageOpacity] = useState(1);

    const [instructionMessage, setInstructionMessage] = useState('Tap on the envelope');
    const [messageOpacity, setMessageOpacity] = useState(0);
    const [isChangingMessage, setIsChangingMessage] = useState(false);

    const [showBottomButton, setShowBottomButton] = useState(false);
    const [bottomButtonOpacity, setBottomButtonOpacity] = useState(0);


    useEffect(() => {
        // Check if mobile on component mount
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => {
            window.removeEventListener('resize', checkMobile);
        };
    }, []);

    // New effect for intro image timing
    useEffect(() => {
        // Start fading out after 3 seconds
        const fadeTimeout = setTimeout(() => {
            setIntroImageOpacity(0);
        }, 4000);

        // Remove from DOM after fade completes
        const removeTimeout = setTimeout(() => {
            setShowIntroImage(false);
            setTimeout(() => {
                setMessageOpacity(1);
            }, 100);
        }, 4500); // 3 seconds + 500ms for fade transition

        return () => {
            clearTimeout(fadeTimeout);
            clearTimeout(removeTimeout);
        };
    }, []);

    useEffect(() => {
        if (isCardCentered) {
            // Wait a moment before showing the button
            setTimeout(() => {
                setShowBottomButton(true);
                setTimeout(() => {
                    setBottomButtonOpacity(1);
                }, 100);
            }, 500);
        }
    }, [isCardCentered]);


    const tiltX = deviceOrientation.gamma * 0.02; // left/right tilt
    const tiltY = deviceOrientation.beta * 0.02;  // front/back tilt

    // Only apply tilt if motion is enabled
    const envelopeTilt = motionEnabled ? `rotateX(${tiltY}deg) rotateY(${tiltX}deg)` : '';

    const handleScreenClick = () => {
        if (!isOpen) {
            handleEnvelopeClick();
        } else if (isCardPulled && !isCardCentered) {
            handleCardClick();
        }
    }

    const handleEnvelopeClick = () => {
        if (!isOpen) {
            setIsOpen(true);
            setMessageOpacity(0);
            setIsChangingMessage(true);

            setTimeout(() => {
                setIsCardPulled(true);
                // Change instruction after card is pulled
                setInstructionMessage('Tap on card to reveal');
                // Fade the new message in
                setMessageOpacity(1);
                setIsChangingMessage(false);
            }, 800);
        }
    };

    const handleCardClick = () => {
        if (isCardPulled && !isCardCentered) {
            setFlapsFaded(true);
            setMessageOpacity(0);
            setTimeout(() => {
                // Hide instruction once card is being revealed
                setInstructionMessage('');
            }, 500); // Wait for fade out to complete
        }
    };

    return (
        <div
            className="relative h-screen w-full flex items-center justify-center bg-gray-100"
            style={{ perspective: '1000px' }} // 3D transform perspective
            onClick={handleScreenClick}
        >
            <ThreeBackground deviceOrientation={deviceOrientation}
                motionEnabled={motionEnabled} />

            {/* Enable Motion Button */}
            {/* <EnableMotionButton onEnabled={setMotionEnabled} /> */}

            {!showIntroImage && instructionMessage && (
                <div
                    className={`absolute bottom-48 left-1/2 transform -translate-x-1/2 ${isChangingMessage ? 'pointer-events-none' : ''}`}
                    style={{
                        opacity: messageOpacity,
                        transition: 'opacity 500ms ease-in-out',
                        zIndex: 10
                    }}
                >
                    <div className=" bg-stone-500 bg-opacity-90 text-white font-montserrat text-sm px-6 py-3 rounded-3xl shadow-md border">
                        {instructionMessage}
                    </div>
                </div>
            )}

            {showBottomButton && (
                <div
                    onClick={() => { window.location.href = '/checkin' }}
                    role="button"
                    tabIndex={0}
                    className="absolute bottom-48 left-1/2 transform -translate-x-1/2 cursor-pointer bg-stone-500 bg-opacity-90 text-white text-center font-montserrat text-sm px-6 py-3 rounded-3xl shadow-md border"
                    style={{
                        opacity: bottomButtonOpacity,
                        transition: 'opacity 500ms ease-in-out',
                        zIndex: 10
                    }}
                >
                    Tap Here for Check In
                </div>

            )}


            {/* Intro Image Overlay */}
            {showIntroImage && (
                <div
                    className="absolute inset-0 flex items-center justify-center z-50"
                    style={{
                        opacity: introImageOpacity,
                        transition: 'opacity 500ms ease-out',

                    }}
                >
                    <img
                        src="/Subject.png"
                        alt="Intro"
                        className="max-w-full max-h-full object-contain"
                    />
                </div>
            )}



            <div
                className={`relative w-96 h-64 cursor-pointer ${!isOpen && 'hover:scale-105'} transition-transform duration-300 `}

                style={{ zIndex: 2, transform: envelopeTilt }}
            >

                {/* Main Envelope Container */}
                <div className="absolute w-full h-full bg-purple-800 shadow-lg transition-opacity duration-300" style={{
                    background: 'linear-gradient(to right, #b29043, #f1c27d, #b29043, #f1c27d, #b29043)',

                }}>

                    <div className="absolute inset-1 transition-opacity duration-300" style={{
                        zIndex: 1,
                        background: 'linear-gradient(to right, #b29043, #f1c27d, #b29043, #f1c27d, #b29043)',
                        opacity: flapsFaded ? 0.2 : 1,

                    }} />

                    {/* Top Flap using clip-path */}
                    <div
                        className="absolute top-0 left-0 w-full transition-transform duration-1000 ease-in-out origin-top"
                        style={{
                            height: '50%',
                            zIndex: 3,
                            transform: isOpen ? 'rotateX(180deg)' : 'rotateX(0deg)',


                        }}
                    >
                        {/* Outer triangle for a “border” effect */}
                        <div
                            className="absolute inset-0"
                            style={{
                                clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)',
                                background: 'linear-gradient(135deg, #8e44ad, #9b59b6)',
                                background: 'linear-gradient(to right, #b29043, #f1c27d, #b29043, #f1c27d, #b29043)',
                                boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                            }}
                        />
                        {/* Inner triangle inset by 2px */}
                        <div
                            className="absolute"
                            style={{
                                top: '2px',
                                left: '2px',
                                right: '2px',
                                bottom: '2px',
                                clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)',
                                background: 'linear-gradient(to right, #b29043, #f1c27d, #b29043, #f1c27d, #b29043)',
                                boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                            }}
                        />
                    </div>

                    {/* Left Flap using clip-path */}
                    <div
                        className="absolute top-0 left-0 w-1/2 h-full transition-opacity duration-300"
                        style={{
                            zIndex: 6,
                            opacity: flapsFaded ? 0.2 : 1,
                            clipPath: 'polygon(0% 0%, 0% 100%, 100% 50%)',
                            background: 'linear-gradient(to bottom, #b29043, #f1c27d, #b29043, #f1c27d, #b29043)',
                            boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                        }}
                        onTransitionEnd={() => {
                            // Once the opacity transition ends, update isCardCentered.
                            if (flapsFaded && !isCardCentered) {
                                setIsCardCentered(true);
                            }
                        }}
                    />

                    {/* Right Flap using clip-path */}
                    <div
                        className="absolute top-0 right-0 w-1/2 h-full transition-opacity duration-300"
                        style={{
                            zIndex: 6,
                            opacity: flapsFaded ? 0 : 1,
                            clipPath: 'polygon(100% 0%, 100% 100%, 0% 50%)',
                            background: 'linear-gradient(to bottom, #b29043, #f1c27d, #b29043, #f1c27d, #b29043)',
                            boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                        }}
                    />

                    {/* Bottom Flap using clip-path */}
                    <div
                        className="absolute bottom-0 left-0 w-full transition-opacity duration-300"
                        style={{
                            height: '50%',
                            zIndex: 6,
                            opacity: flapsFaded ? 0.2 : 1,
                            clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                            background: 'linear-gradient(to left, #b29043, #f1c27d, #b29043, #f1c27d, #b29043)',
                            boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                        }}
                    />
                </div>

                {/* Card */}
                <div

                    className={`absolute left-1/2 w-80 h-48 shadow-xl transform -translate-x-1/2 transition-all duration-1000 cursor-pointer
            ${!isCardPulled ? 'translate-y-0' : (isCardCentered ? '-translate-y-32 max-h-[90vh] max-w-[90vw]' : '-translate-y-32')}`}
                    style={{
                        zIndex: isOpen ? 5 : 2,
                        transformOrigin: 'center bottom',


                    }}
                >
                    <InvitationCard />

                    {/* {isCardPulled && !isCardCentered && (
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-gray-400 text-sm animate-bounce">
              Click to expand
            </div>
          )} */}
                </div>

            </div>

            {/* Top Gradient Overlay: from the top of the screen to the envelope's top */}
            <div
                className="absolute left-0 w-full pointer-events-none"
                style={{
                    top: 0,
                    height: 'calc(50vh - 8rem)', // envelope top = 50vh - 8rem
                    background: 'linear-gradient(to bottom, #371f76, #f3f4f6)',
                }}
            ></div>

            <div
                className="absolute bottom-0 left-0 w-full pointer-events-none"
                style={{
                    zIndex: 3,
                    top: 'calc(50vh + 8rem)', // Envelope bottom: center + half envelope height (16rem/2 = 8rem)
                    height: 'calc(100vh - (50vh + 8rem))',
                    background: 'linear-gradient(to top, #8e44ad, #f3f4f6)',
                }}
            ></div>

        </div>
    );
};

export default EnvelopeAnimation;
