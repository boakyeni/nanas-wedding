'use client'
import React from 'react'
import { Tile, TileBackground, TileContent, TileWrapper } from './tile'
import { WorkBackground, WorkContainer, WorkLeft, WorkRight } from './work'
import Image from 'next/image'

const Works = () => (
  <TileWrapper numOfPages={5}>
    <TileBackground>
      <WorkBackground />
    </TileBackground>
    <TileContent>
      <Tile
        page={0}
        renderContent={({ progress }) => (
          <WorkContainer>
            <WorkLeft progress={progress}>
              <div className='italic'>Our</div>
              <div className='text-4xl md:text-5xl font-semibold font-montserrat text-gradient-gold'>
                First Date
              </div>
            </WorkLeft>
            <WorkRight progress={progress}>
              <Image
                src="/IMG_1500.jpg"
                width={840}
                height={840}
                alt="spotify logo"
                style={{ width: '100%', height: 'auto' }}
              />
            </WorkRight>
          </WorkContainer>
        )}
      />
      <Tile
        page={1}
        renderContent={({ progress }) => (
          <WorkContainer>
            <WorkLeft progress={progress}>
              <div className='italic'>Our</div>
              <div className='text-4xl md:text-5xl font-semibold tracking-tight text-gradient-gold'>
                First Trip
              </div>
            </WorkLeft>
            <WorkRight progress={progress}>
              <Image
                src="/dubaiwall.jpg"
                width={840}
                height={840}
                alt="open book svg"
                style={{ width: '100%', height: 'auto' }}
              />
            </WorkRight>
          </WorkContainer>
        )}
      />
      <Tile
        page={2}
        renderContent={({ progress }) => (
          <WorkContainer>
            <WorkLeft progress={progress}>
              <div>Our</div>
              <div className='text-4xl md:text-5xl font-semibold tracking-tight'>
                <div className='text-4xl md:text-5xl font-semibold font-montserrat text-gradient-gold'>
                Second Date
              </div>
              </div>
            </WorkLeft>
            <WorkRight progress={progress}>
                <Image
                  src="/IMG_9596.jpeg"
                  width={840}
                  height={840}
                  alt="merch logo"
                  style={{ width: '100%', height: 'auto' }}
                />
            </WorkRight>
          </WorkContainer>
        )}
      />
      <Tile
        page={3}
        renderContent={({ progress }) => (
          <WorkContainer>
            <WorkLeft progress={progress}>
              <div>Our</div>
                <div className='text-4xl md:text-5xl font-semibold font-montserrat text-gradient-gold'>
                Knocking
              </div>
            </WorkLeft>
            <WorkRight progress={progress}>
                <Image
                  src="/knocking.jpg"
                  width={840}
                  height={840}
                  alt="instagram logo"
                  style={{ width: '100%', height: 'auto' }}
                />
            </WorkRight>
          </WorkContainer>
        )}
      />
      <Tile
        page={4}
        renderContent={({ progress }) => (
          <WorkContainer>
            <WorkLeft progress={progress}>
              <div onClick={() => window.location.href='/gallery'}>
              <div>Tap the Logo</div>
                <div className='text-4xl md:text-5xl font-semibold font-montserrat text-gradient-gold pb-3'>
                For the Gallery
              </div>
              </div>
            </WorkLeft>
            <WorkRight progress={progress}>
                <Image
                  src="/n_w.png"
                  width={840}
                  height={840}
                  alt="Wedding crest"
                  style={{ width: '100%', height: 'auto' }}
                  className='cursor-pointer'
                  onClick={() => window.location.href='/gallery'}
                />
            </WorkRight>
          </WorkContainer>
        )}
      />
    </TileContent>
  </TileWrapper>
)

export default Works
