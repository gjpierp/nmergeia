import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import gsap from 'gsap';
import { languageNames } from '../locales/index.js';

export const OrbitalGlobeLanguageSelector = ({
  activeLanguageCode,
  onSelectLanguage,
  globeTextureUrl = 'https://unpkg.com/three-globe/example/img/earth-dark.jpg',
  width = '100%',
  height = '500px',
}) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const globeRef = useRef(null);
  const orbitsGroupRef = useRef(null);
  const markersGroupRef = useRef(null);
  
  const lastUserInteractionTime = useRef(Date.now());
  const hoveredMarkerRef = useRef(null);
  const isHoveredRef = useRef(false);
  const [isMobile, setIsMobile] = React.useState(
    typeof window !== 'undefined' ? window.innerWidth < 600 : false
  );

  React.useEffect(() => {
    const handleResizeMobile = () => {
      setIsMobile(window.innerWidth < 600);
    };
    window.addEventListener('resize', handleResizeMobile);
    return () => window.removeEventListener('resize', handleResizeMobile);
  }, []);

  // Mapeamos los 7 idiomas a sus órbitas y ubicaciones geográficas relativas para los anillos
  const languagesList = [
    { code: 'es', name: 'Español', flagUrl: 'https://flagcdn.com/w160/es.png', orbitIndex: 0 },
    { code: 'en', name: 'English', flagUrl: 'https://flagcdn.com/w160/us.png', orbitIndex: 0 },
    { code: 'pt', name: 'Português', flagUrl: 'https://flagcdn.com/w160/br.png', orbitIndex: 1 },
    { code: 'fr', name: 'Français', flagUrl: 'https://flagcdn.com/w160/fr.png', orbitIndex: 1 },
    { code: 'de', name: 'Deutsch', flagUrl: 'https://flagcdn.com/w160/de.png', orbitIndex: 1 },
    { code: 'zh', name: '简体中文', flagUrl: 'https://flagcdn.com/w160/cn.png', orbitIndex: 2 },
    { code: 'ja', name: '日本語', flagUrl: 'https://flagcdn.com/w160/jp.png', orbitIndex: 2 },
  ];

  useEffect(() => {
    if (isMobile) return;
    if (!containerRef.current || !canvasRef.current) return;

    const widthPx = containerRef.current.clientWidth || (typeof width === 'number' ? width : 220);
    const heightPx = containerRef.current.clientHeight || (typeof height === 'number' ? height : 220);

    let scene, camera, renderer;
    try {
      // 1. Escena y Cámara
      scene = new THREE.Scene();
      sceneRef.current = scene;

      camera = new THREE.PerspectiveCamera(45, widthPx / heightPx, 0.1, 100);
      if (heightPx < 100) {
        camera.position.set(0, 0, 8.5);
      } else {
        camera.position.set(0, 4, 13);
      }
      cameraRef.current = camera;

      // 2. Renderizador WebGL
      renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.current,
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
      renderer.setSize(widthPx, heightPx);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      rendererRef.current = renderer;
    } catch (e) {
      console.warn('WebGL not supported, falling back to flat language selector:', e);
      setIsMobile(true);
      return;
    }

    // 3. Controles
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 6;
    controls.maxDistance = 20;
    controlsRef.current = controls;

    const recordInteraction = () => {
      lastUserInteractionTime.current = Date.now();
    };
    controls.addEventListener('start', recordInteraction);
    controls.addEventListener('change', recordInteraction);

    // 4. Luces
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.35);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 0.85);
    sunLight.position.set(10, 8, 10);
    scene.add(sunLight);

    const accentLight = new THREE.DirectionalLight(0x06b6d4, 0.4);
    accentLight.position.set(-10, -5, -10);
    scene.add(accentLight);

    // Campo de partículas (estrellas)
    const starCount = 200;
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i++) {
      starPositions[i] = (Math.random() - 0.5) * 40;
    }
    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMaterial = new THREE.PointsMaterial({
      color: 0x64748b,
      size: 0.07,
      transparent: true,
      opacity: 0.5,
    });
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    // 5. Globo Esférico Central con Textura Procesal Local (0ms latency, 100% offline)
    const globeRadius = 0.5;
    const globeGeo = new THREE.SphereGeometry(globeRadius, 48, 48);
    
    const procCanvas = document.createElement('canvas');
    procCanvas.width = 512;
    procCanvas.height = 256;
    const pCtx = procCanvas.getContext('2d');
    if (pCtx) {
      pCtx.fillStyle = '#0b0f19';
      pCtx.fillRect(0, 0, 512, 256);
      pCtx.fillStyle = '#1e293b';
      for (let i = 0; i < 250; i++) {
        pCtx.beginPath();
        pCtx.arc(Math.random() * 512, Math.random() * 256, Math.random() * 3 + 1, 0, Math.PI * 2);
        pCtx.fill();
      }
    }
    const earthTexture = new THREE.CanvasTexture(procCanvas);

    const globeMat = new THREE.MeshStandardMaterial({
      map: earthTexture,
      roughness: 0.9,
      metalness: 0.1,
    });
    const globe = new THREE.Mesh(globeGeo, globeMat);
    scene.add(globe);
    globeRef.current = globe;

    // Brillo de Atmósfera
    const atmosGeo = new THREE.SphereGeometry(globeRadius * 1.04, 32, 32);
    const atmosMat = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.6 - dot(vNormal, vec3(0, 0, 1.0)), 2.5);
          gl_FragColor = vec4(16.0/255.0, 185.0/255.0, 129.0/255.0, 1.0) * intensity * 0.45;
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true
    });
    const atmosMesh = new THREE.Mesh(atmosGeo, atmosMat);
    scene.add(atmosMesh);

    // 6. Anillos Orbitales
    const orbitsGroup = new THREE.Group();
    scene.add(orbitsGroup);
    orbitsGroupRef.current = orbitsGroup;

    const markersGroup = new THREE.Group();
    scene.add(markersGroup);
    markersGroupRef.current = markersGroup;

    const orbitRadii = [3.6, 4.6, 3.8];
    const orbitHeights = [1.1, 0.0, -1.1];
    const orbitColors = [0x10b981, 0x3b82f6, 0x8b5cf6]; // Verde, Azul, Púrpura

    orbitRadii.forEach((radius, idx) => {
      // Línea de órbita concéntrica
      const ringGeo = new THREE.RingGeometry(radius - 0.015, radius + 0.015, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        color: orbitColors[idx],
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.12,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = orbitHeights[idx];
      orbitsGroup.add(ring);
    });

    // Mapear cantidad de idiomas por anillo
    const orbitCount = [0, 0, 0];
    languagesList.forEach((lang) => {
      orbitCount[lang.orbitIndex]++;
    });

    const orbitAngles = [0, 0, 0];

    // Cargar y distribuir banderas
    languagesList.forEach((lang) => {
      const oIdx = lang.orbitIndex;
      const radius = orbitRadii[oIdx];
      const yPos = orbitHeights[oIdx];
      
      const totalInOrbit = orbitCount[oIdx];
      const angleIndex = orbitAngles[oIdx]++;
      const angle = (angleIndex / totalInOrbit) * Math.PI * 2;

      const markerGroup = new THREE.Group();
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      markerGroup.position.set(x, yPos, z);

      markerGroup.userData = {
        languageCode: lang.code,
        orbitIndex: oIdx,
        initialAngle: angle,
      };

      // Pequeño mástil que sostiene la bandera
      const mastGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.35, 8);
      mastGeo.translate(0, 0.175, 0);
      const mastMat = new THREE.MeshBasicMaterial({ color: 0x4b5563, transparent: true, opacity: 0.35 });
      const mast = new THREE.Mesh(mastGeo, mastMat);
      markerGroup.add(mast);

      // Tarjeta de Bandera (Sprite - Siempre de frente)
      const flagTexture = textureLoader.load(lang.flagUrl);
      const flagMat = new THREE.SpriteMaterial({
        map: flagTexture,
        transparent: true
      });
      const flagSprite = new THREE.Sprite(flagMat);
      flagSprite.scale.set(1.25, 0.83, 1);
      flagSprite.position.set(0, 0.52, 0);
      markerGroup.add(flagSprite);

      // Etiqueta del Idioma (Canvas Sprite - Siempre de frente)
      const textCanvas = document.createElement('canvas');
      textCanvas.width = 180;
      textCanvas.height = 48;
      const ctx = textCanvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
        ctx.beginPath();
        ctx.roundRect ? ctx.roundRect(10, 5, 160, 38, 6) : ctx.rect(10, 5, 160, 38);
        ctx.fill();
        
        ctx.strokeStyle = activeLanguageCode === lang.code ? '#10b981' : 'rgba(255, 255, 255, 0.15)';
        ctx.lineWidth = 1.8;
        ctx.stroke();

        ctx.font = 'bold 15px sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(lang.name, 90, 24);
      }

      const textTexture = new THREE.CanvasTexture(textCanvas);
      const textMat = new THREE.SpriteMaterial({
        map: textTexture,
        transparent: true
      });
      const textSprite = new THREE.Sprite(textMat);
      textSprite.scale.set(1.3, 0.35, 1);
      textSprite.position.set(0, -0.15, 0);
      markerGroup.add(textSprite);

      markersGroup.add(markerGroup);
    });

    // 7. Raycasting
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerDown = (event) => {
      recordInteraction();
      
      const clientX = event.touches ? event.touches[0].clientX : event.clientX;
      const clientY = event.touches ? event.touches[0].clientY : event.clientY;

      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(markersGroup.children, true);

      if (intersects.length > 0) {
        let current = intersects[0].object;
        while (current && current !== markersGroup) {
          if (current.userData && current.userData.languageCode) {
            selectAndFocus(current);
            break;
          }
          current = current.parent;
        }
      }
    };

    const handlePointerMove = (event) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(markersGroup.children, true);

      if (intersects.length > 0) {
        let current = intersects[0].object;
        while (current && current !== markersGroup) {
          if (current.userData && current.userData.languageCode) {
            if (hoveredMarkerRef.current !== current) {
              if (hoveredMarkerRef.current) {
                gsap.to(hoveredMarkerRef.current.scale, { x: 1, y: 1, z: 1, duration: 0.22 });
              }
              hoveredMarkerRef.current = current;
              gsap.to(current.scale, { x: 2.0, y: 2.0, z: 2.0, duration: 0.22 });
              document.body.style.cursor = 'pointer';
            }
            return;
          }
          current = current.parent;
        }
      } else {
        if (hoveredMarkerRef.current) {
          gsap.to(hoveredMarkerRef.current.scale, { x: 1, y: 1, z: 1, duration: 0.22 });
          hoveredMarkerRef.current = null;
          document.body.style.cursor = 'default';
        }
      }
    };

    const selectAndFocus = (marker) => {
      // Ejecutar callback de cambio de idioma
      onSelectLanguage(marker.userData.languageCode);

      // Traer la bandera seleccionada al frente de la cámara rotando el grupo, manteniendo el centro de la órbita intacto
      const camAngle = Math.atan2(camera.position.x, camera.position.z);
      const targetRotationY = camAngle - marker.userData.initialAngle;

      controls.enabled = false;
      
      gsap.to([markersGroup.rotation, orbitsGroup.rotation], {
        y: targetRotationY,
        duration: 0.8,
        ease: 'power2.out',
        onComplete: () => {
          controls.enabled = true;
        }
      });
    };

    const handleMouseEnter = () => { isHoveredRef.current = true; };
    const handleMouseLeave = () => { isHoveredRef.current = false; };

    // 8. Eventos del Mouse/Touch
    const dom = renderer.domElement;
    dom.addEventListener('mousedown', handlePointerDown);
    dom.addEventListener('touchstart', handlePointerDown);
    dom.addEventListener('mousemove', handlePointerMove);
    dom.addEventListener('mouseenter', handleMouseEnter);
    dom.addEventListener('mouseleave', handleMouseLeave);

    // 9. Loop de Render
    let animationFrameId;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Rotaciones pasivas continuas e incrementales (se detienen por completo si una bandera está enfocada)
      const idleTime = Date.now() - lastUserInteractionTime.current;
      const isFlagHovered = hoveredMarkerRef.current !== null;
      if (!isFlagHovered && idleTime > 4000) {
        const speedMultiplier = isHoveredRef.current ? 4.5 : 1.0;
        if (globe) globe.rotation.y += 0.0025 * speedMultiplier;
        orbitsGroup.rotation.y += 0.0035 * speedMultiplier;
        markersGroup.rotation.y += 0.0035 * speedMultiplier;
      }

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    // 10. Resize
    const handleResize = () => {
      if (!containerRef.current || !camera || !renderer) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;

      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // 11. Limpieza de WebGL
    return () => {
      window.removeEventListener('resize', handleResize);
      dom.removeEventListener('mousedown', handlePointerDown);
      dom.removeEventListener('touchstart', handlePointerDown);
      dom.removeEventListener('mousemove', handlePointerMove);
      dom.removeEventListener('mouseenter', handleMouseEnter);
      dom.removeEventListener('mouseleave', handleMouseLeave);
      controls.removeEventListener('start', recordInteraction);
      controls.removeEventListener('change', recordInteraction);

      cancelAnimationFrame(animationFrameId);

      globeGeo.dispose();
      globeMat.dispose();
      earthTexture.dispose();
      atmosGeo.dispose();
      atmosMat.dispose();
      starGeometry.dispose();
      starMaterial.dispose();

      orbitsGroup.children.forEach((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
          if (Array.isArray(child.material)) child.material.forEach(m => m.dispose());
          else child.material.dispose();
        }
      });

      markersGroup.children.forEach((child) => {
        child.traverse((node) => {
          if (node instanceof THREE.Mesh) {
            node.geometry.dispose();
            if (node.material instanceof THREE.Material) {
              if (node.material.map) node.material.map.dispose();
              node.material.dispose();
            }
          } else if (node instanceof THREE.Sprite) {
            if (node.material instanceof THREE.Material) {
              if (node.material.map) node.material.map.dispose();
              node.material.dispose();
            }
          }
        });
      });

      renderer.dispose();
    };
  }, [globeTextureUrl]);

  // Efecto secundario reactivo: Actualizar bordes en caliente a nivel de GPU
  useEffect(() => {
    if (!markersGroupRef.current) return;

    markersGroupRef.current.children.forEach((markerGroup) => {
      const langCode = markerGroup.userData.languageCode;
      const lang = languagesList.find(l => l.code === langCode);
      if (!lang) return;

      // Encontrar el Sprite de texto (posicionado en y = 0.03)
      const textSprite = markerGroup.children.find(child => child instanceof THREE.Sprite && child.position.y === 0.03);
      if (textSprite && textSprite.material) {
        const textCanvas = document.createElement('canvas');
        textCanvas.width = 180;
        textCanvas.height = 48;
        const ctx = textCanvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
          ctx.beginPath();
          ctx.roundRect ? ctx.roundRect(10, 5, 160, 38, 6) : ctx.rect(10, 5, 160, 38);
          ctx.fill();
          
          ctx.strokeStyle = activeLanguageCode === langCode ? '#10b981' : 'rgba(255, 255, 255, 0.08)';
          ctx.lineWidth = 1.5;
          ctx.stroke();

          ctx.font = 'bold 15px sans-serif';
          ctx.fillStyle = '#ffffff';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(lang.name, 90, 24);
        }

        const oldTexture = textSprite.material.map;
        textSprite.material.map = new THREE.CanvasTexture(textCanvas);
        if (oldTexture) oldTexture.dispose();
      }
    });
  }, [activeLanguageCode]);

  if (isMobile) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        padding: '8px',
        background: 'rgba(5, 5, 5, 0.3)',
        borderRadius: '8px',
        width: '100%',
        height: '100%',
        overflowY: 'auto',
        boxSizing: 'border-box'
      }}>
        {languagesList.map(lang => (
          <button
            key={lang.code}
            onClick={() => onSelectLanguage(lang.code)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              padding: '6px 10px',
              background: activeLanguageCode === lang.code ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.02)',
              border: activeLanguageCode === lang.code ? '1px solid #10b981' : '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '5px',
              color: '#ffffff',
              cursor: 'pointer',
              fontSize: '0.75rem',
              fontWeight: '500',
              transition: 'all 0.2s ease',
              boxSizing: 'border-box'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <img src={lang.flagUrl} alt={lang.name} style={{ width: '16px', height: '10px', borderRadius: '1px', objectFit: 'cover' }} />
              <span style={{ fontSize: '0.75rem' }}>{lang.name}</span>
            </div>
            {activeLanguageCode === lang.code && (
              <span className="material-symbols-rounded" style={{ fontSize: '0.9rem', color: '#10b981' }}>check_circle</span>
            )}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div 
      ref={containerRef} 
      style={{ 
        width, 
        height, 
        position: 'relative', 
        overflow: 'hidden',
        background: 'transparent',
        borderRadius: '16px'
      }}
    >
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />
    </div>
  );
};
