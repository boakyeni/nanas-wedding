'use client'
import { useRef, useEffect } from 'react';
import * as THREE from 'three';

const ThreeBackground = ({
  deviceOrientation = { beta: 0, gamma: 0 },
  motionEnabled = false,
  className = '',
  style = {},
  // Route endpoints (lon/lat degrees)
  start = { lon: -118.2437, lat: 34.0522 }, // Los Angeles
  end   = { lon:   -0.1870, lat:  5.6037 }, // Accra
  arcHeight = 0.25,  // 0 = straight line, 0.2–0.35 looks nice
  speed = 0.07,      // smaller = slower
}) => {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const airplaneRef = useRef(null);
  const frameIdRef = useRef(null);
  const clockRef = useRef(new THREE.Clock());
  const resizeObsRef = useRef(null);

  // Route control points & optional debug line
  const ARef = useRef(null);
  const BRef = useRef(null);
  const CRef = useRef(null);
  const pathLineRef = useRef(null);

  // --- helpers ---
  const sizeToContainer = () => {
    if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
    const { clientWidth: width, clientHeight: height } = containerRef.current;
    if (!width || !height) return;
    cameraRef.current.aspect = width / height;
    cameraRef.current.updateProjectionMatrix();
    rendererRef.current.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    rendererRef.current.setSize(width, height, false);
  };

  // Equirectangular lon/lat => NDC (-1..1)
  const lonLatToNDC = ({ lon, lat }) => ({
    x: lon / 180, // -180..180 -> -1..1
    y: lat / 90,  //  -90..90  -> -1..1
  });

  // NDC (-1..1) at Z=0 -> world coords for current camera
  const ndcToWorld = (camera, ndc) => {
    const worldH = 2 * Math.tan((camera.fov * Math.PI) / 180 / 2) * camera.position.z;
    const worldW = worldH * camera.aspect;
    return new THREE.Vector3(
      (worldW * 0.5) * ndc.x,
      (worldH * 0.5) * ndc.y,
      0
    );
  };

  // Quadratic Bézier & derivative
  const qBezier = (a, c, b, t, out = new THREE.Vector3()) =>
    out.copy(a).multiplyScalar((1 - t) * (1 - t))
       .add(c.clone().multiplyScalar(2 * (1 - t) * t))
       .add(b.clone().multiplyScalar(t * t));

  const qBezierDeriv = (a, c, b, t, out = new THREE.Vector3()) =>
    out.copy(c).sub(a).multiplyScalar(2 * (1 - t))
       .add(b.clone().sub(c).multiplyScalar(2 * t));

  // Build/refresh route after sizing (depends on camera aspect)
  const buildRoute = () => {
    const cam = cameraRef.current;
    const scene = sceneRef.current;
    if (!cam || !scene) return;

    const ndcA = lonLatToNDC(start);
    const ndcB = lonLatToNDC(end);
    const A = ndcToWorld(cam, ndcA);
    const B = ndcToWorld(cam, ndcB);

    // Control point C: midpoint + perpendicular lift proportional to distance
    const mid = new THREE.Vector3().addVectors(A, B).multiplyScalar(0.5);
    const dir = new THREE.Vector3().subVectors(B, A);
    const dist = dir.length();
    const perp = new THREE.Vector3(-dir.y, dir.x, 0).normalize().multiplyScalar(dist * arcHeight);
    const C = new THREE.Vector3().addVectors(mid, perp);

    ARef.current = A; BRef.current = B; CRef.current = C;

    // Optional faint path line for debugging (comment out to hide)
    if (pathLineRef.current) {
      scene.remove(pathLineRef.current);
      pathLineRef.current.geometry.dispose();
      pathLineRef.current.material.dispose();
      pathLineRef.current = null;
    }
    const pts = [];
    const tmp = new THREE.Vector3();
    for (let i = 0; i <= 80; i++) {
      const t = i / 80;
      pts.push(qBezier(A, C, B, t, tmp.clone()).clone());
    }
    const geom = new THREE.BufferGeometry().setFromPoints(pts);
    const mat = new THREE.LineBasicMaterial({ transparent: true, opacity: 0.18 });
    const line = new THREE.Line(geom, mat);
    scene.add(line);
    pathLineRef.current = line;
  };

  useEffect(() => {
    let cancelled = false;
    if (typeof window === 'undefined' || !containerRef.current) return;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.z = 15;
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    rendererRef.current = renderer;
    // Keep canvas inside parent, no overflow
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    containerRef.current.appendChild(renderer.domElement);

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const dir = new THREE.DirectionalLight(0xffffff, 0.8);
    dir.position.set(0, 10, 10);
    scene.add(dir);

    // Trail
    const createTrail = () => {
      const trailGeometry = new THREE.BufferGeometry();
      const trailMaterial = new THREE.PointsMaterial({
        color: 0xf1c27d,
        size: 0.01,
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending,
      });
      const trailPositions = [];
      for (let i = 0; i < 50; i++) trailPositions.push(-i * 0.1, 0, 0);
      trailGeometry.setAttribute('position', new THREE.Float32BufferAttribute(trailPositions, 3));
      const trail = new THREE.Points(trailGeometry, trailMaterial);
      return { trail };
    };

    // Fallback plane
    const createFallbackPlane = (trail) => {
      const g = new THREE.Group();
      const body = new THREE.Mesh(
        new THREE.ConeGeometry(0.15, 1, 8),
        new THREE.MeshPhongMaterial({ color: 0xffffff, emissive: 0x371f76, emissiveIntensity: 0.3 })
      );
      body.rotation.z = Math.PI / 2;
      g.add(body);

      const wings = new THREE.Mesh(
        new THREE.BoxGeometry(0.7, 0.05, 0.3),
        new THREE.MeshPhongMaterial({ color: 0xb29043 })
      );
      g.add(wings);

      if (trail) g.add(trail);
      return g;
    };

    // Airplane group (with trail)
    const airplaneGroup = new THREE.Group();
    const { trail } = createTrail();
    airplaneGroup.add(trail);
    airplaneGroup.userData = { trail };
    scene.add(airplaneGroup);
    airplaneRef.current = airplaneGroup;

    // Initial size & route
    sizeToContainer();
    buildRoute();

    // Observe container size -> resize & rebuild route
    if ('ResizeObserver' in window) {
      const obs = new ResizeObserver(() => { sizeToContainer(); buildRoute(); });
      obs.observe(containerRef.current);
      resizeObsRef.current = obs;
    } else {
      const onWinResize = () => { sizeToContainer(); buildRoute(); };
      window.addEventListener('resize', onWinResize);
      resizeObsRef.current = { disconnect: () => window.removeEventListener('resize', onWinResize) };
    }

    // Loaders (dynamic: safe for Next)
    (async () => {
      try {
        const [{ OBJLoader }, { MTLLoader }] = await Promise.all([
          import('three/examples/jsm/loaders/OBJLoader'),
          import('three/examples/jsm/loaders/MTLLoader'),
        ]);
        if (cancelled) return;

        const mtlLoader = new MTLLoader();
        mtlLoader.load(
          '/airplane.mtl',
          (materials) => {
            if (cancelled) return;
            materials.preload();
            const objLoader = new OBJLoader();
            objLoader.setMaterials(materials);
            objLoader.load(
              '/airplane.obj',
              (object) => {
                if (cancelled) return;
                object.scale.set(0.005, 0.005, 0.005);
                const box = new THREE.Box3().setFromObject(object);
                const center = box.getCenter(new THREE.Vector3());
                object.position.sub(center);
                object.rotation.set(0, 0, 0);
                object.rotation.y = -Math.PI / 1.5;
                object.rotation.x = -Math.PI / 2;
                airplaneGroup.add(object);
              },
              undefined,
              () => {
                if (cancelled) return;
                scene.add(createFallbackPlane(trail));
              }
            );
          },
          undefined,
          () => {
            // If MTL fails, try OBJ without materials
            const { OBJLoader } = require('three/examples/jsm/loaders/OBJLoader');
            const objLoader = new OBJLoader();
            objLoader.load(
              '/airplane.obj',
              (object) => {
                if (cancelled) return;
                object.traverse((child) => {
                  if (child.isMesh) {
                    child.material = new THREE.MeshPhongMaterial({
                      color: 0xffffff,
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
              },
              undefined,
              () => {
                if (cancelled) return;
                scene.add(createFallbackPlane(trail));
              }
            );
          }
        );
      } catch {
        // Show fallback if loaders fail
        scene.add(createFallbackPlane(airplaneGroup.userData?.trail));
      }
    })();

    // Animation: follow Bézier from A -> B
    const animate = () => {
      frameIdRef.current = requestAnimationFrame(animate);
      clockRef.current.getDelta();

      const airplane = airplaneRef.current;
      const A = ARef.current, B = BRef.current, C = CRef.current;

      if (airplane && A && B && C) {
        const t = (clockRef.current.getElapsedTime() * speed) % 1;

        // Position
        const pos = new THREE.Vector3();
        qBezier(A, C, B, t, pos);
        airplane.position.copy(pos);

        // Tangent & orientation
        const tangent = new THREE.Vector3();
        qBezierDeriv(A, C, B, t, tangent).normalize();
        const target = new THREE.Vector3().copy(pos).add(tangent);

        const lookAtMatrix = new THREE.Matrix4();
        lookAtMatrix.lookAt(pos, target, new THREE.Vector3(0, 1, 0));
        const targetQ = new THREE.Quaternion().setFromRotationMatrix(lookAtMatrix);

        // Flip if model faces backward
        const correctionQ = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI);
        targetQ.multiply(correctionQ);

        airplane.quaternion.slerp(targetQ, 0.25);

        // Trail
        const trail = airplane.userData?.trail;
        if (trail) {
          const attr = trail.geometry.attributes.position;
          const arr = attr.array;
          const trailOffset = new THREE.Vector3(-0.5, 0, 0).applyQuaternion(airplane.quaternion);
          for (let i = (arr.length / 3) - 1; i > 0; i--) {
            arr[i * 3]     = arr[(i - 1) * 3];
            arr[i * 3 + 1] = arr[(i - 1) * 3 + 1];
            arr[i * 3 + 2] = arr[(i - 1) * 3 + 2];
          }
          arr[0] = trailOffset.x; arr[1] = trailOffset.y; arr[2] = trailOffset.z;
          attr.needsUpdate = true;
        }
      }

      rendererRef.current.render(sceneRef.current, cameraRef.current);
    };
    animate();

    // Cleanup
    return () => {
      cancelled = true;
      if (frameIdRef.current) cancelAnimationFrame(frameIdRef.current);
      if (resizeObsRef.current) resizeObsRef.current.disconnect?.();

      if (containerRef.current && rendererRef.current) {
        try { containerRef.current.removeChild(rendererRef.current.domElement); } catch {}
      }
      if (rendererRef.current) rendererRef.current.dispose();

      if (pathLineRef.current) {
        scene.remove(pathLineRef.current);
        pathLineRef.current.geometry.dispose();
        pathLineRef.current.material.dispose();
      }

      if (airplaneRef.current) {
        airplaneRef.current.traverse((child) => {
          if (child.geometry) child.geometry.dispose();
          if (child.material) {
            if (Array.isArray(child.material)) child.material.forEach((m) => m.dispose && m.dispose());
            else child.material.dispose && child.material.dispose();
          }
        });
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [arcHeight, speed, start.lon, start.lat, end.lon, end.lat]); // rebuild if route params change

  // Gentle device tilt
  useEffect(() => {
    if (!motionEnabled || !sceneRef.current) return;
    const betaAngle = deviceOrientation.beta * 0.01;
    const gammaAngle = deviceOrientation.gamma * 0.01;
    sceneRef.current.rotation.x = THREE.MathUtils.lerp(sceneRef.current.rotation.x, betaAngle, 0.02);
    sceneRef.current.rotation.y = THREE.MathUtils.lerp(sceneRef.current.rotation.y, gammaAngle, 0.02);
  }, [deviceOrientation, motionEnabled]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',   // parent must give it a height (we're overlaying, so parent is the SVG box)
        pointerEvents: 'none',
        ...style,
      }}
    />
  );
};

export default ThreeBackground;
