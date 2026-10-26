/**
 * Portfolio Website - Bashayer Alhawsawi
 * i18n, navigation, scroll reveal and cinematic touches.
 */

let translations = {};
const translationCache = {};
const STORAGE_KEY = 'portfolio-lang';

document.addEventListener('DOMContentLoaded', async () => {
  await initI18n();
  initNavbar();
  initScrollReveal();
  initSmoothScroll();
  initStoryProgress();
  initCursor();
  initHeroStars();
  initTypewriter();
  initParallaxBgText();
});

// ===== i18n - Internationalization =====
async function initI18n() {
  let savedLang = 'en';
  try {
    savedLang = localStorage.getItem(STORAGE_KEY) || 'en';
  } catch (_) { /* storage blocked */ }
  await setLanguage(savedLang);
  initLanguageToggle();
}

async function loadTranslations(lang) {
  if (translationCache[lang]) return translationCache[lang];
  try {
    const response = await fetch(`locales/${lang}.json`);
    if (!response.ok) throw new Error(`Failed to load ${lang}.json`);
    translationCache[lang] = await response.json();
    return translationCache[lang];
  } catch (err) {
    console.error('Translation load error:', err);
    return lang === 'en' ? {} : await loadTranslations('en');
  }
}

function getNestedValue(obj, path) {
  return path.split('.').reduce((o, k) => (o && o[k] !== undefined ? o[k] : null), obj);
}

function applyTranslations(t) {
  const year = String(new Date().getFullYear());

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const value = getNestedValue(t, key);
    if (typeof value === 'string') {
      el.textContent = value.replace('{year}', year);
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
    const active = btn.dataset.lang === lang;
    btn.classList.toggle('active', active);
    btn.setAttribute('aria-pressed', String(active));
  });

  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch (_) { /* storage blocked */ }

  document.dispatchEvent(new CustomEvent('portfolio:language-changed'));
}

function initLanguageToggle() {
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      setLanguage(btn.dataset.lang);
    });
  });
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
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.addEventListener('click', () => {
      const open = navLinks.classList.toggle('active');
      navToggle.classList.toggle('active', open);
      navToggle.setAttribute('aria-expanded', String(open));
    });

    // Close menu when clicking a link
    navItems.forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Navbar: add .scrolled class for cinematic fade-in
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 80);
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

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('active');
      observer.unobserve(entry.target);
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => {
    if (!el.closest('#home')) {
      observer.observe(el);
    }
  });
}

// ===== Smooth Scroll =====
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

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

  // Native cursor is hidden only once the custom one is running
  document.documentElement.classList.add('has-custom-cursor');

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

  document.querySelectorAll('a, button, .tl-entry, .service-card').forEach(el => {
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

  const defaultPhrases = [
    "I build apps people love to open.",
    "Kotlin · Flutter · Real-time systems.",
    "From idea to shipped — I handle both.",
    "I don't stop at 'it works.'"
  ];

  // Read phrases from the active language each time, so switching language restarts in that language
  function currentPhrases() {
    const tw = translations && translations.hero && translations.hero.typewriter;
    return (Array.isArray(tw) && tw.length > 0) ? tw : defaultPhrases;
  }

  let phrases = currentPhrases();
  let phraseIdx = 0, charIdx = 0, deleting = false, timer = null;

  function schedule(fn, ms) {
    timer = setTimeout(fn, ms);
  }

  function tick() {
    const current = phrases[phraseIdx];
    if (!deleting) {
      el.textContent = current.slice(0, ++charIdx);
      if (charIdx === current.length) {
        deleting = true;
        schedule(tick, 1800);
        return;
      }
      schedule(tick, 55);
    } else {
      el.textContent = current.slice(0, --charIdx);
      if (charIdx === 0) {
        deleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        schedule(tick, 400);
        return;
      }
      schedule(tick, 30);
    }
  }

  document.addEventListener('portfolio:language-changed', () => {
    clearTimeout(timer);
    phrases = currentPhrases();
    phraseIdx = 0;
    charIdx = 0;
    deleting = false;
    el.textContent = '';
    schedule(tick, 300);
  });

  // Start after a short delay so the page feels settled
  schedule(tick, 900);
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
