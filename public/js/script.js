/* ================================================================
   ECOS DO ANDARILHO — script.js
   Animações: Anime.js 3.2.1 (sem GSAP)
   ================================================================ */

// ================================================================
// ÁUDIO (Easter Egg Moeda Mario)
// ================================================================
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx;

function playMarioCoinSound() {
  if (!audioCtx) audioCtx = new AudioCtx();
  if (audioCtx.state === 'suspended') audioCtx.resume();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  const now = audioCtx.currentTime;
  osc.type = 'square';
  osc.frequency.setValueAtTime(987.77, now);
  osc.frequency.setValueAtTime(1318.51, now + 0.1);
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(0.1, now + 0.05);
  gain.gain.setValueAtTime(0.1, now + 0.1);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start(now);
  osc.stop(now + 0.5);
}

function collectCoin(e, coinWrapper) {
  playMarioCoinSound();
  coinWrapper.style.pointerEvents = 'none';

  const score = document.createElement('div');
  score.className = 'score-popup';
  score.innerText = '+100';
  score.style.left = e.clientX + 'px';
  score.style.top = e.clientY + 'px';
  document.body.appendChild(score);

  anime({
    targets: coinWrapper.querySelector('.coin'),
    translateY: -120,
    scale: [1, 1.6, 0],
    opacity: [1, 0],
    rotate: '1turn',
    duration: 700,
    easing: 'easeOutExpo',
    complete: () => coinWrapper.remove()
  });

  anime({
    targets: score,
    translateY: [-10, -90],
    scale: [0.5, 1.4, 1],
    opacity: [1, 1, 0],
    duration: 1100,
    easing: 'easeOutCubic',
    complete: () => score.remove()
  });
}

// ================================================================
// TILT 3D NOS CARTÕES (só desktop)
// ================================================================
function initTilt() {
  if (window.innerWidth <= 900) return;
  document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      const rX = ((y - r.height / 2) / r.height) * -8;
      const rY = ((x - r.width  / 2) / r.width)  *  8;
      card.style.transform = `perspective(1000px) rotateX(${rX}deg) rotateY(${rY}deg) scale3d(1.02,1.02,1.02)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)';
    });
  });
}

// ================================================================
// BOTÕES MAGNÉTICOS
// ================================================================
function initMagneticButtons() {
  if (window.innerWidth <= 900) return;
  document.querySelectorAll('.btn-3d').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width  / 2;
      const y = e.clientY - r.top  - r.height / 2;
      anime({ targets: btn, translateX: x * 0.14, translateY: y * 0.14, scale: 1.04, duration: 140, easing: 'easeOutQuad' });
      const svg = btn.querySelector('svg');
      if (svg) anime({ targets: svg, translateX: x * 0.08, translateY: y * 0.08, duration: 140, easing: 'easeOutQuad' });
    });
    btn.addEventListener('mouseleave', () => {
      anime({ targets: btn, translateX: 0, translateY: 0, scale: 1, duration: 550, easing: 'easeOutElastic(1, .5)' });
      const svg = btn.querySelector('svg');
      if (svg) anime({ targets: svg, translateX: 0, translateY: 0, duration: 550, easing: 'easeOutElastic(1, .5)' });
    });
  });
}

// ================================================================
// LOADER
// ================================================================
function initLoader() {
  const loaderTitle = document.getElementById('loader-title');
  loaderTitle.innerHTML = loaderTitle.innerText
    .replace(/\S/g, "<span class='char'>$&</span>");

  const loaderPixels = document.querySelectorAll('.loader-pixel-art span');

  anime.timeline({
    complete: () => {
      anime({
        targets: '#loader',
        translateY: '-100%',
        duration: 900,
        easing: 'easeInOutExpo',
        complete: () => {
          const loader = document.getElementById('loader');
          loader.style.display = 'none';
          initHeroAnimations();
        }
      });
    }
  })
  .add({
    targets: loaderPixels,
    scale: [0, 1],
    opacity: [0, 1],
    duration: 400,
    delay: anime.stagger(60, { grid: [3, 3], from: 'center' }),
    easing: 'easeOutBack'
  })
  .add({
    targets: '.progress-fill',
    width: ['0%', '100%'],
    duration: 1200,
    easing: 'easeInOutQuad'
  }, '-=200')
  .add({
    targets: '#loader-title .char',
    translateY: [0, -24],
    opacity: [1, 0],
    scale: [1, 0.8],
    duration: 350,
    delay: anime.stagger(40),
    easing: 'easeInBack'
  }, '-=300');
}

// ================================================================
// HERO: animações de entrada
// ================================================================
function initHeroAnimations() {
  const heroTitle = document.getElementById('hero-title');
  if (!heroTitle) return;

  const text = heroTitle.innerText;
  heroTitle.innerHTML = '';
  text.split('').forEach(ch => {
    const span = document.createElement('span');
    span.className = 'char';
    span.innerText = ch === ' ' ? ' ' : ch;
    heroTitle.appendChild(span);
  });

  anime.timeline({ easing: 'easeOutElastic(1, .55)' })
    .add({
      targets: '#hero-title .char',
      translateY: [-120, 0],
      rotateZ: [40, 0],
      scale: [0.4, 1],
      opacity: [0, 1],
      duration: 1400,
      delay: anime.stagger(45)
    })
    .add({
      targets: '.reveal-hero',
      translateY: [60, 0],
      opacity: [0, 1],
      duration: 900,
      easing: 'easeOutExpo',
      delay: anime.stagger(160)
    }, '-=900');
}

// ================================================================
// GRID ESTOCÁSTICO (HERO BG)
// ================================================================
function initStaggerGrid() {
  const grid = document.getElementById('stagger-grid');
  if (!grid) return;
  const cols = Math.ceil(window.innerWidth  / 64);
  const rows = Math.ceil(window.innerHeight / 64);
  const total = cols * rows;
  const frag = document.createDocumentFragment();
  for (let i = 0; i < total; i++) {
    const cell = document.createElement('div');
    cell.className = 'stagger-cell';
    frag.appendChild(cell);
  }
  grid.appendChild(frag);

  anime({
    targets: '.stagger-cell',
    scale: [
      { value: 0.05, easing: 'easeOutSine',   duration: 700  },
      { value: 1,    easing: 'easeInOutQuad',  duration: 1100 }
    ],
    opacity: [
      { value: 0.05, easing: 'easeOutSine',   duration: 700  },
      { value: 0.6,  easing: 'easeInOutQuad', duration: 1100 }
    ],
    delay: anime.stagger(120, { grid: [cols, rows], from: 'center' }),
    loop: true,
    direction: 'alternate'
  });
}

// ================================================================
// PARTÍCULAS (HERO)
// ================================================================
function initParticles() {
  const container = document.getElementById('anime-particles');
  if (!container) return;
  const colors = ['#FDE047', '#93C5FD', '#6EE7B7', '#F87171', '#FFFFFF', '#D97706'];
  const frag = document.createDocumentFragment();
  for (let i = 0; i < 36; i++) {
    const p = document.createElement('div');
    p.className = 'anime-particle';
    p.style.left = anime.random(0, 100) + 'vw';
    p.style.top  = anime.random(0, 100) + 'vh';
    p.style.backgroundColor = colors[anime.random(0, colors.length - 1)];
    frag.appendChild(p);
  }
  container.appendChild(frag);

  anime({
    targets: '.anime-particle',
    translateX: () => anime.random(-300, 300),
    translateY: () => anime.random(-300, 300),
    scale:      () => anime.random(0.2, 1.9),
    rotate:     () => anime.random(-360, 360),
    opacity: [0, 0.7, 0],
    duration:   () => anime.random(3000, 8000),
    easing: 'easeInOutSine',
    loop: true,
    direction: 'alternate'
  });
}

// ================================================================
// NUVENS
// ================================================================
function initClouds() {
  const container = document.getElementById('clouds-container');
  if (!container) return;
  const widths  = [10, 14, 20];
  const heights = [ 5,  7,  6];

  for (let i = 0; i < 10; i++) {
    const cloud = document.createElement('div');
    const type  = Math.floor(Math.random() * 3) + 1;
    cloud.className = 'cloud cloud-type-' + type;
    const scale = 4 + Math.random() * 11;
    cloud.style.width  = (widths[type - 1]  * scale) + 'px';
    cloud.style.height = (heights[type - 1] * scale) + 'px';
    cloud.style.top    = (5 + Math.random() * 65) + 'vh';
    container.appendChild(cloud);

    anime({
      targets: cloud,
      translateX: ['-20vw', '115vw'],
      duration:   () => anime.random(22000, 55000),
      easing: 'linear',
      loop: true,
      delay: () => anime.random(-40000, 0)
    });
  }
}

// ================================================================
// SETA DE SCROLL (HERO)
// ================================================================
function initScrollArrow() {
  anime({
    targets: '.scroll-arrow',
    translateY: [0, 12],
    direction: 'alternate',
    loop: true,
    easing: 'easeInOutSine',
    duration: 950
  });
}

// ================================================================
// PULSE (CTAs)
// ================================================================
function initPulse() {
  anime({
    targets: '.anime-pulse-btn',
    scale: [1, 1.045, 1],
    duration: 2600,
    easing: 'easeInOutSine',
    loop: true
  });
}

// ================================================================
// ÍCONES FLUTUANTES
// ================================================================
function initFloatingIcons() {
  anime({
    targets: '.feature-card .icon svg',
    translateY: [-5, 5],
    scale: [0.94, 1.06],
    duration: 1600,
    direction: 'alternate',
    loop: true,
    easing: 'easeInOutSine',
    delay: anime.stagger(220)
  });
}

// ================================================================
// SCROLL ANIMATIONS via IntersectionObserver + anime.js
// (substitui GSAP ScrollTrigger)
// ================================================================
function initScrollAnimations() {
  const THRESHOLD = 0.1;
  const ROOT_MARGIN = '0px 0px -70px 0px';

  // --- Pop (scale + fade up) ---
  const popEls = document.querySelectorAll('.scroll-reveal');
  const popObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      anime({
        targets: entry.target,
        scale:       [0.82, 1],
        translateY:  [40,   0],
        opacity:     [0,    1],
        duration:    1100,
        easing:      'easeOutElastic(1, .55)'
      });
      popObserver.unobserve(entry.target);
    });
  }, { threshold: THRESHOLD, rootMargin: ROOT_MARGIN });
  popEls.forEach(el => { el.style.opacity = '0'; el.style.transform = 'scale(0.82) translateY(40px)'; popObserver.observe(el); });

  // --- Stagger (cards em grid) ---
  const staggerEls = document.querySelectorAll('.scroll-reveal-stagger');
  const staggerObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (!entry.isIntersecting) return;
      anime({
        targets: entry.target,
        translateY: [55, 0],
        opacity:    [0,  1],
        duration:   900,
        delay:      i * 100,
        easing:     'easeOutBack(1.4)'
      });
      staggerObserver.unobserve(entry.target);
    });
  }, { threshold: THRESHOLD, rootMargin: ROOT_MARGIN });
  staggerEls.forEach(el => { el.style.opacity = '0'; el.style.transform = 'translateY(55px)'; staggerObserver.observe(el); });

  // --- Slide da esquerda ---
  const leftEls = document.querySelectorAll('.reveal-left, .scroll-reveal-left');
  const leftObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      anime({
        targets: entry.target,
        translateX: [-80, 0],
        opacity:    [0,   1],
        duration:   1000,
        easing:     'easeOutExpo'
      });
      leftObserver.unobserve(entry.target);
    });
  }, { threshold: THRESHOLD, rootMargin: ROOT_MARGIN });
  leftEls.forEach(el => { el.style.opacity = '0'; el.style.transform = 'translateX(-80px)'; leftObserver.observe(el); });

  // --- Slide da direita ---
  const rightEls = document.querySelectorAll('.reveal-right');
  const rightObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      anime({
        targets: entry.target,
        translateX: [80, 0],
        scale:      [0.92, 1],
        opacity:    [0, 1],
        duration:   1100,
        easing:     'easeOutBack(1.2)'
      });
      rightObserver.unobserve(entry.target);
    });
  }, { threshold: THRESHOLD, rootMargin: ROOT_MARGIN });
  rightEls.forEach(el => { el.style.opacity = '0'; el.style.transform = 'translateX(80px) scale(0.92)'; rightObserver.observe(el); });
}

// ================================================================
// GALERIA HORIZONTAL (sem GSAP)
// Desktop: scroll vertical converte para horizontal (sticky)
// Mobile:  scroll nativo com touch
// ================================================================
function initHorizontalGallery() {
  const gallerySection = document.querySelector('#gallery');
  const wrapper        = document.querySelector('.gallery-pin-wrapper');
  const scrollCont     = document.querySelector('.horizontal-scroll-container');

  if (!gallerySection || !wrapper || !scrollCont) return;

  function isMobile() { return window.innerWidth <= 900; }

  function setupDesktop() {
    // Resetar estilos mobile
    wrapper.style.overflow = 'hidden';
    wrapper.classList.remove('is-sticky');
    scrollCont.style.transform = 'translateX(0)';

    const galleryHeader = gallerySection.querySelector('.gallery-header');
    const headerH = galleryHeader ? galleryHeader.offsetHeight : 0;
    const scrollWidth = scrollCont.scrollWidth - window.innerWidth + 80;

    // Seção cresce para acomodar o scroll
    gallerySection.style.height = (scrollWidth + window.innerHeight) + 'px';
    wrapper.style.position = 'sticky';
    wrapper.style.top      = '0';
    wrapper.style.height   = window.innerHeight + 'px';
    wrapper.style.overflow = 'hidden';
  }

  function resetMobile() {
    gallerySection.style.height = '';
    wrapper.style.position = '';
    wrapper.style.top      = '';
    wrapper.style.height   = '';
    wrapper.style.overflow = '';
    scrollCont.style.transform = '';
  }

  function onScroll() {
    if (isMobile()) return;
    const rect      = gallerySection.getBoundingClientRect();
    const scrollH   = gallerySection.offsetHeight - window.innerHeight;
    if (scrollH <= 0) return;
    const progress  = Math.max(0, Math.min(1, -rect.top / scrollH));
    const maxTX     = -(scrollCont.scrollWidth - window.innerWidth + 80);
    scrollCont.style.transform = `translateX(${maxTX * progress}px)`;
  }

  function init() {
    if (isMobile()) {
      resetMobile();
    } else {
      // Aguardar layout estabilizar
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setupDesktop();
          onScroll();
        });
      });
    }
  }

  init();
  window.addEventListener('resize',   init,    { passive: true });
  window.addEventListener('scroll',   onScroll, { passive: true });
}

// ================================================================
// NAVBAR — esconder/mostrar com scroll
// ================================================================
function initNavScroll() {
  let lastY   = 0;
  let ticking = false;
  const nav = document.querySelector('.nav-wrapper');
  if (!nav) return;

  window.addEventListener('scroll', () => {
    if (ticking) return;
    requestAnimationFrame(() => {
      const y       = window.pageYOffset;
      const mobile  = window.innerWidth <= 900;
      const hideVal = mobile ? 150 : -150;

      if (y < 60) {
        anime({ targets: nav, translateY: 0, duration: 400, easing: 'easeOutQuad' });
      } else if (y > lastY) {
        anime({ targets: nav, translateY: hideVal, duration: 500, easing: 'easeInOutQuad' });
      } else {
        anime({ targets: nav, translateY: 0, duration: 400, easing: 'easeOutQuad' });
      }
      lastY   = y;
      ticking = false;
    });
    ticking = true;
  }, { passive: true });
}

// ================================================================
// FAQ — acordeão com anime.js
// ================================================================
function initFAQ() {
  document.querySelectorAll('.faq-item').forEach(item => {
    item.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      const answer   = item.querySelector('.faq-answer');

      document.querySelectorAll('.faq-item').forEach(f => {
        f.classList.remove('active');
        f.querySelector('.faq-answer').style.display = 'none';
      });

      if (!isActive) {
        item.classList.add('active');
        answer.style.display = 'block';
        anime({
          targets:    answer,
          translateY: [-18, 0],
          opacity:    [0,   1],
          duration:   380,
          easing:     'easeOutCubic'
        });
      }
    });
  });
}

// ================================================================
// MOEDAS EASTER EGG
// ================================================================
function initCoins() {
  const sections   = ['#about', '#roadmap', '#avaliacao', '#gameplay'];
  const coinCount  = window.innerWidth < 900 ? 1 : 2;

  sections.forEach(sel => {
    const section = document.querySelector(sel);
    if (!section) return;

    for (let i = 0; i < coinCount; i++) {
      const wrapper = document.createElement('div');
      wrapper.className = 'coin-wrapper';
      wrapper.style.left = (3 + Math.random() * 94) + '%';
      wrapper.style.top  = (5 + Math.random() * 88) + '%';

      const coin = document.createElement('div');
      coin.className = 'coin';
      wrapper.appendChild(coin);
      section.appendChild(wrapper);

      wrapper.addEventListener('click', e => collectCoin(e, wrapper));
    }
  });
}

// ================================================================
// PARALLAX LEVE (mousemove no hero — só desktop)
// ================================================================
function initParallax() {
  if (window.innerWidth <= 900) return;
  const hero = document.querySelector('.parallax-hero');
  if (!hero) return;

  document.addEventListener('mousemove', e => {
    const x = (window.innerWidth  / 2 - e.pageX) * 0.012;
    const y = (window.innerHeight / 2 - e.pageY) * 0.012;
    anime({
      targets:  hero,
      translateX: x,
      translateY: y,
      duration: 800,
      easing: 'easeOutQuad'
    });
  });
}

// ================================================================
// ANIMAÇÃO DE ENTRADA DA NAVBAR
// ================================================================
function initNavEntrance() {
  const nav = document.querySelector('.nav-wrapper');
  if (!nav) return;
  anime({
    targets: nav,
    translateY: [-100, 0],
    opacity:    [0,    1],
    duration:   800,
    delay:      400,
    easing:     'easeOutElastic(1, .6)'
  });
}

// ================================================================
// INIT PRINCIPAL
// ================================================================
document.addEventListener('DOMContentLoaded', () => {
  initLoader();         // Loader (dispara hero após concluir)
  initStaggerGrid();
  initParticles();
  initClouds();
  initScrollArrow();
  initPulse();
  initFloatingIcons();
  initScrollAnimations();
  initHorizontalGallery();
  initNavScroll();
  initFAQ();
  initCoins();
  initTilt();
  initMagneticButtons();
  initParallax();
  initNavEntrance();
});
