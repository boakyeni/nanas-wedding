'use client';
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';

const InteractiveShaderEnvelope = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;

    // Set up scene, camera, and renderer.
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf3f4f6);

    const camera = new THREE.PerspectiveCamera(
      45,
      mount.clientWidth / mount.clientHeight,
      0.1,
      100
    );
    camera.position.z = 3;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    // Create a plane geometry to represent the envelope.
    // The subdivisions give the shader extra vertices to work with.
    const geometry = new THREE.PlaneGeometry(2, 1, 32, 16);

    // Define uniforms for our shader.
    const uniforms = {
      time: { value: 0.0 }
    };

    // Vertex shader: passes UV coordinates and adds a subtle distortion on the top half.
    const vertexShader = `
      uniform float time;
      varying vec2 vUv;
      void main() {
        vUv = uv;
        vec3 pos = position;
        // For the top half (uv.y > 0.5), add a subtle horizontal wave effect.
        if (uv.y > 0.5) {
          pos.x += sin(uv.y * 10.0 + time) * 0.1;
        }
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `;

    // Fragment shader: creates a vertical gradient and a subtle shimmering effect.
    const fragmentShader = `
      uniform float time;
      varying vec2 vUv;
      void main() {
        vec2 uv = vUv;
        // Gradient colors simulating an envelope tone.
        vec3 color1 = vec3(0.55, 0.27, 0.07); // deeper brown.
        vec3 color2 = vec3(0.94, 0.77, 0.47); // lighter, paper-like.
        vec3 color = mix(color1, color2, uv.y);
        // A subtle shimmer effect.
        float shimmer = sin((uv.x + uv.y + time) * 10.0) * 0.05;
        color += shimmer;
        gl_FragColor = vec4(color, 1.0);
      }
    `;

    // Create the shader material.
    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
    });

    // Create and add the mesh to the scene.
    const envelopeMesh = new THREE.Mesh(geometry, material);
    scene.add(envelopeMesh);

    // Set up post-processing with EffectComposer.
    const composer = new EffectComposer(renderer);
    composer.setSize(mount.clientWidth, mount.clientHeight);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    // Add an UnrealBloomPass for a glowing effect.
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(mount.clientWidth, mount.clientHeight),
      1.5, // strength
      0.4, // radius
      0.85 // threshold
    );
    composer.addPass(bloomPass);

    // Animation loop.
    const clock = new THREE.Clock();
    let frameId;
    const animate = () => {
      uniforms.time.value = clock.getElapsedTime();
      composer.render();
      frameId = requestAnimationFrame(animate);
    };
    animate();

    // Handle window resize.
    const handleResize = () => {
      const width = mount.clientWidth;
      const height = mount.clientHeight;
      renderer.setSize(width, height);
      composer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', handleResize);

    // Clean up on unmount.
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} style={{ width: '100%', height: '100vh' }} />;
};

export default InteractiveShaderEnvelope;
