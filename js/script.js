gsap.registerPlugin(ScrollTrigger);

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
  if(window.innerWidth > 900) {
    tiltCards.forEach(card => {
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -8; // Grau de inclinação
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
      
      anime({
        targets: btn,
        translateX: x * 0.15,
        translateY: y * 0.15,
        scale: 1.05,
        duration: 150,
        easing: 'easeOutQuad'
      });
      
      const svg = btn.querySelector('svg');
      if (svg) {
        anime({
          targets: svg,
          translateX: x * 0.1,
          translateY: y * 0.1,
          duration: 150,
          easing: 'easeOutQuad'
        });
      }
    });
    
    btn.addEventListener('mouseleave', () => {
      anime({
        targets: btn,
        translateX: 0,
        translateY: 0,
        scale: 1,
        duration: 600,
        easing: 'easeOutElastic(1, .5)'
      });
      
      const svg = btn.querySelector('svg');
      if (svg) {
        anime({
          targets: svg,
          translateX: 0,
          translateY: 0,
          duration: 600,
          easing: 'easeOutElastic(1, .5)'
        });
      }
    });
  });

  // Grid Dinâmica de Fundo (Hero)
  const gridContainer = document.getElementById('stagger-grid');
  const numColumns = Math.ceil(window.innerWidth / 60);
  const numRows = Math.ceil(window.innerHeight / 60);
  const totalCells = numColumns * numRows;
  
  for(let i = 0; i < totalCells; i++) {
    let cell = document.createElement('div');
    cell.className = 'stagger-cell';
    gridContainer.appendChild(cell);
  }
  
  anime({
    targets: '.stagger-cell',
    scale: [
      {value: 0.1, easing: 'easeOutSine', duration: 800},
      {value: 1, easing: 'easeInOutQuad', duration: 1200}
    ],
    opacity: [
      {value: 0.1, easing: 'easeOutSine', duration: 800},
      {value: 0.6, easing: 'easeInOutQuad', duration: 1200}
    ],
    delay: anime.stagger(150, {grid: [numColumns, numRows], from: 'center'}),
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

  function initHeroAnimations() {
    const heroTitle = document.getElementById('hero-title');
    const text = heroTitle.innerText;
    heroTitle.innerHTML = '';
    text.split('').forEach(char => {
      let span = document.createElement('span');
      span.className = 'char';
      span.innerText = char === ' ' ? '\u00A0' : char; 
      heroTitle.appendChild(span);
    });

    let heroTimeline = anime.timeline({ easing: 'easeOutElastic(1, .5)' });
    heroTimeline.add({
      targets: '.char',
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

  const cloudsContainer = document.getElementById('clouds-container');
  for(let i=0; i<12; i++){
    let cloud = document.createElement('div');
    let type = Math.floor(Math.random() * 3) + 1; // 1, 2 or 3
    cloud.className = 'cloud cloud-type-' + type;
    
    let widthMultipliers = [10, 14, 20]; // SVG real pixel widths
    let heightMultipliers = [5, 7, 6]; // SVG real pixel heights
    
    let scale = 4 + Math.random() * 12; // pixel scale
    let w = widthMultipliers[type-1] * scale;
    let h = heightMultipliers[type-1] * scale;
    
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

  if(window.innerWidth > 900) {
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

  // Parallax Vertical - Desativado em dispositivos móveis/pequenos para evitar "tremor" (jitter)
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

  // Normalizar Scroll no Mobile (evita saltos da barra de endereços)
  // Normalizar scroll removido para permitir arraste horizontal nativo no mobile


  // Pin Horizontal (Web)
  let mm = gsap.matchMedia();
  mm.add("(min-width: 901px)", () => {
    const galleryPinWrap = document.querySelector('.gallery-pin-wrapper');
    const galleryScrollCont = document.querySelector('.horizontal-scroll-container');
    if(galleryPinWrap && galleryScrollCont) {
      let getToValue = () => -(galleryScrollCont.scrollWidth - window.innerWidth + 40);
      gsap.to(galleryScrollCont, {
        x: getToValue, ease: "none",
        scrollTrigger: { trigger: galleryPinWrap, start: "top 120px", end: () => "+=" + (galleryScrollCont.scrollWidth - window.innerWidth), pin: true, scrub: 1, invalidateOnRefresh: true }
      });
    }
  });

  window.addEventListener('load', () => ScrollTrigger.refresh());

  // ========================================================
  // 3. LÓGICAS COMUNS
  // ========================================================
  const sectionsForCoins = ['#about', '#roadmap', '#avaliacao', '#gameplay'];
  sectionsForCoins.forEach(selector => {
    const section = document.querySelector(selector);
    if(section) {
      let coinCount = window.innerWidth < 900 ? 1 : 2; 
      for(let i=0; i<coinCount; i++) {
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

      if(!isActive) {
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
  
  let lastScroll = 0;
  const navWrapper = document.querySelector('.nav-wrapper');
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    if (currentScroll < 50) {
      gsap.to(navWrapper, { y: 0, duration: 0.4, ease: "power2.out" });
      lastScroll = currentScroll;
      return;
    }

    const isMobile = window.innerWidth <= 900;
    if (currentScroll > lastScroll) {
      // Rolando para baixo - Esconder Nav
      gsap.to(navWrapper, { y: isMobile ? 150 : -150, duration: 0.5, ease: "power2.inOut" });
    } else {
      // Rolando para cima - Mostrar Nav
      gsap.to(navWrapper, { y: 0, duration: 0.4, ease: "power2.out" });
    }
    lastScroll = currentScroll;
  }, { passive: true });
});
