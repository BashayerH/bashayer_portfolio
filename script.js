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
  initProjectImageSliders();
  initContactForm();
  initSmoothScroll();
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

  // Navbar background on scroll
  window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
      navbar.style.background = 'rgba(11, 0, 20, 0.95)';
    } else {
      navbar.style.background = 'rgba(11, 0, 20, 0.8)';
    }
  });
}

// ===== Scroll Reveal Animation =====
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal');
  const revealOnLoad = document.querySelectorAll('#home .reveal');

  // Page load: fade + slide up for hero
  revealOnLoad.forEach((el, i) => {
    setTimeout(() => {
      el.classList.add('active');
    }, 150 + i * 100);
  });

  // Scroll reveal for other sections
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
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

    if (!track || images.length <= 1) return;

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

    // Go to specific image
    function goToImage(index) {
      currentIndex = Math.max(0, Math.min(index, images.length - 1));
      const offset = -currentIndex * 100;
      track.style.transform = `translateX(${offset}%)`;
      updateDots();
    }

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
