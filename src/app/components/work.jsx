'use client'
import React from 'react'
import Link from 'next/link'
// import NextLink from 'next/link'
// import Image from 'next/image'


// Container for two-column layout
export const WorkContainer = ({ children }) => (
  <div className='grid grid-cols-1 lg:grid-cols-2 w-full min-h-screen'>
    {children}
  </div>
)

// Static background split
export const WorkBackground = () => (
  <div className="grid grid-cols-1 lg:grid-cols-2 w-full min-h-screen top-0 sticky">
    <div className="purple-royal-gradient h-[30vh] lg:h-auto"></div>
    <div className="bg-white h-[70vh] lg:min-h-screen"></div>
  </div>
)

// Left column content with scroll animation
export const WorkLeft = ({ children, progress }) => {
  // baseline = 0 to avoid initial jump
  let translateY = 0;

  if (progress > 0) {
    translateY = Math.max(0, 50 - progress * 3 * 50);
    if (progress > 0.85) translateY = Math.max(-50, -(progress - 0.85) * 2 * 50);
  }

  return (
    <div
      className="flex flex-col items-center justify-center text-3xl lg:text-3xl h-[30vh] lg:h-auto"
      style={{ transform: `translateY(${translateY}px)` }}
    >
      <div className="leading-10">{children}</div>
    </div>
  );
};

export const WorkRight = ({ children, progress }) => {
  // baseline = 0 to avoid initial jump
  let translateY = 0;

  if (progress > 0) {
    translateY = Math.max(-50, -(progress - 0.5) * 50);
  }

  return (
    <div
      className="flex flex-1 lg:items-center justify-center h-screen"
      style={{ transform: `translateY(${translateY}px)` }}
    >
      <div className="w-full max-w-md pt-10 lg:pt-0 px-10 md:px-0">{children}</div>
    </div>
  );
};


// External link with underline
export const WorkLink = ({ href, children }) => (
  <Link
    href={href}
    target="_blank"
    rel="noreferrer"
    className="underline underline-offset-8 decoration-1"
  >
    {children}
  </Link>
);

// // Work grid item with image and link
// export const WorkGridItem = ({ children, progress, id, title, thumbnail }) => {
//   let translateY = Math.max(-50, -(progress - 0.5) * 50)
//   return (
//     <div
//       className='flex flex-1 lg:items-center justify-center h-screen'
//       style={{ transform: `translateY(${translateY}px)` }}
//     >
//       <Box w="100%">
//         <NextLink href={`/commerce/${id}`}>
//           <LinkBox cursor='pointer'>
//             <Image
//               src={thumbnail}
//               alt={title}
//               layout='responsive'
//               width={840}
//               height={840}
//             />
//             <LinkOverlay href={`/commerce/${id}`}>
//               <Text mt={2} fontSize={20}>
//                 {title}
//               </Text>
//             </LinkOverlay>
//             <Text fontSize={14}>{children}</Text>
//           </LinkBox>
//         </NextLink>
//       </Box>
//     </div>
//   )
// }
