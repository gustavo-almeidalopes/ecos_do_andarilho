gsap.registerPlugin(ScrollTrigger);

ScrollTrigger.config({ ignoreMobileResize: true, limitCallbacks: true });

// ========================================================
// FUNDO ATMOSFÉRICO DARK MODE (Canvas Estrelas + Nuvens)
// ========================================================
let darkAtmosphere = null;
let starCanvas = null;
let starCtx = null;
let starAnimId = null;
let starsData = [];
let lastStarFrame = 0;

function buildDarkAtmosphere() {
  if (darkAtmosphere) return;

  darkAtmosphere = document.createElement('div');
  darkAtmosphere.id = 'dark-atmosphere';

  // Nuvens atmosféricas suaves (blobs borrados)
  const cloudDefs = [
    { l: '-8%',  t: '0%',   w: '50%',  h: '28%', r: '55,35,100', o: 0.22, anim: 0, dur: 55 },
    { l: '45%',  t: '-8%',  w: '60%',  h: '32%', r: '35,22,80',  o: 0.18, anim: 1, dur: 70 },
    { l: '15%',  t: '30%',  w: '65%',  h: '28%', r: '45,28,90',  o: 0.10, anim: 2, dur: 88 },
    { l: '60%',  t: '55%',  w: '45%',  h: '26%', r: '30,18,70',  o: 0.14, anim: 3, dur: 62 },
    { l: '-12%', t: '65%',  w: '55%',  h: '30%', r: '50,32,88',  o: 0.12, anim: 4, dur: 78 },
    { l: '30%',  t: '80%',  w: '40%',  h: '22%', r: '38,24,76',  o: 0.09, anim: 1, dur: 95 },
  ];

  cloudDefs.forEach((c) => {
    const cloud = document.createElement('div');
    cloud.className = 'dark-atm-cloud';
    cloud.style.cssText = [
      `left:${c.l}`, `top:${c.t}`, `width:${c.w}`, `height:${c.h}`,
      `background:radial-gradient(ellipse at center, rgba(${c.r},${c.o}) 0%, transparent 68%)`,
      `filter:blur(55px)`,
      `animation:darkCloudFloat${c.anim} ${c.dur}s ease-in-out infinite`,
    ].join(';');
    darkAtmosphere.appendChild(cloud);
  });

  // Canvas de estrelas
  starCanvas = document.createElement('canvas');
  starCanvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;opacity:0;transition:opacity 1.6s ease;';
  darkAtmosphere.appendChild(starCanvas);

  document.body.insertBefore(darkAtmosphere, document.body.firstChild);

  // Inicializa estrelas
  resizeStarCanvas();
  window.addEventListener('resize', resizeStarCanvas, { passive: true });

  // Fade-in suave
  requestAnimationFrame(() => {
    darkAtmosphere.classList.add('active');
    setTimeout(() => { if (starCanvas) starCanvas.style.opacity = '1'; }, 600);
  });

  // Inicia animação
  if (starAnimId) cancelAnimationFrame(starAnimId);
  starAnimId = requestAnimationFrame(tickStars);
}

function resizeStarCanvas() {
  if (!starCanvas) return;
  starCanvas.width = window.innerWidth;
  starCanvas.height = window.innerHeight;
  starCtx = starCanvas.getContext('2d');
  generateStarData();
}

function generateStarData() {
  starsData = [];
  const total = window.innerWidth > 900
    ? Math.min(160, Math.floor(window.innerWidth * window.innerHeight / 5500))
    : Math.min(80, Math.floor(window.innerWidth * window.innerHeight / 6000));

  // Paletas de cores de estrelas (quentes e frias)
  const palettes = [
    [255, 248, 230], // branco quente
    [220, 228, 255], // azul frio
    [255, 252, 210], // amarelado
    [240, 232, 255], // lavanda
    [255, 240, 220], // âmbar suave
  ];

  for (let i = 0; i < total; i++) {
    const pal = palettes[Math.floor(Math.random() * palettes.length)];
    // Concentrar mais estrelas no topo
    const yNorm = Math.pow(Math.random(), 1.4);
    const isBig = Math.random() < 0.08;
    const isMed = !isBig && Math.random() < 0.22;
    starsData.push({
      x: Math.random() * (starCanvas ? starCanvas.width : window.innerWidth),
      y: yNorm * (starCanvas ? starCanvas.height : window.innerHeight),
      size: isBig ? (1.8 + Math.random() * 1.4) : (isMed ? (1.2 + Math.random() * 0.6) : (0.6 + Math.random() * 0.7)),
      r: pal[0], g: pal[1], b: pal[2],
      baseAlpha: isBig ? (0.55 + Math.random() * 0.4) : (0.25 + Math.random() * 0.55),
      speed: 0.25 + Math.random() * 1.0,
      phase: Math.random() * Math.PI * 2,
    });
  }
}

function tickStars(ts) {
  if (!starCtx || !darkAtmosphere || !document.body.contains(darkAtmosphere)) {
    starAnimId = null;
    return;
  }

  // Limitar a ~18fps para poupar CPU
  if (ts - lastStarFrame < 55) {
    starAnimId = requestAnimationFrame(tickStars);
    return;
  }
  lastStarFrame = ts;

  const t = ts / 1000;
  const w = starCanvas.width;
  const h = starCanvas.height;

  starCtx.clearRect(0, 0, w, h);

  for (let i = 0; i < starsData.length; i++) {
    const s = starsData[i];
    const alpha = Math.max(0.05, s.baseAlpha * (0.55 + 0.45 * Math.sin(t * s.speed + s.phase)));
    starCtx.fillStyle = `rgba(${s.r},${s.g},${s.b},${alpha.toFixed(3)})`;
    // Pixels quadrados para estética retrô
    const px = Math.round(s.x);
    const py = Math.round(s.y);
    const sz = Math.ceil(s.size);
    starCtx.fillRect(px, py, sz, sz);
  }

  starAnimId = requestAnimationFrame(tickStars);
}

function destroyDarkAtmosphere() {
  if (starAnimId) { cancelAnimationFrame(starAnimId); starAnimId = null; }
  window.removeEventListener('resize', resizeStarCanvas);
  if (darkAtmosphere) {
    darkAtmosphere.classList.remove('active');
    starCanvas = null; starCtx = null; starsData = [];
    setTimeout(() => {
      if (darkAtmosphere && darkAtmosphere.parentNode) darkAtmosphere.remove();
      darkAtmosphere = null;
    }, 1200);
  }
}

// ========================================================
// TRANSIÇÃO DE TEMA — RIPPLE MÁGICO
// ========================================================
let rippleActive = false;

function applyTheme(isDark, toggleEl) {
  const htmlEl = document.documentElement;
  const themeColorMeta = document.querySelector('meta[name="theme-color"]');

  if (rippleActive) {
    // Aplicar sem animação se outro ripple está em curso
    htmlEl.setAttribute('data-theme', isDark ? 'dark' : 'light');
    if (themeColorMeta) themeColorMeta.setAttribute('content', isDark ? '#0f0c1e' : '#3B82F6');
    isDark ? buildDarkAtmosphere() : destroyDarkAtmosphere();
    return;
  }

  rippleActive = true;

  // Posição do toggle para origem do ripple
  let rx = window.innerWidth / 2, ry = 60;
  if (toggleEl) {
    const rect = toggleEl.getBoundingClientRect();
    rx = rect.left + rect.width / 2;
    ry = rect.top + rect.height / 2;
  }

  // Cor do overlay = tema ATUAL (vai sumir revelando o novo)
  const currentDark = htmlEl.getAttribute('data-theme') === 'dark';
  const overlayBg = currentDark
    ? 'rgba(12, 9, 22, 0.99)'
    : 'rgba(251, 248, 240, 0.99)';

  // Overlay que cobre a tela inteira com a cor do tema atual
  const overlay = document.createElement('div');
  overlay.className = 'theme-ripple-overlay';
  overlay.style.cssText = `
    background:${overlayBg};
    clip-path:circle(200vmax at ${rx}px ${ry}px);
  `;
  document.body.appendChild(overlay);

  // Mudar tema enquanto oculto pelo overlay
  htmlEl.setAttribute('data-theme', isDark ? 'dark' : 'light');
  if (themeColorMeta) themeColorMeta.setAttribute('content', isDark ? '#0f0c1e' : '#3B82F6');

  // Gerenciar atmosfera
  if (isDark) {
    buildDarkAtmosphere();
  } else {
    destroyDarkAtmosphere();
  }

  // Animar o colapso do overlay (revela o novo tema dos cantos para o centro)
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      overlay.style.transition = 'clip-path 1.05s cubic-bezier(0.76, 0, 0.24, 1)';
      overlay.style.clipPath = `circle(0px at ${rx}px ${ry}px)`;

      setTimeout(() => {
        overlay.remove();
        rippleActive = false;
      }, 1100);
    });
  });
}

// ========================================================
// INICIALIZAÇÃO GERAL
// ========================================================
document.addEventListener("DOMContentLoaded", () => {

  const htmlEl = document.documentElement;
  const themeColorMeta = document.querySelector('meta[name="theme-color"]');
  const darkToggle = document.getElementById('dark-mode-toggle');

  // ── Tema inicial (preferência salva ou sistema) ──
  const savedTheme = localStorage.getItem('ecos-theme');
  const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const startDark = savedTheme ? savedTheme === 'dark' : systemPrefersDark;

  // Aplicar sem animação no boot
  htmlEl.setAttribute('data-theme', startDark ? 'dark' : 'light');
  if (themeColorMeta) themeColorMeta.setAttribute('content', startDark ? '#0f0c1e' : '#3B82F6');
  if (startDark) buildDarkAtmosphere();

  // ── Toggle de tema com ripple e animação ──
  if (darkToggle) {
    darkToggle.addEventListener('click', () => {
      const isDark = htmlEl.getAttribute('data-theme') !== 'dark';
      applyTheme(isDark, darkToggle);
      localStorage.setItem('ecos-theme', isDark ? 'dark' : 'light');

      // Animação do ícone do botão
      anime({
        targets: darkToggle,
        scale: [1, 0.75, 1.3, 1],
        rotate: [0, isDark ? -30 : 30, 0],
        duration: 700,
        easing: 'easeOutElastic(1, 0.45)'
      });
    });
  }

  // ========================================================
  // FORMULÁRIO DE AVALIAÇÃO — envio via mailto: para AMBOS os destinatários
  // (to + cc garante entrega em todos os clientes de e-mail)
  // ========================================================
  const avaliacaoForm = document.getElementById('avaliacao-form');
  if (avaliacaoForm) {
    const EMAIL_TO = 'gustavo13.roberto@gmail.com';
    const EMAIL_CC = 'erick.oliveira@email.com';
    const ASSUNTO = 'Avaliação do Projeto — Ecos do Andarilho';

    avaliacaoForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const textarea = document.getElementById('avaliacao-mensagem');
      const mensagem = (textarea && textarea.value.trim()) || '';
      if (!mensagem) {
        textarea && textarea.focus();
        return;
      }
      const subject = encodeURIComponent(ASSUNTO);
      const body = encodeURIComponent(mensagem);
      const cc = encodeURIComponent(EMAIL_CC);
      window.location.href = `mailto:${EMAIL_TO}?cc=${cc}&subject=${subject}&body=${body}`;
    });
  }

  // ========================================================
  // TILT NOS CARTÕES
  // ========================================================
  if (window.innerWidth > 900) {
    document.querySelectorAll('.tilt-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const rx = ((y - rect.height / 2) / rect.height) * -7;
        const ry = ((x - rect.width / 2) / rect.width) * 7;
        card.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.02, 1.02, 1.02)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      });
    });
  }

  // ========================================================
  // 1. ANIME.JS — LOADER, HERO, PARTÍCULAS
  // ========================================================

  // Loader
  const loaderTitle = document.getElementById('loader-title');
  loaderTitle.innerHTML = loaderTitle.innerText.replace(/\S/g, "<span class='char'>$&</span>");

  anime.timeline({
    complete: () => {
      anime({
        targets: '#loader',
        translateY: '-100%',
        duration: 800,
        easing: 'easeInOutExpo',
        complete: () => {
          document.getElementById('loader').style.display = 'none';
          initHeroAnimations();
        }
      });
    }
  })
  .add({ targets: '.progress-fill', width: ['0%', '100%'], duration: 1500, easing: 'easeInOutQuad' })
  .add({ targets: '#loader-title .char', translateY: [0, -20], opacity: [1, 0], duration: 400, delay: anime.stagger(50), easing: 'easeInQuad' }, '-=400');

  // Botões Magnéticos
  document.querySelectorAll('.btn-3d').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      if (window.innerWidth <= 900) return;
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      anime({ targets: btn, translateX: x * 0.15, translateY: y * 0.15, scale: 1.05, duration: 140, easing: 'easeOutQuad' });
      const svg = btn.querySelector('svg');
      if (svg) anime({ targets: svg, translateX: x * 0.1, translateY: y * 0.1, duration: 140, easing: 'easeOutQuad' });
    });
    btn.addEventListener('mouseleave', () => {
      anime({ targets: btn, translateX: 0, translateY: 0, scale: 1, duration: 600, easing: 'easeOutElastic(1, .5)' });
      const svg = btn.querySelector('svg');
      if (svg) anime({ targets: svg, translateX: 0, translateY: 0, duration: 600, easing: 'easeOutElastic(1, .5)' });
    });
  });

  // Grid dinâmica hero
  const gridContainer = document.getElementById('stagger-grid');
  const numCols = Math.ceil(window.innerWidth / 60);
  const numRows = Math.ceil(window.innerHeight / 60);
  const totalCells = numCols * numRows;
  for (let i = 0; i < totalCells; i++) {
    const cell = document.createElement('div');
    cell.className = 'stagger-cell';
    gridContainer.appendChild(cell);
  }
  anime({
    targets: '.stagger-cell',
    scale: [{ value: 0.1, easing: 'easeOutSine', duration: 800 }, { value: 1, easing: 'easeInOutQuad', duration: 1200 }],
    opacity: [{ value: 0.1, easing: 'easeOutSine', duration: 800 }, { value: 0.6, easing: 'easeInOutQuad', duration: 1200 }],
    delay: anime.stagger(150, { grid: [numCols, numRows], from: 'center' }),
    loop: true, direction: 'alternate'
  });

  // Partículas hero
  const particleContainer = document.getElementById('anime-particles');
  const pColors = ['#FDE047', '#93C5FD', '#6EE7B7', '#F87171', '#FFFFFF'];
  for (let i = 0; i < 35; i++) {
    const p = document.createElement('div');
    p.className = 'anime-particle';
    p.style.left = anime.random(0, 100) + 'vw';
    p.style.top = anime.random(0, 100) + 'vh';
    p.style.backgroundColor = pColors[anime.random(0, pColors.length - 1)];
    particleContainer.appendChild(p);
  }
  anime({
    targets: '.anime-particle',
    translateX: () => anime.random(-220, 220),
    translateY: () => anime.random(-220, 220),
    scale: () => anime.random(0.3, 1.7),
    rotate: () => anime.random(-360, 360),
    opacity: [0, 0.55, 0],
    duration: () => anime.random(3200, 7000),
    easing: 'easeInOutSine',
    loop: true, direction: 'alternate'
  });

  // Ícones das feature cards
  anime({
    targets: '.feature-card .icon svg',
    translateY: [-3, 3], scale: [0.95, 1.05],
    duration: 1600, direction: 'alternate', loop: true,
    easing: 'easeInOutSine', delay: anime.stagger(200)
  });

  // Avatar dos personagens
  anime({
    targets: '.char-avatar svg',
    translateY: [-5, 5], rotateZ: [-4, 4],
    duration: 2600, direction: 'alternate', loop: true,
    easing: 'easeInOutSine', delay: anime.stagger(300)
  });

  // Hero — animação de caracteres preservando <br>
  function initHeroAnimations() {
    const heroTitle = document.getElementById('hero-title');
    const segments = heroTitle.innerHTML.trim().split(/<br\s*\/?>/i);
    heroTitle.innerHTML = '';
    segments.forEach((segment, idx) => {
      segment.split('').forEach(char => {
        const span = document.createElement('span');
        span.className = 'char';
        span.textContent = char === ' ' ? ' ' : char;
        heroTitle.appendChild(span);
      });
      if (idx < segments.length - 1) heroTitle.appendChild(document.createElement('br'));
    });
    anime.timeline({ easing: 'easeOutElastic(1, .5)' })
      .add({ targets: '#hero-title .char', translateY: [-100, 0], opacity: [0, 1], rotateZ: [45, 0], scale: [0.5, 1], duration: 1200, delay: anime.stagger(50) })
      .add({ targets: '.reveal-hero', translateY: [60, 0], opacity: [0, 1], duration: 1000, easing: 'easeOutExpo', delay: anime.stagger(150) }, '-=800');
  }

  // Seta de scroll
  anime({ targets: '.scroll-arrow', translateY: 20, direction: 'alternate', loop: true, easing: 'easeInOutQuad', duration: 900 });

  // Nuvens pixel art no hero
  const cloudsContainer = document.getElementById('clouds-container');
  for (let i = 0; i < 12; i++) {
    const cloud = document.createElement('div');
    const type = Math.floor(Math.random() * 3) + 1;
    cloud.className = 'cloud cloud-type-' + type;
    const wMult = [10, 14, 20];
    const hMult = [5, 7, 6];
    const scale = 4 + Math.random() * 12;
    cloud.style.width = (wMult[type - 1] * scale) + 'px';
    cloud.style.height = (hMult[type - 1] * scale) + 'px';
    cloud.style.top = (5 + Math.random() * 70) + 'vh';
    cloudsContainer.appendChild(cloud);
    anime({
      targets: cloud,
      translateX: ['-30vw', '120vw'],
      duration: () => anime.random(22000, 52000),
      easing: 'linear', loop: true,
      delay: () => anime.random(-30000, 0)
    });
  }

  // Pulso dos botões principais
  anime({ targets: '.anime-pulse-btn', scale: [1, 1.04, 1], duration: 2600, easing: 'easeInOutSine', loop: true });

  // Estrelas piscantes extras no hero
  const heroPCont = document.getElementById('anime-particles');
  if (heroPCont) {
    for (let i = 0; i < 18; i++) {
      const star = document.createElement('div');
      const sz = anime.random(3, 6);
      star.style.cssText = `position:absolute;left:${anime.random(0,100)}%;top:${anime.random(0,100)}%;width:${sz}px;height:${sz}px;background:#FFFFFF;border-radius:1px;opacity:0;pointer-events:none;`;
      heroPCont.appendChild(star);
      anime({ targets: star, opacity: [0, 0.9, 0], scale: [0, 1.5, 0], rotate: () => anime.random(0, 45), duration: () => anime.random(1200, 3500), delay: () => anime.random(0, 5000), loop: true, easing: 'easeInOutSine' });
    }
  }

  // ========================================================
  // 2. GSAP SCROLLTRIGGER
  // ========================================================
  if (window.innerWidth > 900) {
    document.addEventListener('mousemove', (e) => {
      const x = (window.innerWidth / 2 - e.pageX) * 0.013;
      const y = (window.innerHeight / 2 - e.pageY) * 0.013;
      gsap.to('.parallax-hero', { x, y, duration: 1.2, ease: 'power2.out' });
    });
  }

  const safeScrollConfig = (el) => ({ trigger: el, start: 'top 90%', toggleActions: 'play none none none' });

  gsap.utils.toArray('.gs-pop').forEach(el => {
    gsap.fromTo(el, { scale: 0.85, autoAlpha: 0, y: 35 }, { scrollTrigger: safeScrollConfig(el), scale: 1, autoAlpha: 1, y: 0, duration: 1.2, ease: 'elastic.out(1, 0.5)' });
  });

  gsap.utils.toArray('.gs-stagger-up').forEach(el => {
    gsap.fromTo(el, { y: 55, autoAlpha: 0 }, { scrollTrigger: safeScrollConfig(el), y: 0, autoAlpha: 1, duration: 0.8, ease: 'back.out(1.4)' });
  });

  gsap.utils.toArray('.milestone-stagger').forEach(el => {
    gsap.fromTo(el, { x: -55, autoAlpha: 0 }, { scrollTrigger: safeScrollConfig(el), x: 0, autoAlpha: 1, duration: 0.8, ease: 'back.out(1.2)' });
  });

  gsap.fromTo('.gs-reveal-left',
    { x: -100, autoAlpha: 0 },
    { scrollTrigger: { trigger: '#about', start: 'top 80%' }, x: 0, autoAlpha: 1, duration: 1.2, ease: 'power3.out' }
  );
  gsap.fromTo('.gs-reveal-right',
    { x: 100, scale: 0.92, autoAlpha: 0 },
    { scrollTrigger: { trigger: '#about', start: 'top 80%' }, x: 0, scale: 1, autoAlpha: 1, duration: 1.2, ease: 'back.out(1.2)' }
  );

  gsap.utils.toArray('.gs-elastic-box').forEach(box => {
    gsap.fromTo(box, { scale: 0.9, y: 50, autoAlpha: 0 }, { scrollTrigger: safeScrollConfig(box), scale: 1, y: 0, autoAlpha: 1, duration: 1.4, ease: 'elastic.out(1, 0.4)' });
  });

  // Parallax vertical — apenas desktop
  if (window.innerWidth > 1024) {
    gsap.utils.toArray('.vertical-parallax').forEach(el => {
      const speed = parseFloat(el.getAttribute('data-speed') || '0.1');
      gsap.to(el, {
        y: () => window.innerHeight * speed,
        ease: 'none',
        scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true }
      });
    });
  }

  // Galeria horizontal — pin só no desktop
  gsap.matchMedia().add('(min-width: 901px)', () => {
    const pinWrap = document.querySelector('.gallery-pin-wrapper');
    const scrollCont = document.querySelector('.horizontal-scroll-container');
    if (pinWrap && scrollCont) {
      gsap.to(scrollCont, {
        x: () => -(scrollCont.scrollWidth - window.innerWidth + 40),
        ease: 'none',
        scrollTrigger: {
          trigger: pinWrap, start: 'top 120px',
          end: () => '+=' + (scrollCont.scrollWidth - window.innerWidth),
          pin: true, scrub: 1, invalidateOnRefresh: true, anticipatePin: 1
        }
      });
    }
  });

  window.addEventListener('load', () => {
    requestAnimationFrame(() => requestAnimationFrame(() => ScrollTrigger.refresh()));
  }, { passive: true });

  // ========================================================
  // 3. FAQ INTERATIVO
  // ========================================================
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    item.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      const answer = item.querySelector('.faq-answer');
      faqItems.forEach(f => { f.classList.remove('active'); f.querySelector('.faq-answer').style.display = 'none'; });
      if (!isActive) {
        item.classList.add('active');
        answer.style.display = 'block';
        anime({ targets: answer, translateY: [-12, 0], opacity: [0, 1], duration: 380, easing: 'easeOutCubic' });
      }
    });
  });

  // ========================================================
  // 5. BARRA DE PROGRESSO DE SCROLL
  // ========================================================
  const scrollFill = document.getElementById('scroll-progress-fill');
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY || window.pageYOffset;
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    if (docH > 0 && scrollFill) scrollFill.style.width = ((scrollTop / docH) * 100).toFixed(1) + '%';
  }, { passive: true });

  // ========================================================
  // HAMBÚRGUER MOBILE
  // ========================================================
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const navLinksEl = document.getElementById('navLinks');
  if (hamburgerBtn && navLinksEl) {
    hamburgerBtn.addEventListener('click', () => {
      hamburgerBtn.classList.toggle('open');
      navLinksEl.classList.toggle('open');
    });
    navLinksEl.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', () => {
        hamburgerBtn.classList.remove('open');
        navLinksEl.classList.remove('open');
      });
    });
  }

  // ========================================================
  // 6. LINK ATIVO NA NAV (IntersectionObserver)
  // ========================================================
  const navLinksTracked = document.querySelectorAll('.nav-links a[href^="#"]');
  const trackedSections = document.querySelectorAll('section[id]');
  if ('IntersectionObserver' in window && trackedSections.length > 0) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const href = '#' + entry.target.id;
          navLinksTracked.forEach(link => link.classList.toggle('nav-active', link.getAttribute('href') === href));
        }
      });
    }, { rootMargin: '-35% 0px -58% 0px', threshold: 0 });
    trackedSections.forEach(s => obs.observe(s));
  }

  // ========================================================
  // 7. CURSOR TRAIL DE PIXELS (desktop)
  // ========================================================
  if (window.innerWidth > 900) {
    const trailColors = ['#FDE047', '#93C5FD', '#6EE7B7', '#F87171', '#FF2D6B', '#FFFFFF'];
    let trailThrottle = false;
    document.addEventListener('mousemove', (e) => {
      if (trailThrottle) return;
      trailThrottle = true;
      setTimeout(() => { trailThrottle = false; }, 36);
      const trail = document.createElement('div');
      trail.style.cssText = `position:fixed;pointer-events:none;z-index:9990;left:${e.clientX-4}px;top:${e.clientY-4}px;width:8px;height:8px;background:${trailColors[Math.floor(Math.random()*trailColors.length)]};border:2px solid rgba(0,0,0,0.3);border-radius:2px;`;
      document.body.appendChild(trail);
      anime({ targets: trail, translateX: () => anime.random(-22, 22), translateY: () => anime.random(-42, -8), scale: [1, 0], opacity: [0.85, 0], duration: anime.random(350, 680), easing: 'easeOutCubic', complete: () => trail.remove() });
    });
  }

  // ========================================================
  // 8. PIXEL BURST AO CLICAR BOTÕES
  // ========================================================
  const burstColors = ['#FDE047', '#FFFFFF', '#6EE7B7', '#F87171', '#93C5FD'];
  document.querySelectorAll('.btn-3d').forEach(btn => {
    btn.addEventListener('click', (e) => {
      for (let i = 0; i < 10; i++) {
        const px = document.createElement('div');
        const sz = anime.random(5, 12);
        px.style.cssText = `position:fixed;pointer-events:none;z-index:9998;left:${e.clientX}px;top:${e.clientY}px;width:${sz}px;height:${sz}px;background:${burstColors[i%burstColors.length]};border:2px solid rgba(0,0,0,0.3);border-radius:2px;transform:translate(-50%,-50%);`;
        document.body.appendChild(px);
        const angle = (i / 10) * Math.PI * 2;
        const dist = anime.random(28, 88);
        anime({ targets: px, translateX: Math.cos(angle)*dist, translateY: Math.sin(angle)*dist, scale: [1.5, 0], opacity: [1, 0], rotate: () => anime.random(-180, 180), duration: anime.random(400, 720), easing: 'easeOutExpo', complete: () => px.remove() });
      }
    });
  });

  // ========================================================
  // 9. GLITCH PERIÓDICO NO LOGO
  // ========================================================
  const logoEl = document.querySelector('.logo');
  if (logoEl && window.innerWidth > 900) {
    function runGlitch() {
      anime.timeline({ easing: 'steps(4)' })
        .add({ targets: logoEl, translateX: [0,-5,5,-3,3,0], duration: 280 })
        .add({ targets: logoEl, filter: ['none','hue-rotate(90deg)','hue-rotate(200deg)','none'], duration: 220 }, '-=280')
        .add({ targets: logoEl, opacity: [1,0.6,1], duration: 180 }, '-=180');
      setTimeout(runGlitch, anime.random(5000, 13000));
    }
    setTimeout(runGlitch, anime.random(4000, 8000));
  }

  // ========================================================
  // 10. PIXEL BURST NO HERO AO CLICAR
  // ========================================================
  const heroSect = document.getElementById('hero');
  if (heroSect) {
    heroSect.addEventListener('click', (e) => {
      if (e.target.closest('.btn-3d') || e.target.closest('.hero-badge') || e.target.closest('.scroll-down')) return;
      const hColors = ['#FDE047', '#93C5FD', '#6EE7B7', '#FF2D6B', '#FFFFFF', '#F87171'];
      for (let i = 0; i < 18; i++) {
        const px = document.createElement('div');
        const sz = anime.random(6, 16);
        px.style.cssText = `position:fixed;pointer-events:none;z-index:9995;left:${e.clientX}px;top:${e.clientY}px;width:${sz}px;height:${sz}px;background:${hColors[Math.floor(Math.random()*hColors.length)]};border:2px solid rgba(0,0,0,0.4);border-radius:2px;transform:translate(-50%,-50%);`;
        document.body.appendChild(px);
        const angle = Math.random() * Math.PI * 2;
        const dist = anime.random(55, 190);
        anime({ targets: px, translateX: Math.cos(angle)*dist, translateY: Math.sin(angle)*dist, scale: [1.5,0], opacity: [1,0], rotate: () => anime.random(-360,360), duration: anime.random(500,1050), easing: 'easeOutExpo', complete: () => px.remove() });
      }
    });
  }

  // ========================================================
  // 11. SCRAMBLE NOS TÍTULOS (scroll)
  // ========================================================
  const scrChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%*';
  function scrambleText(el, finalText, duration) {
    const frames = Math.floor(duration / 50);
    let frame = 0;
    const timer = setInterval(() => {
      el.textContent = finalText.split('').map((ch, i) => {
        if (ch === ' ') return ' ';
        const p = frame / frames;
        const revealAt = (i / Math.max(finalText.length - 1, 1)) * 0.75;
        return p > revealAt ? ch : scrChars[Math.floor(Math.random() * scrChars.length)];
      }).join('');
      frame++;
      if (frame >= frames) { el.textContent = finalText; clearInterval(timer); }
    }, 50);
  }
  if ('IntersectionObserver' in window) {
    const scrObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const orig = el.dataset.orig || el.textContent.trim();
          el.dataset.orig = orig;
          setTimeout(() => scrambleText(el, orig, 900), 200);
          scrObs.unobserve(el);
        }
      });
    }, { threshold: 0.55 });
    document.querySelectorAll('.section-title').forEach(t => scrObs.observe(t));
  }

  // ========================================================
  // 12. FEATURE CARDS — ícone bounce + sparks
  // ========================================================
  document.querySelectorAll('.feature-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      const svg = card.querySelector('.icon svg');
      if (svg) anime({ targets: svg, scale: [1, 1.5, 1], rotate: [0, -15, 15, 0], duration: 580, easing: 'easeOutElastic(1, 0.3)' });
    });
    card.addEventListener('click', () => {
      anime({ targets: card, scale: [1, 0.9, 1.08, 1], duration: 440, easing: 'easeOutElastic(1, 0.5)' });
      [{ l: '4px', t: '4px' }, { l: 'calc(100% - 10px)', t: '4px' }, { l: '4px', t: 'calc(100% - 10px)' }, { l: 'calc(100% - 10px)', t: 'calc(100% - 10px)' }].forEach(pos => {
        const sp = document.createElement('div');
        sp.style.cssText = `position:absolute;pointer-events:none;z-index:20;width:6px;height:6px;background:var(--accent);border-radius:1px;left:${pos.l};top:${pos.t};opacity:0;`;
        card.appendChild(sp);
        anime({ targets: sp, scale: [0, 2.5], opacity: [1, 0], duration: 440, easing: 'easeOutExpo', complete: () => sp.remove() });
      });
    });
  });

  // ========================================================
  // 13. NAV LINKS — bounce hover + pulse click
  // ========================================================
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('mouseenter', () => anime({ targets: link, translateY: [-4, 0], duration: 320, easing: 'easeOutBounce' }));
    link.addEventListener('click', () => anime({ targets: link, scale: [0.88, 1.1, 1], duration: 360, easing: 'easeOutElastic(1, 0.4)' }));
  });

  // ========================================================
  // 14. GALLERY — pixel scatter no hover
  // ========================================================
  const gColors = ['#FDE047', '#FF2D6B', '#00FFCA', '#93C5FD', '#FFFFFF'];
  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
      for (let i = 0; i < 7; i++) {
        const px = document.createElement('div');
        px.style.cssText = `position:absolute;pointer-events:none;z-index:20;width:${anime.random(4,11)}px;height:${anime.random(4,11)}px;background:${gColors[Math.floor(Math.random()*gColors.length)]};left:${anime.random(5,95)}%;top:${anime.random(5,65)}%;border-radius:1px;opacity:0;`;
        item.appendChild(px);
        anime({ targets: px, translateY: [0, -anime.random(22, 68)], translateX: () => anime.random(-28, 28), opacity: [1, 0], scale: [1, 0], duration: anime.random(380, 850), easing: 'easeOutCubic', complete: () => px.remove() });
      }
    });
  });

  // ========================================================
  // 15. CHAR CARDS — halo de pixels
  // ========================================================
  const haloColors = ['#FDE047', '#93C5FD', '#6EE7B7', '#F87171'];
  document.querySelectorAll('.char-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      for (let i = 0; i < 7; i++) {
        const px = document.createElement('div');
        px.style.cssText = `position:absolute;pointer-events:none;z-index:15;width:7px;height:7px;background:${haloColors[Math.floor(Math.random()*haloColors.length)]};border:2px solid rgba(0,0,0,0.28);left:${anime.random(10,90)}%;top:${anime.random(3,20)}%;border-radius:2px;opacity:0;`;
        card.appendChild(px);
        anime({ targets: px, translateY: -anime.random(36, 88), translateX: () => anime.random(-28,28), scale: [1.2, 0], opacity: [0.85, 0], duration: anime.random(580, 1050), easing: 'easeOutCubic', complete: () => px.remove() });
      }
    });
  });

  // ========================================================
  // 16. FAQ — ícone bounce + burst
  // ========================================================
  document.querySelectorAll('.faq-question').forEach(q => {
    q.addEventListener('click', () => {
      const icon = q.querySelector('.faq-icon');
      if (icon) anime({ targets: icon, scale: [1, 1.4, 1], duration: 380, easing: 'easeOutElastic(1, 0.3)' });
      const fqC = ['#FDE047', '#6EE7B7', '#93C5FD'];
      const rect = q.getBoundingClientRect();
      for (let i = 0; i < 6; i++) {
        const px = document.createElement('div');
        px.style.cssText = `position:fixed;pointer-events:none;z-index:9999;left:${rect.right-22}px;top:${rect.top+rect.height/2}px;width:6px;height:6px;background:${fqC[i%fqC.length]};border-radius:1px;transform:translate(-50%,-50%);opacity:0;`;
        document.body.appendChild(px);
        anime({ targets: px, translateX: () => anime.random(-42,42), translateY: () => anime.random(-32,32), scale: [1,0], opacity: [1,0], duration: anime.random(380,660), easing: 'easeOutCubic', complete: () => px.remove() });
      }
    });
  });

  // ========================================================
  // 17. MILESTONES — pulse ao entrar
  // ========================================================
  if ('IntersectionObserver' in window) {
    const msObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.pulsed) {
          entry.target.dataset.pulsed = '1';
          const dateEl = entry.target.querySelector('.milestone-date');
          if (dateEl) setTimeout(() => anime({ targets: dateEl, scale: [1, 1.16, 1], boxShadow: ['0 0 0 rgba(239,68,68,0)', '0 0 20px rgba(239,68,68,0.5)', '0 0 0 rgba(239,68,68,0)'], duration: 620, easing: 'easeOutElastic(1, 0.4)' }), 750);
        }
      });
    }, { threshold: 0.5 });
    document.querySelectorAll('.milestone').forEach(m => msObs.observe(m));
  }

  // ========================================================
  // 18. FORMULÁRIO — pixel celebration no submit
  // ========================================================
  const evalForm = document.querySelector('#avaliacao form');
  if (evalForm) {
    evalForm.removeAttribute('onsubmit');
    evalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = evalForm.querySelector('button[type="submit"]');
      anime.timeline().add({ targets: btn, scale: [1, 0.88, 1.16, 1], rotate: [0, -7, 7, 0], duration: 700, easing: 'easeOutElastic(1, 0.4)' });
      const rect2 = btn.getBoundingClientRect();
      const celC = ['#FDE047', '#6EE7B7', '#93C5FD', '#FFFFFF', '#F87171', '#FF2D6B'];
      for (let i = 0; i < 24; i++) {
        const px = document.createElement('div');
        const sz = anime.random(6, 18);
        px.style.cssText = `position:fixed;pointer-events:none;z-index:9999;left:${rect2.left+rect2.width/2}px;top:${rect2.top+rect2.height/2}px;width:${sz}px;height:${sz}px;background:${celC[Math.floor(Math.random()*celC.length)]};border:2px solid rgba(0,0,0,0.3);border-radius:2px;transform:translate(-50%,-50%);`;
        document.body.appendChild(px);
        const angle = (i / 24) * Math.PI * 2;
        const dist = anime.random(75, 200);
        anime({ targets: px, translateX: Math.cos(angle)*dist, translateY: Math.sin(angle)*dist, scale: [1.5,0], opacity: [1,0], rotate: () => anime.random(-360,360), duration: anime.random(680, 1350), easing: 'easeOutExpo', complete: () => px.remove() });
      }
      setTimeout(() => alert('Feedback enviado com sucesso! Muito obrigado pela avaliação.'), 620);
    });
  }

  // ========================================================
  // 19. LOGO — wave ao clicar
  // ========================================================
  const logoWaveEl = document.querySelector('.logo');
  if (logoWaveEl) {
    logoWaveEl.addEventListener('click', (e) => {
      e.preventDefault();
      const saved = logoWaveEl.innerHTML;
      logoWaveEl.innerHTML = 'ECOS'.split('').map(c => `<span style="display:inline-block">${c}</span>`).join('') + '<span style="display:inline-block">.</span>';
      anime({
        targets: logoWaveEl.querySelectorAll('span'),
        translateY: [0, -18, 0], color: ['currentColor', '#FDE047', 'currentColor'],
        duration: 680, delay: anime.stagger(65), easing: 'easeOutElastic(1, 0.5)',
        complete: () => { logoWaveEl.innerHTML = saved; window.scrollTo({ top: 0, behavior: 'smooth' }); }
      });
    });
  }

  // ========================================================
  // 20. DEV CARDS — hover spark no avatar
  // ========================================================
  document.querySelectorAll('.dev-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      const av = card.querySelector('.dev-avatar');
      if (av) anime({ targets: av, scale: [1, 1.07, 1], rotate: [0, -5, 5, 0], duration: 480, easing: 'easeOutElastic(1, 0.4)' });
    });
  });

  // ========================================================
  // 21. SHIMMER AO ENTRAR NAS SEÇÕES
  // ========================================================
  if ('IntersectionObserver' in window) {
    const shimObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.shimmered) {
          entry.target.dataset.shimmered = '1';
          const ov = document.createElement('div');
          ov.style.cssText = 'position:absolute;inset:0;background:rgba(255,255,255,0.04);pointer-events:none;z-index:50;';
          if (!entry.target.style.position || entry.target.style.position === 'static') entry.target.style.position = 'relative';
          entry.target.appendChild(ov);
          anime({ targets: ov, opacity: [0, 1, 0], duration: 680, easing: 'easeOutCubic', complete: () => ov.remove() });
        }
      });
    }, { threshold: 0.25 });
    document.querySelectorAll('section').forEach(s => shimObs.observe(s));
  }

  // ========================================================
  // 22. SCROLL-DOWN ARROW — batida ao clicar
  // ========================================================
  const scrollArrow = document.querySelector('.scroll-down');
  if (scrollArrow) {
    scrollArrow.addEventListener('click', () => {
      anime({ targets: scrollArrow, scale: [1, 1.6, 1], opacity: [1, 0.4, 1], duration: 380, easing: 'easeOutElastic(1, 0.3)' });
      const colors = ['#FDE047', '#FFFFFF', '#6EE7B7'];
      for (let i = 0; i < 6; i++) {
        const px = document.createElement('div');
        const rect = scrollArrow.getBoundingClientRect();
        px.style.cssText = `position:fixed;pointer-events:none;z-index:9999;left:${rect.left+rect.width/2}px;top:${rect.top+rect.height/2}px;width:6px;height:6px;background:${colors[i%colors.length]};border-radius:1px;transform:translate(-50%,-50%);opacity:0;`;
        document.body.appendChild(px);
        anime({ targets: px, translateX: Math.cos((i/6)*Math.PI*2)*38, translateY: Math.sin((i/6)*Math.PI*2)*38, scale: [1, 0], opacity: [1, 0], duration: 480, easing: 'easeOutExpo', complete: () => px.remove() });
      }
    });
  }

  // ========================================================
  // 23. NAVBAR — sempre visível (sem ocultar no scroll)
  // ========================================================
  const navWrapper = document.querySelector('.nav-wrapper');
  if (navWrapper) {
    navWrapper.style.transform = 'translateY(0)';
  }

  // ========================================================
  // 24. TEXTAREA AVALIAÇÃO — auto-resize (sem scroll interno)
  // ========================================================
  const avaliacaoTextarea = document.getElementById('avaliacao-mensagem');
  if (avaliacaoTextarea) {
    const autoResize = () => {
      avaliacaoTextarea.style.height = 'auto';
      avaliacaoTextarea.style.height = avaliacaoTextarea.scrollHeight + 'px';
    };
    avaliacaoTextarea.addEventListener('input', autoResize);
    // Aplicar na carga para o texto pré-preenchido
    autoResize();
  }

});
