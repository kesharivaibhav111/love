/**
 * THREE.JS 3D SCENES MANAGER
 * Handles Hero 3D Heart, Background Cosmos, Universe Dual Orbits, and Forgiveness Effects
 */

class Love3DExperience {
  constructor() {
    this.heroCanvas = document.getElementById('hero-canvas');
    this.universeCanvas = document.getElementById('universe-canvas');
    this.bgCanvas = document.getElementById('bg-canvas');
    
    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    this.clock = new THREE.Clock();
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.initBackgroundScene();
    this.initHeroScene();
    this.initUniverseScene();
    this.setupEventListeners();
    this.animate();
  }

  // ==========================================
  // 1. HELPER: CREATE 3D HEART GEOMETRY
  // ==========================================
  createHeartGeometry(scale = 1) {
    const heartShape = new THREE.Shape();
    const x = 0, y = 0;
    
    // Heart shape curve definition
    heartShape.moveTo(x + 0.25, y + 0.25);
    heartShape.bezierCurveTo(x + 0.25, y + 0.25, x + 0.20, y, x, y);
    heartShape.bezierCurveTo(x - 0.35, y, x - 0.35, y + 0.35, x - 0.35, y + 0.35);
    heartShape.bezierCurveTo(x - 0.35, y + 0.55, x - 0.15, y + 0.77, x + 0.25, y + 0.95);
    heartShape.bezierCurveTo(x + 0.65, y + 0.77, x + 0.85, y + 0.55, x + 0.85, y + 0.35);
    heartShape.bezierCurveTo(x + 0.85, y + 0.35, x + 0.85, y, x + 0.50, y);
    heartShape.bezierCurveTo(x + 0.35, y, x + 0.25, y + 0.25, x + 0.25, y + 0.25);

    const extrudeSettings = {
      depth: 0.28,
      bevelEnabled: true,
      bevelSegments: 12,
      steps: 4,
      bevelSize: 0.12,
      bevelThickness: 0.14
    };

    const geometry = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);
    geometry.center();
    geometry.rotateZ(Math.PI);
    geometry.scale(scale * 2.8, scale * 2.8, scale * 2.8);
    return geometry;
  }

  // ==========================================
  // 2. BACKGROUND COSMOS & FLOATING STARDUST
  // ==========================================
  initBackgroundScene() {
    if (!this.bgCanvas) return;
    
    this.bgRenderer = new THREE.WebGLRenderer({
      canvas: this.bgCanvas,
      alpha: true,
      antialias: true
    });
    this.bgRenderer.setSize(window.innerWidth, window.innerHeight);
    this.bgRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.bgScene = new THREE.Scene();
    this.bgCamera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.bgCamera.position.z = 50;

    // Glowing Stardust Particles
    const starCount = 650;
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);
    const starSizes = new Float32Array(starCount);

    const palette = [
      new THREE.Color('#ff4d6d'),
      new THREE.Color('#ff758f'),
      new THREE.Color('#c9184a'),
      new THREE.Color('#ffb3c1'),
      new THREE.Color('#ffd166'),
      new THREE.Color('#b5179e'),
      new THREE.Color('#7209b7')
    ];

    for (let i = 0; i < starCount; i++) {
      starPositions[i * 3] = (Math.random() - 0.5) * 140;
      starPositions[i * 3 + 1] = (Math.random() - 0.5) * 140;
      starPositions[i * 3 + 2] = (Math.random() - 0.5) * 100;

      const col = palette[Math.floor(Math.random() * palette.length)];
      starColors[i * 3] = col.r;
      starColors[i * 3 + 1] = col.g;
      starColors[i * 3 + 2] = col.b;

      starSizes[i] = Math.random() * 3.5 + 1.0;
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));
    starGeometry.setAttribute('size', new THREE.BufferAttribute(starSizes, 1));

    // Particle Shader / Texture
    const particleTexture = this.createCircleTexture();
    const starMaterial = new THREE.PointsMaterial({
      size: 2.2,
      map: particleTexture,
      transparent: true,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.8
    });

    this.bgStars = new THREE.Points(starGeometry, starMaterial);
    this.bgScene.add(this.bgStars);
  }

  // ==========================================
  // 3. HERO 3D GLOWING HEART SCENE
  // ==========================================
  initHeroScene() {
    if (!this.heroCanvas) return;

    this.heroRenderer = new THREE.WebGLRenderer({
      canvas: this.heroCanvas,
      alpha: true,
      antialias: true
    });
    const rect = this.heroCanvas.parentElement.getBoundingClientRect();
    const width = rect.width || window.innerWidth;
    const height = rect.height || 500;

    this.heroRenderer.setSize(width, height);
    this.heroRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.heroScene = new THREE.Scene();
    this.heroCamera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    this.heroCamera.position.set(0, 0, 8.5);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xff69b4, 0.8);
    this.heroScene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xff477e, 2.0);
    dirLight1.position.set(5, 6, 7);
    this.heroScene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x7928ca, 2.5);
    dirLight2.position.set(-5, -4, 4);
    this.heroScene.add(dirLight2);

    const goldLight = new THREE.PointLight(0xffd700, 2.5, 12);
    goldLight.position.set(0, 1.5, 4);
    this.heroScene.add(goldLight);

    this.heroHeartPointLight = new THREE.PointLight(0xff0055, 3.5, 10);
    this.heroHeartPointLight.position.set(0, 0, 1);
    this.heroScene.add(this.heroHeartPointLight);

    // Heart 3D Mesh
    const heartGeo = this.createHeartGeometry(1.25);
    
    // Crystal Rose Physical Material
    this.heartMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xff1752,
      emissive: 0x990033,
      emissiveIntensity: 0.65,
      metalness: 0.15,
      roughness: 0.18,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      reflectivity: 0.9,
      transmission: 0.35,
      thickness: 1.2
    });

    this.heroHeartMesh = new THREE.Mesh(heartGeo, this.heartMaterial);
    this.heroHeartMesh.position.y = 0.2;
    this.heroScene.add(this.heroHeartMesh);

    // Heart Glowing Aura Rings
    const ringGeo = new THREE.RingGeometry(2.4, 2.45, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xff70a6,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending
    });
    this.heartHaloRing1 = new THREE.Mesh(ringGeo, ringMat);
    this.heartHaloRing1.rotation.x = Math.PI / 2.3;
    this.heroScene.add(this.heartHaloRing1);

    const ringGeo2 = new THREE.RingGeometry(2.9, 2.94, 64);
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0xffd166,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.25,
      blending: THREE.AdditiveBlending
    });
    this.heartHaloRing2 = new THREE.Mesh(ringGeo2, ringMat2);
    this.heartHaloRing2.rotation.x = -Math.PI / 2.5;
    this.heartHaloRing2.rotation.y = 0.3;
    this.heroScene.add(this.heartHaloRing2);

    // Swarm of tiny orbiting heart embers
    const emberCount = 120;
    const emberGeo = new THREE.BufferGeometry();
    const emberPos = new Float32Array(emberCount * 3);
    const emberScales = new Float32Array(emberCount);
    this.emberOrbits = [];

    for (let i = 0; i < emberCount; i++) {
      const radius = 2.0 + Math.random() * 2.5;
      const speed = (0.5 + Math.random() * 1.0) * (Math.random() > 0.5 ? 1 : -1);
      const angle = Math.random() * Math.PI * 2;
      const yOffset = (Math.random() - 0.5) * 3;
      const tilt = (Math.random() - 0.5) * Math.PI;

      this.emberOrbits.push({ radius, speed, angle, yOffset, tilt });
      emberPos[i * 3] = Math.cos(angle) * radius;
      emberPos[i * 3 + 1] = yOffset;
      emberPos[i * 3 + 2] = Math.sin(angle) * radius;
      emberScales[i] = Math.random() * 3 + 1.5;
    }

    emberGeo.setAttribute('position', new THREE.BufferAttribute(emberPos, 3));
    const emberMat = new THREE.PointsMaterial({
      color: 0xffb7b2,
      size: 2.2,
      map: this.createHeartTexture(),
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.9
    });

    this.emberParticles = new THREE.Points(emberGeo, emberMat);
    this.heroScene.add(this.emberParticles);
  }

  // ==========================================
  // 4. "OUR LITTLE UNIVERSE" 3D BINARY ORBIT
  // ==========================================
  initUniverseScene() {
    if (!this.universeCanvas) return;

    this.universeRenderer = new THREE.WebGLRenderer({
      canvas: this.universeCanvas,
      alpha: true,
      antialias: true
    });

    const rect = this.universeCanvas.parentElement.getBoundingClientRect();
    const width = rect.width || window.innerWidth;
    const height = rect.height || 550;

    this.universeRenderer.setSize(width, height);
    this.universeRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.universeScene = new THREE.Scene();
    this.universeCamera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    this.universeCamera.position.set(0, 3.5, 9);
    this.universeCamera.lookAt(0, 0, 0);

    // Ambient & Directional Lights
    const uniAmb = new THREE.AmbientLight(0x7209b7, 1.2);
    this.universeScene.add(uniAmb);

    const uniSun = new THREE.PointLight(0xffd166, 3, 20);
    uniSun.position.set(0, 0, 0);
    this.universeScene.add(uniSun);

    const pinkSpot = new THREE.SpotLight(0xff4d6d, 3.5, 25, Math.PI / 4, 0.3);
    pinkSpot.position.set(6, 8, 6);
    this.universeScene.add(pinkSpot);

    // Glowing Center Cosmic Core (The Love Singularity)
    const coreGeo = new THREE.SphereGeometry(0.55, 32, 32);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0xfff0f5,
      transparent: true,
      opacity: 0.95
    });
    this.coreMesh = new THREE.Mesh(coreGeo, coreMat);
    this.universeScene.add(this.coreMesh);

    // Core Glow Sprite
    const coreGlowMat = new THREE.SpriteMaterial({
      map: this.createCircleTexture(),
      color: 0xff758f,
      transparent: true,
      blending: THREE.AdditiveBlending,
      opacity: 0.8
    });
    const coreGlow = new THREE.Sprite(coreGlowMat);
    coreGlow.scale.set(3.5, 3.5, 1);
    this.universeScene.add(coreGlow);

    // Orbit Ring Track
    const orbitRingGeo = new THREE.RingGeometry(3.1, 3.14, 96);
    const orbitRingMat = new THREE.MeshBasicMaterial({
      color: 0x9b5de5,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending
    });
    const orbitRing = new THREE.Mesh(orbitRingGeo, orbitRingMat);
    orbitRing.rotation.x = Math.PI / 2;
    this.universeScene.add(orbitRing);

    // 1st Planet Heart: Sakshi ❤️ (Radiant Ruby Rose)
    const sakshiGeo = this.createHeartGeometry(0.55);
    const sakshiMat = new THREE.MeshPhysicalMaterial({
      color: 0xff2a75,
      emissive: 0x800f2f,
      emissiveIntensity: 0.7,
      metalness: 0.2,
      roughness: 0.2,
      clearcoat: 1.0,
      transmission: 0.3
    });
    this.sakshiHeart = new THREE.Mesh(sakshiGeo, sakshiMat);
    this.universeScene.add(this.sakshiHeart);

    // 2nd Planet Heart: Me / Partner (Warm Golden Amber & Rose)
    const myGeo = this.createHeartGeometry(0.5);
    const myMat = new THREE.MeshPhysicalMaterial({
      color: 0xf77f00,
      emissive: 0xd62828,
      emissiveIntensity: 0.6,
      metalness: 0.25,
      roughness: 0.2,
      clearcoat: 1.0,
      transmission: 0.3
    });
    this.myHeart = new THREE.Mesh(myGeo, myMat);
    this.universeScene.add(this.myHeart);

    // Constellation Laser Ribbon connecting them
    const lineGeo = new THREE.BufferGeometry();
    const linePositions = new Float32Array(2 * 3);
    lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    const lineMat = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
      linewidth: 2
    });
    this.connectionLine = new THREE.Line(lineGeo, lineMat);
    this.universeScene.add(this.connectionLine);

    // Galaxy Stardust Orbit Swarm
    const dustCount = 300;
    const dustGeo = new THREE.BufferGeometry();
    const dustPositions = new Float32Array(dustCount * 3);
    const dustColors = new Float32Array(dustCount * 3);

    for (let i = 0; i < dustCount; i++) {
      const radius = 1.2 + Math.random() * 4.2;
      const theta = Math.random() * Math.PI * 2;
      const height = (Math.random() - 0.5) * 0.8;

      dustPositions[i * 3] = Math.cos(theta) * radius;
      dustPositions[i * 3 + 1] = height;
      dustPositions[i * 3 + 2] = Math.sin(theta) * radius;

      const col = Math.random() > 0.5 ? new THREE.Color(0xff4d6d) : new THREE.Color(0xffd166);
      dustColors[i * 3] = col.r;
      dustColors[i * 3 + 1] = col.g;
      dustColors[i * 3 + 2] = col.b;
    }

    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
    dustGeo.setAttribute('color', new THREE.BufferAttribute(dustColors, 3));
    const dustMat = new THREE.PointsMaterial({
      size: 1.8,
      map: this.createCircleTexture(),
      transparent: true,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.65
    });

    this.universeDust = new THREE.Points(dustGeo, dustMat);
    this.universeScene.add(this.universeDust);
  }

  // ==========================================
  // 5. TEXTURE GENERATORS (NO EXTERNAL ASSETS NEEDED)
  // ==========================================
  createCircleTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 30);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.35, 'rgba(255, 160, 200, 0.8)');
    grad.addColorStop(0.7, 'rgba(255, 80, 140, 0.3)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }

  createHeartTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(32, 20);
    ctx.bezierCurveTo(32, 16, 20, 4, 10, 16);
    ctx.bezierCurveTo(2, 26, 12, 44, 32, 58);
    ctx.bezierCurveTo(52, 44, 62, 26, 54, 16);
    ctx.bezierCurveTo(44, 4, 32, 16, 32, 20);
    ctx.fill();

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }

  // ==========================================
  // 6. INTERACTIVE FORGIVENESS BURST EFFECT
  // ==========================================
  triggerForgivenessBurst() {
    if (!this.heroScene) return;

    // Heart scale pump animation
    if (this.heroHeartMesh) {
      gsap.to(this.heroHeartMesh.scale, {
        x: 1.8,
        y: 1.8,
        z: 1.8,
        duration: 0.4,
        yoyo: true,
        repeat: 3,
        ease: 'power2.out',
        onComplete: () => {
          gsap.to(this.heroHeartMesh.scale, { x: 1.3, y: 1.3, z: 1.3, duration: 0.8 });
        }
      });
      gsap.to(this.heartMaterial, {
        emissiveIntensity: 1.8,
        duration: 0.5,
        yoyo: true,
        repeat: 3,
        ease: 'power2.inOut',
        onComplete: () => {
          gsap.to(this.heartMaterial, { emissiveIntensity: 0.85, duration: 1.0 });
        }
      });
    }

    // Spawn 150 floating 3D glowing hearts surging upwards
    const burstGroup = new THREE.Group();
    const burstCount = 60;
    const heartGeo = this.createHeartGeometry(0.12);
    const colors = [0xff2a75, 0xff70a6, 0xffd166, 0xff0055, 0xffffff];

    for (let i = 0; i < burstCount; i++) {
      const mat = new THREE.MeshBasicMaterial({
        color: colors[Math.floor(Math.random() * colors.length)],
        transparent: true,
        opacity: 1
      });
      const mesh = new THREE.Mesh(heartGeo, mat);
      mesh.position.set(
        (Math.random() - 0.5) * 1.5,
        (Math.random() - 0.5) * 1.5,
        (Math.random() - 0.5) * 1.5
      );
      
      const targetPos = {
        x: mesh.position.x + (Math.random() - 0.5) * 10,
        y: mesh.position.y + 4 + Math.random() * 8,
        z: mesh.position.z + (Math.random() - 0.5) * 8
      };

      const targetRot = {
        x: Math.random() * Math.PI * 4,
        y: Math.random() * Math.PI * 4,
        z: Math.random() * Math.PI * 4
      };

      burstGroup.add(mesh);

      gsap.to(mesh.position, {
        x: targetPos.x,
        y: targetPos.y,
        z: targetPos.z,
        duration: 2.2 + Math.random() * 1.5,
        ease: 'power1.out'
      });

      gsap.to(mesh.rotation, {
        x: targetRot.x,
        y: targetRot.y,
        z: targetRot.z,
        duration: 2.5 + Math.random() * 1.2
      });

      gsap.to(mat, {
        opacity: 0,
        delay: 1.5,
        duration: 1.2,
        ease: 'power2.in',
        onComplete: () => {
          burstGroup.remove(mesh);
        }
      });
    }

    this.heroScene.add(burstGroup);
    setTimeout(() => {
      this.heroScene.remove(burstGroup);
    }, 4500);
  }

  // ==========================================
  // 7. EVENT LISTENERS & RESIZE
  // ==========================================
  setupEventListeners() {
    window.addEventListener('mousemove', (e) => {
      this.mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      this.mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    window.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        this.mouse.targetX = (e.touches[0].clientX / window.innerWidth) * 2 - 1;
        this.mouse.targetY = -(e.touches[0].clientY / window.innerHeight) * 2 + 1;
      }
    }, { passive: true });

    window.addEventListener('resize', () => this.handleResize());
  }

  handleResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Background Scene
    if (this.bgRenderer && this.bgCamera) {
      this.bgCamera.aspect = width / height;
      this.bgCamera.updateProjectionMatrix();
      this.bgRenderer.setSize(width, height);
    }

    // Hero Scene
    if (this.heroRenderer && this.heroCamera && this.heroCanvas) {
      const heroRect = this.heroCanvas.parentElement.getBoundingClientRect();
      const heroW = heroRect.width || width;
      const heroH = heroRect.height || 500;
      this.heroCamera.aspect = heroW / heroH;
      this.heroCamera.updateProjectionMatrix();
      this.heroRenderer.setSize(heroW, heroH);
    }

    // Universe Scene
    if (this.universeRenderer && this.universeCamera && this.universeCanvas) {
      const uniRect = this.universeCanvas.parentElement.getBoundingClientRect();
      const uniW = uniRect.width || width;
      const uniH = uniRect.height || 550;
      this.universeCamera.aspect = uniW / uniH;
      this.universeCamera.updateProjectionMatrix();
      this.universeRenderer.setSize(uniW, uniH);
    }
  }

  // ==========================================
  // 8. ANIMATION RENDER LOOP
  // ==========================================
  animate() {
    requestAnimationFrame(() => this.animate());

    const elapsedTime = this.clock.getElapsedTime();
    const delta = this.clock.getDelta();

    // Smooth mouse interpolation
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.05;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.05;

    // 1. Background Stars Animation
    if (this.bgStars) {
      this.bgStars.rotation.y = elapsedTime * 0.025;
      this.bgStars.rotation.x = elapsedTime * 0.015;
      this.bgCamera.position.x = this.mouse.x * 3;
      this.bgCamera.position.y = this.mouse.y * 3;
      this.bgRenderer.render(this.bgScene, this.bgCamera);
    }

    // 2. Hero 3D Heart Animation
    if (this.heroHeartMesh) {
      // Natural floating + gentle rotation
      this.heroHeartMesh.position.y = 0.2 + Math.sin(elapsedTime * 1.5) * 0.15;
      this.heroHeartMesh.rotation.y = elapsedTime * 0.5 + this.mouse.x * 0.8;
      this.heroHeartMesh.rotation.x = Math.sin(elapsedTime * 0.8) * 0.15 - this.mouse.y * 0.6;
      this.heroHeartMesh.rotation.z = Math.cos(elapsedTime * 0.6) * 0.08;

      // Organic Heartbeat pulse algorithm (double pulse: lub-dub)
      const beatFreq = 2.0; // beats
      const beatPhase = (elapsedTime * beatFreq) % (Math.PI * 2);
      let pulse = 1.0;
      if (beatPhase < 0.4) {
        pulse = 1.0 + Math.sin(beatPhase * Math.PI / 0.4) * 0.12;
      } else if (beatPhase >= 0.5 && beatPhase < 0.9) {
        pulse = 1.0 + Math.sin((beatPhase - 0.5) * Math.PI / 0.4) * 0.06;
      }
      
      // Keep GSAP scale overrides if burst is active, otherwise pulse
      if (!gsap.isTweening(this.heroHeartMesh.scale)) {
        this.heroHeartMesh.scale.set(pulse, pulse, pulse);
      }

      if (this.heroHeartPointLight) {
        this.heroHeartPointLight.intensity = 2.5 + (pulse - 1) * 12;
      }

      // Halo Rings Rotation
      if (this.heartHaloRing1) {
        this.heartHaloRing1.rotation.z = elapsedTime * 0.3;
        this.heartHaloRing1.rotation.y = elapsedTime * 0.2;
      }
      if (this.heartHaloRing2) {
        this.heartHaloRing2.rotation.z = -elapsedTime * 0.25;
        this.heartHaloRing2.rotation.x = -Math.PI / 2.5 + Math.sin(elapsedTime * 0.4) * 0.1;
      }

      // Orbiting ember particles
      if (this.emberParticles && this.emberOrbits) {
        const positions = this.emberParticles.geometry.attributes.position.array;
        for (let i = 0; i < this.emberOrbits.length; i++) {
          const o = this.emberOrbits[i];
          const currAngle = o.angle + elapsedTime * o.speed * 0.6;
          
          positions[i * 3] = Math.cos(currAngle) * o.radius;
          positions[i * 3 + 1] = o.yOffset + Math.sin(elapsedTime * 2 + i) * 0.3;
          positions[i * 3 + 2] = Math.sin(currAngle) * o.radius;
        }
        this.emberParticles.geometry.attributes.position.needsUpdate = true;
      }

      this.heroRenderer.render(this.heroScene, this.heroCamera);
    }

    // 3. Universe Dual Heart Orbit Animation
    if (this.sakshiHeart && this.myHeart) {
      const orbitSpeed = 0.55;
      const orbitRadiusX = 3.2;
      const orbitRadiusZ = 2.4;
      const angle = elapsedTime * orbitSpeed;

      // Sakshi Heart position (orbit phase 0)
      const sakshiX = Math.cos(angle) * orbitRadiusX;
      const sakshiZ = Math.sin(angle) * orbitRadiusZ;
      const sakshiY = Math.sin(angle * 2) * 0.5;
      this.sakshiHeart.position.set(sakshiX, sakshiY, sakshiZ);
      this.sakshiHeart.rotation.y = elapsedTime * 1.2;
      this.sakshiHeart.rotation.z = Math.sin(elapsedTime * 1.5) * 0.2;

      // My Heart position (orbit phase PI, opposite side)
      const myX = Math.cos(angle + Math.PI) * orbitRadiusX;
      const myZ = Math.sin(angle + Math.PI) * orbitRadiusZ;
      const myY = Math.sin((angle + Math.PI) * 2) * 0.5;
      this.myHeart.position.set(myX, myY, myZ);
      this.myHeart.rotation.y = -elapsedTime * 1.2;
      this.myHeart.rotation.z = -Math.sin(elapsedTime * 1.5) * 0.2;

      // Update Connection Line
      if (this.connectionLine) {
        const linePos = this.connectionLine.geometry.attributes.position.array;
        linePos[0] = sakshiX;
        linePos[1] = sakshiY;
        linePos[2] = sakshiZ;
        linePos[3] = myX;
        linePos[4] = myY;
        linePos[5] = myZ;
        this.connectionLine.geometry.attributes.position.needsUpdate = true;
      }

      // Rotate Universe Dust
      if (this.universeDust) {
        this.universeDust.rotation.y = elapsedTime * 0.15;
      }

      // Rotate central core
      if (this.coreMesh) {
        this.coreMesh.rotation.y = elapsedTime * 0.8;
      }

      // Slight camera responsive tilt
      this.universeCamera.position.x = this.mouse.x * 2;
      this.universeCamera.position.y = 3.5 + this.mouse.y * 1.5;
      this.universeCamera.lookAt(0, 0, 0);

      this.universeRenderer.render(this.universeScene, this.universeCamera);
    }
  }
}

// Export instance
window.Love3DExperience = Love3DExperience;
