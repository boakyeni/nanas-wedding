'use client'
import { useState } from 'react';
import InvitationCard from '../components/InvitationCard';

const EnvelopeAnimation = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isCardPulled, setIsCardPulled] = useState(false);
    const [isCardCentered, setIsCardCentered] = useState(false);
    const [flapsFaded, setFlapsFaded] = useState(false);

    const handleEnvelopeClick = () => {
        if (!isOpen) {
            setIsOpen(true);
            setTimeout(() => setIsCardPulled(true), 800);
        }
    };

    const handleCardClick = () => {
        if (isCardPulled && !isCardCentered) {
            setFlapsFaded(true);

        }
    };

    return (
        <div
            className="relative h-screen w-full flex items-center justify-center bg-gray-100"
            style={{ perspective: '1000px' }} // 3D transform perspective
        >
            <div
                className={`relative w-96 h-64 cursor-pointer ${!isOpen && 'hover:scale-105'} transition-transform duration-300 `}
                onClick={handleEnvelopeClick}
            >
                {/* Main Envelope Container */}
                <div className="absolute w-full h-full bg-purple-800 shadow-lg transition-opacity duration-300" style={{
                    background: 'linear-gradient(135deg, #8e44ad, #9b59b6)',

                }}>

                    <div className="absolute inset-1 transition-opacity duration-300" style={{
                        zIndex: 1,
                        background: 'linear-gradient(135deg, #8e44ad, #9b59b6)',
                        opacity: flapsFaded ? 0.2 : 1,

                    }} />

                    {/* Top Flap using clip-path */}
                    <div
                        className="absolute top-0 left-0 w-full transition-transform duration-1000 ease-in-out origin-top"
                        style={{
                            height: '50%',
                            zIndex: 3,
                            transform: isOpen ? 'rotateX(180deg)' : 'rotateX(0deg)'
                        }}
                    >
                        {/* Outer triangle for a “border” effect */}
                        <div
                            className="absolute inset-0"
                            style={{
                                clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)',
                                background: 'linear-gradient(135deg, #8e44ad, #9b59b6)'
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
                                background: 'linear-gradient(135deg, #9b59b6, #8e44ad)'
                            }}
                        />
                    </div>

                    {/* Left Flap using clip-path */}
                    <div
                        className="absolute top-0 left-0 w-1/2 h-full transition-opacity duration-300"
                        style={{
                            zIndex: 5,
                            opacity: flapsFaded ? 0.2 : 1,
                            clipPath: 'polygon(0% 0%, 0% 100%, 100% 50%)',
                            background: 'linear-gradient(135deg, #8e44ad, #9b59b6)'
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
                            zIndex: 5,
                            opacity: flapsFaded ? 0.2 : 1,
                            clipPath: 'polygon(100% 0%, 100% 100%, 0% 50%)',
                            background: 'linear-gradient(135deg, #8e44ad, #9b59b6)'
                        }}
                    />

                    {/* Bottom Flap using clip-path */}
                    <div
                        className="absolute bottom-0 left-0 w-full transition-opacity duration-300"
                        style={{
                            height: '50%',
                            zIndex: 5,
                            opacity: flapsFaded ? 0.2 : 1,
                            clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                            background: 'linear-gradient(135deg, #8e44ad, #9b59b6)'
                        }}
                    />
                </div>

                {/* Card */}
                <div
                    onClick={handleCardClick}
                    className={`absolute left-1/2 w-80 h-48 shadow-xl transform -translate-x-1/2 transition-all duration-1000 cursor-pointer
            ${!isCardPulled ? 'translate-y-0' : (isCardCentered ? '-translate-y-32 max-h-[90vh] max-w-[90vw]' : '-translate-y-32')}`}
                    style={{
                        zIndex: isOpen ? 4 : 2,
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

            <div
                className="absolute bottom-0 left-0 w-full pointer-events-none transition-opacity duration-300"
                style={{
                    zIndex: 5,
                    height: '37vh', // adjust height as needed
                    background: 'linear-gradient(to top, #8e44ad, #f3f4f6)',
                }}
            ></div>

        </div>
    );
};

export default EnvelopeAnimation;
