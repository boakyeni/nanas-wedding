'use client'
import { useRef, useEffect } from 'react';
import * as THREE from 'three';

const ThreeBackground = ({ deviceOrientation = { beta: 0, gamma: 0 }, motionEnabled = false }) => {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const particlesRef = useRef(null);
  const frameIdRef = useRef(null);

  useEffect(() => {
    // Setup Three.js scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Create camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 15;
    cameraRef.current = camera;

    // Create renderer
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0); // Transparent background
    rendererRef.current = renderer;

    // Add renderer to DOM
    if (containerRef.current) {
      containerRef.current.appendChild(renderer.domElement);
    }

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(0, 10, 10);
    scene.add(directionalLight);

    // Create particle system for a dynamic, dreamy background
    const particleCount = 300;
    const particles = new THREE.BufferGeometry();
    const particlePositions = [];
    const particleColors = [];

    const colorPalette = [
      new THREE.Color(0x371f76), // Purple
      new THREE.Color(0x64389f), // Lighter purple
      new THREE.Color(0xb29043), // Gold
      new THREE.Color(0xf1c27d)  // Light gold
    ];

    for (let i = 0; i < particleCount; i++) {
      // Position particles throughout the scene
      const x = (Math.random() - 0.5) * 30;
      const y = Math.random() * 30 - 15; // Full height coverage
      const z = (Math.random() - 0.5) * 15 - 5; // Some depth variation
      
      particlePositions.push(x, y, z);
      
      // Random color from palette
      const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      particleColors.push(color.r, color.g, color.b);
    }

    particles.setAttribute('position', new THREE.Float32BufferAttribute(particlePositions, 3));
    particles.setAttribute('color', new THREE.Float32BufferAttribute(particleColors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.25,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });

    const particleSystem = new THREE.Points(particles, particleMaterial);
    scene.add(particleSystem);
    particlesRef.current = particleSystem;

    // Animation loop
    const animate = () => {
      frameIdRef.current = requestAnimationFrame(animate);
      
      // Make particles float downward slowly
      if (particlesRef.current && particlesRef.current.geometry) {
        const positions = particlesRef.current.geometry.attributes.position.array;
        
        for (let i = 0; i < particleCount; i++) {
          const i3 = i * 3;
          
          // Move particles down slowly
          positions[i3 + 1] -= 0.03;
          
          // Add a slight sway
          positions[i3] += Math.sin(Date.now() * 0.001 + i) * 0.01;
          
          // Reset particles that go too low
          if (positions[i3 + 1] < -15) {
            positions[i3] = (Math.random() - 0.5) * 30;
            positions[i3 + 1] = 15; // Reset to top
            positions[i3 + 2] = (Math.random() - 0.5) * 15 - 5;
          }
        }
        
        particlesRef.current.geometry.attributes.position.needsUpdate = true;
      }
      
      // Render the scene
      renderer.render(scene, camera);
    };
    
    animate();

    // Handle window resize
    const handleResize = () => {
      if (cameraRef.current && rendererRef.current) {
        cameraRef.current.aspect = window.innerWidth / window.innerHeight;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(window.innerWidth, window.innerHeight);
      }
    };
    
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(frameIdRef.current);
      window.removeEventListener('resize', handleResize);
      
      if (containerRef.current && rendererRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
      
      // Dispose of geometries and materials
      if (particlesRef.current) {
        particlesRef.current.geometry.dispose();
        particlesRef.current.material.dispose();
      }
    };
  }, []);

  // Update scene based on device orientation
  useEffect(() => {
    if (!motionEnabled || !sceneRef.current) return;

    // Apply gentle tilt to scene based on device orientation
    const betaAngle = deviceOrientation.beta * 0.01;
    const gammaAngle = deviceOrientation.gamma * 0.01;
    
    if (sceneRef.current) {
      sceneRef.current.rotation.x = THREE.MathUtils.lerp(
        sceneRef.current.rotation.x,
        betaAngle,
        0.02 // Very gentle, smooth transition
      );
      
      sceneRef.current.rotation.y = THREE.MathUtils.lerp(
        sceneRef.current.rotation.y,
        gammaAngle,
        0.02
      );
    }
  }, [deviceOrientation, motionEnabled]);

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0"
      style={{ 
        pointerEvents: 'none',
        zIndex: 4 // Between gradient (0) and envelope (2)
      }}
    />
  );
};

export default ThreeBackground;