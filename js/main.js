/* =============================================================
   Anija Jones Daniel Chandra — Portfolio behaviour
   Vanilla JS, no dependencies.
   ============================================================= */
(function () {
  'use strict';

  var docEl = document.documentElement;
  var body = document.body;

  /* -------------------- Footer year -------------------- */
  var yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  /* -------------------- Mobile navigation -------------------- */
  var navToggle = document.getElementById('navToggle');
  var primaryNav = document.getElementById('primaryNav');

  function setNav(open) {
    if (!navToggle || !primaryNav) return;
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    navToggle.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
    primaryNav.classList.toggle('is-open', open);
  }

  if (navToggle && primaryNav) {
    navToggle.addEventListener('click', function () {
      setNav(navToggle.getAttribute('aria-expanded') !== 'true');
    });

    // Close the menu after choosing a section
    primaryNav.addEventListener('click', function (event) {
      if (event.target.closest('a')) setNav(false);
    });

    // Close on Escape
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && navToggle.getAttribute('aria-expanded') === 'true') {
        setNav(false);
        navToggle.focus();
      }
    });

    // Close when clicking outside
    document.addEventListener('click', function (event) {
      if (navToggle.getAttribute('aria-expanded') !== 'true') return;
      if (primaryNav.contains(event.target) || navToggle.contains(event.target)) return;
      setNav(false);
    });

    // Reset state when returning to desktop width
    window.addEventListener('resize', function () {
      if (window.innerWidth > 860) setNav(false);
    });
  }

  /* -------------------- Smooth scrolling with sticky-header offset -------------------- */
  var header = document.getElementById('siteHeader');
  var headerOffset = function () {
    return header ? header.offsetHeight + 12 : 0;
  };

  function scrollToTarget(target) {
    var top = target.getBoundingClientRect().top + window.pageYOffset - headerOffset();
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: Math.max(top, 0), behavior: reduceMotion ? 'auto' : 'smooth' });
  }

  document.addEventListener('click', function (event) {
    var link = event.target.closest('a[href^="#"]');
    if (!link) return;

    var hash = link.getAttribute('href');
    if (!hash || hash === '#') return;

    var target = document.querySelector(hash);
    if (!target) return;

    event.preventDefault();
    scrollToTarget(target);

    if (history.replaceState) {
      history.replaceState(null, '', hash);
    }
    // Keep keyboard focus in sync with the visual jump
    target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  });

  /* -------------------- Scroll spy -------------------- */
  var navLinks = Array.prototype.slice.call(
    document.querySelectorAll('.primary-nav a[href^="#"]')
  );

  var spyTargets = navLinks
    .map(function (link) {
      var id = link.getAttribute('href').slice(1);
      var section = document.getElementById(id);
      return section ? { link: link, section: section } : null;
    })
    .filter(Boolean);

  function updateActiveLink() {
    var probe = window.pageYOffset + headerOffset() + 24;
    var currentId = spyTargets.length ? spyTargets[0].section.id : null;

    for (var i = 0; i < spyTargets.length; i++) {
      if (spyTargets[i].section.offsetTop <= probe) {
        currentId = spyTargets[i].section.id;
      }
    }

    // Near the bottom of the page, always highlight the last tracked section
    if (window.innerHeight + window.pageYOffset >= docEl.scrollHeight - 4 && spyTargets.length) {
      currentId = spyTargets[spyTargets.length - 1].section.id;
    }

    navLinks.forEach(function (link) {
      link.classList.toggle('is-active', link.getAttribute('href') === '#' + currentId);
    });
  }

  /* -------------------- Reveal on scroll -------------------- */
  var revealTargets = Array.prototype.slice.call(
    document.querySelectorAll('.section-head, .bullet-list > li, .chip-grid > li, .skill-card, .role, .project-list > li, .timeline-list > li, .referee-card, .contact-card')
  );

  var supportsReveal = 'IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (supportsReveal) {
    revealTargets.forEach(function (el, index) {
      el.classList.add('reveal');
      el.style.transitionDelay = (index % 6) * 55 + 'ms';
    });

    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.06 }
    );

    revealTargets.forEach(function (el) { revealObserver.observe(el); });
  }

  /* -------------------- Back to top -------------------- */
  var toTop = document.getElementById('toTop');

  if (toTop) {
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

/* -------------------- Download Resume -------------------- */
var printBtn = document.getElementById('printBtn');

if (printBtn) {
  printBtn.addEventListener('click', function () {
    const link = document.createElement('a');
    link.href = 'assets/Resume.pdf';
    link.download = 'Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
}

  /* -------------------- Throttled scroll handler -------------------- */
  var ticking = false;

  function onScroll() {
    if (ticking) return;
    ticking = true;

    window.requestAnimationFrame(function () {
      updateActiveLink();
      if (toTop) {
        toTop.classList.toggle('is-visible', window.pageYOffset > 500);
      }
      ticking = false;
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);

  updateActiveLink();
  onScroll();

  // Ensure no stray focus outline on programmatically focused sections
  body.addEventListener('blur', function (event) {
    if (event.target && event.target.hasAttribute && event.target.hasAttribute('tabindex')) {
      event.target.style.outline = 'none';
    }
  }, true);
})();