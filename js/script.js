gsap.registerPlugin(ScrollTrigger);

// Configuração global do ScrollTrigger — evita jumps no resize mobile (barra de endereço do Safari/Chrome)
ScrollTrigger.config({ ignoreMobileResize: true, limitCallbacks: true });

// ==========================================
// ÁUDIO SINTETIZADO (EASTER EGG MOEDA MARIO)
// ==========================================
const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioCtx;

function playMarioCoinSound() {
  if (!audioCtx) audioCtx = new AudioContext();
  if (audioCtx.state === 'suspended') audioCtx.resume();
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  oscillator.type = 'square';
  const now = audioCtx.currentTime;
  oscillator.frequency.setValueAtTime(987.77, now);
  oscillator.frequency.setValueAtTime(1318.51, now + 0.1);
  gainNode.gain.setValueAtTime(0, now);
  gainNode.gain.linearRampToValueAtTime(0.1, now + 0.05);
  gainNode.gain.setValueAtTime(0.1, now + 0.1);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);
  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  oscillator.start(now);
  oscillator.stop(now + 0.5);
}

function collectCoin(e, coinWrapper) {
  playMarioCoinSound();
  coinWrapper.style.pointerEvents = 'none';

  const score = document.createElement('div');
  score.className = 'score-popup';
  score.innerText = '100';
  score.style.left = e.clientX + 'px';
  score.style.top = e.clientY + 'px';
  document.body.appendChild(score);

  anime({
    targets: coinWrapper.querySelector('.coin'),
    translateY: -100,
    scale: 1.5,
    opacity: 0,
    rotate: '1turn',
    duration: 800,
    easing: 'easeOutExpo',
    complete: () => coinWrapper.remove()
  });

  anime({
    targets: score,
    translateY: -80,
    scale: [0.5, 1.5],
    opacity: [1, 0],
    duration: 1000,
    easing: 'easeOutCubic',
    complete: () => score.remove()
  });
}

document.addEventListener("DOMContentLoaded", () => {

  // EFEITO TILT NOS CARTÕES (Vanilla JS - Performance Otimizada)
  const tiltCards = document.querySelectorAll('.tilt-card');
  if (window.innerWidth > 900) {
    tiltCards.forEach(card => {
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -8;
        const rotateY = ((x - centerX) / centerX) * 8;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
      });
    });
  }

  // ========================================================
  // 1. ANIMAÇÕES ANIME.JS (LOADER, MAGNETISMO E HERO)
  // ========================================================

  // Animação do Loader
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
  .add({
    targets: '.progress-fill',
    width: ['0%', '100%'],
    duration: 1500,
    easing: 'easeInOutQuad'
  })
  .add({
    targets: '#loader-title .char',
    translateY: [0, -20],
    opacity: [1, 0],
    duration: 400,
    delay: anime.stagger(50),
    easing: 'easeInQuad'
  }, '-=400');

  // Botões Magnéticos com Anime.js
  const magneticButtons = document.querySelectorAll('.btn-3d');
  magneticButtons.forEach(btn => {
    btn.addEventListener('mousemove', e => {
      if (window.innerWidth <= 900) return;
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      anime({ targets: btn, translateX: x * 0.15, translateY: y * 0.15, scale: 1.05, duration: 150, easing: 'easeOutQuad' });
      const svg = btn.querySelector('svg');
      if (svg) anime({ targets: svg, translateX: x * 0.1, translateY: y * 0.1, duration: 150, easing: 'easeOutQuad' });
    });
    btn.addEventListener('mouseleave', () => {
      anime({ targets: btn, translateX: 0, translateY: 0, scale: 1, duration: 600, easing: 'easeOutElastic(1, .5)' });
      const svg = btn.querySelector('svg');
      if (svg) anime({ targets: svg, translateX: 0, translateY: 0, duration: 600, easing: 'easeOutElastic(1, .5)' });
    });
  });

  // Grid Dinâmica de Fundo (Hero)
  const gridContainer = document.getElementById('stagger-grid');
  const numColumns = Math.ceil(window.innerWidth / 60);
  const numRows = Math.ceil(window.innerHeight / 60);
  const totalCells = numColumns * numRows;

  for (let i = 0; i < totalCells; i++) {
    let cell = document.createElement('div');
    cell.className = 'stagger-cell';
    gridContainer.appendChild(cell);
  }

  anime({
    targets: '.stagger-cell',
    scale: [
      { value: 0.1, easing: 'easeOutSine', duration: 800 },
      { value: 1, easing: 'easeInOutQuad', duration: 1200 }
    ],
    opacity: [
      { value: 0.1, easing: 'easeOutSine', duration: 800 },
      { value: 0.6, easing: 'easeInOutQuad', duration: 1200 }
    ],
    delay: anime.stagger(150, { grid: [numColumns, numRows], from: 'center' }),
    loop: true,
    direction: 'alternate'
  });

  // Partículas
  const particleContainer = document.getElementById('anime-particles');
  const colors = ['#FDE047', '#93C5FD', '#6EE7B7', '#F87171', '#FFFFFF'];
  for (let i = 0; i < 40; i++) {
    let p = document.createElement('div');
    p.className = 'anime-particle';
    p.style.left = anime.random(0, 100) + 'vw';
    p.style.top = anime.random(0, 100) + 'vh';
    p.style.backgroundColor = colors[anime.random(0, colors.length - 1)];
    particleContainer.appendChild(p);
  }
  anime({
    targets: '.anime-particle',
    translateX: () => anime.random(-250, 250),
    translateY: () => anime.random(-250, 250),
    scale: () => anime.random(0.3, 1.8),
    rotate: () => anime.random(-360, 360),
    opacity: [0, 0.6, 0],
    duration: () => anime.random(3000, 7000),
    easing: 'easeInOutSine',
    loop: true,
    direction: 'alternate'
  });

  // Animações Contínuas (Floating)
  anime({
    targets: '.feature-card .icon svg',
    translateY: [-4, 4],
    scale: [0.95, 1.05],
    duration: 1500,
    direction: 'alternate',
    loop: true,
    easing: 'easeInOutSine',
    delay: anime.stagger(200)
  });

  anime({
    targets: '.char-avatar svg',
    translateY: [-6, 6],
    rotateZ: [-5, 5],
    duration: 2500,
    direction: 'alternate',
    loop: true,
    easing: 'easeInOutSine',
    delay: anime.stagger(300)
  });

  // ── Hero: anima caracteres preservando a <br> entre "ECOS DO" e "ANDARILHO" ──
  function initHeroAnimations() {
    const heroTitle = document.getElementById('hero-title');

    // Divide no <br>, processa cada segmento, reinsere a <br>
    const segments = heroTitle.innerHTML.trim().split(/<br\s*\/?>/i);
    heroTitle.innerHTML = '';

    segments.forEach((segment, idx) => {
      segment.split('').forEach(char => {
        const span = document.createElement('span');
        span.className = 'char';
        span.textContent = char === ' ' ? ' ' : char;
        heroTitle.appendChild(span);
      });
      if (idx < segments.length - 1) {
        heroTitle.appendChild(document.createElement('br'));
      }
    });

    anime.timeline({ easing: 'easeOutElastic(1, .5)' })
      .add({
        targets: '#hero-title .char',
        translateY: [-100, 0],
        opacity: [0, 1],
        rotateZ: [45, 0],
        scale: [0.5, 1],
        duration: 1200,
        delay: anime.stagger(50)
      })
      .add({
        targets: '.reveal-hero',
        translateY: [60, 0],
        opacity: [0, 1],
        duration: 1000,
        easing: 'easeOutExpo',
        delay: anime.stagger(150)
      }, '-=800');
  }

  anime({
    targets: '.scroll-arrow',
    translateY: 20,
    direction: 'alternate',
    loop: true,
    easing: 'easeInOutQuad',
    duration: 900
  });

  // Nuvens
  const cloudsContainer = document.getElementById('clouds-container');
  for (let i = 0; i < 12; i++) {
    let cloud = document.createElement('div');
    let type = Math.floor(Math.random() * 3) + 1;
    cloud.className = 'cloud cloud-type-' + type;
    let widthMultipliers = [10, 14, 20];
    let heightMultipliers = [5, 7, 6];
    let scale = 4 + Math.random() * 12;
    let w = widthMultipliers[type - 1] * scale;
    let h = heightMultipliers[type - 1] * scale;
    cloud.style.width = w + 'px';
    cloud.style.height = h + 'px';
    cloud.style.top = (5 + Math.random() * 70) + 'vh';
    cloudsContainer.appendChild(cloud);
    anime({
      targets: cloud,
      translateX: ['-30vw', '120vw'],
      duration: () => anime.random(20000, 50000),
      easing: 'linear',
      loop: true,
      delay: () => anime.random(-30000, 0)
    });
  }

  anime({
    targets: '.anime-pulse-btn',
    scale: [1, 1.04, 1],
    duration: 2500,
    easing: 'easeInOutSine',
    loop: true
  });

  // ========================================================
  // 2. GSAP SCROLLTRIGGER
  // ========================================================

  if (window.innerWidth > 900) {
    document.addEventListener("mousemove", (e) => {
      const x = (window.innerWidth / 2 - e.pageX) * 0.015;
      const y = (window.innerHeight / 2 - e.pageY) * 0.015;
      gsap.to(".parallax-hero", { x: x, y: y, duration: 1, ease: "power2.out" });
    });
  }

  const safeScrollConfig = (el) => ({
    trigger: el,
    start: "top 90%",
    toggleActions: "play none none none"
  });

  gsap.utils.toArray('.gs-pop').forEach(element => {
    gsap.fromTo(element,
      { scale: 0.8, autoAlpha: 0, y: 40 },
      { scrollTrigger: safeScrollConfig(element), scale: 1, autoAlpha: 1, y: 0, duration: 1.2, ease: "elastic.out(1, 0.5)" }
    );
  });

  gsap.utils.toArray('.gs-stagger-up').forEach(element => {
    gsap.fromTo(element,
      { y: 60, autoAlpha: 0 },
      { scrollTrigger: safeScrollConfig(element), y: 0, autoAlpha: 1, duration: 0.8, ease: "back.out(1.4)" }
    );
  });

  gsap.utils.toArray('.milestone-stagger').forEach(element => {
    gsap.fromTo(element,
      { x: -60, autoAlpha: 0 },
      { scrollTrigger: safeScrollConfig(element), x: 0, autoAlpha: 1, duration: 0.8, ease: "back.out(1.2)" }
    );
  });

  gsap.fromTo(".gs-reveal-left",
    { x: -100, autoAlpha: 0 },
    { scrollTrigger: { trigger: "#about", start: "top 80%" }, x: 0, autoAlpha: 1, duration: 1.2, ease: "power3.out" }
  );

  gsap.fromTo(".gs-reveal-right",
    { x: 100, scale: 0.9, autoAlpha: 0 },
    { scrollTrigger: { trigger: "#about", start: "top 80%" }, x: 0, scale: 1, autoAlpha: 1, duration: 1.2, ease: "back.out(1.2)" }
  );

  gsap.utils.toArray('.gs-elastic-box').forEach(box => {
    gsap.fromTo(box,
      { scale: 0.9, y: 50, autoAlpha: 0 },
      { scrollTrigger: safeScrollConfig(box), scale: 1, y: 0, autoAlpha: 1, duration: 1.4, ease: "elastic.out(1, 0.4)" }
    );
  });

  // Parallax vertical — apenas desktop
  const isDesktop = window.innerWidth > 1024;
  if (isDesktop) {
    gsap.utils.toArray('.vertical-parallax').forEach(element => {
      const speed = parseFloat(element.getAttribute('data-speed') || "0.1");
      gsap.to(element, {
        y: () => (window.innerHeight * speed),
        ease: "none",
        scrollTrigger: { trigger: element.parentElement, start: "top bottom", end: "bottom top", scrub: true }
      });
    });
  }

  // ── Galeria horizontal — pin só no desktop ──
  let mm = gsap.matchMedia();
  mm.add("(min-width: 901px)", () => {
    const galleryPinWrap = document.querySelector('.gallery-pin-wrapper');
    const galleryScrollCont = document.querySelector('.horizontal-scroll-container');
    if (galleryPinWrap && galleryScrollCont) {
      let getToValue = () => -(galleryScrollCont.scrollWidth - window.innerWidth + 40);
      gsap.to(galleryScrollCont, {
        x: getToValue,
        ease: "none",
        scrollTrigger: {
          trigger: galleryPinWrap,
          start: "top 120px",
          end: () => "+=" + (galleryScrollCont.scrollWidth - window.innerWidth),
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          anticipatePin: 1
        }
      });
    }
  });

  // Refresh único, depois do layout estabilizar — sem causar jump de scroll
  window.addEventListener('load', () => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
    });
  });

  // ========================================================
  // 3. LÓGICAS COMUNS
  // ========================================================
  const sectionsForCoins = ['#about', '#roadmap', '#avaliacao', '#gameplay'];
  sectionsForCoins.forEach(selector => {
    const section = document.querySelector(selector);
    if (section) {
      let coinCount = window.innerWidth < 900 ? 1 : 2;
      for (let i = 0; i < coinCount; i++) {
        let coinWrapper = document.createElement('div');
        coinWrapper.className = 'coin-wrapper vertical-parallax';
        coinWrapper.setAttribute('data-speed', -0.15);
        coinWrapper.style.left = (2 + Math.random() * 96) + '%';
        coinWrapper.style.top = (5 + Math.random() * 90) + '%';

        let coin = document.createElement('div');
        coin.className = 'coin';

        coinWrapper.appendChild(coin);
        section.appendChild(coinWrapper);
        coinWrapper.addEventListener('click', (e) => collectCoin(e, coinWrapper));
      }
    }
  });

  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    item.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      const answer = item.querySelector('.faq-answer');

      faqItems.forEach(faq => {
        faq.classList.remove('active');
        faq.querySelector('.faq-answer').style.display = 'none';
      });

      if (!isActive) {
        item.classList.add('active');
        answer.style.display = 'block';
        anime({
          targets: answer,
          translateY: [-15, 0],
          opacity: [0, 1],
          duration: 400,
          easing: 'easeOutCubic'
        });
      }
    });
  });

  // ========================================================
  // 4. MODO ESCURO
  // ========================================================
  const darkToggle = document.getElementById('dark-mode-toggle');
  const htmlEl = document.documentElement;
  const themeColorMeta = document.querySelector('meta[name="theme-color"]');

  function applyTheme(isDark) {
    htmlEl.setAttribute('data-theme', isDark ? 'dark' : 'light');
    if (themeColorMeta) {
      themeColorMeta.setAttribute('content', isDark ? '#13111C' : '#3B82F6');
    }
  }

  // Inicializa com preferência salva ou preferência do sistema
  const savedTheme = localStorage.getItem('ecos-theme');
  const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(savedTheme ? savedTheme === 'dark' : systemPrefersDark);

  if (darkToggle) {
    darkToggle.addEventListener('click', () => {
      const isDark = htmlEl.getAttribute('data-theme') === 'dark';
      applyTheme(!isDark);
      localStorage.setItem('ecos-theme', !isDark ? 'dark' : 'light');

      anime({
        targets: darkToggle,
        scale: [1, 0.8, 1.2, 1],
        rotate: [0, isDark ? -25 : 25, 0],
        duration: 600,
        easing: 'easeOutElastic(1, 0.5)'
      });
    });
  }

  // ========================================================
  // 5. BARRA DE PROGRESSO DE SCROLL
  // ========================================================
  const scrollProgressFill = document.getElementById('scroll-progress-fill');
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY || window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight > 0 && scrollProgressFill) {
      scrollProgressFill.style.width = ((scrollTop / docHeight) * 100).toFixed(1) + '%';
    }
  }, { passive: true });

  // ========================================================
  // 6. LINK ATIVO NA NAV (rastreia seção visível)
  // ========================================================
  const navLinksTracked = document.querySelectorAll('.nav-links a[href^="#"]');
  const trackedSections = document.querySelectorAll('section[id]');

  if ('IntersectionObserver' in window && trackedSections.length > 0) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const activeHref = '#' + entry.target.id;
          navLinksTracked.forEach(link => {
            link.classList.toggle('nav-active', link.getAttribute('href') === activeHref);
          });
        }
      });
    }, { rootMargin: '-35% 0px -58% 0px', threshold: 0 });

    trackedSections.forEach(section => sectionObserver.observe(section));
  }

  // ========================================================
  // 7. CURSOR TRAIL DE PIXELS (desktop only)
  // ========================================================
  if (window.innerWidth > 900) {
    const trailColors = ['#FDE047', '#93C5FD', '#6EE7B7', '#F87171', '#FF2D6B', '#FFFFFF'];
    let trailThrottle = false;
    document.addEventListener('mousemove', (e) => {
      if (trailThrottle) return;
      trailThrottle = true;
      setTimeout(() => { trailThrottle = false; }, 35);
      const trail = document.createElement('div');
      trail.className = 'pixel-trail';
      trail.style.cssText = `position:fixed;pointer-events:none;z-index:9990;left:${e.clientX - 4}px;top:${e.clientY - 4}px;width:8px;height:8px;background:${trailColors[Math.floor(Math.random() * trailColors.length)]};border:2px solid rgba(0,0,0,0.35);border-radius:2px;`;
      document.body.appendChild(trail);
      anime({
        targets: trail,
        translateX: () => anime.random(-25, 25),
        translateY: () => anime.random(-45, -8),
        scale: [1, 0],
        opacity: [0.9, 0],
        duration: anime.random(350, 700),
        easing: 'easeOutCubic',
        complete: () => trail.remove()
      });
    });
  }

  // ========================================================
  // 8. BURST DE PIXELS AO CLICAR EM QUALQUER BOTÃO
  // ========================================================
  const burstColors = ['#FDE047', '#FFFFFF', '#6EE7B7', '#F87171', '#93C5FD'];
  document.querySelectorAll('.btn-3d').forEach(btn => {
    btn.addEventListener('click', (e) => {
      for (let i = 0; i < 10; i++) {
        const px = document.createElement('div');
        const sz = anime.random(5, 12);
        px.style.cssText = `position:fixed;pointer-events:none;z-index:9998;left:${e.clientX}px;top:${e.clientY}px;width:${sz}px;height:${sz}px;background:${burstColors[i % burstColors.length]};border:2px solid rgba(0,0,0,0.35);border-radius:2px;transform:translate(-50%,-50%);`;
        document.body.appendChild(px);
        const angle = (i / 10) * Math.PI * 2;
        const dist = anime.random(30, 90);
        anime({
          targets: px,
          translateX: Math.cos(angle) * dist,
          translateY: Math.sin(angle) * dist,
          scale: [1.5, 0],
          opacity: [1, 0],
          rotate: () => anime.random(-180, 180),
          duration: anime.random(400, 750),
          easing: 'easeOutExpo',
          complete: () => px.remove()
        });
      }
    });
  });

  // ========================================================
  // 9. GLITCH PERIÓDICO NO LOGO
  // ========================================================
  const logoGlitchEl = document.querySelector('.logo');
  if (logoGlitchEl && window.innerWidth > 900) {
    function runGlitch() {
      anime.timeline({ easing: 'steps(4)' })
        .add({ targets: logoGlitchEl, translateX: [0, -5, 5, -3, 3, 0], duration: 280 })
        .add({ targets: logoGlitchEl, filter: ['none', 'hue-rotate(90deg)', 'hue-rotate(200deg)', 'none'], duration: 220 }, '-=280')
        .add({ targets: logoGlitchEl, opacity: [1, 0.6, 1], duration: 180 }, '-=180');
      setTimeout(runGlitch, anime.random(5000, 13000));
    }
    setTimeout(runGlitch, anime.random(4000, 8000));
  }

  // ========================================================
  // 10. CLIQUE NO HERO — PIXEL BURST NA POSIÇÃO DO CURSOR
  // ========================================================
  const heroSect = document.getElementById('hero');
  if (heroSect) {
    heroSect.addEventListener('click', (e) => {
      if (e.target.closest('.btn-3d') || e.target.closest('.hero-badge') || e.target.closest('.scroll-down')) return;
      const hColors = ['#FDE047', '#93C5FD', '#6EE7B7', '#FF2D6B', '#FFFFFF', '#F87171'];
      for (let i = 0; i < 20; i++) {
        const px = document.createElement('div');
        const sz = anime.random(6, 18);
        px.style.cssText = `position:fixed;pointer-events:none;z-index:9995;left:${e.clientX}px;top:${e.clientY}px;width:${sz}px;height:${sz}px;background:${hColors[Math.floor(Math.random() * hColors.length)]};border:2px solid rgba(0,0,0,0.4);border-radius:2px;transform:translate(-50%,-50%);`;
        document.body.appendChild(px);
        const angle = Math.random() * Math.PI * 2;
        const dist = anime.random(60, 200);
        anime({
          targets: px,
          translateX: Math.cos(angle) * dist,
          translateY: Math.sin(angle) * dist,
          scale: [1.5, 0],
          opacity: [1, 0],
          rotate: () => anime.random(-360, 360),
          duration: anime.random(500, 1100),
          easing: 'easeOutExpo',
          complete: () => px.remove()
        });
      }
    });
  }

  // ========================================================
  // 11. SCRAMBLE DE TEXTO NOS TÍTULOS (ao entrar no viewport)
  // ========================================================
  const scrChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%*';
  function scrambleText(el, finalText, duration) {
    const totalFrames = Math.floor(duration / 50);
    let frame = 0;
    const timer = setInterval(() => {
      el.textContent = finalText.split('').map((ch, i) => {
        if (ch === ' ') return ' ';
        const progress = frame / totalFrames;
        const revealAt = (i / Math.max(finalText.length - 1, 1)) * 0.75;
        return progress > revealAt ? ch : scrChars[Math.floor(Math.random() * scrChars.length)];
      }).join('');
      frame++;
      if (frame >= totalFrames) { el.textContent = finalText; clearInterval(timer); }
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
  // 12. FEATURE CARDS — ícone bounce + sparks nos cantos ao clicar
  // ========================================================
  document.querySelectorAll('.feature-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      const svg = card.querySelector('.icon svg');
      if (svg) anime({ targets: svg, scale: [1, 1.5, 1], rotate: [0, -15, 15, 0], duration: 600, easing: 'easeOutElastic(1, 0.3)' });
    });
    card.addEventListener('click', () => {
      anime({ targets: card, scale: [1, 0.9, 1.08, 1], duration: 450, easing: 'easeOutElastic(1, 0.5)' });
      const sparkPos = [{ l: '4px', t: '4px' }, { l: 'calc(100% - 10px)', t: '4px' }, { l: '4px', t: 'calc(100% - 10px)' }, { l: 'calc(100% - 10px)', t: 'calc(100% - 10px)' }];
      sparkPos.forEach(pos => {
        const sp = document.createElement('div');
        sp.style.cssText = `position:absolute;pointer-events:none;z-index:20;width:6px;height:6px;background:var(--accent);border-radius:1px;left:${pos.l};top:${pos.t};opacity:0;`;
        card.appendChild(sp);
        anime({ targets: sp, scale: [0, 2.5], opacity: [1, 0], duration: 450, easing: 'easeOutExpo', complete: () => sp.remove() });
      });
    });
  });

  // ========================================================
  // 13. NAV LINKS — pixel bounce hover + pulse click
  // ========================================================
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('mouseenter', () => {
      anime({ targets: link, translateY: [-5, 0], duration: 350, easing: 'easeOutBounce' });
    });
    link.addEventListener('click', () => {
      anime({ targets: link, scale: [0.85, 1.1, 1], duration: 380, easing: 'easeOutElastic(1, 0.4)' });
    });
  });

  // ========================================================
  // 14. GALLERY ITEMS — pixel scatter no hover
  // ========================================================
  const gPxColors = ['#FDE047', '#FF2D6B', '#00FFCA', '#93C5FD', '#FFFFFF'];
  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
      for (let i = 0; i < 8; i++) {
        const px = document.createElement('div');
        px.style.cssText = `position:absolute;pointer-events:none;z-index:20;width:${anime.random(4, 12)}px;height:${anime.random(4, 12)}px;background:${gPxColors[Math.floor(Math.random() * gPxColors.length)]};left:${anime.random(5, 95)}%;top:${anime.random(5, 65)}%;border-radius:1px;opacity:0;`;
        item.appendChild(px);
        anime({ targets: px, translateY: [0, -anime.random(25, 75)], translateX: () => anime.random(-30, 30), opacity: [1, 0], scale: [1, 0], duration: anime.random(400, 900), easing: 'easeOutCubic', complete: () => px.remove() });
      }
    });
  });

  // ========================================================
  // 15. CHAR CARDS — halo de pixels flutuantes no hover
  // ========================================================
  const cHaloColors = ['#FDE047', '#93C5FD', '#6EE7B7', '#F87171'];
  document.querySelectorAll('.char-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      for (let i = 0; i < 8; i++) {
        const px = document.createElement('div');
        px.style.cssText = `position:absolute;pointer-events:none;z-index:15;width:8px;height:8px;background:${cHaloColors[Math.floor(Math.random() * cHaloColors.length)]};border:2px solid rgba(0,0,0,0.3);left:${anime.random(10, 90)}%;top:${anime.random(3, 20)}%;border-radius:2px;opacity:0;`;
        card.appendChild(px);
        anime({ targets: px, translateY: -anime.random(40, 95), translateX: () => anime.random(-30, 30), scale: [1.2, 0], opacity: [0.9, 0], duration: anime.random(600, 1100), easing: 'easeOutCubic', complete: () => px.remove() });
      }
    });
  });

  // ========================================================
  // 16. FAQ — ícone bounce + mini burst ao clicar na pergunta
  // ========================================================
  document.querySelectorAll('.faq-question').forEach(q => {
    q.addEventListener('click', () => {
      const icon = q.querySelector('.faq-icon');
      if (icon) anime({ targets: icon, scale: [1, 1.45, 1], duration: 400, easing: 'easeOutElastic(1, 0.3)' });
      const fqColors = ['#FDE047', '#6EE7B7', '#93C5FD'];
      const rect = q.getBoundingClientRect();
      for (let i = 0; i < 6; i++) {
        const px = document.createElement('div');
        px.style.cssText = `position:fixed;pointer-events:none;z-index:9999;left:${rect.right - 22}px;top:${rect.top + rect.height / 2}px;width:6px;height:6px;background:${fqColors[i % fqColors.length]};border-radius:1px;transform:translate(-50%,-50%);opacity:0;`;
        document.body.appendChild(px);
        anime({ targets: px, translateX: () => anime.random(-45, 45), translateY: () => anime.random(-35, 35), scale: [1, 0], opacity: [1, 0], duration: anime.random(400, 700), easing: 'easeOutCubic', complete: () => px.remove() });
      }
    });
  });

  // ========================================================
  // 17. MILESTONE DATES — pulse de entrada (após GSAP)
  // ========================================================
  if ('IntersectionObserver' in window) {
    const msObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.pulsed) {
          entry.target.dataset.pulsed = '1';
          const dateEl = entry.target.querySelector('.milestone-date');
          if (dateEl) setTimeout(() => anime({ targets: dateEl, scale: [1, 1.18, 1], boxShadow: ['0 0 0 rgba(239,68,68,0)', '0 0 22px rgba(239,68,68,0.55)', '0 0 0 rgba(239,68,68,0)'], duration: 650, easing: 'easeOutElastic(1, 0.4)' }), 750);
        }
      });
    }, { threshold: 0.5 });
    document.querySelectorAll('.milestone').forEach(m => msObs.observe(m));
  }

  // ========================================================
  // 18. FORMULÁRIO — submit com pixel celebration
  // ========================================================
  const evalForm = document.querySelector('#avaliacao form');
  if (evalForm) {
    evalForm.removeAttribute('onsubmit');
    evalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = evalForm.querySelector('button[type="submit"]');
      anime.timeline()
        .add({ targets: submitBtn, scale: [1, 0.88, 1.16, 1], rotate: [0, -7, 7, 0], duration: 720, easing: 'easeOutElastic(1, 0.4)' });
      const rect2 = submitBtn.getBoundingClientRect();
      const celColors = ['#FDE047', '#6EE7B7', '#93C5FD', '#FFFFFF', '#F87171', '#FF2D6B'];
      for (let i = 0; i < 26; i++) {
        const px = document.createElement('div');
        const sz = anime.random(6, 20);
        px.style.cssText = `position:fixed;pointer-events:none;z-index:9999;left:${rect2.left + rect2.width / 2}px;top:${rect2.top + rect2.height / 2}px;width:${sz}px;height:${sz}px;background:${celColors[Math.floor(Math.random() * celColors.length)]};border:2px solid rgba(0,0,0,0.3);border-radius:2px;transform:translate(-50%,-50%);`;
        document.body.appendChild(px);
        const angle = (i / 26) * Math.PI * 2;
        const dist = anime.random(80, 220);
        anime({ targets: px, translateX: Math.cos(angle) * dist, translateY: Math.sin(angle) * dist, scale: [1.5, 0], opacity: [1, 0], rotate: () => anime.random(-360, 360), duration: anime.random(700, 1400), easing: 'easeOutExpo', complete: () => px.remove() });
      }
      setTimeout(() => alert('Feedback enviado com sucesso! Muito obrigado pela avaliação.'), 650);
    });
  }

  // ========================================================
  // 19. LOGO — clique dispara wave nas letras + scroll ao topo
  // ========================================================
  const logoWaveEl = document.querySelector('.logo');
  if (logoWaveEl) {
    logoWaveEl.addEventListener('click', (e) => {
      e.preventDefault();
      const saved = logoWaveEl.innerHTML;
      logoWaveEl.innerHTML = 'ECOS'.split('').map(c => `<span style="display:inline-block">${c}</span>`).join('') + '<span style="display:inline-block">.</span>';
      anime({
        targets: logoWaveEl.querySelectorAll('span'),
        translateY: [0, -18, 0],
        color: ['currentColor', '#FDE047', 'currentColor'],
        duration: 700,
        delay: anime.stagger(70),
        easing: 'easeOutElastic(1, 0.5)',
        complete: () => { logoWaveEl.innerHTML = saved; window.scrollTo({ top: 0, behavior: 'smooth' }); }
      });
    });
  }

  // ========================================================
  // 20. HERO — estrelas piscantes extras
  // ========================================================
  const heroPCont = document.getElementById('anime-particles');
  if (heroPCont) {
    for (let i = 0; i < 20; i++) {
      const star = document.createElement('div');
      const sz = anime.random(3, 7);
      star.style.cssText = `position:absolute;left:${anime.random(0, 100)}%;top:${anime.random(0, 100)}%;width:${sz}px;height:${sz}px;background:#FFFFFF;border-radius:1px;opacity:0;pointer-events:none;`;
      heroPCont.appendChild(star);
      anime({ targets: star, opacity: [0, 0.95, 0], scale: [0, 1.6, 0], rotate: () => anime.random(0, 45), duration: () => anime.random(1200, 3500), delay: () => anime.random(0, 5000), loop: true, easing: 'easeInOutSine' });
    }
  }

  // ========================================================
  // 21. SHIMMER AO ENTRAR EM CADA SEÇÃO
  // ========================================================
  if ('IntersectionObserver' in window) {
    const shimObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.shimmered) {
          entry.target.dataset.shimmered = '1';
          const ov = document.createElement('div');
          ov.style.cssText = 'position:absolute;inset:0;background:rgba(255,255,255,0.05);pointer-events:none;z-index:50;';
          const prevPos = entry.target.style.position;
          if (!prevPos || prevPos === 'static') entry.target.style.position = 'relative';
          entry.target.appendChild(ov);
          anime({ targets: ov, opacity: [0, 1, 0], duration: 700, easing: 'easeOutCubic', complete: () => ov.remove() });
        }
      });
    }, { threshold: 0.25 });
    document.querySelectorAll('section').forEach(s => shimObs.observe(s));
  }

  // ========================================================
  // 22. DEV CARDS — hover spark no avatar
  // ========================================================
  document.querySelectorAll('.dev-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      const av = card.querySelector('.dev-avatar');
      if (av) anime({ targets: av, scale: [1, 1.08, 1], rotate: [0, -5, 5, 0], duration: 500, easing: 'easeOutElastic(1, 0.4)' });
    });
  });

  // ========================================================
  // 23. SCROLL-DOWN ARROW — batida extra ao clicar
  // ========================================================
  const scrollArrow = document.querySelector('.scroll-down');
  if (scrollArrow) {
    scrollArrow.addEventListener('click', () => {
      anime({ targets: scrollArrow, scale: [1, 1.6, 1], opacity: [1, 0.4, 1], duration: 400, easing: 'easeOutElastic(1, 0.3)' });
      const colors = ['#FDE047', '#FFFFFF', '#6EE7B7'];
      for (let i = 0; i < 6; i++) {
        const px = document.createElement('div');
        const rect = scrollArrow.getBoundingClientRect();
        px.style.cssText = `position:fixed;pointer-events:none;z-index:9999;left:${rect.left + rect.width / 2}px;top:${rect.top + rect.height / 2}px;width:6px;height:6px;background:${colors[i % colors.length]};border-radius:1px;transform:translate(-50%,-50%);opacity:0;`;
        document.body.appendChild(px);
        const angle = (i / 6) * Math.PI * 2;
        anime({ targets: px, translateX: Math.cos(angle) * 40, translateY: Math.sin(angle) * 40, scale: [1, 0], opacity: [1, 0], duration: 500, easing: 'easeOutExpo', complete: () => px.remove() });
      }
    });
  }

  // ──────────────────────────────────────────────────────
  // ── Navbar: sempre visível, só esconde com scroll rápido para baixo ──
  // Usa um debounce / delta mínimo para não sumir com micro-scrolls do iOS/Safari
  let lastScroll = 0;
  let navHideTimer = null;
  const navWrapper = document.querySelector('.nav-wrapper');

  window.addEventListener('scroll', () => {
    const currentScroll = Math.max(0, window.pageYOffset || window.scrollY);
    const delta = currentScroll - lastScroll;

    // Próximo ao topo: sempre mostra
    if (currentScroll < 50) {
      gsap.to(navWrapper, { y: 0, duration: 0.4, ease: "power2.out" });
      lastScroll = currentScroll;
      return;
    }

    // Ignora micro-scrolls (barra de endereço do Safari/Chrome mobile)
    if (Math.abs(delta) < 8) return;

    const isMobile = window.innerWidth <= 900;

    if (delta > 0) {
      // Scrollando para baixo → esconde
      gsap.to(navWrapper, { y: isMobile ? 150 : -150, duration: 0.5, ease: "power2.inOut" });

      // Segurança: sempre mostra de volta após 3 s sem scroll
      clearTimeout(navHideTimer);
      navHideTimer = setTimeout(() => {
        gsap.to(navWrapper, { y: 0, duration: 0.5, ease: "power2.out" });
      }, 3000);
    } else {
      // Scrollando para cima → mostra
      clearTimeout(navHideTimer);
      gsap.to(navWrapper, { y: 0, duration: 0.4, ease: "power2.out" });
    }

    lastScroll = currentScroll;
  }, { passive: true });
});
