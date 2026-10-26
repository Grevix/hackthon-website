/**
 * GREVIX COMMUNITY PORTAL
 * - Official Lenis + GSAP ScrollTrigger synchronization
 * - 4-Phase Reversible Pinned Spatial Tunnel Timeline (0% -> 20% -> 35% -> 75% -> 100%)
 * - Card-origin Pathway Experience Overlay (CONNECT, LEARN, COLLABORATE, GROW)
 */
(function () {
  'use strict';

  /* ========================================================================
     1. PATHWAY EXPERIENCE DATA (4 DISTINCT DESTINATIONS)
     ======================================================================== */
  const PATHWAYS = {
    connect: {
      code: '01 // CONNECT PATHWAY',
      kicker: '[ PATHWAY 01 — GLOBAL BUILDER NETWORK ]',
      title: 'CONNECT WITH BUILDERS WORLDWIDE.',
      lead:
        'Access regional builder chapters, real-time technical channels, and curated peer introductions across the global Grevix network.',
      primaryCta: 'JOIN GLOBAL DISCORD & MATRIX CHANNELS →',
      confirmedText: 'CHANNEL ACCESS INITIALIZED ✓',
      secondaryLinkText: 'EXPLORE UPCOMING GLOBAL HACKATHONS →',
      secondaryHref: 'hackathons.html',
      cards: [
        {
          tag: 'NODE 01 // REGIONAL HUBS',
          title: 'CITY BUILDER CHAPTERS',
          desc: 'Connect with local engineers, researchers, and designers hosting monthly hardware/software co-working sprints.',
          meta: 'ACTIVE IN AMER · EMEA · APAC · INDIA'
        },
        {
          tag: 'NODE 02 // TECHNICAL GUILDS',
          title: 'DOMAIN CHANNELS',
          desc: 'Dedicated low-noise rooms for Autonomous AI, Distributed Systems, Creative Shaders, Web3 Protocols, and Climate Tech.',
          meta: '24/7 PEER CODE & ARCHITECTURE REVIEW'
        },
        {
          tag: 'NODE 03 // DIRECTORY',
          title: 'BUILDER MATCH PROTOCOL',
          desc: 'Filter fellow builders by stack, timezone, and past hackathon ships to form long-term technical partnerships.',
          meta: '10K+ VERIFIED BUILDER PROFILES'
        }
      ]
    },
    learn: {
      code: '02 // LEARN PATHWAY',
      kicker: '[ PATHWAY 02 — WORKSHOPS, AMAS & DEEP DIVES ]',
      title: 'SHARPEN YOUR CRAFT AT THE FRONTIER.',
      lead:
        'Participate in live architectural teardowns, interactive shader & systems workshops, and candid AMAs with protocol creators.',
      primaryCta: 'RSVP FOR NEXT LIVE TECHNICAL SESSION →',
      confirmedText: 'SESSION SEAT RESERVED ✓',
      secondaryLinkText: 'VIEW HACKATHON PREP TRACKS →',
      secondaryHref: 'hackathons.html',
      cards: [
        {
          tag: 'LIVE WORKSHOP // FRI 17:00 UTC',
          title: 'MULTI-AGENT ORCHESTRATION',
          desc: 'Hands-on systems lab building deterministic tool-use loops, memory graphs, and low-latency evaluation harnesses.',
          meta: 'INSTRUCTOR: CORE AI ARCHITECTURE GUILD'
        },
        {
          tag: 'TECHNICAL AMA // TUE 18:00 UTC',
          title: 'CREATIVE WEBGL & SPATIAL UI',
          desc: 'Deep dive into GPU-accelerated DOM synchronization, custom GLSL post-processing, and 60fps scroll choreography.',
          meta: 'INSTRUCTOR: CREATIVE TECH FELLOWS'
        },
        {
          tag: 'OPEN LAB // ON-DEMAND',
          title: 'SYSTEMS & RUST CLINIC',
          desc: 'Weekly peer-led code reviews covering embedded Rust, zero-copy networking, and high-throughput backend design.',
          meta: 'OPEN TO ALL SKILL LEVELS'
        }
      ]
    },
    collaborate: {
      code: '03 // COLLABORATE PATHWAY',
      kicker: '[ PATHWAY 03 — SQUAD FORMATION & OPEN SOURCE ]',
      title: 'FIND TEAMMATES & SHIP REAL SYSTEMS.',
      lead:
        'Match with complementary engineers and designers before hackathons begin, or contribute directly to active Grevix open-source repositories.',
      primaryCta: 'LAUNCH SQUAD MATCHMAKER →',
      confirmedText: 'SQUAD PROFILE ACTIVATED ✓',
      secondaryLinkText: 'REGISTER FOR GREVIX AFTERCODE →',
      secondaryHref: 'hackathons.html',
      cards: [
        {
          tag: 'SQUAD BOARD // GREVIX AFTERCODE',
          title: 'HACKATHON TEAM FORMATION',
          desc: 'Browse open squad slots looking for Frontend/Shader Engineers, AI Systems Builders, and Product Designers.',
          meta: 'MAR 14 - 16, 2026 // GLOBAL ONLINE'
        },
        {
          tag: 'OPEN SOURCE // BOUNTY REPOS',
          title: 'COMMUNITY COMMONS',
          desc: 'Co-author open-source developer tools, evaluation benchmarks, and starter templates used across Grevix events.',
          meta: '100+ IDEAS TURNED INTO IMPACT'
        },
        {
          tag: 'CO-BUILD // SPRINT ROOMS',
          title: 'WEEKEND SHIP ROOMS',
          desc: '48-hour focused co-building rooms with live checkpoints, demo feedback, and instant peer testing.',
          meta: 'EVERY SATURDAY & SUNDAY'
        }
      ]
    },
    grow: {
      code: '04 // GROW PATHWAY',
      kicker: '[ PATHWAY 04 — MENTORSHIP, GRANTS & OPPORTUNITIES ]',
      title: 'ACCELERATE FROM PROTOTYPE TO IMPACT.',
      lead:
        'Take your hackathon project beyond the weekend with 1-on-1 mentorship, compute & micro-grants, and direct introductions to frontier teams.',
      primaryCta: 'APPLY FOR MENTORSHIP & COMPUTE GRANTS →',
      confirmedText: 'APPLICATION PORTAL UNLOCKED ✓',
      secondaryLinkText: 'EXPLORE FLAGSHIP PRIZE TRACKS →',
      secondaryHref: 'hackathons.html',
      cards: [
        {
          tag: 'MENTORSHIP // 1-ON-1 OFFICE HOURS',
          title: 'PRINCIPAL ENGINEER TRACK',
          desc: 'Book direct architecture, security, and product feedback sessions with staff engineers and technical founders.',
          meta: 'BI-WEEKLY COHORT MATCHING'
        },
        {
          tag: 'GRANTS // POST-HACKATHON CONTINUATION',
          title: 'MICRO-GRANTS & COMPUTE',
          desc: 'Receive non-dilutive micro-grants and GPU compute credits to turn promising hackathon prototypes into production releases.',
          meta: 'FOR TOP COMMUNITY SHIPS'
        },
        {
          tag: 'OPPORTUNITIES // FELLOWSHIP',
          title: 'BUILDER CAREER NETWORK',
          desc: 'Direct portfolio-first introductions to engineering-led startups, research labs, and open-source foundations.',
          meta: 'VERIFIED BY SHIPPED CODE'
        }
      ]
    }
  };

  /* ========================================================================
     2. DOM REFERENCES
     ======================================================================== */
  const headerEl = document.getElementById('cm-header');
  const headerIdxEl = document.getElementById('cm-header-idx');
  const pinSection = document.getElementById('cm-portal-pin');
  const gridLayer = document.getElementById('cm-grid-layer');
  const portalCore = document.getElementById('cm-portal-core');
  const bhCanvas = document.getElementById('cm-bh-canvas');
  const bhRing = document.getElementById('cm-bh-ring');
  const bhLens = document.getElementById('cm-bh-lens');
  const wallLeft = document.getElementById('cm-wall-left');
  const wallRight = document.getElementById('cm-wall-right');
  const hudLeft = document.getElementById('cm-hud-left');
  const hudRight = document.getElementById('cm-hud-right');
  const cardsStage = document.getElementById('cm-cards-stage');
  const cards = [
    document.getElementById('cm-card-1'),
    document.getElementById('cm-card-2'),
    document.getElementById('cm-card-3'),
    document.getElementById('cm-card-4')
  ];
  const stepItems = Array.from(document.querySelectorAll('.cm-step-item'));
  const progFillLeft = document.getElementById('cm-prog-fill-left');
  const progFillRight = document.getElementById('cm-prog-fill-right');
  const progDot = document.getElementById('cm-prog-dot');
  const progReadout = document.getElementById('cm-prog-readout');

  const overlayBackdrop = document.getElementById('cm-overlay');
  const overlayPanel = document.getElementById('cm-overlay-panel');
  const overlayCode = document.getElementById('cm-ov-code');
  const overlayBody = document.getElementById('cm-ov-body');
  const overlayClose = document.getElementById('cm-ov-close');
  const overlayTabs = Array.from(document.querySelectorAll('.cm-ov-tab'));

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ========================================================================
     2B. HIGH-CONTRAST HALFTONE STIPPLED BLACK HOLE CANVAS RENDERER
     ======================================================================== */
  function renderHalftoneBlackHole() {
    if (!bhCanvas) return;
    const ctx = bhCanvas.getContext('2d');
    if (!ctx) return;

    const W = bhCanvas.width;   // 560
    const H = bhCanvas.height;  // 360
    const cx = 290;
    const cy = 186;

    ctx.clearRect(0, 0, W, H);

    // Deterministic PRNG for organic stipple distribution
    let seed = 42197;
    function rand() {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      return seed / 4294967296;
    }

    // 1. Far-Wall Architectural Stipple & Dark Corner Masses
    ctx.fillStyle = '#080808';
    // Bottom-left dark stepped mass
    ctx.fillRect(10, 210, 88, 128);
    ctx.fillRect(98, 266, 56, 72);
    // Top-left dark stepped mass
    ctx.fillRect(14, 48, 66, 96);
    // Top-right stepped pixel glitch blocks
    ctx.fillRect(320, 18, 92, 28);
    ctx.fillRect(382, 46, 58, 42);
    // Right/bottom-right dark architectural mass
    ctx.fillRect(468, 72, 74, 96);
    ctx.fillRect(452, 218, 92, 120);

    // 2. Vivid Orange Far-Wall Architectural Pixel Blocks (matching target image)
    ctx.fillStyle = '#FF4B16';
    ctx.fillRect(14, 52, 34, 42);      // left-top orange block
    ctx.fillRect(82, 232, 32, 38);     // bottom-left orange square
    ctx.fillRect(356, 36, 42, 46);     // top-right swirl orange block
    ctx.fillRect(474, 32, 48, 22);     // far top-right orange bar
    ctx.fillRect(512, 54, 24, 34);     // far top-right vertical tick
    ctx.fillRect(508, 238, 26, 26);    // bottom-right orange square

    // 3. Swirling Black Ink Crest on Upper-Left Vortex Arm
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(-0.28);
    ctx.beginPath();
    ctx.arc(-18, -14, 152, Math.PI * 0.92, Math.PI * 1.92);
    ctx.arc(4, -2, 118, Math.PI * 1.92, Math.PI * 0.92, true);
    ctx.closePath();
    ctx.fillStyle = '#080808';
    ctx.fill();
    ctx.restore();

    // 4. Ivory Accretion Ring Base (Bright Negative Space Swirl around Singularity)
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(-0.18);
    ctx.beginPath();
    ctx.ellipse(-6, 4, 158, 134, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#F3F0E8';
    ctx.fill();
    ctx.restore();

    // Re-carve upper-left sweeping black vortex arm
    ctx.save();
    ctx.translate(cx, cy);
    ctx.beginPath();
    ctx.arc(-12, -10, 144, Math.PI * 1.05, Math.PI * 1.86);
    ctx.arc(2, 0, 108, Math.PI * 1.86, Math.PI * 1.05, true);
    ctx.closePath();
    ctx.fillStyle = '#080808';
    ctx.fill();
    ctx.restore();

    // 5. Thousands of Organic Spiral Halftone Stipple Dots & Ink Splatter in Accretion Cloud
    for (let i = 0; i < 6200; i++) {
      const t = rand();
      const r = 96 + Math.pow(t, 0.82) * 98;
      const baseAngle = rand() * Math.PI * 2;
      // Logarithmic spiral twist
      const angle = baseAngle + (r - 96) * 0.018;
      const ex = cx + Math.cos(angle) * r * 1.16;
      const ey = cy + Math.sin(angle) * r * 0.94;

      if (ex < 8 || ex > W - 8 || ey < 12 || ey > H - 12) continue;

      // Spiral density modulation for gritty ink bands
      const spiralWave = Math.sin(angle * 3 - r * 0.085);
      const isOrangeZone =
        (angle > -1.05 && angle < -0.25 && r > 112 && r < 156 && rand() < 0.28) ||
        (angle > 2.35 && angle < 3.05 && r > 118 && r < 168 && rand() < 0.24);

      if (isOrangeZone) {
        ctx.fillStyle = '#FF4B16';
        const sz = 1.2 + rand() * 2.4;
        ctx.fillRect(ex, ey, sz, sz);
      } else if (spiralWave > -0.15 || rand() < 0.45) {
        ctx.fillStyle = '#080808';
        const dotR = 0.65 + rand() * 1.65;
        ctx.beginPath();
        ctx.arc(ex, ey, dotR, 0, Math.PI * 2);
        ctx.fill();
      } else if (r > 115 && rand() < 0.35) {
        ctx.fillStyle = '#F3F0E8';
        const dotR = 0.7 + rand() * 1.4;
        ctx.beginPath();
        ctx.arc(ex, ey, dotR, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // 6. Central Black Hole Singularity with Concentric Halftone Inner Rim Shading
    // Pure black singularity core
    ctx.beginPath();
    ctx.arc(cx, cy, 108, 0, Math.PI * 2);
    ctx.fillStyle = '#040404';
    ctx.fill();

    // Outer razor ivory photon ring
    ctx.beginPath();
    ctx.arc(cx, cy, 109.5, 0, Math.PI * 2);
    ctx.strokeStyle = '#F3F0E8';
    ctx.lineWidth = 2.2;
    ctx.stroke();

    // Inner Halftone Dot-Matrix Rim (matches the stippled spherical inner rim in target image)
    for (let ring = 0; ring < 15; ring++) {
      const r = 105.5 - ring * 2.1;
      const circumference = 2 * Math.PI * r;
      const steps = Math.floor(circumference / 3.4);
      const fade = 1 - ring / 15;

      for (let s = 0; s < steps; s++) {
        const a = (s / steps) * Math.PI * 2 + (ring % 2) * 0.04;
        // Stronger illumination on lower-right and upper-left inner rim
        const rimLight = 0.55 + 0.45 * Math.cos(a - 0.65);
        const dotRadius = Math.max(0.25, fade * rimLight * 1.35);
        if (dotRadius < 0.32) continue;

        const dx = cx + Math.cos(a) * r;
        const dy = cy + Math.sin(a) * r;
        ctx.beginPath();
        ctx.arc(dx, dy, dotRadius, 0, Math.PI * 2);
        ctx.fillStyle = ring < 3 ? '#F3F0E8' : 'rgba(243, 240, 232, 0.78)';
        ctx.fill();
      }
    }
  }

  /* ========================================================================
     3. UNIFIED FLOATING-POINT TRACKPAD, WHEEL, TOUCH & SCROLLBAR ENGINE
     ======================================================================== */
  const hasGSAP = typeof window.gsap !== 'undefined';
  if (hasGSAP && typeof window.ScrollTrigger !== 'undefined') {
    window.gsap.registerPlugin(window.ScrollTrigger);
  }

  let portalTimeline = null;
  let targetProgress = 0;
  let currentProgress = 0;
  let isOverlayOpen = false;
  let isProgrammaticScroll = false;
  let lastWheelInputTime = 0;

  function getMaxScroll() {
    return Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  }

  /* ========================================================================
     4. PROGRESS BAR & STEP INDICATOR SYNCHRONIZATION (REVERSIBLE)
     ======================================================================== */
  function updatePortalTelemetry(progress) {
    const clamped = Math.max(0, Math.min(1, progress));
    const pct = (clamped * 100).toFixed(1);

    // Determine active step 01..04 from scroll progress:
    // 0% - 29%: 01 | 30% - 49%: 02 | 50% - 67%: 03 | 68% - 100%: 04
    let stepNum = 1;
    if (clamped >= 0.68) stepNum = 4;
    else if (clamped >= 0.50) stepNum = 3;
    else if (clamped >= 0.30) stepNum = 2;

    const formattedStep = String(stepNum).padStart(2, '0');

    if (progFillLeft) progFillLeft.style.width = `${pct}%`;
    if (progDot) progDot.style.left = `${pct}%`;
    if (progFillRight) {
      const rightPct = Math.min(100, Math.max(25, stepNum * 25));
      progFillRight.style.width = `${rightPct}%`;
    }
    if (progReadout) {
      progReadout.innerHTML = `[ <em>${formattedStep}</em> ]`;
    }
    // Keep top header index fixed at 03. (Community is page 03)
    if (headerIdxEl) {
      headerIdxEl.textContent = '03.';
    }
    if (headerEl) {
      headerEl.classList.toggle('is-compact', clamped > 0.03);
    }

    stepItems.forEach((item) => {
      const itemStep = Number(item.getAttribute('data-step'));
      item.classList.toggle('active', itemStep === stepNum);
    });

    // Enable pointer-events & active styling as each card emerges on scroll
    const visibleThresholds = [0.08, 0.26, 0.44, 0.62];
    const emergedThresholds = [0.20, 0.38, 0.56, 0.74];
    cards.forEach((card, idx) => {
      if (!card) return;
      card.classList.toggle('is-visible', clamped >= visibleThresholds[idx]);
      card.classList.toggle('is-emerged', clamped >= emergedThresholds[idx]);
    });
  }

  /* ========================================================================
     5. 4-PHASE REVERSIBLE GSAP PORTAL TIMELINE (0 -> 100)
     ======================================================================== */
  function buildPortalScrollTimeline() {
    if (!hasGSAP || !pinSection) return;

    const gsap = window.gsap;

    // Mobile narrow layout fallback
    if (window.innerWidth <= 768) {
      cards.forEach((c) => {
        if (!c) return;
        c.style.opacity = '1';
        c.classList.add('is-visible', 'is-emerged');
      });
      updatePortalTelemetry(0);
      return;
    }

    // Start all 4 cards completely hidden below the portal floor at scroll = 0%
    gsap.set(cards, {
      yPercent: 95,
      scale: 0.74,
      opacity: 0,
      force3D: true
    });

    // Subtle idle orbital oscillation on accretion ring so the portal feels alive at 0%
    gsap.to('#cm-bh-ring', {
      rotation: 4,
      scale: 1.025,
      duration: 4.5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      transformOrigin: '50% 50%'
    });

    // Paused master timeline driven directly at 60/120fps by currentProgress (0..1)
    const tl = gsap.timeline({ paused: true });
    portalTimeline = tl;

    /* ----------------------------------------------------------------------
       PHASE 1 & 2: ENTER PORTAL TUNNEL & EVENT HORIZON (0% -> 85%)
       ---------------------------------------------------------------------- */
    tl.to(
      gridLayer,
      { scale: 1.06, ease: 'none', duration: 85, force3D: true },
      0
    )
      .to(
        wallLeft,
        { xPercent: -2.2, scale: 1.02, ease: 'none', duration: 85, force3D: true },
        0
      )
      .to(
        wallRight,
        { xPercent: 2.2, scale: 1.02, ease: 'none', duration: 85, force3D: true },
        0
      )
      .to(
        '.cm-right-astro-wrap',
        { yPercent: -2, scale: 1.02, ease: 'none', duration: 85, force3D: true },
        0
      )
      .to(
        portalCore,
        { scale: 1.14, yPercent: -2, ease: 'none', duration: 85, force3D: true },
        0
      )
      .to(
        '.cm-frag-tl',
        { xPercent: -35, yPercent: -25, rotation: -18, scale: 1.15, duration: 85, ease: 'none', force3D: true },
        0
      )
      .to(
        '.cm-frag-tr',
        { xPercent: 35, yPercent: -25, rotation: 22, scale: 1.15, duration: 85, ease: 'none', force3D: true },
        0
      )
      .to(
        '.cm-frag-bl',
        { xPercent: -40, yPercent: 25, rotation: 16, scale: 1.15, duration: 85, ease: 'none', force3D: true },
        0
      )
      .to(
        '.cm-frag-br',
        { xPercent: 40, yPercent: 25, rotation: -20, scale: 1.15, duration: 85, ease: 'none', force3D: true },
        0
      )
      .fromTo(
        bhLens,
        { scale: 0.55, opacity: 0 },
        { scale: 1.45, opacity: 0.55, ease: 'power2.out', duration: 22, immediateRender: false, force3D: true },
        8
      )
      .to(
        bhLens,
        { scale: 1.9, opacity: 0.0, ease: 'power2.in', duration: 30, force3D: true },
        30
      );

    /* ----------------------------------------------------------------------
       PHASE 3: COMMUNITY CARDS EMERGE ONE BY ONE ON SCROLL (8% -> 84%)
       - At 0% scroll, all 4 cards are hidden (opacity: 0, yPercent: 95)
       - Card 01 (CONNECT):     8%  -> 28%
       - Card 02 (LEARN):       26% -> 46%
       - Card 03 (COLLABORATE): 44% -> 64%
       - Card 04 (GROW):        62% -> 82%
       ---------------------------------------------------------------------- */
    tl.to(
      cards[0],
      {
        yPercent: 0,
        scale: 1,
        opacity: 1,
        ease: 'power2.out',
        duration: 20,
        force3D: true
      },
      8
    )
      .to(
        cards[1],
        {
          yPercent: 0,
          scale: 1,
          opacity: 1,
          ease: 'power2.out',
          duration: 20,
          force3D: true
        },
        26
      )
      .to(
        cards[2],
        {
          yPercent: 0,
          scale: 1,
          opacity: 1,
          ease: 'power2.out',
          duration: 20,
          force3D: true
        },
        44
      )
      .to(
        cards[3],
        {
          yPercent: 0,
          scale: 1,
          opacity: 1,
          ease: 'power2.out',
          duration: 20,
          force3D: true
        },
        62
      );

    /* ----------------------------------------------------------------------
       PHASE 4: SETTLE INTO THE COMMUNITY (82% -> 100%)
       ---------------------------------------------------------------------- */
    tl.to(
      portalCore,
      { scale: 1.1, yPercent: -1, ease: 'power1.out', duration: 18, force3D: true },
      82
    );

    // Bind laptop trackpad, mouse wheel, touch, keyboard, and native scrollbar
    const virtualScrollRange = () => Math.max(850, window.innerHeight * 1.35);

    window.addEventListener(
      'wheel',
      (e) => {
        if (isOverlayOpen || window.innerWidth <= 768) return;
        if (e.ctrlKey) return; // allow browser pinch-zoom

        e.preventDefault();
        lastWheelInputTime = performance.now();

        // Support both vertical and horizontal/diagonal two-finger trackpad swipes
        const primaryDelta =
          Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
        const modeMult =
          e.deltaMode === 1 ? 18 : e.deltaMode === 2 ? window.innerHeight : 1;
        const deltaPx = primaryDelta * modeMult;

        targetProgress = Math.max(
          0,
          Math.min(1, targetProgress + deltaPx / virtualScrollRange())
        );
      },
      { passive: false }
    );

    let touchStartY = 0;
    let touchStartX = 0;
    window.addEventListener(
      'touchstart',
      (e) => {
        if (isOverlayOpen || !e.touches || !e.touches[0]) return;
        touchStartY = e.touches[0].clientY;
        touchStartX = e.touches[0].clientX;
      },
      { passive: true }
    );

    window.addEventListener(
      'touchmove',
      (e) => {
        if (isOverlayOpen || window.innerWidth <= 768 || !e.touches || !e.touches[0]) return;
        const cy = e.touches[0].clientY;
        const cx = e.touches[0].clientX;
        const dy = touchStartY - cy;
        const dx = touchStartX - cx;
        touchStartY = cy;
        touchStartX = cx;

        const delta = Math.abs(dy) >= Math.abs(dx) ? dy : dx;
        lastWheelInputTime = performance.now();
        targetProgress = Math.max(
          0,
          Math.min(1, targetProgress + (delta * 1.6) / virtualScrollRange())
        );
      },
      { passive: true }
    );

    window.addEventListener('keydown', (e) => {
      if (isOverlayOpen || window.innerWidth <= 768) return;
      if (['ArrowDown', 'PageDown', ' '].includes(e.key)) {
        e.preventDefault();
        lastWheelInputTime = performance.now();
        targetProgress = Math.min(1, targetProgress + 0.16);
      } else if (['ArrowUp', 'PageUp'].includes(e.key)) {
        e.preventDefault();
        lastWheelInputTime = performance.now();
        targetProgress = Math.max(0, targetProgress - 0.16);
      } else if (e.key === 'Home') {
        e.preventDefault();
        lastWheelInputTime = performance.now();
        targetProgress = 0;
      } else if (e.key === 'End') {
        e.preventDefault();
        lastWheelInputTime = performance.now();
        targetProgress = 1;
      }
    });

    // Sync if the user drags the native browser scrollbar directly
    window.addEventListener(
      'scroll',
      () => {
        if (isOverlayOpen || window.innerWidth <= 768) return;
        if (isProgrammaticScroll) return;
        if (performance.now() - lastWheelInputTime < 140) return;

        const maxS = getMaxScroll();
        if (maxS > 1) {
          targetProgress = Math.max(0, Math.min(1, window.scrollY / maxS));
        }
      },
      { passive: true }
    );

    // Continuous 60/120fps smooth interpolation loop
    function tickPortal() {
      if (!isOverlayOpen && window.innerWidth > 768) {
        const diff = targetProgress - currentProgress;
        if (Math.abs(diff) > 0.0001) {
          currentProgress += diff * 0.11;
          if (Math.abs(targetProgress - currentProgress) < 0.0002) {
            currentProgress = targetProgress;
          }
          if (portalTimeline) {
            portalTimeline.progress(currentProgress);
          }
          updatePortalTelemetry(currentProgress);

          // Sync native scrollbar thumb position when driven by trackpad/wheel
          if (performance.now() - lastWheelInputTime < 600) {
            const maxS = getMaxScroll();
            isProgrammaticScroll = true;
            window.scrollTo({ top: currentProgress * maxS, behavior: 'instant' });
            requestAnimationFrame(() => {
              isProgrammaticScroll = false;
            });
          }
        }
      }
      requestAnimationFrame(tickPortal);
    }
    requestAnimationFrame(tickPortal);
  }

  /* ========================================================================
     6. INTERACTIVE PATHWAY EXPERIENCE OVERLAY (CARD-ORIGIN EXPANSION)
     ======================================================================== */
  let activePathwayKey = null;
  let lastTriggerEl = null;

  function renderPathwayContent(pathwayKey) {
    const data = PATHWAYS[pathwayKey];
    if (!data || !overlayBody) return;

    if (overlayCode) overlayCode.textContent = data.code;

    overlayTabs.forEach((tab) => {
      const isMatch = tab.getAttribute('data-switch-pathway') === pathwayKey;
      tab.classList.toggle('active', isMatch);
      tab.setAttribute('aria-selected', isMatch ? 'true' : 'false');
    });

    const cardsHtml = data.cards
      .map(
        (c) => `
        <article class="cm-ov-card">
          <div>
            <span class="cm-ov-card-tag">${c.tag}</span>
            <h3>${c.title}</h3>
            <p>${c.desc}</p>
          </div>
          <div class="cm-ov-card-meta">${c.meta}</div>
        </article>
      `
      )
      .join('');

    overlayBody.innerHTML = `
      <div class="cm-ov-hero">
        <p class="cm-ov-kicker">${data.kicker}</p>
        <h2 class="cm-ov-title" id="cm-ov-title">${data.title}</h2>
        <p class="cm-ov-lead">${data.lead}</p>
      </div>
      <div class="cm-ov-grid">
        ${cardsHtml}
      </div>
      <div class="cm-ov-actions">
        <button class="cm-ov-primary-btn" type="button" id="cm-ov-action-btn">
          ${data.primaryCta}
        </button>
        <a class="cm-ov-secondary-link" href="${data.secondaryHref}">
          ${data.secondaryLinkText}
        </a>
      </div>
    `;

    const actionBtn = document.getElementById('cm-ov-action-btn');
    if (actionBtn) {
      actionBtn.addEventListener('click', () => {
        actionBtn.textContent = data.confirmedText;
        actionBtn.classList.add('is-confirmed');
      });
    }

    if (hasGSAP && !prefersReducedMotion) {
      window.gsap.fromTo(
        overlayBody.querySelectorAll('.cm-ov-hero, .cm-ov-card, .cm-ov-actions'),
        { y: 18, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.42, stagger: 0.06, ease: 'power2.out' }
      );
    }
  }

  function openPathwayOverlay(pathwayKey, originEl, pushHistory = true) {
    if (!PATHWAYS[pathwayKey] || !overlayBackdrop || !overlayPanel) return;

    activePathwayKey = pathwayKey;
    lastTriggerEl = originEl || document.querySelector(`.cm-card[data-pathway="${pathwayKey}"]`);

    // Highlight origin card and recede sibling cards
    cards.forEach((c) => {
      if (!c) return;
      c.classList.toggle('is-selected-origin', c === lastTriggerEl);
    });
    if (cardsStage) cardsStage.classList.add('has-active-overlay');

    renderPathwayContent(pathwayKey);

    overlayBackdrop.hidden = false;
    overlayBackdrop.setAttribute('aria-hidden', 'false');
    isOverlayOpen = true;

    if (pushHistory && window.history && window.history.pushState) {
      window.history.pushState({ pathway: pathwayKey }, '', `#${pathwayKey}`);
    }

    // Animate expansion from selected card's screen position
    if (hasGSAP && lastTriggerEl) {
      const cardRect = lastTriggerEl.getBoundingClientRect();
      const panelRect = overlayPanel.getBoundingClientRect();
      const dx = cardRect.left + cardRect.width / 2 - (panelRect.left + panelRect.width / 2);
      const dy = cardRect.top + cardRect.height / 2 - (panelRect.top + panelRect.height / 2);
      const scaleX = Math.max(0.25, cardRect.width / Math.max(panelRect.width, 1));
      const scaleY = Math.max(0.25, cardRect.height / Math.max(panelRect.height, 1));

      window.gsap.fromTo(
        overlayBackdrop,
        { opacity: 0 },
        { opacity: 1, duration: 0.28, ease: 'power2.out' }
      );
      window.gsap.fromTo(
        overlayPanel,
        { x: dx * 0.45, y: dy * 0.45, scaleX, scaleY, opacity: 0.2 },
        { x: 0, y: 0, scaleX: 1, scaleY: 1, opacity: 1, duration: 0.42, ease: 'expo.out' }
      );
    }

    if (overlayClose) overlayClose.focus();
  }

  function closePathwayOverlay(fromPopState = false) {
    if (!overlayBackdrop || overlayBackdrop.hidden) return;

    const finishClose = () => {
      overlayBackdrop.hidden = true;
      overlayBackdrop.setAttribute('aria-hidden', 'true');
      if (cardsStage) cardsStage.classList.remove('has-active-overlay');
      cards.forEach((c) => c && c.classList.remove('is-selected-origin'));
      activePathwayKey = null;
      isOverlayOpen = false;
      if (lastTriggerEl && typeof lastTriggerEl.focus === 'function') {
        lastTriggerEl.focus({ preventScroll: true });
      }
    };

    if (!fromPopState && window.location.hash && PATHWAYS[window.location.hash.slice(1)]) {
      if (window.history && window.history.pushState) {
        window.history.pushState(null, '', window.location.pathname + window.location.search);
      }
    }

    if (hasGSAP) {
      window.gsap.to(overlayPanel, {
        scale: 0.92,
        opacity: 0,
        duration: 0.22,
        ease: 'power2.in',
        onComplete: () => {
          window.gsap.set(overlayPanel, { clearProps: 'all' });
          finishClose();
        }
      });
    } else {
      finishClose();
    }
  }

  // Bind click & keyboard events to all [data-pathway] cards and hub items
  document.querySelectorAll('[data-pathway]').forEach((el) => {
    el.addEventListener('click', () => {
      const key = el.getAttribute('data-pathway');
      openPathwayOverlay(key, el, true);
    });
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const key = el.getAttribute('data-pathway');
        openPathwayOverlay(key, el, true);
      }
    });
  });

  // Switcher tabs inside overlay
  overlayTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const nextKey = tab.getAttribute('data-switch-pathway');
      if (nextKey && PATHWAYS[nextKey]) {
        activePathwayKey = nextKey;
        renderPathwayContent(nextKey);
        if (window.history && window.history.replaceState) {
          window.history.replaceState({ pathway: nextKey }, '', `#${nextKey}`);
        }
      }
    });
  });

  if (overlayClose) {
    overlayClose.addEventListener('click', () => closePathwayOverlay(false));
  }

  if (overlayBackdrop) {
    overlayBackdrop.addEventListener('click', (e) => {
      if (e.target === overlayBackdrop) closePathwayOverlay(false);
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlayBackdrop && !overlayBackdrop.hidden) {
      closePathwayOverlay(false);
    }
  });

  window.addEventListener('popstate', () => {
    const hashKey = window.location.hash.replace('#', '');
    if (PATHWAYS[hashKey]) {
      openPathwayOverlay(hashKey, null, false);
    } else if (overlayBackdrop && !overlayBackdrop.hidden) {
      closePathwayOverlay(true);
    }
  });

  // Handle [data-scroll-to] links (JOIN / ABOUT)
  document.querySelectorAll('[data-scroll-to]').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      openPathwayOverlay('connect', cards[0] || link, true);
    });
  });

  /* ========================================================================
     6B. SMOOTH STEP RAIL NAVIGATION, PROGRESS SCRUBBING & 3D CARD TILT
     ======================================================================== */
  function scrollToPortalRatio(ratio) {
    lastWheelInputTime = performance.now();
    targetProgress = Math.max(0, Math.min(1, ratio));
  }

  // Click any step on the right-hand rail (01..04) to smoothly glide to that card phase
  const stepRatios = { 1: 0.25, 2: 0.45, 3: 0.63, 4: 0.85 };
  stepItems.forEach((item) => {
    item.addEventListener('click', () => {
      const stepNum = Number(item.getAttribute('data-step')) || 1;
      scrollToPortalRatio(stepRatios[stepNum] ?? 0);
    });
  });

  // Click anywhere along the footer progress track to scrub smoothly
  document.querySelectorAll('.cm-prog-track').forEach((track) => {
    track.addEventListener('click', (e) => {
      const rect = track.getBoundingClientRect();
      if (rect.width <= 0) return;
      const ratio = (e.clientX - rect.left) / rect.width;
      scrollToPortalRatio(ratio);
    });
  });

  // 3D magnetic tilt & specular spotlight tracking on each pathway card
  cards.forEach((card) => {
    if (!card) return;
    card.addEventListener('pointermove', (e) => {
      const rect = card.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      const nx = (e.clientX - rect.left) / rect.width;
      const ny = (e.clientY - rect.top) / rect.height;
      const rx = ((0.5 - ny) * 8).toFixed(2);
      const ry = ((nx - 0.5) * 10).toFixed(2);
      card.style.setProperty('--card-rx', `${rx}deg`);
      card.style.setProperty('--card-ry', `${ry}deg`);
      card.style.setProperty('--card-glow-x', `${(nx * 100).toFixed(1)}%`);
      card.style.setProperty('--card-glow-y', `${(ny * 100).toFixed(1)}%`);
    });

    card.addEventListener('pointerleave', () => {
      card.style.setProperty('--card-rx', '0deg');
      card.style.setProperty('--card-ry', '0deg');
      card.style.setProperty('--card-glow-x', '50%');
      card.style.setProperty('--card-glow-y', '0%');
    });
  });

  /* ========================================================================
     7. INITIALIZE & REFRESH AFTER FONTS / IMAGES SETTLE
     ======================================================================== */
  renderHalftoneBlackHole();
  buildPortalScrollTimeline();
  updatePortalTelemetry(0);

  window.addEventListener('load', () => {
    const params = new URLSearchParams(window.location.search);
    const scrollParam = params.get('scroll');
    if (scrollParam !== null && portalTimeline) {
      const ratio = Math.max(0, Math.min(1, parseFloat(scrollParam) || 0));
      lastWheelInputTime = performance.now();
      targetProgress = ratio;
      currentProgress = ratio;
      portalTimeline.progress(ratio);
      updatePortalTelemetry(ratio);
    }
    const initialHash = window.location.hash.replace('#', '');
    if (PATHWAYS[initialHash]) {
      openPathwayOverlay(initialHash, null, false);
    }
  });
})();
