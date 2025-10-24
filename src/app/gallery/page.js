'use client';
import Gallery from "../components/Gallery";
import Image from "next/image";

const demo = [
  { src: '/n_w2.jpeg', alt: 'Nana and Wahab at Knock', title: 'Knocking', description: 'Us at our knocking', width: 3000, height: 2000 },
  { src: '/knocking.jpg', alt: 'Landscape 1', title: 'Knocking', description: 'Us at our knocking', width: 2000, height: 3000 },
  { src: '/gallery/proposal.jpg', alt: 'Portrait 2', title: 'The Proposal', description: 'Hilltop palms and breeze.', width: 2000, height: 3000 },
  { src: '/IMG_1500.jpg', alt: 'Landscape 2', title: 'Our First Date', description: 'Hilltop palms and breeze.', width: 3200, height: 2133 },
  { src: '/IMG_9596.jpeg', alt: 'Portrait 2', title: 'Our Second Date', description: 'Historic lighthouse streets.', width: 1800, height: 2400 },
  { src: '/gallery/IMG_2084.JPG', alt: 'Landscape 2', title: 'Vacation', description: 'Hilltop palms and breeze.', width: 3200, height: 2133 },
  { src: '/gallery/photo_with_heart.jpg', alt: 'Portrait 2', title: 'Photo with Heart', description: 'Hilltop palms and breeze.', width: 2000, height: 3000 },
  { src: '/gallery/stormy.jpg', alt: 'Portrait 2', title: 'Stormy', description: 'Hilltop palms and breeze.', width: 2000, height: 3000 },
  { src: '/gallery/boat.jpg', alt: 'Portrait 2', title: 'Boat', description: 'Hilltop palms and breeze.', width: 2000, height: 3000 },
  { src: '/gallery/waterbg.jpg', alt: 'Portrait 2', title: 'Water BG', description: 'Hilltop palms and breeze.', width: 2000, height: 3000 },
  { src: '/gallery/water_bg_landscape.jpg', alt: 'Portrait 2', title: 'Water BG Landscape', description: 'Hilltop palms and breeze.', width: 3000, height: 2000 },
  { src: '/gallery/building.jpg', alt: 'Portrait 2', title: 'Building', description: 'Hilltop palms and breeze.', width: 2000, height: 3000 },
  { src: '/gallery/waterbg.jpg', alt: 'Portrait 2', title: 'Water BG', description: 'Hilltop palms and breeze.', width: 2000, height: 3000 },
  { src: '/gallery/beach.jpg', alt: 'Portrait 2', title: 'Beach', description: 'Hilltop palms and breeze.', width: 2000, height: 3000 },
  { src: '/gallery/IMG_2403.JPG', alt: 'Portrait 2', title: 'Photo', description: 'Hilltop palms and breeze.', width: 2000, height: 3000 },
  { src: '/gallery/club.jpg', alt: 'Portrait 2', title: 'Club', description: 'Hilltop palms and breeze.', width: 3000, height: 2000 },
  { src: '/gallery/beach2.jpg', alt: 'Portrait 2', title: 'Beach2', description: 'Hilltop palms and breeze.', width: 3000, height: 2000 },
  { src: '/gallery/lake.jpg', alt: 'Portrait 2', title: 'Lake', description: 'Hilltop palms and breeze.', width: 3000, height: 2000 },
  { src: '/gallery/marble.jpg', alt: 'Portrait 2', title: 'Marble', description: 'Hilltop palms and breeze.', width: 2000, height: 3000 },
  { src: '/gallery/field.jpg', alt: 'Portrait 2', title: 'Field', description: 'Hilltop palms and breeze.', width: 3000, height: 2000 },
  { src: '/gallery/field2.jpg', alt: 'Portrait 2', title: 'Field2', description: 'Hilltop palms and breeze.', width: 2000, height: 3000 },
];

export default function Page() {
  return (
    <main className="p-4 sm:p-6">
        <div className="flex flex-row justify-between">
    <Image
            src="/n_w.png" // ← replace with your actual image path
            alt="Back to site"
            width={48}
            height={48}
            className="rounded-full hover:opacity-80 transition-opacity duration-200"
            onClick={() => window.location.href= '/'}
          />
      <h1 className="text-xl sm:text-2xl font-semibold text-gradient-gold mb-4">Gallery</h1>
      
      </div>
      <Gallery items={demo} />
    </main>
  );
}
