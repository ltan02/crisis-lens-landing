'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Real disasters with actual coordinates
const MAJOR_DISASTERS = [
  { id: '1', title: 'Los Angeles Wildfires', category: 'Wildfires', region: 'North America', lat: 34.0522, lon: -118.2437 },
  { id: '2', title: 'Tokyo Earthquake Zone', category: 'Earthquakes', region: 'Asia', lat: 35.6762, lon: 139.6503 },
  { id: '3', title: 'Amazon Rainforest Fires', category: 'Wildfires', region: 'South America', lat: -3.4653, lon: -62.2159 },
  { id: '4', title: 'Pakistan Monsoon Floods', category: 'Floods', region: 'Asia', lat: 30.3753, lon: 69.3451 },
  { id: '5', title: 'Mount Etna Eruption', category: 'Volcanoes', region: 'Europe', lat: 37.7510, lon: 14.9934 },
  { id: '6', title: 'Horn of Africa Drought', category: 'Drought', region: 'Africa', lat: 9.145, lon: 40.4897 },
  { id: '7', title: 'Manila Typhoon', category: 'Severe Storms', region: 'Asia', lat: 14.5995, lon: 120.9842 },
  { id: '8', title: 'Sydney Bushfires', category: 'Wildfires', region: 'Oceania', lat: -33.8688, lon: 151.2093 }
];

// Radii: keep surface slightly below markers/dots for subtle parallax
const SURFACE_R = 19.5;
const MARKER_R = 20;

export default function Globe({ onDisasterPositions }) {
  const mountRef = useRef(null);
  const materialsRef = useRef([]);
  const cameraRef = useRef(null);
  const globeGroupRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const container = mountRef.current;
    let animationId;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(
      30,
      container.clientWidth / container.clientHeight,
      1,
      1000
    );
    camera.position.z = (container.clientWidth || window.innerWidth) > 700 ? 100 : 140;
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: true
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Lighting - very dim for comfort
    const pointLight = new THREE.PointLight(0x2a3040, 4, 200);
    pointLight.position.set(-50, 0, 60);
    scene.add(pointLight);
    scene.add(new THREE.HemisphereLight(0x4a5568, 0x0a0e14, 0.5));

    // OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.autoRotate = true;
    controls.autoRotateSpeed = 2.0;
    controls.enableDamping = true;
    // Disable manual rotation; globe will just auto-rotate
    controls.enableRotate = false;
    controls.enablePan = false;
    controls.enableZoom = false;
    controls.minPolarAngle = (Math.PI / 2) - 0.5;
    controls.maxPolarAngle = (Math.PI / 2) + 0.5;

    // Create globe group for rotation
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);
    globeGroupRef.current = globeGroup;

    // Effects group (ripples, arcs, packets)
    const effectsGroup = new THREE.Group();
    globeGroup.add(effectsGroup);

    // Base sphere - very dark (add to globe group)
    const baseSphere = new THREE.SphereGeometry(SURFACE_R, 35, 35);
    const baseMaterial = new THREE.MeshStandardMaterial({
      color: 0x0a0e14,
      transparent: true,
      opacity: 0.98
    });
    const baseMesh = new THREE.Mesh(baseSphere, baseMaterial);
    globeGroup.add(baseMesh);

    // Load and process world map (add to globe group instead of scene)
    loadWorldMap(globeGroup, materialsRef);

    // Ripple effects setup
    const rippleSources = MAJOR_DISASTERS.map(d => ({ lat: d.lat, lon: d.lon }));
    const ripples = [];
    const RIPPLE_DURATION_MS = 3000;
    const RIPPLE_MAX_SCALE = 6;
    const RIPPLE_BASE_SCALE = 0.6;

    function spawnRippleAt(lat, lon) {
      const center = latLonToVector3(lat, lon, SURFACE_R + 0.05);
      const normal = center.clone().normalize();
      const ringGeom = new THREE.RingGeometry(0.12, 0.14, 64);
      const ringMat = new THREE.MeshBasicMaterial({ color: 0x4fc3f7, transparent: true, opacity: 0.9, depthWrite: false });
      const ring = new THREE.Mesh(ringGeom, ringMat);
      const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);
      ring.quaternion.copy(quat);
      ring.position.copy(center);
      ring.scale.setScalar(RIPPLE_BASE_SCALE);
      effectsGroup.add(ring);
      ripples.push({ mesh: ring, start: performance.now(), lat, lon });
    }

    // Seed a few ripples initially
    for (let i = 0; i < Math.min(5, rippleSources.length); i++) {
      const src = rippleSources[i];
      spawnRippleAt(src.lat, src.lon);
    }

    // Arc connections with moving packets
    const arcPairs = [
      [MAJOR_DISASTERS[0], MAJOR_DISASTERS[1]], // LA -> Tokyo
      [MAJOR_DISASTERS[2], MAJOR_DISASTERS[4]], // Amazon -> Etna
      [MAJOR_DISASTERS[6], MAJOR_DISASTERS[7]], // Manila -> Sydney
      [MAJOR_DISASTERS[3], MAJOR_DISASTERS[5]], // Pakistan -> Horn of Africa
    ].filter(Boolean);

    const arcs = [];
    
    // Watcher blips (ephemeral, biased toward hotspots)
    const watcherBlips = [];
    const MAX_WATCHERS = 120;
    const WATCHER_DURATION_MS = 1800;
    const watcherGeom = new THREE.SphereGeometry(0.07, 6, 6);
    const watcherMat = new THREE.MeshBasicMaterial({ color: 0x9be7ff, transparent: true, opacity: 0.0, depthWrite: false });

    function spawnWatcher() {
      // 70% pick a hotspot, 30% random land-ish lat/lon
      let lat, lon;
      if (Math.random() < 0.7) {
        const src = rippleSources[Math.floor(Math.random() * rippleSources.length)];
        // jitter within ~2 degrees
        lat = src.lat + (Math.random() - 0.5) * 4;
        lon = src.lon + (Math.random() - 0.5) * 4;
      } else {
        lat = -60 + Math.random() * 120; // avoid poles for visibility
        lon = -180 + Math.random() * 360;
      }
      const pos = latLonToVector3(lat, lon, SURFACE_R + 0.1);
      const m = new THREE.Mesh(watcherGeom, watcherMat.clone());
      m.position.copy(pos);
      m.material.opacity = 0.0;
      effectsGroup.add(m);
      watcherBlips.push({ mesh: m, start: performance.now(), lat, lon });
    }

    function createArc(from, to) {
      const start = latLonToVector3(from.lat, from.lon, MARKER_R);
      const end = latLonToVector3(to.lat, to.lon, MARKER_R);
      const midDir = start.clone().add(end).normalize();
      const mid = midDir.multiplyScalar(MARKER_R + 3.0);
      const curve = new THREE.CatmullRomCurve3([start, mid, end]);
      const points = curve.getPoints(64);
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({ color: 0x80d8ff, transparent: true, opacity: 0.4 });
      const line = new THREE.Line(geometry, material);
      effectsGroup.add(line);

      const packets = [];
      const packetCount = 3;
      for (let i = 0; i < packetCount; i++) {
        const pGeom = new THREE.SphereGeometry(0.12, 8, 8);
        const pMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.9 });
        const packet = new THREE.Mesh(pGeom, pMat);
        effectsGroup.add(packet);
        packets.push({ mesh: packet, t: Math.random(), speed: 0.12 + Math.random() * 0.18, curve });
      }

      arcs.push({ line, curve, packets });
    }

    arcPairs.forEach(([a, b]) => createArc(a, b));

    // Handle resize
    const handleResize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.position.z = (width || window.innerWidth) > 700 ? 100 : 140;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', handleResize);

    // Animation loop - very slow twinkling
    const twinkleTime = 0.008;
    let lastTime = performance.now();
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      const now = performance.now();
      const dt = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;

      // 1) update controls first (moves the camera)
      controls.update();

      // 2) twinkling uniforms
      materialsRef.current.forEach(mat => {
        mat.uniforms.u_time.value += twinkleTime;
      });

      // 3) ensure matrices are current before projection
      camera.updateMatrixWorld(true);
      globeGroup.updateMatrixWorld(true);
      scene.updateMatrixWorld(true);

      // 4) update effects (ripples, arcs)
      // Ripples
      for (let i = 0; i < ripples.length; i++) {
        const r = ripples[i];
        const progress = (now - r.start) / RIPPLE_DURATION_MS;
        if (progress >= 1) {
          const src = rippleSources[Math.floor(Math.random() * rippleSources.length)];
          r.start = now;
          r.lat = src.lat;
          r.lon = src.lon;
          const center = latLonToVector3(r.lat, r.lon, SURFACE_R + 0.05);
          const normal = center.clone().normalize();
          r.mesh.position.copy(center);
          r.mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);
          r.mesh.scale.setScalar(RIPPLE_BASE_SCALE);
          r.mesh.material.opacity = 0.9;
          continue;
        }
        const s = RIPPLE_BASE_SCALE + progress * RIPPLE_MAX_SCALE;
        r.mesh.scale.setScalar(s);
        r.mesh.material.opacity = 0.9 * (1 - progress);
      }

      // Packets along arcs
      for (let i = 0; i < arcs.length; i++) {
        const arc = arcs[i];
        for (let j = 0; j < arc.packets.length; j++) {
          const pkt = arc.packets[j];
          pkt.t = (pkt.t + pkt.speed * dt) % 1;
          const pos = arc.curve.getPointAt(pkt.t);
          pkt.mesh.position.copy(pos);
        }
      }

      // Watcher blips: spawn and animate
      if (watcherBlips.length < MAX_WATCHERS && Math.random() < 0.6) {
        spawnWatcher();
      }
      for (let i = watcherBlips.length - 1; i >= 0; i--) {
        const b = watcherBlips[i];
        const p = (now - b.start) / WATCHER_DURATION_MS;
        if (p >= 1) {
          effectsGroup.remove(b.mesh);
          b.mesh.geometry.dispose();
          b.mesh.material.dispose();
          watcherBlips.splice(i, 1);
          continue;
        }
        // fade in then out
        const fade = p < 0.3 ? (p / 0.3) : (1 - (p - 0.3) / 0.7);
        b.mesh.material.opacity = Math.max(0, Math.min(1, fade)) * 0.9;
        // slight outward drift along normal
        const normal = b.mesh.position.clone().normalize();
        b.mesh.position.addScaledVector(normal, 0.002);
      }

      // Optional: compute projected positions if a callback is provided
      if (onDisasterPositions) {
        updateDisasterPositions();
      }

      // 5) render
      renderer.render(scene, camera);
    };
    animate();

    // Update disaster marker screen positions based on globe rotation
    function updateDisasterPositions() {
      if (!cameraRef.current || !onDisasterPositions) return;

      // Reuse temp vectors to avoid GC thrash
      const vWorld = new THREE.Vector3();
      const vNDC = new THREE.Vector3();

      const positions = MAJOR_DISASTERS.map(disaster => {
        // Lat/lon to world position; globe is static at origin
        vWorld.copy(latLonToVector3(disaster.lat, disaster.lon, MARKER_R));

        // If later rotating/translating the globe group, switch to:
        // globeGroupRef.current?.localToWorld(vWorld);

        // Project to NDC
        vNDC.copy(vWorld).project(cameraRef.current);

        // Convert to pixel coords
        const x = (vNDC.x * 0.5 + 0.5) * window.innerWidth;
        const y = (vNDC.y * -0.5 + 0.5) * window.innerHeight;

        // Visibility: inside clip and in front of camera
        const onScreen =
          vNDC.x >= -1 && vNDC.x <= 1 &&
          vNDC.y >= -1 && vNDC.y <= 1 &&
          vNDC.z >= -1 && vNDC.z <= 1;

        const PAD = 50;
        const withinPad =
          x > PAD && x < window.innerWidth - PAD &&
          y > PAD && y < window.innerHeight - PAD;

        return {
          ...disaster,
          position: { x, y },
          visible: onScreen && withinPad
        };
      });

      onDisasterPositions(positions.filter(d => d.visible));
    }

    // Cleanup
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      controls.dispose();
      
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      
      renderer.dispose();
    };
  }, [onDisasterPositions]);

  return <div ref={mountRef} className="w-full h-full" />;
}

// Helper: Convert lat/lon to 3D position
function latLonToVector3(lat, lon, radius) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = (radius * Math.sin(phi) * Math.sin(theta));
  const y = (radius * Math.cos(phi));
  
  return new THREE.Vector3(x, y, z);
}

// Shader code
const vertexShader = `
  uniform float u_time;

  void main() {
    vec3 newPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
  }
`;

const fragmentShader = `
  uniform float u_time;

  vec3 colorA = vec3(0.25, 0.28, 0.32);   // Very muted gray-blue
  vec3 colorB = vec3(0.20, 0.22, 0.25);   // Even darker gray-blue

  void main() {
    vec3 color = vec3(0.0);
    float pct = abs(sin(u_time)) * 0.15 + 0.85;  // Very subtle twinkling (85-100% brightness)
    color = mix(colorA, colorB, pct);
    gl_FragColor = vec4(color, 0.6);  // More transparency
  }
`;

// Load world map and create dots
function loadWorldMap(scene, materialsRef) {
  const image = new Image();
  
  image.onload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
    
    const context = canvas.getContext('2d');
    context.drawImage(image, 0, 0);
    
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    
    console.log(`Image dimensions: ${canvas.width}x${canvas.height}`);
    
    // Process image data
    const activeLatLon = {};
    readImageData(imageData.data, activeLatLon, canvas.width, canvas.height);
    
    // Create dots
    createDots(scene, activeLatLon, materialsRef);
  };
  
  image.onerror = () => {
    console.error('Failed to load world map image');
  };
  
  image.src = '/assets/world_alpha_mini.jpg';
}

// Read image data to find land coordinates
function readImageData(imageData, activeLatLon, width, height) {
  for (let y = 0; y < height; y++) {
    const lat = Math.round(90 - (y / height) * 180);
    
    if (!activeLatLon[lat]) activeLatLon[lat] = [];
    
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      const lon = Math.round(-180 + (x / width) * 360);
      
      const red = imageData[i];
      const green = imageData[i + 1];
      const blue = imageData[i + 2];
      
      // Dark pixels represent land
      if (red < 80 && green < 80 && blue < 80) {
        activeLatLon[lat].push(lon);
      }
    }
  }
}

// Check if coordinate should be visible
function visibilityForCoordinate(lon, lat, activeLatLon) {
  if (!activeLatLon[lat] || !activeLatLon[lat].length) return false;
  
  const closest = activeLatLon[lat].reduce((prev, curr) => {
    return (Math.abs(curr - lon) < Math.abs(prev - lon) ? curr : prev);
  });
  
  return Math.abs(lon - closest) < 0.5;
}

// Convert lat/lon to 3D position (exact formula from repo)
function calcPosFromLatLonRad(lon, lat, radius) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = (radius * Math.sin(phi) * Math.sin(theta));
  const y = (radius * Math.cos(phi));
  
  return new THREE.Vector3(x, y, z);
}

// Create shader material
function createMaterial(timeValue, materialsRef) {
  const material = new THREE.ShaderMaterial({
    side: THREE.DoubleSide,
    uniforms: {
      u_time: { value: timeValue * Math.sin(Math.random()) }
    },
    vertexShader: vertexShader,
    fragmentShader: fragmentShader
  });
  
  materialsRef.current.push(material);
  return material;
}

// Create dots on globe
function createDots(scene, activeLatLon, materialsRef) {
  const dotSphereRadius = 20;
  const dotDensity = 2.5;
  let dotCount = 0;
  
  for (let lat = 90, i = 0; lat > -90; lat--, i++) {
    const radius = Math.cos(Math.abs(lat) * (Math.PI / 180)) * dotSphereRadius;
    const circumference = radius * Math.PI * 2;
    const dotsForLat = circumference * dotDensity;
    
    for (let x = 0; x < dotsForLat; x++) {
      const lon = -180 + x * 360 / dotsForLat;
      
      if (!visibilityForCoordinate(lon, lat, activeLatLon)) continue;
      
      const vector = calcPosFromLatLonRad(lon, lat, dotSphereRadius);
      
      const dotGeometry = new THREE.CircleGeometry(0.08, 5);  // Smaller dots
      dotGeometry.lookAt(vector);
      dotGeometry.translate(vector.x, vector.y, vector.z);
      
      const material = createMaterial(i, materialsRef);
      const mesh = new THREE.Mesh(dotGeometry, material);
      
      scene.add(mesh);
      dotCount++;
    }
  }
  
  console.log(`Created ${dotCount} dots`);
}
