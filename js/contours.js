// Flowing contour-line background: marching squares over a slowly evolving scalar field.
(() => {
  const cv = document.getElementById('flow');
  if (!cv) return;
  const ctx = cv.getContext('2d');
  const CELL = 15, SCALE = 280;           // grid cell px / px per field unit (bigger = larger shapes)
  const LEVELS = [-1.5, -0.95, -0.4, 0.15, 0.7, 1.25];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const T_OFF = +(location.hash.match(/t=(\d+)/)||[0,0])[1];
  let W, H, nx, ny, dpr, field, raf = 0, t0 = performance.now(), lastDraw = 0;

  function resize() {
    dpr = 1;
    W = innerWidth; H = innerHeight;
    cv.width = W * dpr; cv.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    nx = Math.ceil(W / CELL) + 2; ny = Math.ceil(H / CELL) + 2;
    field = new Float32Array(nx * ny);
  }

  // Domain-warped sines at different slow speeds per region -> stretching/contracting organic loops.
  function f(x, y, t) {
    const u = x / SCALE, v = y / SCALE;
    const wu = u + 0.8 * Math.sin(v * 1.3 + t * 0.11) + 0.3 * Math.sin(v * 2.1 - t * 0.07);
    const wv = v + 0.8 * Math.sin(u * 1.1 - t * 0.09) + 0.3 * Math.cos(u * 1.9 + t * 0.06);
    return 1.0 * Math.sin(wu * 1.5 + t * 0.05) +
           0.9 * Math.sin(wv * 1.7 - t * 0.04 + 1.3) +
           0.7 * Math.sin((wu + wv) * 1.1 + t * 0.03 + 0.4) +
           0.4 * Math.sin(wu * 2.6 - wv * 1.2 + t * 0.08);
  }

  function draw(t) {
    ctx.clearRect(0, 0, W, H);
    for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) field[j * nx + i] = f(i * CELL, j * CELL, t);
    ctx.lineWidth = 1; ctx.lineCap = 'round';
    ctx.strokeStyle = 'rgba(70,70,68,.3)';
    ctx.beginPath();
    for (const L of LEVELS) {
      for (let j = 0; j < ny - 1; j++) {
        for (let i = 0; i < nx - 1; i++) {
          const a = field[j * nx + i], b = field[j * nx + i + 1], c = field[(j + 1) * nx + i + 1], d = field[(j + 1) * nx + i];
          let k = (a > L ? 8 : 0) | (b > L ? 4 : 0) | (c > L ? 2 : 0) | (d > L ? 1 : 0);
          if (k === 0 || k === 15) continue;
          const x = i * CELL, y = j * CELL;
          const T = [x + CELL * (L - a) / (b - a), y];
          const R = [x + CELL, y + CELL * (L - b) / (c - b)];
          const B = [x + CELL * (L - d) / (c - d), y + CELL];
          const Lf = [x, y + CELL * (L - a) / (d - a)];
          const seg = (p, q) => { ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); };
          switch (k) {
            case 1: case 14: seg(Lf, B); break;
            case 2: case 13: seg(B, R); break;
            case 3: case 12: seg(Lf, R); break;
            case 4: case 11: seg(T, R); break;
            case 5: seg(Lf, T); seg(B, R); break;
            case 6: case 9: seg(T, B); break;
            case 7: case 8: seg(Lf, T); break;
            case 10: seg(Lf, B); seg(T, R); break;
          }
        }
      }
    }
    ctx.stroke();
  }

  const frame = now => {
    if (now - lastDraw >= 28) {
      lastDraw = now;
      draw((now - t0) / 1000 + 20 + T_OFF);
    }
    raf = requestAnimationFrame(frame);
  };
  function start() { if (!raf && !reduce) raf = requestAnimationFrame(frame); }
  function stop() { if (raf) { cancelAnimationFrame(raf); raf = 0; } }

  addEventListener('resize', () => { resize(); draw((performance.now() - t0) / 1000 + 20 + T_OFF); });
  addEventListener('pagehide', stop);
  addEventListener('pageshow', start);
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
  resize(); draw(20); start();
})();



