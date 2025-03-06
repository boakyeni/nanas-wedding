'use client'
import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';

const ThreeBackground = ({ deviceOrientation = { beta: 0, gamma: 0 }, motionEnabled = false }) => {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const airplaneRef = useRef(null);
  const frameIdRef = useRef(null);
  const clockRef = useRef(new THREE.Clock());

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

    // Create trail effect (this will be attached to the airplane later)
    const createTrail = () => {
      const trailGeometry = new THREE.BufferGeometry();
      const trailMaterial = new THREE.PointsMaterial({
        color: 0xf1c27d,
        size: 0.01, // Even smaller trail size for the tiny airplane
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending
      });
      
      // Create trail points
      const trailPositions = [];
      for (let i = 0; i < 50; i++) {
        trailPositions.push(-i * 0.1, 0, 0); // Initial positions
      }
      
      trailGeometry.setAttribute('position', new THREE.Float32BufferAttribute(trailPositions, 3));
      const trail = new THREE.Points(trailGeometry, trailMaterial);
      
      return { trail, trailPositions };
    };

    // Create airplane group to hold the model and trail
    const airplaneGroup = new THREE.Group();
    const { trail, trailPositions } = createTrail();
    airplaneGroup.add(trail);
    
    // Store trail data for animation
    airplaneGroup.userData = {
      trail: trail,
      trailPositions: trailPositions
    };
    
    // Load the MTL and then OBJ model
    // First load the materials file
    const mtlLoader = new MTLLoader();
    mtlLoader.load(
      '/airplane.mtl', // Path to your MTL file
      (materials) => {
        materials.preload();
        
        // Create OBJ loader and set materials
        const objLoader = new OBJLoader();
        objLoader.setMaterials(materials);
        
        // Now load the OBJ file
        objLoader.load(
          '/airplane.obj', // Path to your OBJ file
          (object) => {
            // Make the airplane much smaller
            object.scale.set(0.001, 0.001, 0.001); // 10x smaller than before
            
            // Center the model
            const box = new THREE.Box3().setFromObject(object);
            const center = box.getCenter(new THREE.Vector3());
            object.position.sub(center);
            
            // Reset any default rotations and apply specific orientation
            // Rotate to show side view with nose forward, not up
            object.rotation.set(0, 0, 0); // Reset all rotations
            
            // These rotations may need adjustment depending on how your model is oriented
            object.rotation.y = Math.PI / 2; // 90 degrees - to see the side
            object.rotation.x = -Math.PI / 2; // 90 degrees down - to point nose forward
            
            // Add the model to the airplane group
            airplaneGroup.add(object);
            
            // Add airplane to scene
            scene.add(airplaneGroup);
            airplaneRef.current = airplaneGroup;
            
            // Position the airplane higher on screen
            airplaneGroup.position.set(0, 8, 0);
          },
          (xhr) => {
            console.log((xhr.loaded / xhr.total * 100) + '% OBJ loaded');
          },
          (error) => {
            console.error('Error loading OBJ model:', error);
            
            // Fallback to a simple airplane if model fails to load
            const fallbackPlane = createFallbackPlane();
            scene.add(fallbackPlane);
            airplaneRef.current = fallbackPlane;
          }
        );
      },
      (xhr) => {
        console.log((xhr.loaded / xhr.total * 100) + '% MTL loaded');
      },
      (error) => {
        console.error('Error loading MTL file:', error);
        
        // If MTL fails, try to load OBJ without materials
        const objLoader = new OBJLoader();
        objLoader.load(
          '/airplane.obj',
          (object) => {
            object.traverse((child) => {
              if (child instanceof THREE.Mesh) {
                // Apply a fallback material
                child.material = new THREE.MeshPhongMaterial({ 
                  color: 0xFFFFFF,
                  emissive: 0x371f76,
                  emissiveIntensity: 0.3,
                  shininess: 90,
                });
              }
            });
            
            object.scale.set(0.001, 0.001, 0.001);
            
            const box = new THREE.Box3().setFromObject(object);
            const center = box.getCenter(new THREE.Vector3());
            object.position.sub(center);
            
            airplaneGroup.add(object);
            scene.add(airplaneGroup);
            airplaneRef.current = airplaneGroup;
            airplaneGroup.position.set(0, 8, 0);
          },
          null,
          (error) => {
            console.error('Error loading OBJ as fallback:', error);
            const fallbackPlane = createFallbackPlane();
            scene.add(fallbackPlane);
            airplaneRef.current = fallbackPlane;
          }
        );
      }
    );
    
    // Fallback airplane if OBJ fails to load
    const createFallbackPlane = () => {
      const fallbackGroup = new THREE.Group();
      
      // Simple plane shape
      const bodyGeometry = new THREE.ConeGeometry(0.15, 1, 8);
      const bodyMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xFFFFFF,
        emissive: 0x371f76,
        emissiveIntensity: 0.3,
      });
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
      body.rotation.z = Math.PI / 2; // Rotate to point forward
      fallbackGroup.add(body);
      
      // Wings
      const wingGeometry = new THREE.BoxGeometry(0.7, 0.05, 0.3);
      const wingMaterial = new THREE.MeshPhongMaterial({ color: 0xb29043 });
      const wings = new THREE.Mesh(wingGeometry, wingMaterial);
      fallbackGroup.add(wings);
      
      fallbackGroup.position.set(0, 5, 0);
      fallbackGroup.add(trail);
      fallbackGroup.userData = airplaneGroup.userData;
      
      return fallbackGroup;
    };

    // Animation loop
    const animate = () => {
        frameIdRef.current = requestAnimationFrame(animate);
        const delta = clockRef.current.getDelta();
        
        if (airplaneRef.current) {
          const airplane = airplaneRef.current;
          const time = clockRef.current.getElapsedTime();
          const radius = 3; // Size of the circular flight path
          const height = 8; // Base height
          const speed = -0.4; // Flight speed
          
          // Compute current position on a circular path:
          const currentPos = new THREE.Vector3(
            radius * Math.cos(time * speed),
            height + Math.sin(time * speed * 0.5) * 0.5,
            radius * Math.sin(time * speed) * 0.8
          );
          
          // Compute a slightly future position for direction calculation:
          const nextTime = time + 0.01;
          const nextPos = new THREE.Vector3(
            radius * Math.cos(nextTime * speed),
            height + Math.sin(nextTime * speed * 0.5) * 0.5,
            radius * Math.sin(nextTime * speed) * 0.8
          );
          
          // Set the airplane's position:
          airplane.position.copy(currentPos);
          
          // Calculate the direction vector (tangent) to the flight path:
          const direction = new THREE.Vector3().subVectors(nextPos, currentPos).normalize();
          const targetPosition = new THREE.Vector3().copy(currentPos).add(direction);
          
          // Create a lookAt matrix from currentPos to targetPosition:
          const lookAtMatrix = new THREE.Matrix4();
          lookAtMatrix.lookAt(currentPos, targetPosition, new THREE.Vector3(0, 1, 0));
          const targetQuaternion = new THREE.Quaternion().setFromRotationMatrix(lookAtMatrix);
          
          // Apply a correction to flip the model if it’s upside down.
          // Adjust the axis and angle if your model needs a different correction.
          const correctionQuaternion = new THREE.Quaternion();
          correctionQuaternion.setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI);
          targetQuaternion.multiply(correctionQuaternion);
          
          // Smoothly interpolate the airplane’s quaternion toward the target.
          airplane.quaternion.slerp(targetQuaternion, 0.1);
          
          // Update trail – note the fix for the Z coordinate:
          if (airplane.userData && airplane.userData.trail) {
            const trailPositions = airplane.userData.trail.geometry.attributes.position.array;
            const trailOffset = new THREE.Vector3(-0.5, 0, 0);
            trailOffset.applyQuaternion(airplane.quaternion);
            
            // Shift all trail points back:
            for (let i = (trailPositions.length / 3) - 1; i > 0; i--) {
              trailPositions[i * 3]     = trailPositions[(i - 1) * 3];
              trailPositions[i * 3 + 1] = trailPositions[(i - 1) * 3 + 1];
              trailPositions[i * 3 + 2] = trailPositions[(i - 1) * 3 + 2];
            }
            
            // Update the first trail point:
            trailPositions[0] = trailOffset.x;
            trailPositions[1] = trailOffset.y;
            trailPositions[2] = trailOffset.z;
            
            airplane.userData.trail.geometry.attributes.position.needsUpdate = true;
          }
        }
        
        rendererRef.current.render(sceneRef.current, cameraRef.current);
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
      if (airplaneRef.current) {
        airplaneRef.current.traverse((child) => {
          if (child.geometry) child.geometry.dispose();
          if (child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach(material => material.dispose());
            } else {
              child.material.dispose();
            }
          }
        });
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