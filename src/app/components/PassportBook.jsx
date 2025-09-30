"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Bone,
  Color,
  Float32BufferAttribute,
  MathUtils,
  MeshStandardMaterial,
  Skeleton,
  SkinnedMesh,
  SRGBColorSpace,
  Uint16BufferAttribute,
  Vector3,
  CanvasTexture,
} from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { Environment, Float, Loader, useCursor, useTexture } from "@react-three/drei";
import { easing } from "maath";
import { degToRad } from "three/src/math/MathUtils.js";

/* ---------------------- tuneables (kept from your code) ---------------------- */

const easingFactor = 0.5;        // y-rotation ease (page curve)
const easingFactorFold = 0.3;    // x-rotation ease (fold)
const insideCurveStrength = 0.18;
const outsideCurveStrength = 0.05;
const turningCurveStrength = 0.09;

const PAGE_WIDTH = 1.28;
const PAGE_HEIGHT = 1.71; // 4:3ish
const PAGE_DEPTH = 0.015;
const PAGE_SEGMENTS = 18;
const SEGMENT_WIDTH = PAGE_WIDTH / PAGE_SEGMENTS;

/* ---------------------- shared geometry / skinning ---------------------- */
const CORNER = 0.08;      // corner radius in world units (≈ PAGE_WIDTH * 0.08)
const SMOOTH = 8;         // smoothness/subdivs

const pageGeometry = new RoundedBoxGeometry(
  PAGE_WIDTH,
  PAGE_HEIGHT,
  PAGE_DEPTH,
  SMOOTH,   // smoothness
  CORNER    // corner radius
);
pageGeometry.translate(PAGE_WIDTH / 2, 0, 0);

const position = pageGeometry.attributes.position;
const vertex = new Vector3();
const skinIndexes = [];
const skinWeights = [];

for (let i = 0; i < position.count; i++) {
  vertex.fromBufferAttribute(position, i);
  const x = vertex.x;

  const skinIndex = Math.max(0, Math.floor(x / SEGMENT_WIDTH));
  const skinWeight = (x % SEGMENT_WIDTH) / SEGMENT_WIDTH;

  skinIndexes.push(skinIndex, skinIndex + 1, 0, 0);
  skinWeights.push(1 - skinWeight, skinWeight, 0, 0);
}

pageGeometry.setAttribute("skinIndex", new Uint16BufferAttribute(skinIndexes, 4));
pageGeometry.setAttribute("skinWeight", new Float32BufferAttribute(skinWeights, 4));

const whiteColor = new Color("white");
const emissiveColor = new Color("orange");

/* ---- hide edge faces so rounded alpha defines silhouette (fixes white bleed) ---- */
const basePageMaterials = [
  new MeshStandardMaterial({ color: whiteColor, transparent: true, opacity: 0 }),
  new MeshStandardMaterial({ color: "#111", transparent: true, opacity: 0 }),
  new MeshStandardMaterial({ color: whiteColor, transparent: true, opacity: 0 }),
  new MeshStandardMaterial({ color: whiteColor, transparent: true, opacity: 0 }),
];

/* ---------------------- Page component ---------------------- */
function useRoundedAlpha(size = 1024, radiusRatio = 0.08) {
  return React.useMemo(() => {
    const c = document.createElement("canvas");
    c.width = size; c.height = size;
    const ctx = c.getContext("2d");
    const r = radiusRatio * size;

    ctx.clearRect(0, 0, size, size);
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.moveTo(r, 0);
    ctx.arcTo(size, 0, size, r, r);
    ctx.arcTo(size, size, size - r, size, r);
    ctx.arcTo(0, size, 0, size - r, r);
    ctx.arcTo(0, 0, r, 0, r);
    ctx.closePath();
    ctx.fill();

    const tex = new CanvasTexture(c);
    tex.needsUpdate = true;
    return tex;
  }, [size, radiusRatio]);
}

function Page({
  number,
  front,
  back,
  page,
  opened,
  bookClosed,
  total,
  coverRoughnessTex = "/textures/book-cover-roughness.jpg",
}) {
  // preload textures just-in-time
  const maps = useTexture([
    `/textures/${front}.jpg`,
    `/textures/${back}.jpg`,
    ...(number === 0 || number === total - 1 ? [coverRoughnessTex] : []),
  ]);
  const [frontMap, backMap, roughMap] = maps;
  if (frontMap) frontMap.colorSpace = SRGBColorSpace;
  if (backMap) backMap.colorSpace = SRGBColorSpace;

  const group = useRef();
  const skinnedMeshRef = useRef();
  const turnedAt = useRef(0);
  const lastOpened = useRef(opened);
  const [highlighted, setHighlighted] = useState(false);
  useCursor(highlighted);

  const roundedAlpha = useRoundedAlpha(1024, 0.085); // slight bump to cover any fringe

  // build skinned mesh once
  const manualSkinnedMesh = useMemo(() => {
    const bones = [];
    for (let i = 0; i <= PAGE_SEGMENTS; i++) {
      const bone = new Bone();
      bones.push(bone);
      bone.position.x = i === 0 ? 0 : SEGMENT_WIDTH;
      if (i > 0) bones[i - 1].add(bone);
    }
    const skeleton = new Skeleton(bones);

    const materials = [
      ...basePageMaterials,
      new MeshStandardMaterial({
        color: whiteColor,
        map: frontMap,
        ...(number === 0 ? { roughnessMap: roughMap } : { roughness: 0.1 }),
        emissive: emissiveColor,
        emissiveIntensity: 0,
        transparent: true,
        alphaMap: roundedAlpha,
        alphaTest: 0.02, // crisper cut to avoid white peek-through
      }),
      new MeshStandardMaterial({
        color: whiteColor,
        map: backMap,
        ...(number === total - 1 ? { roughnessMap: roughMap } : { roughness: 0.1 }),
        emissive: emissiveColor,
        emissiveIntensity: 0,
        transparent: true,
        alphaMap: roundedAlpha,
        alphaTest: 0.02,
      }),
    ];

    const mesh = new SkinnedMesh(pageGeometry, materials);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.frustumCulled = false;
    mesh.add(skeleton.bones[0]);
    mesh.bind(skeleton);
    return mesh;
  }, [frontMap, backMap, roughMap, number, total, roundedAlpha]); // include roundedAlpha here

  useFrame((_, delta) => {
    if (!skinnedMeshRef.current) return;

    // subtle highlight on hover
    const emissiveTarget = highlighted ? 0.22 : 0;
    skinnedMeshRef.current.material[4].emissiveIntensity =
      skinnedMeshRef.current.material[5].emissiveIntensity = MathUtils.lerp(
        skinnedMeshRef.current.material[4].emissiveIntensity,
        emissiveTarget,
        0.1
      );

    // flip timing
    if (lastOpened.current !== opened) {
      turnedAt.current = Date.now();
      lastOpened.current = opened;
    }
    let t = Math.min(400, Date.now() - turnedAt.current) / 400;
    t = Math.sin(t * Math.PI);

    // base target rotation around Y for the “flip”
    let targetRotation = opened ? -Math.PI / 2 : Math.PI / 2;

    // slight fan when not fully closed
    if (!(page === 0 || page === total)) {
      targetRotation += degToRad(number * 0.8);
    }

    const bones = skinnedMeshRef.current.skeleton.bones;
    for (let i = 0; i < bones.length; i++) {
      const target = i === 0 ? group.current : bones[i];

      const insideCurveIntensity = i < 8 ? Math.sin(i * 0.2 + 0.25) : 0;
      const outsideCurveIntensity = i >= 8 ? Math.cos(i * 0.3 + 0.09) : 0;
      const turningIntensity = Math.sin((i * Math.PI) / bones.length) * t;

      let rotationAngle =
        insideCurveStrength * insideCurveIntensity * targetRotation -
        outsideCurveStrength * outsideCurveIntensity * targetRotation +
        turningCurveStrength * turningIntensity * targetRotation;

      let foldRotationAngle = degToRad(Math.sign(targetRotation) * 2);

      if (bookClosed) {
        if (i === 0) {
          rotationAngle = targetRotation;
          foldRotationAngle = 0;
        } else {
          rotationAngle = 0;
          foldRotationAngle = 0;
        }
      }

      easing.dampAngle(target.rotation, "y", rotationAngle, easingFactor, delta);

      const foldIntensity =
        i > 8 ? Math.sin((i * Math.PI) / bones.length - 0.5) * t : 0;

      easing.dampAngle(
        target.rotation,
        "x",
        foldRotationAngle * foldIntensity,
        easingFactorFold,
        delta
      );
    }
  });

  return (
    <group
      ref={group}
      onPointerEnter={(e) => {
        e.stopPropagation();
        setHighlighted(true);
      }}
      onPointerLeave={(e) => {
        e.stopPropagation();
        setHighlighted(false);
      }}
      onClick={(e) => {
        e.stopPropagation();
        // flip forward or back one page
        // parent controls actual page index
      }}
    >
      <primitive
        object={manualSkinnedMesh}
        ref={skinnedMeshRef}
        position-z={-number * PAGE_DEPTH + page * PAGE_DEPTH}
      />
    </group>
  );
}

/* ---------------------- Book (collection of pages) ---------------------- */

function Book({ pages, page, setPage, position = [0, 0, 0] }) {
  const [delayedPage, setDelayedPage] = useState(page);

  // delayed stepping animation (your logic)
  useEffect(() => {
    let timeout;
    const step = () => {
      setDelayedPage((d) => {
        if (page === d) return d;
        timeout = setTimeout(step, Math.abs(page - d) > 2 ? 50 : 150);
        return page > d ? d + 1 : d - 1;
      });
    };
    step();
    return () => clearTimeout(timeout);
  }, [page]);

  const bookClosed = delayedPage === 0 || delayedPage === pages.length;

  return (
    <group rotation-y={-Math.PI / 2} position={position}>
      {pages.map((pageData, index) => (
        <Page
          key={index}
          page={delayedPage}
          number={index}
          opened={delayedPage > index}
          bookClosed={bookClosed}
          total={pages.length}
          {...pageData}
        />
      ))}
    </group>
  );
}

/* ---------------------- Scene wrapper with "passport rotate" ---------------------- */

function Scene({ pages, page, setPage }) {
  const root = useRef();
  const flip = useRef(null);

  useEffect(() => {
    flip.current = new Audio("/audios/page-flip-01a.mp3");
  }, []);

  useEffect(() => {
    if (flip.current) {
      flip.current.currentTime = 0;
      flip.current.play().catch(() => { });
    }
  }, [page]);

  useFrame((_, delta) => {
    if (!root.current) return;
    const targetZ = page > 0 ? Math.PI / 2 : 0;
    easing.dampAngle(root.current.rotation, "z", targetZ, 0.3, delta);
  });

  return (
    <>
      <group ref={root} position-y={0.22}>
        <Float rotation-x={0} floatIntensity={0} speed={0} rotationIntensity={0}>
          <Book pages={pages} page={page} setPage={setPage} position={[page === 0 ? -PAGE_WIDTH / 2 : 0, 0, 0]} />
        </Float>
      </group>

      {/* lights / env */}
      <Environment preset="studio" />
      <directionalLight
        position={[2, 5, 2]}
        intensity={2.5}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-bias={-0.0001}
      />
      <mesh position-y={-1.5} rotation-x={-Math.PI / 2} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <shadowMaterial transparent opacity={0.2} />
      </mesh>
    </>
  );
}

/* ---------------------- Public component ---------------------- */

export default function PassportBook({
  pictures = [],
  className = "",
  camera = { position: [0, -0.2, 5], fov: 40 },
}) {
  // build pages array from pictures like your example
  const pages = useMemo(() => {
    if (!pictures || pictures.length === 0) {
      return [{ front: "book-cover", back: "book-back" }];
    }
    const arr = [{ front: "book-cover", back: pictures[0] }];
    for (let i = 1; i < pictures.length - 1; i += 2) {
      arr.push({
        front: pictures[i % pictures.length],
        back: pictures[(i + 1) % pictures.length],
      });
    }
    arr.push({ front: pictures[pictures.length - 1], back: "book-back" });
    return arr;
  }, [pictures]);

  // preload textures so pages pop in cleanly
  useEffect(() => {
    pages.forEach((p) => {
      useTexture.preload(`/textures/${p.front}.jpg`);
      useTexture.preload(`/textures/${p.back}.jpg`);
    });
    useTexture.preload(`/textures/book-cover-roughness.jpg`);
  }, [pages]);

  const [page, setPage] = useState(0);



  // simple UI: click to step forward/back (you can replace with your own UI)
  const TOTAL = pages.length + 1; // indices 0..pages.length

  const next = () => setPage(p => (p + 1) % TOTAL);
  const prev = () => setPage(p => (p - 1 + TOTAL) % TOTAL);

  return (
    <div className={className} onClick={next}>

      <Canvas
        shadows
        camera={camera}
        className="w-full aspect-[3/5]"
        dpr={[1, 2]}
        gl={{ powerPreference: "low-power", antialias: true }}
      >
        <React.Suspense fallback={null}>
          <Scene pages={pages} page={page} setPage={setPage} />
        </React.Suspense>
      </Canvas>

      <Loader />
    </div>
  );
}
