/* eslint-disable */
/**
 * Генеративные сцены ролика: чистый canvas, без внешних библиотек.
 * Кадры считаются по одному вызову __step() — состояние живёт между кадрами,
 * поэтому доступны шлейфы и накопительные эффекты, а рендер остаётся
 * детерминированным (весь рандом — из seeded-генератора).
 *
 * Палитра повторяет токены лендинга: near-black #08090A, петроль #0F7C77 /
 * #2E9E97, бронза #B08D57.
 */
(() => {
  const canvas = document.getElementById("c");
  const ctx = canvas.getContext("2d");
  const W = canvas.width;
  const H = canvas.height;

  const INK = "#F7F8F8";
  const TEAL = [46, 158, 151];
  const TEAL_DEEP = [15, 124, 119];
  const BRONZE = [176, 141, 87];

  const rgba = ([r, g, b], a) => `rgba(${r},${g},${b},${a})`;

  /** mulberry32 — детерминированный PRNG, чтобы кадры повторялись от прогона к прогону. */
  function rng(seed) {
    let a = seed >>> 0;
    return () => {
      a = (a + 0x6d2b79f5) >>> 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  const ease = (t) => 1 - Math.pow(1 - t, 3);
  const clamp01 = (t) => Math.max(0, Math.min(1, t));

  let state = null;

  /** Затемняющая заливка вместо clearRect: даёт шлейф движения. */
  function fade(alpha) {
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = `rgba(8,9,10,${alpha})`;
    ctx.fillRect(0, 0, W, H);
  }

  function glow(x, y, r, color, a) {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, rgba(color, a));
    g.addColorStop(1, rgba(color, 0));
    ctx.globalCompositeOperation = "lighter";
    ctx.fillStyle = g;
    ctx.fillRect(x - r, y - r, r * 2, r * 2);
    ctx.globalCompositeOperation = "source-over";
  }

  function vignette() {
    const g = ctx.createRadialGradient(W / 2, H * 0.45, H * 0.2, W / 2, H * 0.5, H * 0.78);
    g.addColorStop(0, "rgba(0,0,0,0)");
    g.addColorStop(1, "rgba(0,0,0,0.72)");
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
  }

  /** Зерно: без него плоские градиенты на тёмном бандятся полосами. */
  function grain(frame) {
    const r = rng(1000 + frame);
    ctx.globalCompositeOperation = "overlay";
    for (let i = 0; i < 2600; i += 1) {
      const a = 0.02 + r() * 0.05;
      ctx.fillStyle = r() > 0.5 ? `rgba(255,255,255,${a})` : `rgba(0,0,0,${a})`;
      ctx.fillRect(r() * W, r() * H, 2, 2);
    }
    ctx.globalCompositeOperation = "source-over";
  }

  function roundRect(x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  /* ------------------------------------------------------------------ */
  /* Сцена 1 — «сигнал»: тёмный кабинет, телефон загорается уведомлением. */
  /* ------------------------------------------------------------------ */
  const signal = {
    init(s) {
      const r = rng(7);
      s.dust = Array.from({ length: 150 }, () => ({
        x: r() * W,
        y: r() * H,
        z: 0.3 + r() * 1.2,
        vx: (r() - 0.5) * 0.25,
        vy: -0.12 - r() * 0.3,
        a: 0.05 + r() * 0.22,
      }));
      s.rings = [];
    },
    draw(s, p, frame) {
      fade(0.28);

      const zoom = 1 + 0.1 * ease(p);
      const px = W * 0.5;
      const py = H * 0.6;

      // Вспышки уведомлений: две волны, вторая ярче.
      const burst = (at, len) => clamp01(1 - Math.abs(p - at) / len);
      const flash = Math.max(burst(0.22, 0.16) * 0.75, burst(0.62, 0.2));

      ctx.save();
      ctx.translate(px, py);
      ctx.scale(zoom, zoom);
      ctx.translate(-px, -py);

      // Свет от экрана по столу.
      glow(px, py - 40, 620, TEAL_DEEP, 0.1 + flash * 0.3);
      glow(px + 60, py + 260, 900, TEAL_DEEP, 0.05 + flash * 0.12);
      // Тёплый источник вдалеке.
      glow(W * 0.82, H * 0.24, 420, BRONZE, 0.09);

      // Плоскость стола.
      const desk = ctx.createLinearGradient(0, py - 120, 0, H);
      desk.addColorStop(0, "rgba(20,22,24,0)");
      desk.addColorStop(0.35, "rgba(16,18,20,0.9)");
      desk.addColorStop(1, "rgba(8,9,10,1)");
      ctx.fillStyle = desk;
      ctx.fillRect(0, py - 120, W, H - py + 120);

      // Телефон.
      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(-0.11);
      ctx.shadowColor = rgba(TEAL, 0.45 + flash * 0.4);
      ctx.shadowBlur = 90 + flash * 120;
      ctx.fillStyle = "#0B0C0D";
      roundRect(-150, -300, 300, 600, 38);
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.strokeStyle = `rgba(255,255,255,${0.10 + flash * 0.2})`;
      ctx.lineWidth = 2;
      roundRect(-150, -300, 300, 600, 38);
      ctx.stroke();

      // Экран.
      const scr = ctx.createLinearGradient(0, -270, 0, 270);
      scr.addColorStop(0, rgba(TEAL, 0.30 + flash * 0.5));
      scr.addColorStop(1, rgba(TEAL_DEEP, 0.06 + flash * 0.2));
      ctx.fillStyle = scr;
      roundRect(-128, -272, 256, 544, 26);
      ctx.fill();

      // Строки «уведомлений», появляются с вспышкой.
      for (let i = 0; i < 4; i += 1) {
        const appear = clamp01((p - 0.24 - i * 0.075) * 7);
        if (appear <= 0) continue;
        ctx.fillStyle = `rgba(247,248,248,${0.10 + 0.5 * appear * (0.4 + flash)})`;
        roundRect(-104, -190 + i * 92, 208 * appear, 54, 14);
        ctx.fill();
      }
      ctx.restore();

      // Кольца-импульсы от телефона.
      if (flash > 0.85 && frame % 6 === 0) s.rings.push({ r: 120, a: 0.5 });
      ctx.globalCompositeOperation = "lighter";
      s.rings = s.rings.filter((ring) => ring.a > 0.01);
      for (const ring of s.rings) {
        ring.r += 9;
        ring.a *= 0.955;
        ctx.strokeStyle = rgba(TEAL, ring.a);
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(px, py, ring.r, ring.r * 0.55, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.globalCompositeOperation = "source-over";

      // Пыль в воздухе.
      ctx.globalCompositeOperation = "lighter";
      for (const d of s.dust) {
        d.x += d.vx * d.z;
        d.y += d.vy * d.z;
        if (d.y < -20) d.y = H + 20;
        ctx.fillStyle = rgba(d.z > 1.1 ? BRONZE : TEAL, d.a);
        ctx.fillRect(d.x, d.y, 2 * d.z, 2 * d.z);
      }
      ctx.globalCompositeOperation = "source-over";
      ctx.restore();

      vignette();
      grain(frame);
    },
  };

  /* ------------------------------------------------------------------ */
  /* Сцена 2 — «созвездие»: граф собирается из точек, по рёбрам идут импульсы. */
  /* ------------------------------------------------------------------ */
  const constellation = {
    init(s) {
      const r = rng(21);
      s.nodes = Array.from({ length: 52 }, () => {
        const ang = r() * Math.PI * 2;
        const rad = Math.pow(r(), 0.6) * 430;
        return {
          x: Math.cos(ang) * rad,
          y: Math.sin(ang) * rad * 1.45,
          z: (r() - 0.5) * 320,
          s: 2 + r() * 4,
          t: r(),
        };
      });
      s.edges = [];
      for (let i = 0; i < s.nodes.length; i += 1) {
        for (let j = i + 1; j < s.nodes.length; j += 1) {
          const a = s.nodes[i];
          const b = s.nodes[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z);
          if (d < 240) s.edges.push({ i, j, d });
        }
      }
      s.pulses = [];
      s.rand = r;
    },
    draw(s, p, frame) {
      fade(0.34);

      const cx = W / 2;
      const cy = H * 0.46;
      const rot = frame * 0.0042;
      const zoom = 1 + 0.12 * p;

      glow(cx, cy, 640, TEAL_DEEP, 0.16);
      glow(cx, cy, 200, TEAL, 0.14 + 0.05 * Math.sin(frame * 0.09));

      const proj = (n) => {
        const x = n.x * Math.cos(rot) - n.z * Math.sin(rot);
        const z = n.x * Math.sin(rot) + n.z * Math.cos(rot);
        const k = (760 / (760 + z)) * zoom;
        return { x: cx + x * k, y: cy + n.y * k, k };
      };

      ctx.globalCompositeOperation = "lighter";

      for (const e of s.edges) {
        const born = clamp01((p - 0.05 - s.nodes[e.i].t * 0.45) * 4);
        if (born <= 0) continue;
        const a = proj(s.nodes[e.i]);
        const b = proj(s.nodes[e.j]);
        ctx.strokeStyle = rgba(TEAL, 0.05 + 0.14 * born * (1 - e.d / 240));
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }

      // Импульсы по случайным рёбрам.
      if (frame % 2 === 0) {
        const e = s.edges[Math.floor(s.rand() * s.edges.length)];
        if (e) s.pulses.push({ e, t: 0 });
      }
      s.pulses = s.pulses.filter((pl) => pl.t < 1);
      for (const pl of s.pulses) {
        pl.t += 0.035;
        const a = proj(s.nodes[pl.e.i]);
        const b = proj(s.nodes[pl.e.j]);
        const x = a.x + (b.x - a.x) * pl.t;
        const y = a.y + (b.y - a.y) * pl.t;
        glow(x, y, 26, TEAL, 0.5 * (1 - pl.t));
        ctx.fillStyle = rgba(TEAL, 0.9 * (1 - pl.t));
        ctx.beginPath();
        ctx.arc(x, y, 2.6, 0, Math.PI * 2);
        ctx.fill();
      }

      for (const n of s.nodes) {
        const born = clamp01((p - n.t * 0.5) * 5);
        if (born <= 0) continue;
        const q = proj(n);
        const size = n.s * q.k * born;
        glow(q.x, q.y, size * 9, TEAL, 0.16 * born);
        ctx.fillStyle = rgba(n.t > 0.86 ? BRONZE : [247, 248, 248], 0.55 + 0.4 * born);
        ctx.beginPath();
        ctx.arc(q.x, q.y, size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Бронзовые частицы на орбитах.
      for (let i = 0; i < 3; i += 1) {
        const ang = frame * (0.014 + i * 0.004) + i * 2.1;
        const x = cx + Math.cos(ang) * (330 + i * 70);
        const y = cy + Math.sin(ang) * (470 + i * 60) * 0.7;
        glow(x, y, 46, BRONZE, 0.32);
      }

      ctx.globalCompositeOperation = "source-over";
      vignette();
      grain(frame);
    },
  };

  /* ------------------------------------------------------------------ */
  /* Сцена 3 — «письма без ответа»: конверты рассыпаются в угли.          */
  /* ------------------------------------------------------------------ */
  const dissolve = {
    init(s) {
      const r = rng(33);
      s.envelopes = Array.from({ length: 13 }, (_, i) => ({
        x: 90 + r() * (W - 180),
        y: -200 + r() * (H + 300),
        w: 150 + r() * 130,
        rot: (r() - 0.5) * 0.7,
        vr: (r() - 0.5) * 0.006,
        vy: 12 + r() * 22,
        start: 0.1 + r() * 0.55,
        hero: i === 0,
      }));
      s.envelopes[0] = {
        ...s.envelopes[0],
        x: W * 0.5,
        y: H * 0.52,
        w: 420,
        rot: -0.18,
        vr: 0.004,
        vy: 6,
        start: 0.42,
        hero: true,
      };
      s.embers = [];
      s.rand = r;
    },
    draw(s, p, frame) {
      fade(0.3);
      glow(W * 0.5, H * 0.42, 760, TEAL_DEEP, 0.1);
      glow(W * 0.2, H * 0.8, 520, BRONZE, 0.045);

      const dt = 1 / 30;
      ctx.globalCompositeOperation = "lighter";

      for (const e of s.envelopes) {
        e.y += e.vy * dt * 6;
        e.rot += e.vr;
        const d = clamp01((p - e.start) * 2.6);
        const alive = 1 - d;
        if (alive <= 0.02) continue;

        const h = e.w * 0.62;
        const scale = e.hero ? 1 - 0.28 * ease(clamp01((p - 0.3) * 1.4)) : 1;

        ctx.save();
        ctx.translate(e.x, e.y);
        ctx.rotate(e.rot);
        ctx.scale(scale, scale);
        ctx.globalAlpha = alive;

        ctx.globalCompositeOperation = "source-over";
        ctx.fillStyle = "rgba(14,15,17,0.95)";
        roundRect(-e.w / 2, -h / 2, e.w, h, 10);
        ctx.fill();
        ctx.strokeStyle = rgba(TEAL, 0.35 * alive);
        ctx.lineWidth = 2;
        roundRect(-e.w / 2, -h / 2, e.w, h, 10);
        ctx.stroke();
        // Клапан.
        ctx.beginPath();
        ctx.moveTo(-e.w / 2, -h / 2);
        ctx.lineTo(0, h * 0.12);
        ctx.lineTo(e.w / 2, -h / 2);
        ctx.stroke();
        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = "lighter";
        ctx.restore();

        // Угли на месте распада.
        if (d > 0 && d < 1 && frame % 2 === 0) {
          for (let k = 0; k < (e.hero ? 6 : 2); k += 1) {
            s.embers.push({
              x: e.x + (s.rand() - 0.5) * e.w * scale,
              y: e.y + (s.rand() - 0.5) * h * scale,
              vx: (s.rand() - 0.5) * 1.2,
              vy: -0.8 - s.rand() * 1.8,
              a: 0.5 + s.rand() * 0.5,
              s: 1.5 + s.rand() * 2.6,
              warm: s.rand() > 0.55,
            });
          }
        }
      }

      s.embers = s.embers.filter((m) => m.a > 0.02);
      for (const m of s.embers) {
        m.x += m.vx;
        m.y += m.vy;
        m.vy -= 0.012;
        m.a *= 0.975;
        glow(m.x, m.y, m.s * 7, m.warm ? BRONZE : TEAL, m.a * 0.35);
        ctx.fillStyle = rgba(m.warm ? BRONZE : TEAL, m.a);
        ctx.fillRect(m.x, m.y, m.s, m.s);
      }

      ctx.globalCompositeOperation = "source-over";
      vignette();
      grain(frame);
    },
  };

  /* ------------------------------------------------------------------ */
  /* Сцена 4 — «разгон»: столбцы растут, снизу вверх идёт световая волна.  */
  /* ------------------------------------------------------------------ */
  const rise = {
    init(s) {
      const r = rng(51);
      s.cols = Array.from({ length: 9 }, (_, i) => ({
        x: 70 + i * ((W - 140) / 9),
        w: (W - 140) / 9 - 26,
        h: 0.24 + r() * 0.62,
        delay: i * 0.05 + r() * 0.05,
      }));
      s.streaks = Array.from({ length: 60 }, () => ({
        x: r() * W,
        y: r() * H,
        len: 40 + r() * 220,
        v: 6 + r() * 26,
        a: 0.05 + r() * 0.25,
      }));
    },
    draw(s, p, frame) {
      fade(0.32);

      const base = H * 0.78;
      glow(W / 2, base, 900, TEAL_DEEP, 0.12);

      // Стеклянный пол.
      const floor = ctx.createLinearGradient(0, base, 0, H);
      floor.addColorStop(0, "rgba(255,255,255,0.045)");
      floor.addColorStop(1, "rgba(8,9,10,0)");
      ctx.fillStyle = floor;
      ctx.fillRect(0, base, W, H - base);

      ctx.globalCompositeOperation = "lighter";

      // Разгонные штрихи.
      for (const st of s.streaks) {
        st.y -= st.v * (0.5 + p * 1.6);
        if (st.y + st.len < 0) st.y = H + st.len;
        const g = ctx.createLinearGradient(st.x, st.y, st.x, st.y + st.len);
        g.addColorStop(0, rgba(TEAL, 0));
        g.addColorStop(0.5, rgba(TEAL, st.a * (0.4 + p)));
        g.addColorStop(1, rgba(TEAL, 0));
        ctx.strokeStyle = g;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(st.x, st.y);
        ctx.lineTo(st.x, st.y + st.len);
        ctx.stroke();
      }

      // Столбцы.
      for (const c of s.cols) {
        const grow = ease(clamp01((p - c.delay) * 1.9));
        const h = c.h * base * 0.86 * grow;
        if (h < 2) continue;
        const g = ctx.createLinearGradient(0, base - h, 0, base);
        g.addColorStop(0, rgba(TEAL, 0.85));
        g.addColorStop(0.45, rgba(TEAL_DEEP, 0.4));
        g.addColorStop(1, rgba(TEAL_DEEP, 0.06));
        ctx.fillStyle = g;
        roundRect(c.x, base - h, c.w, h, 8);
        ctx.fill();
        // Отражение.
        const gr = ctx.createLinearGradient(0, base, 0, base + h * 0.42);
        gr.addColorStop(0, rgba(TEAL, 0.18));
        gr.addColorStop(1, rgba(TEAL, 0));
        ctx.fillStyle = gr;
        ctx.fillRect(c.x, base, c.w, h * 0.42);
        // Светящаяся кромка.
        glow(c.x + c.w / 2, base - h, c.w * 1.5, TEAL, 0.3);
        ctx.fillStyle = rgba([247, 248, 248], 0.75);
        ctx.fillRect(c.x, base - h - 3, c.w, 3);
      }

      // Световая волна снизу вверх.
      const sweepY = H * 1.05 - ease(clamp01(p * 1.15)) * H * 1.25;
      const sw = ctx.createLinearGradient(0, sweepY - 180, 0, sweepY + 180);
      sw.addColorStop(0, rgba(TEAL, 0));
      sw.addColorStop(0.5, rgba(TEAL, 0.30));
      sw.addColorStop(1, rgba(TEAL, 0));
      ctx.fillStyle = sw;
      ctx.fillRect(0, sweepY - 180, W, 360);
      glow(W * 0.5, sweepY, 520, BRONZE, 0.1);

      ctx.globalCompositeOperation = "source-over";
      vignette();
      grain(frame);
    },
  };

  const SCENES = { signal, constellation, dissolve, rise };

  window.__scene = (name, total) => {
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = "#08090A";
    ctx.fillRect(0, 0, W, H);
    state = { name, total, frame: 0 };
    SCENES[name].init(state);
  };

  window.__step = () => {
    const p = state.frame / (state.total - 1);
    SCENES[state.name].draw(state, p, state.frame);
    state.frame += 1;
  };
})();
