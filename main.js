/**
 * MAIN INTERACTION & ANIMATION ORCHESTRATOR
 * Coordinates GSAP, Audio, UI Components, and Three.js 3D Scenes
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Dynamic Content from CONFIG
  setupDynamicContent();

  // 2. Initialize 3D WebGL Scenes
  const loveExperience = new Love3DExperience();
  window.loveExperience = loveExperience;

  // 3. Setup Audio Player
  setupAudioPlayer();

  // 4. Setup Cursor Particle Trail
  setupCursorTrail();

  // 5. Setup Scroll Triggers & GSAP Animations
  setupScrollAnimations();

  // 6. Setup Interactive Forgiveness Moment
  setupForgivenessMoment(loveExperience);

  // 7. Setup 3D Tilt for Memory Cards
  setupCardTiltEffects();

  // 8. Setup Smooth Navigation
  setupNavigation();
});

/**
 * Populate dynamic content from config.js
 */
function setupDynamicContent() {
  if (typeof CONFIG === 'undefined') return;

  // Hero Section
  const heroBadge = document.getElementById('hero-badge');
  const heroTitle = document.getElementById('hero-title');
  const heroSubtitle = document.getElementById('hero-subtitle');
  const heroBtn = document.getElementById('hero-btn');

  if (heroBadge) heroBadge.textContent = CONFIG.hero.badge;
  if (heroTitle) heroTitle.innerHTML = CONFIG.hero.title;
  if (heroSubtitle) heroSubtitle.textContent = CONFIG.hero.subtitle;
  if (heroBtn) heroBtn.innerHTML = `<span>${CONFIG.hero.buttonText}</span>`;

  // Letter Section
  const letterHeading = document.getElementById('letter-heading');
  const letterBody = document.getElementById('letter-body');

  if (letterHeading) letterHeading.innerHTML = `<span class="gradient">${CONFIG.letter.heading}</span>`;
  
  if (letterBody) {
    letterBody.innerHTML = '';
    CONFIG.letter.paragraphs.forEach((pText, index) => {
      const p = document.createElement('p');
      p.className = 'letter-para';
      
      // Highlight certain key lines
      if (pText.includes("I'm really, really sorry") || pText.includes("Every single time")) {
        p.innerHTML = `<strong>${pText}</strong>`;
      } else if (pText.includes("I don't want to win an argument")) {
        p.className = 'letter-para highlight-quote';
        p.textContent = pText;
      } else {
        p.textContent = pText;
      }
      letterBody.appendChild(p);
    });

    const sig = document.createElement('div');
    sig.className = 'letter-signature';
    sig.textContent = `Forever yours, ${CONFIG.yourName}`;
    letterBody.appendChild(sig);
  }

  // Forgiveness Button & Content
  const forgiveBtn = document.getElementById('btn-forgive');
  const forgiveTitle = document.getElementById('forgive-title');
  const forgiveSubtitle = document.getElementById('forgive-subtitle');

  if (forgiveBtn) forgiveBtn.textContent = CONFIG.forgiveness.buttonText;
  if (forgiveTitle) forgiveTitle.textContent = CONFIG.forgiveness.successTitle;
  if (forgiveSubtitle) forgiveSubtitle.textContent = CONFIG.forgiveness.successSubtitle;

  // Memories Grid
  const memoriesGrid = document.getElementById('memories-grid');
  if (memoriesGrid && CONFIG.memories) {
    memoriesGrid.innerHTML = '';
    CONFIG.memories.forEach((mem) => {
      const card = document.createElement('div');
      card.className = 'memory-card';
      
      let iconSymbol = '💖';
      if (mem.icon === 'sparkles') iconSymbol = '✨';
      else if (mem.icon === 'eye') iconSymbol = '👀';
      else if (mem.icon === 'message-circle') iconSymbol = '💬';
      else if (mem.icon === 'heart') iconSymbol = '🌸';
      else if (mem.icon === 'stars') iconSymbol = '🌟';
      else if (mem.icon === 'award') iconSymbol = '👑';

      card.innerHTML = `
        <div class="card-icon-wrap">${iconSymbol}</div>
        <h3 class="card-title">${mem.title}</h3>
        <div class="card-tagline">${mem.tagline}</div>
        <p class="card-desc">${mem.description}</p>
      `;
      memoriesGrid.appendChild(card);
    });
  }

  // Universe Section
  const universeQuote = document.getElementById('universe-quote');
  const tagSakshi = document.getElementById('tag-sakshi');
  const tagMe = document.getElementById('tag-me');

  if (universeQuote) universeQuote.textContent = CONFIG.universe.quote;
  if (tagSakshi) tagSakshi.textContent = CONFIG.universe.planet1;
  if (tagMe) tagMe.textContent = `${CONFIG.yourName || 'Me'} ❤️`;

  // Final Closing
  const finalLine1 = document.getElementById('final-line-1');
  const finalLine2 = document.getElementById('final-line-2');
  const finalLine3 = document.getElementById('final-line-3');
  const finalSignature = document.getElementById('final-signature');

  if (finalLine1) finalLine1.textContent = CONFIG.closing.line1;
  if (finalLine2) finalLine2.textContent = CONFIG.closing.line2;
  if (finalLine3) finalLine3.textContent = CONFIG.closing.line3;
  if (finalSignature) finalSignature.textContent = `${CONFIG.closing.signature}${CONFIG.yourName}`;
}

/**
 * Setup Background Music Player with Fallback Procedural Romantic Chords
 */
function setupAudioPlayer() {
  const audioBtn = document.getElementById('audio-controller');
  const audioLabel = document.getElementById('audio-label');
  let isPlaying = false;
  let audio = new Audio();
  let audioContext = null;
  let synthInterval = null;

  if (CONFIG.music && CONFIG.music.url) {
    audio.src = CONFIG.music.url;
    audio.loop = true;
    audio.volume = 0.5;
  }

  // Procedural Web Audio romantic chord progression (if external audio is blocked or offline)
  function startRomanticSynth() {
    try {
      if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }

      // Chord notes in Hz: Cmaj7, Am9, Fmaj7, Gsus4
      const chords = [
        [261.63, 329.63, 392.00, 493.88], // Cmaj7
        [220.00, 261.63, 329.63, 392.00], // Am7
        [174.61, 220.00, 261.63, 329.63], // Fmaj7
        [196.00, 246.94, 293.66, 392.00]  // G6
      ];

      let chordIdx = 0;

      function playChord() {
        if (!isPlaying) return;
        const currentChord = chords[chordIdx % chords.length];
        chordIdx++;

        currentChord.forEach((freq, i) => {
          const osc = audioContext.createOscillator();
          const gain = audioContext.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, audioContext.currentTime + i * 0.12);

          gain.gain.setValueAtTime(0, audioContext.currentTime);
          gain.gain.linearRampToValueAtTime(0.04, audioContext.currentTime + 0.4 + i * 0.1);
          gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 3.5);

          osc.connect(gain);
          gain.connect(audioContext.destination);

          osc.start(audioContext.currentTime + i * 0.12);
          osc.stop(audioContext.currentTime + 4.0);
        });
      }

      playChord();
      synthInterval = setInterval(playChord, 3600);
    } catch (e) {
      console.warn("Web Audio fallback not supported:", e);
    }
  }

  function stopRomanticSynth() {
    if (synthInterval) clearInterval(synthInterval);
    if (audioContext && audioContext.state === 'running') {
      audioContext.suspend();
    }
  }

  function toggleAudio() {
    if (isPlaying) {
      audio.pause();
      stopRomanticSynth();
      isPlaying = false;
      audioBtn.classList.remove('audio-playing');
      audioLabel.textContent = "Play Our Song 🎵";
    } else {
      isPlaying = true;
      audioBtn.classList.add('audio-playing');
      audioLabel.textContent = "Playing Romantic Melody ✨";

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // If external audio source fails or blocked, gracefully fallback to procedural romantic synth
          startRomanticSynth();
        });
      }
    }
  }

  if (audioBtn) {
    audioBtn.addEventListener('click', toggleAudio);
  }
}

/**
 * Setup Romantic Cursor Particles
 */
function setupCursorTrail() {
  const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (isReduced || window.innerWidth < 768) return;

  const hearts = ['❤️', '💖', '✨', '🌸', '💕'];
  let lastTime = 0;

  window.addEventListener('mousemove', (e) => {
    const now = Date.now();
    if (now - lastTime < 90) return; // Throttle spawn rate
    lastTime = now;

    const heart = document.createElement('span');
    heart.className = 'cursor-heart';
    heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    heart.style.left = `${e.clientX}px`;
    heart.style.top = `${e.clientY}px`;
    heart.style.fontSize = `${Math.random() * 8 + 12}px`;

    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 1200);
  });
}

/**
 * Setup GSAP Scroll-Triggered Letter Reveal and Section Entrances
 */
function setupScrollAnimations() {
  if (typeof gsap === 'undefined') return;

  // Animate Letter Paragraphs on Scroll
  const letterParas = document.querySelectorAll('.letter-para');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  }, { threshold: 0.2 });

  letterParas.forEach((p) => observer.observe(p));

  // Memory cards stagger entrance
  gsap.from('.memory-card', {
    scrollTrigger: {
      trigger: '.memories-grid',
      start: 'top 80%',
    },
    y: 40,
    opacity: 0,
    duration: 0.8,
    stagger: 0.15,
    ease: 'power2.out'
  });
}

/**
 * Interactive "Can You Forgive Me? 🥺❤️" Moment
 */
function setupForgivenessMoment(loveExperience) {
  const forgiveBtn = document.getElementById('btn-forgive');
  const forgiveSuccess = document.getElementById('forgiveness-success');
  const forgivenessWrap = document.querySelector('.forgiveness-wrapper');

  if (!forgiveBtn || !forgiveSuccess) return;

  forgiveBtn.addEventListener('click', () => {
    // 1. Trigger 3D Heart Burst in Three.js Scene
    if (loveExperience && typeof loveExperience.triggerForgivenessBurst === 'function') {
      loveExperience.triggerForgivenessBurst();
    }

    // 2. Trigger Confetti celebration hearts
    if (typeof confetti === 'function') {
      const end = Date.now() + 3000;
      const colors = ['#ff4d6d', '#ff758f', '#ffd166', '#ffffff', '#7209b7'];

      (function frame() {
        confetti({
          particleCount: 4,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.7 },
          colors: colors,
          shapes: ['circle']
        });
        confetti({
          particleCount: 4,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.7 },
          colors: colors,
          shapes: ['circle']
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      })();
    }

    // 3. Screen Golden Warmth Flash
    const flash = document.createElement('div');
    flash.style.position = 'fixed';
    flash.style.inset = '0';
    flash.style.background = 'radial-gradient(circle, rgba(255, 209, 102, 0.4) 0%, rgba(255, 77, 109, 0.3) 60%, transparent 100%)';
    flash.style.zIndex = '9998';
    flash.style.pointerEvents = 'none';
    flash.style.opacity = '0';
    flash.style.transition = 'opacity 0.6s ease';
    document.body.appendChild(flash);

    setTimeout(() => { flash.style.opacity = '1'; }, 20);
    setTimeout(() => {
      flash.style.opacity = '0';
      setTimeout(() => flash.remove(), 700);
    }, 1000);

    // 4. Transform Button to Success Message
    gsap.to(forgiveBtn, {
      scale: 0,
      opacity: 0,
      duration: 0.4,
      onComplete: () => {
        forgiveBtn.style.display = 'none';
        forgiveSuccess.style.display = 'block';
        if (forgivenessWrap) {
          forgivenessWrap.style.background = 'rgba(60, 20, 80, 0.7)';
          forgivenessWrap.style.borderColor = 'rgba(255, 209, 102, 0.6)';
        }
      }
    });
  });
}

/**
 * 3D Interactive Card Tilt & Shimmer Effect on Mouse Hover
 */
function setupCardTiltEffects() {
  const cards = document.querySelectorAll('.memory-card');

  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
      card.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
      card.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
    });
  });
}

/**
 * Setup Smooth Navigation & Action Buttons
 */
function setupNavigation() {
  const heroBtn = document.getElementById('hero-btn');
  const letterSection = document.getElementById('letter-section');
  const replayBtn = document.getElementById('replay-btn');

  if (heroBtn && letterSection) {
    heroBtn.addEventListener('click', (e) => {
      e.preventDefault();
      letterSection.scrollIntoView({ behavior: 'smooth' });
    });
  }

  if (replayBtn) {
    replayBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}
