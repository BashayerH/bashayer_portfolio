/**
 * Titanic theme layer — atmospheric enhancements.
 * Runs alongside script.js; purely additive, no content changes.
 */
(function () {
  'use strict';

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.addEventListener('DOMContentLoaded', function () {
    initSeaDust();
    initGoldRipples();
    initProwParallax();
  });

  /* ── Deep-sea dust particles drifting up through the hero ── */
  function initSeaDust() {
    var hero = document.getElementById('home');
    if (!hero) return;

    var layer = document.createElement('div');
    layer.className = 'sea-dust';
    layer.setAttribute('aria-hidden', 'true');
    // Behind hero content (z-index 2) but above the prow backdrop (z-index 0)
    hero.insertBefore(layer, hero.firstChild);

    if (reducedMotion) return;

    var count = window.innerWidth < 768 ? 18 : 34;
    for (var i = 0; i < count; i++) {
      var d = document.createElement('span');
      d.className = 'dust';
      var size = (Math.random() * 3 + 1.2).toFixed(1);
      d.style.width = size + 'px';
      d.style.height = size + 'px';
      d.style.left = (Math.random() * 100).toFixed(1) + '%';
      d.style.top = (55 + Math.random() * 45).toFixed(1) + '%';
      d.style.setProperty('--dur', (16 + Math.random() * 18).toFixed(1) + 's');
      d.style.setProperty('--delay', (-Math.random() * 24).toFixed(1) + 's');
      d.style.setProperty('--dx', ((Math.random() - 0.5) * 90).toFixed(0) + 'px');
      d.style.setProperty('--o', (0.18 + Math.random() * 0.4).toFixed(2));
      layer.appendChild(d);
    }
  }

  /* ── Soft underwater gold ripple on interactive elements ── */
  function initGoldRipples() {
    if (reducedMotion) return;

    document.addEventListener('click', function (e) {
      var host = e.target.closest('.btn, .contact-icon-link, .service-card, .tl-tag-link, .tl-tag-demo');
      if (!host) return;

      host.classList.add('ripple-host');
      var rect = host.getBoundingClientRect();
      var size = Math.max(rect.width, rect.height) * 2;
      var ripple = document.createElement('span');
      ripple.className = 'gold-ripple';
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
      host.appendChild(ripple);
      ripple.addEventListener('animationend', function () {
        ripple.remove();
      });
    });
  }

  /* ── Gentle parallax on the ship-prow backdrop ── */
  function initProwParallax() {
    if (reducedMotion) return;
    var bg = document.querySelector('.hero-bg');
    if (!bg) return;

    var ticking = false;

    function update() {
      ticking = false;
      var y = Math.min(window.scrollY, window.innerHeight) * 0.12;
      var flip = document.documentElement.dir === 'rtl' ? 'scaleX(-1) ' : '';
      bg.style.transform = flip + 'translate3d(0,' + y.toFixed(1) + 'px,0)';
    }

    window.addEventListener('scroll', function () {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }, { passive: true });

    update();
  }
})();
