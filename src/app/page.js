// app/page.js
'use client';

import dynamic from 'next/dynamic';
import { Plane, Heart } from 'lucide-react';

const Turn = dynamic(() => import('./components/Turn'), {
  ssr: false
});

export default function Home() {
  return (
    <Turn>
      <div>
        <div className="rounded-r-3xl rounded-l-md p-8 flex flex-col items-center justify-center h-full bg-gradient-to-br from-violet-100 to-amber-50">
          <h1 className="text-4xl font-serif text-violet-900 mb-4">Our Wedding</h1>
          <p className="text-xl text-stone-600 italic">Nana & Abdul</p>
          <div className="mt-8">
            <Heart className="text-amber-600 w-12 h-12" />
          </div>
        </div>
      </div>

      <div>
        <div className="p-8 flex flex-col items-center justify-center h-full bg-white">
          <p className="text-2xl text-stone-600">Page 2</p>
        </div>
      </div>

      <div>
        <div className="p-8 flex flex-col items-center justify-center h-full bg-white">
          <p className="text-2xl text-stone-600">Page 3</p>
        </div>
      </div>

      <div>
        <div className="p-8 flex flex-col items-center justify-center h-full bg-white">
          <p className="text-2xl text-stone-600">Page 4</p>
        </div>
      </div>
    </Turn>
  );
}