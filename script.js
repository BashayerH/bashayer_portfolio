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
        // Re-apply slider position when project card becomes visible (fixes "show then gone")
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
