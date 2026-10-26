// Lando Norris-style Transient Fluid Ribbon Reveal:
// - Effortless hover interaction: simply glide your laptop touchpad/mouse over the astronaut (NO clicking/holding required).
// - Spring-smoothed cursor follower produces giant, sweeping, liquid-like brush ribbons (~25%–38% of the astronaut's width).
// - Transient wake: the revealed monochrome region stays bold briefly (~0.65s) and smoothly contracts & dissolves back to the original astronaut over ~1.6s.
(() => {
  const wrap = document.getElementById('astro');
  if (!wrap) return;
  const fx = wrap.querySelector('.astro-fx');
  const BASE = wrap.querySelector('.astro-base');
  const ORIG_SRC = 'images/Futuristic%20Astronaut%20Three-Quarter%20Render.png';
  const CUTOUT_SRC = 'images/Monochrome%20Cybernetic%20Astronaut%20Cutout.png';
  const SOLDIER_SRC = 'images/Monochrome%20Cybernetic%20Astronaut%20Soldier.png';
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) { fx.remove(); return; }

  const loadAsync = async (src) => {
    const img = new Image();
    img.decoding = 'async';
    img.src = src;
    if (img.decode) {
      try { await img.decode(); return img; } catch (_) {}
    }
    return new Promise((res, rej) => {
      if (img.complete && img.naturalWidth) return res(img);
      img.onload = () => res(img);
      img.onerror = rej;
    });
  };

  const scheduleIdle = window.requestIdleCallback || ((cb) => setTimeout(cb, 60));

  scheduleIdle(() => {
    const baseReady =
      BASE.complete && BASE.naturalWidth
        ? Promise.resolve(BASE)
        : loadAsync(ORIG_SRC);

    Promise.all([baseReady, loadAsync(CUTOUT_SRC), loadAsync(SOLDIER_SRC)])
      .then(([orig, cutout, soldier]) => scheduleIdle(() => init(orig, cutout, soldier)))
      .catch(() => fx.remove());
  });

  function init(orig, cutout, soldier) {
    BASE.draggable = false;
    const ctx = fx.getContext('2d');
    const mask = document.createElement('canvas'), mctx = mask.getContext('2d');
    const revealLayer = document.createElement('canvas'), rctx = revealLayer.getContext('2d');
    let W = 0, H = 0, rect = wrap.getBoundingClientRect(), raf = 0;

    // ---- silhouette hit-test (128x192 lookup built lazily on first hover) ----
    const HW = 128, HH = 192; let alpha = null, alphaBuilt = false;
    function ensureAlpha() {
      if (alphaBuilt) return;
      alphaBuilt = true;
      try {
        const h = document.createElement('canvas'); h.width = HW; h.height = HH;
        const hc = h.getContext('2d', { willReadFrequently: true });
        hc.drawImage(orig, 0, 0, HW, HH);
        const d = hc.getImageData(0, 0, HW, HH).data;
        alpha = new Uint8Array(HW * HH);
        for (let i = 0; i < alpha.length; i++) alpha[i] = d[i * 4 + 3];
      } catch (e) { alpha = null; }
    }
    const inside = (nx, ny) => {
      if (nx < 0 || ny < 0 || nx > 1 || ny > 1) return false;
      ensureAlpha();
      if (!alpha) return true;
      return alpha[(Math.min(HH - 1, ny * HH | 0)) * HW + Math.min(HW - 1, nx * HW | 0)] > 18;
    };

    // ---- deterministic organic wave functions for giant liquid ribbon edges ----
    const waveL = (s, id) => (
      0.22 * Math.sin(s * 0.026 + id * 1.7) +
      0.13 * Math.sin(s * 0.064 - id * 0.9 + 1.1) +
      0.07 * Math.cos(s * 0.120 + id * 2.3)
    );
    const waveR = (s, id) => (
      0.22 * Math.sin(s * 0.024 - id * 1.3 + 2.4) +
      0.13 * Math.cos(s * 0.060 + id * 1.9 - 0.7) +
      0.07 * Math.sin(s * 0.114 - id * 2.1 + 0.5)
    );

    // ---- sizing & high-DPI handling ----
    function resize() {
      rect = wrap.getBoundingClientRect();
      const dpr = Math.min(devicePixelRatio || 1, 1.25);
      const nw = Math.max(2, Math.round(rect.width * dpr)), nh = Math.max(2, Math.round(rect.height * dpr));
      if (nw === W && nh === H) return;
      W = fx.width = revealLayer.width = mask.width = nw;
      H = fx.height = revealLayer.height = mask.height = nh;

      // Build rich monochrome reveal layer strictly clipped to original astronaut silhouette
      rctx.clearRect(0, 0, W, H);
      rctx.globalCompositeOperation = 'source-over';
      rctx.drawImage(cutout, 0, 0, W, H);
      rctx.globalAlpha = 0.22;
      rctx.drawImage(soldier, 0, 0, W, H);
      rctx.globalAlpha = 1;
      rctx.globalCompositeOperation = 'destination-in';
      rctx.drawImage(orig, 0, 0, W, H);
      rctx.globalCompositeOperation = 'source-over';
    }

    // ---- transient fluid trail state ----
    const HOLD_MS = 650;      // stays at full strength for ~0.65s
    const FADE_MS = 1600;     // smoothly contracts and dissolves back to original over ~1.6s
    const TOTAL_MS = HOLD_MS + FADE_MS;
    const trails = [];
    let activeTrail = null, strokeId = 1;

    // Fast, responsive spring-smoothed pointer state for effortless touchpad gliding
    let targetX = 0, targetY = 0, smoothX = 0, smoothY = 0, vx = 0, vy = 0;
    let pointerActive = false, curR = 0;

    function drawOrganicBlob(x, y, rx, ry, angle, id, sOffset, alphaVal) {
      if (alphaVal <= 0.005 || rx <= 0.5) return;
      mctx.save();
      mctx.translate(x, y);
      mctx.rotate(angle);
      mctx.fillStyle = `rgba(0,0,0,${alphaVal})`;
      mctx.beginPath();
      const N = 32;
      for (let i = 0; i <= N; i++) {
        const a = (i / N) * Math.PI * 2;
        const wob = 1 + 0.16 * Math.sin(a * 2 + id) + 0.10 * Math.cos(a * 3 - id * 1.4) + 0.06 * Math.sin(a * 5 + sOffset * 0.04);
        const px = Math.cos(a) * rx * wob, py = Math.sin(a) * ry * wob;
        i ? mctx.lineTo(px, py) : mctx.moveTo(px, py);
      }
      mctx.closePath();
      mctx.fill();
      mctx.restore();
    }

    function drawRibbonQuad(a, b, scaleA, scaleB, alphaVal) {
      if (alphaVal <= 0.005) return;
      const rA0 = a.rL * scaleA, rA1 = a.rR * scaleA;
      const rB0 = b.rL * scaleB, rB1 = b.rR * scaleB;
      const lAx = a.x + a.nx * rA0, lAy = a.y + a.ny * rA0;
      const rAx = a.x - a.nx * rA1, rAy = a.y - a.ny * rA1;
      const lBx = b.x + b.nx * rB0, lBy = b.y + b.ny * rB0;
      const rBx = b.x - b.nx * rB1, rBy = b.y - b.ny * rB1;

      mctx.fillStyle = `rgba(0,0,0,${alphaVal})`;
      mctx.beginPath();
      mctx.moveTo(lAx, lAy);
      mctx.lineTo(lBx, lBy);
      mctx.lineTo(rBx, rBy);
      mctx.lineTo(rAx, rAy);
      mctx.closePath();
      mctx.fill();
    }

    function nodeLife(now, tBirth) {
      const age = now - tBirth;
      if (age >= TOTAL_MS) return { alpha: 0, shrink: 0 };
      if (age <= HOLD_MS) return { alpha: 1, shrink: 1 };
      const u = (age - HOLD_MS) / FADE_MS;
      const ease = 1 - u * u * (3 - 2 * u);
      return { alpha: ease, shrink: 0.45 + 0.55 * ease };
    }

    function pushSample(x, y, speed, now) {
      if (!activeTrail) {
        activeTrail = [];
        trails.push(activeTrail);
        strokeId++;
      }
      const prev = activeTrail[activeTrail.length - 1];
      // Giant brush half-width: ~14% of W => 28% total width (expands up to ~38% on fast touchpad sweeps)
      const baseR = W * 0.14;

      if (!prev) {
        curR = baseR * 0.85;
        const rL = curR * (1 + waveL(0, strokeId)), rR = curR * (1 + waveR(0, strokeId));
        activeTrail.push({ x, y, nx: 0, ny: -1, rL, rR, s: 0, angle: 0, t: now, id: strokeId });
        return;
      }

      const dx = x - prev.x, dy = y - prev.y;
      const dist = Math.hypot(dx, dy);
      if (dist < 0.8) {
        prev.t = now;
        return;
      }

      const step = Math.max(2.0, W * 0.008);
      const n = Math.max(1, Math.ceil(dist / step));
      const tx = dx / dist, ty = dy / dist;
      const nx = -ty, ny = tx;
      const angle = Math.atan2(ty, tx);

      if (activeTrail.length === 1) {
        prev.nx = nx; prev.ny = ny; prev.angle = angle;
      }

      let lastNode = prev;
      for (let i = 1; i <= n; i++) {
        const f = i / n;
        const sx = prev.x + dx * f, sy = prev.y + dy * f;
        const s = lastNode.s + dist / n;

        const ramp = Math.min(1, 0.72 + s / (W * 0.14));
        const velBoost = Math.max(0.90, Math.min(1.45, 0.98 + speed / (W * 0.055)));
        const targetR = baseR * ramp * velBoost;
        curR = curR + (targetR - curR) * 0.25;

        const rL = curR * (1 + waveL(s, strokeId));
        const rR = curR * (1 + waveR(s, strokeId));

        let bnx = lastNode.nx * 0.45 + nx * 0.55;
        let bny = lastNode.ny * 0.45 + ny * 0.55;
        const blen = Math.hypot(bnx, bny) || 1;
        bnx /= blen; bny /= blen;

        const node = { x: sx, y: sy, nx: bnx, ny: bny, rL, rR, s, angle, t: now, id: strokeId };
        activeTrail.push(node);
        lastNode = node;
      }
    }

    function stepFrame(now) {
      raf = 0;

      // 1. Advance snappy spring-smoothed pointer when hovering inside the astronaut
      if (pointerActive) {
        const dx = targetX - smoothX, dy = targetY - smoothY;
        vx = vx * 0.42 + dx * 0.46;
        vy = vy * 0.42 + dy * 0.46;
        smoothX += vx;
        smoothY += vy;
        const speed = Math.hypot(vx, vy);
        const nx = smoothX / W, ny = smoothY / H;
        if (inside(nx, ny)) {
          pushSample(smoothX, smoothY, speed, now);
        } else {
          activeTrail = null;
        }
      }

      // 2. Prune expired nodes & empty trails
      let hasLiveNodes = false;
      for (let t = trails.length - 1; t >= 0; t--) {
        const tr = trails[t];
        while (tr.length && (now - tr[0].t) >= TOTAL_MS) {
          tr.shift();
        }
        if (!tr.length) {
          if (tr === activeTrail) activeTrail = null;
          trails.splice(t, 1);
        } else {
          hasLiveNodes = true;
        }
      }

      // 3. Render transient fluid ribbon mask
      ctx.globalCompositeOperation = 'source-over';
      ctx.clearRect(0, 0, W, H);
      if (!hasLiveNodes) {
        if (pointerActive) startLoop();
        return;
      }

      mctx.globalCompositeOperation = 'source-over';
      mctx.clearRect(0, 0, W, H);

      for (let t = 0; t < trails.length; t++) {
        const tr = trails[t];
        for (let i = 0; i < tr.length; i++) {
          const cur = tr[i];
          const life = nodeLife(now, cur.t);
          if (life.alpha <= 0.005) continue;

          const headTaper = i > tr.length - 4 ? 0.78 + 0.07 * (tr.length - 1 - i) : 1;
          const tailTaper = i < 4 ? 0.56 + 0.11 * i : 1;
          const sc = life.shrink * Math.min(headTaper, tailTaper);
          const al = life.alpha;

          if (i > 0) {
            const prv = tr[i - 1];
            const prvLife = nodeLife(now, prv.t);
            const prvSc = prvLife.shrink * (i - 1 < 4 ? 0.56 + 0.11 * (i - 1) : 1);
            const segAlpha = Math.min(al, prvLife.alpha);

            // Multi-layered soft liquid ribbon hull with strong opaque core
            drawRibbonQuad(prv, cur, prvSc * 1.24, sc * 1.24, segAlpha * 0.22);
            drawRibbonQuad(prv, cur, prvSc * 1.12, sc * 1.12, segAlpha * 0.50);
            drawRibbonQuad(prv, cur, prvSc * 1.03, sc * 1.03, segAlpha * 0.85);
            drawRibbonQuad(prv, cur, prvSc * 0.94, sc * 0.94, segAlpha * 1.00);
          }

          const rMean = (cur.rL + cur.rR) * 0.5 * sc;
          drawOrganicBlob(cur.x, cur.y, rMean * 1.32, rMean * 0.96, cur.angle, cur.id, cur.s, al * 0.35);
          drawOrganicBlob(cur.x, cur.y, rMean * 1.12, rMean * 0.88, cur.angle, cur.id, cur.s, al * 1.00);
        }
      }

      // Composite monochrome astronaut through the fluid mask
      ctx.drawImage(revealLayer, 0, 0);
      ctx.globalCompositeOperation = 'destination-in';
      ctx.drawImage(mask, 0, 0);
      ctx.globalCompositeOperation = 'source-over';

      startLoop();
    }

    function startLoop() {
      if (!raf && !document.hidden) raf = requestAnimationFrame(stepFrame);
    }

    // ---- effortless touchpad / mouse hover tracking (no clicking needed) ----
    function onPointerMove(e) {
      rect = wrap.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width, ny = (e.clientY - rect.top) / rect.height;
      const px = nx * W, py = ny * H;
      if (!inside(nx, ny)) {
        pointerActive = false;
        activeTrail = null;
        return;
      }
      if (!pointerActive) {
        pointerActive = true;
        smoothX = targetX = px;
        smoothY = targetY = py;
        vx = vy = 0;
        activeTrail = null;
      } else {
        targetX = px;
        targetY = py;
      }
      startLoop();
    }

    function onPointerLeave() {
      pointerActive = false;
      activeTrail = null;
    }

    addEventListener('pointermove', onPointerMove, { passive: true });
    addEventListener('pointerdown', onPointerMove, { passive: true });
    wrap.addEventListener('pointerleave', onPointerLeave);
    document.addEventListener('pointerleave', onPointerLeave);
    new ResizeObserver(resize).observe(wrap);
    addEventListener('resize', resize);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && raf) { cancelAnimationFrame(raf); raf = 0; }
      else startLoop();
    });
    resize();
    wrap.classList.add('ready');

    // Automated verification mode via URL hash
    if (location.hash.includes('demo')) {
      const now = performance.now();
      const runGiantSweep = (pts, ageOffsetMs) => {
        activeTrail = null;
        for (let i = 0; i < pts.length; i++) {
          const prev = i > 0 ? pts[i - 1] : pts[i];
          const sp = Math.hypot(pts[i].x - prev.x, pts[i].y - prev.y);
          pushSample(pts[i].x, pts[i].y, sp, now - ageOffsetMs + i * 6);
        }
        activeTrail = null;
      };
      // 1. Earlier sweep across helmet (partially dissolving back to original)
      const s1 = Array.from({ length: 45 }, (_, k) => {
        const t = k / 44;
        return { x: (0.30 + 0.48 * t) * W, y: (0.13 + 0.06 * Math.sin(t * 4.0) + 0.04 * t) * H };
      });
      // 2. Fresh giant sweep across the 01 shoulder & torso (fully active)
      const s2 = Array.from({ length: 55 }, (_, k) => {
        const t = k / 54;
        return { x: (0.18 + 0.62 * t) * W, y: (0.43 + 0.08 * Math.sin(t * 4.5 - 0.5)) * H };
      });
      runGiantSweep(s1, 1100);
      runGiantSweep(s2, 100);
      stepFrame(now);
    }
  }
})();
