/* ============================================================
   SCUBADEIVER.HU — Main JavaScript
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ─── Navbar scroll effect ─── */
  const navbar = document.querySelector('.navbar');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    if (currentScroll > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastScroll = currentScroll;
  }, { passive: true });

  /* ─── Mobile menu toggle ─── */
  const toggle = document.querySelector('.navbar-toggle');
  const links = document.querySelector('.navbar-links');
  const overlay = document.querySelector('.nav-overlay');
  const mobileCta = document.querySelector('.navbar-cta-mobile');

  function closeMenu() {
    toggle.classList.remove('active');
    links.classList.remove('open');
    if (overlay) overlay.classList.remove('active');
    if (mobileCta) mobileCta.classList.remove('visible');
    document.body.style.overflow = '';
    toggle.setAttribute('aria-expanded', 'false');
  }

  function openMenu() {
    links.classList.add('open');
    toggle.classList.add('active');
    toggle.setAttribute('aria-expanded', 'true');
    if (overlay) overlay.classList.add('active');
    if (mobileCta) mobileCta.classList.add('visible');
    document.body.style.overflow = 'hidden';
  }

  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const isOpen = links.classList.contains('open');
      if (isOpen) closeMenu(); else openMenu();
    });

    if (overlay) {
      overlay.addEventListener('click', closeMenu);
    }

    // Close on link click
    links.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMenu);
    });
  }

  /* ─── Scroll reveal animation ─── */
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('visible'));
  }

  /* ─── Timeline items ─── */
  const timelineItems = document.querySelectorAll('.timeline-item');
  if ('IntersectionObserver' in window) {
    const timelineObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          timelineObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    timelineItems.forEach(item => timelineObserver.observe(item));
  } else {
    timelineItems.forEach(item => item.classList.add('visible'));
  }

  /* ─── Specialty carousel ─── */
  const track = document.getElementById('specialtyTrack');
  const dotsContainer = document.getElementById('specialtyDots');

  if (track && dotsContainer) {
    const cards = track.querySelectorAll('.slider-card');
    const totalCards = cards.length;
    const visibleCount = 3;
    let currentIndex = 0;
    let autoInterval;
    let cachedGap;

    // Create dots
    for (let i = 0; i < totalCards; i++) {
      const dot = document.createElement('button');
      dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `${i + 1}. specialty`);
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(dot);
    }

    const dots = dotsContainer.querySelectorAll('.slider-dot');

    function getCardWidth() {
      if (cachedGap === undefined) {
        cachedGap = parseInt(getComputedStyle(track).gap);
      }
      return cards[0].offsetWidth + cachedGap;
    }

    function goToSlide(index) {
      currentIndex = index;
      const cardWidth = getCardWidth();
      const offset = -currentIndex * cardWidth;
      track.style.transform = `translateX(${offset}px)`;

      dots.forEach((d, i) => d.classList.toggle('active', i === currentIndex));
    }

    function nextSlide() {
      goToSlide((currentIndex + 1) % totalCards);
    }

    function startAutoPlay() {
      stopAutoPlay();
      autoInterval = setInterval(nextSlide, 6000);
    }

    function stopAutoPlay() {
      if (autoInterval) clearInterval(autoInterval);
    }

    // Recalculate on resize
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => goToSlide(currentIndex), 200);
    });

    // Pause on hover
    track.addEventListener('mouseenter', stopAutoPlay);
    track.addEventListener('mouseleave', startAutoPlay);

    startAutoPlay();
  }

  /* ─── AJAX form submission (Formspree) ─── */
  document.querySelectorAll('.contact-form').forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const success = form.querySelector('.form-success');
      const origText = btn.textContent;

      btn.disabled = true;
      btn.textContent = '⏳ Küldés...';

      try {
        const resp = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { 'Accept': 'application/json' }
        });

        if (resp.ok) {
          form.querySelectorAll('.form-group').forEach(g => g.style.display = 'none');
          btn.style.display = 'none';
          success.style.display = 'block';
        } else {
          alert('Hiba történt a küldés során. Kérlek próbáld újra, vagy írj emailt a chris@scubadiver.hu címre.');
          btn.disabled = false;
          btn.textContent = origText;
        }
      } catch (err) {
        alert('Hálózati hiba. Kérlek próbáld újra később.');
        btn.disabled = false;
        btn.textContent = origText;
      }
    });
  });

  /* ─── Active nav link ─── */
  const currentPath = (window.location.pathname.split('/').pop() || 'index').replace('.html', '');
  const navLinks = document.querySelectorAll('.navbar-links a');
  navLinks.forEach(link => {
    const href = (link.getAttribute('href') || '').split('#')[0].replace(/^\//, '').replace('.html', '') || 'index';
    if (href === currentPath) {
      link.classList.add('active');
    }
  });

});
