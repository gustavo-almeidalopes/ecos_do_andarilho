document.addEventListener("DOMContentLoaded", () => {
  // --- Navigation Scroll Handling ---
  const navbar = document.getElementById('navbar');
  const navWrapper = document.querySelector('.nav-wrapper');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Disable hide on mobile or at top of page
    if (window.innerWidth <= 768 || currentScroll < 50) {
      if (navWrapper) navWrapper.style.transform = 'translateY(0)';
      return;
    }

    if (currentScroll > lastScroll) {
      // Scrolling down - Hide
      if (navWrapper) navWrapper.style.transform = 'translateY(-150%)';
    } else {
      // Scrolling up - Show
      if (navWrapper) navWrapper.style.transform = 'translateY(0)';
    }
    lastScroll = currentScroll;
  }, { passive: true });

  // --- FAQ Accordion ---
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    const icon = question.querySelector('span');

    question.addEventListener('click', () => {
      const isOpen = answer.style.display === 'block';
      
      // Close all others
      faqItems.forEach(i => {
        i.querySelector('.faq-answer').style.display = 'none';
        i.querySelector('.faq-question span').innerText = '+';
      });

      if (!isOpen) {
        answer.style.display = 'block';
        icon.innerText = '-';
        anime({
          targets: answer,
          opacity: [0, 1],
          translateY: [-10, 0],
          duration: 300,
          easing: 'easeOutQuad'
        });
      }
    });
  });

  // --- Evaluation Form Handling ---
  const evalForm = document.getElementById('avaliacao-form');
  if (evalForm) {
    evalForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const feedback = document.getElementById('avaliacao-feedback').value;
      const btn = evalForm.querySelector('button');

      if (!feedback.trim()) return;

      btn.disabled = true;
      btn.innerText = 'Enviando...';

      try {
        const response = await fetch('/api/avaliacoes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ feedback })
        });

        if (response.ok) {
          alert('Avaliação enviada com sucesso!');
          evalForm.reset();
        } else {
          alert('Erro ao enviar avaliação. Tente novamente.');
        }
      } catch (err) {
        console.error(err);
        alert('Erro de conexão.');
      } finally {
        btn.disabled = false;
        btn.innerText = 'Enviar Avaliação';
      }
    });
  }

  // --- Parallax (Desktop Only) ---
  if (window.innerWidth > 1024) {
    gsap.registerPlugin(ScrollTrigger);
    
    gsap.utils.toArray('.vertical-parallax').forEach(el => {
      const speed = el.dataset.speed || 0.1;
      gsap.to(el, {
        y: () => window.innerHeight * speed,
        ease: "none",
        scrollTrigger: {
          trigger: el.parentElement,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });
    });
  }

  // --- Hero Animations ---
  anime({
    targets: '.hero-badge',
    opacity: [0, 1],
    translateY: [20, 0],
    duration: 800,
    easing: 'easeOutQuad'
  });

  anime({
    targets: '#hero h1',
    opacity: [0, 1],
    scale: [0.9, 1],
    delay: 200,
    duration: 1000,
    easing: 'easeOutBack'
  });

  anime({
    targets: '#hero p',
    opacity: [0, 1],
    translateY: [20, 0],
    delay: 400,
    duration: 800,
    easing: 'easeOutQuad'
  });

  anime({
    targets: '.hero-ctas',
    opacity: [0, 1],
    translateY: [20, 0],
    delay: 600,
    duration: 800,
    easing: 'easeOutQuad'
  });
});
