// script.js
// Slider + arrows + swipe support + hamburger accessibility

document.addEventListener('DOMContentLoaded', () => {
  // ---------- SLIDER ----------
  const slides = Array.from(document.querySelectorAll('.slide'));
  let current = 0;

  function showSlide(index) {
    if (!slides.length) return;
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => slide.classList.toggle('active', i === current));
  }

  // Next / Prev buttons — guard with existence checks
  const nextBtn = document.querySelector('.nav.next');
  const prevBtn = document.querySelector('.nav.prev');

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      showSlide(current + 1);
    });
  }
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      showSlide(current - 1);
    });
  }

  // Keyboard navigation (left/right)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
      showSlide(current + 1);
    } else if (e.key === 'ArrowLeft') {
      showSlide(current - 1);
    }
  });

  // Touch / swipe support for mobile
  (function addSwipeSupport() {
    if (!slides.length) return;
    const slider = document.querySelector('.slider');
    if (!slider) return;

    let startX = 0;
    let endX = 0;
    const threshold = 40; // minimum px to consider swipe

    slider.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
    }, {passive: true});

    slider.addEventListener('touchmove', (e) => {
      endX = e.touches[0].clientX;
    }, {passive: true});

    slider.addEventListener('touchend', () => {
      const diff = endX - startX;
      if (Math.abs(diff) > threshold) {
        if (diff < 0) { // left swipe => next
          showSlide(current + 1);
        } else { // right swipe => prev
          showSlide(current - 1);
        }
      }
      startX = 0;
      endX = 0;
    });
  })();

  // initial show
  showSlide(current);


  // ---------- HAMBURGER NAV ----------
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');

  if (hamburger && navLinks) {
    // toggle function
    const toggleNav = () => {
      const open = navLinks.classList.toggle('open');
      hamburger.classList.toggle('active', open);
      // accessibility attributes
      hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
      navLinks.setAttribute('aria-hidden', open ? 'false' : 'true');
    };

    hamburger.addEventListener('click', toggleNav);
    // close with Esc
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        navLinks.classList.remove('open');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        navLinks.setAttribute('aria-hidden', 'true');
      }
    });

    // close when clicking a nav link (optional)
    document.querySelectorAll('.nav-links a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        navLinks.setAttribute('aria-hidden', 'true');
      });
    });

    // keep mobile/desktop states consistent on resize
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        // If we're at desktop width, ensure mobile menu closed.
        if (window.innerWidth > 900) {
          navLinks.classList.remove('open');
          hamburger.classList.remove('active');
          hamburger.setAttribute('aria-expanded', 'false');
          navLinks.setAttribute('aria-hidden', 'false');
        } else {
          // Keep hidden by default on small screens
          navLinks.setAttribute('aria-hidden', navLinks.classList.contains('open') ? 'false' : 'true');
        }
      }, 120);
    });
  }

  // ensure nav-links aria state initial
  if (navLinks) {
    navLinks.setAttribute('aria-hidden', navLinks.classList.contains('open') ? 'false' : 'true');
  }
});
