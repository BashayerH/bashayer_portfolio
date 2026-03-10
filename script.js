/**
 * Portfolio Website - Meriem
 * Based on info.json specification
 */

let translations = {};
const STORAGE_KEY = 'portfolio-lang';

document.addEventListener('DOMContentLoaded', async () => {
  await initI18n();
  initNavbar();
  initScrollReveal();
  initProjectFilter();
  // Initialize sliders after a short delay to ensure images are in DOM
  setTimeout(() => {
    initProjectImageSliders();
  }, 100);
  initContactForm();
  initSmoothScroll();
  initStoryProgress();
  initCursor();
  initHeroStars();
  initTypewriter();
  initParallaxBgText();
});

// ===== i18n - Internationalization =====
async function initI18n() {
  const savedLang = localStorage.getItem(STORAGE_KEY) || 'en';
  await setLanguage(savedLang);
  initLanguageToggle();
}

async function loadTranslations(lang) {
  try {
    const response = await fetch(`locales/${lang}.json`);
    if (!response.ok) throw new Error(`Failed to load ${lang}.json`);
    return await response.json();
  } catch (err) {
    console.error('Translation load error:', err);
    return lang === 'en' ? {} : await loadTranslations('en');
  }
}

function getNestedValue(obj, path) {
  return path.split('.').reduce((o, k) => (o && o[k] !== undefined ? o[k] : null), obj);
}

function applyTranslations(t) {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const value = getNestedValue(t, key);
    if (value !== null && value !== undefined) {
      el.textContent = value;
    }
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    const value = getNestedValue(t, key);
    if (value !== null && value !== undefined) {
      el.placeholder = value;
    }
  });
}

async function setLanguage(lang) {
  translations = await loadTranslations(lang);
  applyTranslations(translations);

  document.documentElement.lang = lang === 'ar' ? 'ar' : 'en';
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.setAttribute('data-lang', lang);

  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });

  localStorage.setItem(STORAGE_KEY, lang);
}

function initLanguageToggle() {
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.dataset.lang;
      setLanguage(lang);
    });
  });
}

function t(key) {
  return getNestedValue(translations, key) || key;
}

// ===== Story progress bar (scroll indicator) =====
function initStoryProgress() {
  const bar = document.getElementById('progress-bar');
  if (!bar) return;
  function updateProgress() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const percent = docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0;
    bar.style.width = percent + '%';
  }
  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();
}

// ===== Navigation =====
function initNavbar() {
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  const navItems = document.querySelectorAll('.nav-links a');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      navToggle.classList.toggle('active');
    });

    // Close menu when clicking a link
    navItems.forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        navToggle.classList.remove('active');
      });
    });
  }

  // Navbar: add .scrolled class for cinematic fade-in
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });
}

// ===== Scroll Reveal Animation =====
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal, .reveal-left');
  const revealOnLoad = document.querySelectorAll('#home .reveal');

  // Page load: staggered entrance for hero elements
  revealOnLoad.forEach((el, i) => {
    setTimeout(() => {
      el.classList.add('active');
    }, 200 + i * 120);
  });

  // Scroll reveal for other sections
  const observerOptions = {
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Re-apply slider position when project card becomes visible
        if (entry.target.classList.contains('project-card')) {
          const track = entry.target.querySelector('.project-images-track');
          if (track && track._sliderGoToImage) {
            const idx = track._sliderCurrentIndex ?? 0;
            requestAnimationFrame(() => {
              track._sliderGoToImage(idx);
            });
          }
        }
      }
    });
  }, observerOptions);

  revealElements.forEach(el => {
    if (!el.closest('#home')) {
      observer.observe(el);
    }
  });
}

// ===== Project Filter =====
function initProjectFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Filter projects
      projectCards.forEach(card => {
        const category = card.dataset.category;
        const show =
          filter === 'all' ||
          (filter === 'web' && category === 'web') ||
          (filter === 'mobile' && category === 'mobile');

        card.style.display = show ? 'block' : 'none';
        card.style.animation = show ? 'fadeIn 0.5s ease forwards' : 'none';
      });
    });
  });
}

// ===== Project Image Sliders =====
function initProjectImageSliders() {
  const projectCards = document.querySelectorAll('.project-card');

  projectCards.forEach(card => {
    const track = card.querySelector('.project-images-track');
    const images = card.querySelectorAll('.project-image');
    const prevBtn = card.querySelector('.project-prev');
    const nextBtn = card.querySelector('.project-next');
    const dotsContainer = card.querySelector('.project-dots');

    if (!track || !prevBtn || !nextBtn || !dotsContainer) return;
    
    // Count only images that have valid src (not broken)
    const validImages = Array.from(images).filter(img => {
      const imgEl = img.querySelector('img');
      return imgEl && imgEl.src;
    });
    
    if (validImages.length <= 1) {
      // Hide navigation if only one or no images
      prevBtn.style.display = 'none';
      nextBtn.style.display = 'none';
      dotsContainer.style.display = 'none';
      return;
    }

    // Track width = n * 100% of slider; each slide = (100/n)% of track so one slide fills viewport
    const n = images.length;
    track.style.width = `${n * 100}%`;
    images.forEach((imgContainer) => {
      imgContainer.style.flex = `0 0 ${100 / n}%`;
    });

    // Add error handling and re-apply position when images load (fixes layout shift "show then go")
    function reapplyPosition() {
      requestAnimationFrame(() => {
        if (track._sliderGoToImage) track._sliderGoToImage(currentIndex);
      });
    }
    images.forEach((imgContainer, index) => {
      const img = imgContainer.querySelector('img');
      if (img) {
        img.addEventListener('error', function() {
          console.error(`❌ Failed to load image ${index + 1}:`, img.src);
        });
        img.addEventListener('load', reapplyPosition);
      }
    });

    let currentIndex = 0;

    // Create dots
    images.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.classList.add('project-dot');
      dot.setAttribute('aria-label', `Image ${index + 1}`);
      if (index === 0) dot.classList.add('active');
      dot.addEventListener('click', (e) => {
        e.stopPropagation();
        goToImage(index);
      });
      dotsContainer.appendChild(dot);
    });

    // Update dots
    function updateDots() {
      const dots = dotsContainer.querySelectorAll('.project-dot');
      dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
      });
    }

    // Go to specific image (each slide is 100/n % of track, so move by that per slide)
    function goToImage(index) {
      currentIndex = Math.max(0, Math.min(index, images.length - 1));
      track._sliderCurrentIndex = currentIndex;
      const percentPerSlide = 100 / n;
      const offset = -currentIndex * percentPerSlide;
      track.style.transform = `translateX(${offset}%)`;
      updateDots();
    }

    // Set initial position so first image shows immediately (no transition yet)
    goToImage(0);
    track._sliderGoToImage = goToImage;
    requestAnimationFrame(() => {
      track.classList.add('slider-ready');
    });

    // Re-apply position on resize so slide stays correct
    window.addEventListener('resize', reapplyPosition);

    // Event listeners
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (currentIndex > 0) {
        goToImage(currentIndex - 1);
      }
    });

    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (currentIndex < images.length - 1) {
        goToImage(currentIndex + 1);
      }
    });

    // Touch/Swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    track.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    });

    track.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    });

    function handleSwipe() {
      const swipeThreshold = 50;
      if (touchEndX < touchStartX - swipeThreshold && currentIndex < images.length - 1) {
        goToImage(currentIndex + 1);
      }
      if (touchEndX > touchStartX + swipeThreshold && currentIndex > 0) {
        goToImage(currentIndex - 1);
      }
    }
  });
}

// Old slider function (removed)
function initProjectSlider() {
  // This function is no longer needed
  console.log('Project image sliders initialized');
}

// ===== Contact Form =====
function initContactForm() {
  const form = document.querySelector('.contact-form');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = form.querySelector('#name').value;
      const email = form.querySelector('#email').value;
      const message = form.querySelector('#message').value;

      // Simulate form submission (replace with actual backend)
      console.log('Form submitted:', { name, email, message });

      // Show success feedback
      const btn = form.querySelector('button[type="submit"]');
      const originalText = t('contact.send');
      btn.textContent = t('contact.sent');
      btn.style.background = 'linear-gradient(135deg, #00E5FF, #9B4DFF)';

      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
        form.reset();
      }, 2000);
    });
  }
}

// ===== Smooth Scroll =====
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;

      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

// Add fadeIn animation for filtered projects
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;
document.head.appendChild(style);

// ═══════════════════════════════════════════════════
// CINEMATIC ADDITIONS — from cinematic-ux-redesign.html
// ═══════════════════════════════════════════════════

// ── Custom Cursor ──
function initCursor() {
  const cursor = document.getElementById('cursor');
  const ring = document.getElementById('cursor-ring');
  if (!cursor || !ring) return;

  // Only on hover-capable pointer devices
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    cursor.style.display = 'none';
    ring.style.display = 'none';
    return;
  }

  let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = (mouseX - 4) + 'px';
    cursor.style.top = (mouseY - 4) + 'px';
  });

  function animateRing() {
    ringX += (mouseX - ringX - 18) * 0.15;
    ringY += (mouseY - ringY - 18) * 0.15;
    ring.style.left = ringX + 'px';
    ring.style.top = ringY + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  document.querySelectorAll('a, button, .scene-card, .project-card, .service-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      ring.style.width = '56px';
      ring.style.height = '56px';
    });
    el.addEventListener('mouseleave', () => {
      ring.style.width = '36px';
      ring.style.height = '36px';
    });
  });
}

// ── Hero Stars ──
function initHeroStars() {
  const container = document.getElementById('hero-stars');
  if (!container) return;

  // Respect reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  for (let i = 0; i < 65; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    const size = Math.random() * 2 + 0.5;
    star.style.cssText = `
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      width: ${size}px;
      height: ${size}px;
      opacity: ${Math.random() * 0.55 + 0.08};
      animation: breathe ${(Math.random() * 4 + 2).toFixed(1)}s ease-in-out infinite;
      animation-delay: ${(Math.random() * 4).toFixed(1)}s;
    `;
    container.appendChild(star);
  }
}

// ── Hero Typewriter ──
function initTypewriter() {
  const el = document.getElementById('typewriter-text');
  if (!el) return;

  // Pull phrases from loaded translations; fall back to English defaults
  const phrases = [
    t('I build apps people love to open.') || "I build apps people love to open.",
    t('Kotlin · Flutter · Scalable systems.') || "Kotlin · Flutter · Real-time systems.",
    t('Engineering apps that feel effortless') || "From idea to shipped — I handle both.",
    t('Because good software should feel invisible') || "I don't stop at 'it works.'"
  ];

  let phraseIdx = 0, charIdx = 0, deleting = false;

  function tick() {
    const current = phrases[phraseIdx];
    if (!deleting) {
      el.textContent = current.slice(0, ++charIdx);
      if (charIdx === current.length) {
        deleting = true;
        setTimeout(tick, 1800);
        return;
      }
      setTimeout(tick, 55);
    } else {
      el.textContent = current.slice(0, --charIdx);
      if (charIdx === 0) {
        deleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        setTimeout(tick, 400);
        return;
      }
      setTimeout(tick, 30);
    }
  }

  // Start after a short delay so the page feels settled
  setTimeout(tick, 900);
}

// ── Parallax BG Text ──
function initParallaxBgText() {
  const bgText = document.querySelector('.bg-text');
  if (!bgText) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    bgText.style.transform = `translate(-50%, calc(-50% + ${scrolled * 0.14}px))`;
  }, { passive: true });
}
