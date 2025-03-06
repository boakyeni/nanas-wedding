import Lottie from 'react-lottie';
import animationData from '../animations/rotate_phone_animation.json';

export default function RotatePhoneAnimation() {
    const options = {
        loop: true,
        autoplay: true,
        animationData,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice',
        },
    };

    return (
        <Lottie
            options={options}
            height={200}
            width={200}
            speed={0.5} // Slow down playback speed (default is 1.0)
        />
    );
}