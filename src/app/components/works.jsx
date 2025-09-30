'use client'
import React from 'react'
import { Tile, TileBackground, TileContent, TileWrapper } from './tile'
import { WorkBackground, WorkContainer, WorkLeft, WorkRight, WorkLink } from './work'
import Image from 'next/image'

const Works = () => (
  <TileWrapper numOfPages={4}>
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
                layout="responsive"
                width={840}
                height={840}
                alt="spotify logo"
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
                layout="responsive"
                width={840}
                height={840}
                alt="open book svg"
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
                <WorkLink href="/commerce/store">Second Trip</WorkLink>
              </div>
            </WorkLeft>
            <WorkRight progress={progress}>
              <WorkLink href="/commerce/store">
                <Image
                  src="/IMG_9596.jpeg"
                  layout="responsive"
                  width={840}
                  height={840}
                  alt="merch logo"
                />
              </WorkLink>
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
              <div className='text-4xl md:text-5xl font-semibold tracking-tight'>
                Knocking
              </div>
            </WorkLeft>
            <WorkRight progress={progress}>
              <WorkLink href="https://www.instagram.com/thedtlabookclub/">
                <Image
                  src="/knocking.jpg"
                  layout="responsive"
                  width={840}
                  height={840}
                  alt="instagram logo"
                />
              </WorkLink>
            </WorkRight>
          </WorkContainer>
        )}
      />
    </TileContent>
  </TileWrapper>
)

export default Works
