'use client'
import dynamic from 'next/dynamic';
const WeddingsMap = dynamic(() => import('../components/WeddingsMap'), { ssr: false })

const RSVPPage = () => {
    return (
        <>
            <WeddingsMap/>
        </>
    )
}

export default RSVPPage;