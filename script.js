/* ===================================================================
   STARBUCKS LANDING PAGE — Interactive Script
   =================================================================== */

(() => {
  'use strict';

  // ────────────── DRINK DATA ──────────────
  const drinks = [
    {
      img: 'img/img1.png',
      desc: 'Experience the perfect blend of rich flavors and artisan craftsmanship in every sip. Our signature Matcha Crème Frappuccino — bold, refreshing, unforgettable.',
      glowColor: '#00704A'
    },
    {
      img: 'img/img2.png',
      desc: 'A spring-inspired creation featuring cherry blossom strawberry flavors, white chocolate shavings, and delicate pink whipped cream.',
      glowColor: '#E8A0BF'
    },
    {
      img: 'img/img3.png',
      desc: 'Dive into a magical color-changing experience. Mango meets blue drizzle in a fairy-tale blend that shimmers and surprises with every sip.',
      glowColor: '#C154C1'
    }
  ];

  let currentDrink = 0;

  // ────────────── DOM REFS ──────────────
  const navbar       = document.getElementById('navbar');
  const navToggle    = document.getElementById('navToggle');
  const navLinks     = document.getElementById('navLinks');
  const productImg   = document.getElementById('productImg');
  const productGlow  = document.getElementById('productGlow');
  const heroDesc     = document.getElementById('heroDesc');
  const highlight    = document.getElementById('brandHighlight');
  const thumbs       = document.querySelectorAll('.drink-thumb');
  const statNumbers  = document.querySelectorAll('.stat-number');

  // ────────────── NAVBAR SCROLL ──────────────
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        navbar.classList.toggle('scrolled', window.scrollY > 40);
        ticking = false;
      });
      ticking = true;
    }
  });

  // ────────────── MOBILE NAV ──────────────
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.classList.toggle('active');
    navToggle.setAttribute('aria-expanded', isOpen);
  });

  // Close mobile nav on link click
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  // ────────────── ACTIVE NAV HIGHLIGHT ──────────────
  const sections = document.querySelectorAll('section[id]');
  const navLinkEls = document.querySelectorAll('.nav-link');

  const observerNav = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinkEls.forEach(l => {
            l.classList.toggle('active', l.getAttribute('href') === `#${id}`);
          });
        }
      });
    },
    { rootMargin: '-40% 0px -55% 0px' }
  );

  sections.forEach(sec => observerNav.observe(sec));

  // ────────────── DRINK SWITCHER ──────────────
  function switchDrink(index) {
    if (index === currentDrink) return;
    currentDrink = index;
    const drink = drinks[index];

    // Animate product out
    productImg.style.opacity = '0';
    productImg.style.transform = 'scale(0.85) translateY(20px)';

    // Fade description
    heroDesc.style.opacity = '0';

    setTimeout(() => {
      productImg.src = drink.img;
      heroDesc.textContent = drink.desc;
      productGlow.style.background = `radial-gradient(circle, ${drink.glowColor} 0%, transparent 70%)`;

      // Animate product in
      requestAnimationFrame(() => {
        productImg.style.opacity = '1';
        productImg.style.transform = 'scale(1) translateY(0)';
        heroDesc.style.opacity = '1';
      });
    }, 350);

    // Update thumbnails
    thumbs.forEach((t, i) => t.classList.toggle('active', i === index));
  }

  thumbs.forEach((thumb, i) => {
    thumb.addEventListener('click', () => switchDrink(i));
  });

  // Auto-cycle drinks every 6s
  let autoTimer = setInterval(() => {
    switchDrink((currentDrink + 1) % drinks.length);
  }, 6000);

  // Pause auto-cycle on hover / interaction
  const heroSection = document.getElementById('hero');
  heroSection.addEventListener('mouseenter', () => clearInterval(autoTimer));
  heroSection.addEventListener('mouseleave', () => {
    autoTimer = setInterval(() => {
      switchDrink((currentDrink + 1) % drinks.length);
    }, 6000);
  });

  // ────────────── SCROLL REVEAL ──────────────
  const revealElements = document.querySelectorAll('.reveal-left, .reveal-right, .reveal-up');

  const revealObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  revealElements.forEach(el => revealObserver.observe(el));

  // Also reveal highlight underline
  if (highlight) {
    const hlObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          highlight.classList.add('visible');
          hlObserver.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    hlObserver.observe(highlight);
  }

  // ────────────── COUNTER ANIMATION ──────────────
  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const duration = 2000;
    const start = performance.now();

    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      el.textContent = Math.floor(eased * target).toLocaleString();
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  const statsObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          statsObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );

  statNumbers.forEach(n => statsObserver.observe(n));

  // ────────────── SMOOTH SCROLL FIX (for buttons) ──────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

})();
