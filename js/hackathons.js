/**
 * Grevix Hackathons — Lenis Smooth Scroll, Scroll-Synced Parallax, Interactive Filtering & Event Modal
 */
(function () {
  'use strict';

  /* ========================================================================
     1. LENIS SMOOTH SCROLL INITIALIZATION & SCROLL-DRIVEN ANIMATIONS
     ======================================================================== */
  let lenis = null;

  const spotCopy = document.querySelector('.hk-spot-copy');
  const spotAstro = document.querySelector('.hk-spot-astro');
  const spotMarker = document.querySelector('.hk-spot-marker');
  const spotWords = document.querySelector('.hk-spot-words');
  const scrollTick = document.querySelector('.hk-spot-scroll-line i');

  if (typeof window.Lenis !== 'undefined') {
    lenis = new window.Lenis({
      duration: 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.2,
      anchors: {
        offset: 0,
        duration: 1.35
      },
      autoResize: true,
      autoToggle: true,
      allowNestedScroll: true,
      stopInertiaOnNavigate: true
    });

    window.lenis = lenis;

    // Synchronize DOM parallax & HUD indicators with Lenis interpolated scroll
    lenis.on('scroll', ({ scroll, limit, velocity, progress }) => {
      document.documentElement.style.setProperty('--lenis-scroll', scroll.toFixed(2));
      document.documentElement.style.setProperty('--lenis-progress', progress.toFixed(4));
      document.documentElement.style.setProperty('--lenis-velocity', velocity.toFixed(3));

      if (lenis.prefersReducedMotion || window.innerWidth <= 960) return;

      // Subtle layered parallax inside the upper Hack Beyond Limits hero
      const heroClamp = Math.min(scroll, window.innerHeight * 1.15);
      if (spotAstro) {
        spotAstro.style.transform = `translate3d(-50%, ${(heroClamp * 0.11).toFixed(2)}px, 0)`;
      }
      if (spotCopy) {
        spotCopy.style.transform = `translate3d(0, ${(heroClamp * -0.055).toFixed(2)}px, 0)`;
      }
      if (spotMarker) {
        spotMarker.style.transform = `translate3d(0, ${Math.min(heroClamp * 0.065, 26).toFixed(2)}px, 0)`;
      }
      if (spotWords) {
        spotWords.style.transform = `translate3d(0, ${(heroClamp * -0.035).toFixed(2)}px, 0)`;
      }
      if (scrollTick && limit > 0) {
        const travel = Math.min(1, scroll / Math.max(window.innerHeight * 0.7, 1));
        scrollTick.style.transform = `translate3d(0, ${(-travel * 22).toFixed(2)}px, 0)`;
      }
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
  }

  /* ========================================================================
     2. INTERSECTION OBSERVER FOR SMOOTH SCROLL REVEALS
     ======================================================================== */
  const revealObserver =
    'IntersectionObserver' in window
      ? new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                entry.target.classList.add('is-inview');
              }
            });
          },
          { threshold: 0.08, rootMargin: '0px 0px -20px 0px' }
        )
      : null;

  function observeRevealElements(elements) {
    elements.forEach((el, idx) => {
      el.style.transitionDelay = `${idx * 75}ms`;
      const rect = el.getBoundingClientRect();
      // Immediately reveal if already inside the current viewport
      if (rect.top < window.innerHeight * 0.96) {
        el.classList.add('is-inview');
      } else if (revealObserver) {
        el.classList.add('hk-scroll-reveal');
        revealObserver.observe(el);
      }
    });
  }

  /* ========================================================================
     3. HACKATHON LISTING DATA & FILTERING
     ======================================================================== */
  const HACKATHONS = [
    {
      id: 'grevix-aftercode-2026',
      index: '01',
      badge: '[ FLAGSHIP ]',
      brandPrefix: 'GREVIX',
      titleAccent: 'AFTERCODE',
      subtitle: 'Build. Collaborate. Ship.',
      date: 'MAR 14 - 16, 2026',
      location: 'GLOBAL (ONLINE)',
      description:
        'A global hackathon to bring together builders, creatives, and problem-solvers to turn bold ideas into real-world solutions.',
      tags: ['AI/ML', 'WEB3', 'OPEN INNOVATION', 'SUSTAINABILITY'],
      status: 'upcoming',
      format: 'online',
      beginnerFriendly: true,
      accentCorner: 'top-left',
      prizePool: '$50,000 GLOBAL PRIZE POOL',
      tracks: [
        'Autonomous AI & Multi-Agent Systems',
        'Decentralized Protocols & Consumer Web3',
        'Climate Resilience & Sustainable Compute',
        'Open Innovation & Public Goods'
      ]
    },
    {
      id: 'grevix-contra-2026',
      index: '02',
      badge: '[ SPECIAL EDITION ]',
      brandPrefix: 'GREVIX',
      titleAccent: 'CONTRA',
      subtitle: 'Ideas beyond boundaries.',
      date: 'APR 11 - 13, 2026',
      location: 'GLOBAL (ONLINE)',
      description:
        'A high-intensity hackathon to explore unconventional ideas and build solutions for a bolder, more open future.',
      tags: ['AI AGENTS', 'INFRASTRUCTURE', 'CREATIVE TECH', 'OPEN SOURCE'],
      status: 'upcoming',
      format: 'online',
      beginnerFriendly: false,
      accentCorner: 'top-right',
      prizePool: '$35,000 + COMPUTE GRANTS',
      tracks: [
        'Next-Gen Developer Infrastructure',
        'Autonomous Agent Swarms',
        'Generative & Spatial Creative Tech',
        'Zero-Trust Open Source Tooling'
      ]
    },
    {
      id: 'grevix-nexus-berlin',
      index: '03',
      badge: '[ REGIONAL SUMMIT ]',
      brandPrefix: 'GREVIX',
      titleAccent: 'NEXUS',
      subtitle: 'Hardware meets frontier code.',
      date: 'MAY 22 - 24, 2026',
      location: 'BERLIN (OFFLINE)',
      description:
        'An in-person deep-tech sprint bringing hardware hackers, systems engineers, and protocol designers under one industrial roof.',
      tags: ['ROBOTICS', 'EDGE AI', 'HARDWARE', 'SYSTEMS'],
      status: 'upcoming',
      format: 'offline',
      beginnerFriendly: false,
      accentCorner: 'top-left',
      featuredOnlyOnFilter: true,
      prizePool: '€40,000 + HARDWARE LAB ACCESS',
      tracks: [
        'Embodied AI & Robotics Control',
        'Low-Latency Edge Inference',
        'Open Silicon & Embedded Rust'
      ]
    },
    {
      id: 'grevix-genesis-2025',
      index: '04',
      badge: '[ ARCHIVE EDITION ]',
      brandPrefix: 'GREVIX',
      titleAccent: 'GENESIS',
      subtitle: 'Where the first wave shipped.',
      date: 'NOV 08 - 10, 2025',
      location: 'GLOBAL (ONLINE)',
      description:
        'Our inaugural global builder sprint uniting 3,400+ engineers and designers across 68 countries to ship 280+ working prototypes.',
      tags: ['AI/ML', 'OPEN SOURCE', 'DEVTOOLS', 'DESIGN SYSTEMS'],
      status: 'past',
      format: 'online',
      beginnerFriendly: true,
      accentCorner: 'top-right',
      prizePool: '$25,000 AWARDED (COMPLETED)',
      tracks: [
        'Foundation Model Applications',
        'Realtime Collaborative Tools',
        'Open Source Developer Experience'
      ]
    }
  ];

  const state = {
    status: 'upcoming', // 'upcoming' | 'past' | 'all'
    filter: 'all'       // 'all' | 'online' | 'offline' | 'beginner'
  };

  const listEl = document.getElementById('hk-list');
  const tabBtns = Array.from(document.querySelectorAll('.hk-tab'));
  const pillBtns = Array.from(document.querySelectorAll('.hk-pill'));
  const modalBackdrop = document.getElementById('hk-modal');
  const modalBody = document.getElementById('hk-modal-body');
  const modalClose = document.getElementById('hk-modal-close');
  const howBtn = document.getElementById('hk-how-btn');

  function getFilteredEvents() {
    return HACKATHONS.filter((ev) => {
      if (state.status === 'upcoming' && state.filter === 'all' && ev.featuredOnlyOnFilter) {
        return false;
      }

      const matchesStatus =
        state.status === 'all' ? true : ev.status === state.status;

      let matchesFilter = true;
      if (state.filter === 'online') {
        matchesFilter = ev.format === 'online';
      } else if (state.filter === 'offline') {
        matchesFilter = ev.format === 'offline';
      } else if (state.filter === 'beginner') {
        matchesFilter = ev.beginnerFriendly === true;
      }

      return matchesStatus && matchesFilter;
    });
  }

  function renderCardBorderSVG(accentCorner) {
    const isLeft = accentCorner === 'top-left';
    return `
      <svg class="hk-card-svg" viewBox="0 0 958 114" preserveAspectRatio="none" aria-hidden="true">
        <path d="M 0.6 106 L 0.6 8 L 8.6 0.6 L 949.4 0.6 L 957.4 8 L 957.4 106 L 949.4 113.4 L 8.6 113.4 Z"
              fill="none" stroke="rgba(255,255,255,0.24)" stroke-width="1"/>
        ${
          isLeft
            ? `<path d="M 0.8 29 L 0.8 8 L 8.8 0.8" fill="none" stroke="#FF4B0B" stroke-width="2.2"/>`
            : `<path d="M 957.2 8 L 957.2 31" fill="none" stroke="#FF4B0B" stroke-width="2.2"/>`
        }
        <path d="M 957.4 105.5 L 949.4 113.4" fill="none" stroke="rgba(255,255,255,0.85)" stroke-width="1.6"/>
      </svg>
    `;
  }

  function renderCards() {
    if (!listEl) return;
    const filtered = getFilteredEvents();

    if (filtered.length === 0) {
      listEl.innerHTML = `
        <div class="hk-empty">
          <p class="hk-empty-title">[ NO MATCHING HACKATHONS ]</p>
          <p class="hk-empty-sub">No events match the current filter combination. Reset filters to view active global hackathons.</p>
          <button class="hk-reset-btn" type="button" id="hk-reset-filters">RESET FILTERS</button>
        </div>
      `;
      const resetBtn = document.getElementById('hk-reset-filters');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          state.status = 'upcoming';
          state.filter = 'all';
          syncControlsUI();
          renderCards();
        });
      }
      if (lenis) lenis.resize();
      return;
    }

    listEl.innerHTML = filtered
      .map((ev, idx) => {
        const displayIdx = String(idx + 1).padStart(2, '0');
        const tagsHtml = ev.tags
          .map((tag) => `<span class="hk-tag">${tag}</span>`)
          .join('');

        return `
          <article class="hk-card" data-event-id="${ev.id}">
            ${renderCardBorderSVG(ev.accentCorner)}

            <!-- Column 1: Index Number -->
            <div class="hk-card-col hk-col-idx">
              <span class="hk-card-num">${displayIdx}</span>
              <span class="hk-card-num-bar" aria-hidden="true"></span>
            </div>

            <!-- Column 2: Event Identity -->
            <div class="hk-card-col hk-col-identity">
              <span class="hk-card-badge">${ev.badge}</span>
              <h2 class="hk-card-title">
                <span class="hk-card-brand">${ev.brandPrefix}</span>
                <span class="hk-card-accent">${ev.titleAccent}</span>
              </h2>
              <p class="hk-card-sub">${ev.subtitle}</p>
            </div>

            <!-- Column 3: Metadata, Description, Tags -->
            <div class="hk-card-col hk-col-details">
              <div class="hk-card-meta">
                <span class="hk-meta-item">
                  <svg class="hk-meta-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3" aria-hidden="true">
                    <rect x="2" y="3" width="12" height="11" rx="1"/>
                    <path d="M2 6.5h12M5.2 1.5v3M10.8 1.5v3"/>
                  </svg>
                  <span>${ev.date}</span>
                </span>
                <span class="hk-meta-item">
                  <svg class="hk-meta-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3" aria-hidden="true">
                    <path d="M8 14.2s4.5-4.1 4.5-7.7a4.5 4.5 0 1 0-9 0c0 3.6 4.5 7.7 4.5 7.7z"/>
                    <circle cx="8" cy="6.5" r="1.6"/>
                  </svg>
                  <span>${ev.location}</span>
                </span>
              </div>

              <p class="hk-card-desc">${ev.description}</p>

              <div class="hk-card-tags" aria-label="Event categories">
                ${tagsHtml}
              </div>
            </div>

            <!-- Column 4: CTA Action -->
            <div class="hk-card-col hk-col-cta">
              <button class="hk-card-cta" type="button" data-open-event="${ev.id}" aria-label="View details for ${ev.brandPrefix} ${ev.titleAccent}">
                <span class="hk-cta-circle" aria-hidden="true">
                  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M4.5 10h11M11 5.5L15.5 10 11 14.5"/>
                  </svg>
                </span>
                <span class="hk-cta-label">VIEW DETAILS</span>
              </button>
            </div>
          </article>
        `;
      })
      .join('');

    observeRevealElements(Array.from(listEl.querySelectorAll('.hk-card')));
    if (lenis) lenis.resize();
  }

  function syncControlsUI() {
    tabBtns.forEach((btn) => {
      const isActive = btn.getAttribute('data-status') === state.status;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    pillBtns.forEach((btn) => {
      const isActive = btn.getAttribute('data-filter') === state.filter;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
  }

  function openEventModal(eventId) {
    const ev = HACKATHONS.find((item) => item.id === eventId);
    if (!ev || !modalBackdrop || !modalBody) return;

    const tracksHtml = (ev.tracks || [])
      .map((t) => `<li>${t}</li>`)
      .join('');

    modalBody.innerHTML = `
      <p class="hk-modal-eyebrow">${ev.badge} // ${ev.status.toUpperCase()}</p>
      <h2 class="hk-modal-title" id="hk-modal-title">
        <span>${ev.brandPrefix}</span> <em class="hk-accent">${ev.titleAccent}</em>
      </h2>
      <p class="hk-modal-sub">${ev.subtitle}</p>
      <div class="hk-modal-meta">
        <span><strong>DATE:</strong> ${ev.date}</span>
        <span><strong>LOCATION:</strong> ${ev.location}</span>
        <span><strong>AWARDS:</strong> ${ev.prizePool}</span>
      </div>
      <p class="hk-modal-desc">${ev.description}</p>
      <div class="hk-modal-tracks">
        <h3>FEATURED TRACKS</h3>
        <ul>${tracksHtml}</ul>
      </div>
      <div class="hk-modal-footer">
        <button class="hk-modal-reg" type="button" id="hk-modal-register">
          REGISTER BUILDER PASS →
        </button>
      </div>
    `;

    modalBackdrop.hidden = false;
    modalBackdrop.setAttribute('aria-hidden', 'false');
    if (lenis) lenis.stop();

    const regBtn = document.getElementById('hk-modal-register');
    if (regBtn) {
      regBtn.addEventListener('click', () => {
        regBtn.textContent = 'REGISTRATION CONFIRMED ✓';
        regBtn.classList.add('registered');
      });
    }
  }

  function closeModal() {
    if (!modalBackdrop) return;
    modalBackdrop.hidden = true;
    modalBackdrop.setAttribute('aria-hidden', 'true');
    if (lenis) lenis.start();
  }

  // Event listeners for tabs
  tabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const nextStatus = btn.getAttribute('data-status');
      if (!nextStatus) return;
      state.status = nextStatus;
      syncControlsUI();
      renderCards();
    });
  });

  // Event listeners for filter pills
  pillBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const nextFilter = btn.getAttribute('data-filter');
      if (!nextFilter) return;
      state.filter = nextFilter;
      syncControlsUI();
      renderCards();
    });
  });

  // Delegate clicks on cards / VIEW DETAILS button
  if (listEl) {
    listEl.addEventListener('click', (e) => {
      const trigger = e.target.closest('[data-open-event]');
      if (trigger) {
        openEventModal(trigger.getAttribute('data-open-event'));
        return;
      }
      const card = e.target.closest('.hk-card');
      if (card && !e.target.closest('button, a')) {
        openEventModal(card.getAttribute('data-event-id'));
      }
    });
  }

  if (howBtn) {
    howBtn.addEventListener('click', () => {
      openEventModal('grevix-aftercode-2026');
    });
  }

  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }

  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop && !modalBackdrop.hidden) {
      closeModal();
    }
  });

  // Initial render & section reveal registration
  syncControlsUI();
  renderCards();
  observeRevealElements(
    Array.from(document.querySelectorAll('.hk-hero-left, .hk-hero-right'))
  );
})();
