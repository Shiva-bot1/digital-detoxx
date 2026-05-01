import React, { useEffect, useRef } from 'react';

const NightBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext('2d');
    let animId;

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const stars = Array.from({ length: 160 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height * 0.65,
      r: Math.random() * 1.4 + 0.3,
      a: Math.random(),
      speed: Math.random() * 0.008 + 0.002,
    }));

    const shooters = Array.from({ length: 6 }, (_, i) => ({
      x: Math.random() * canvas.width,
      y: Math.random() * 120,
      len: Math.random() * 90 + 60,
      speed: Math.random() * 7 + 5,
      angle: Math.PI / 6,
      timer: 0,
      delay: i * 100 + Math.random() * 80,
    }));

    const auroraWaves = [
      { color: 'rgba(0,232,122,',  y: 0.22, amp: 32, freq: 0.006, phase: 0,   speed: 0.007, opacity: 0.14 },
      { color: 'rgba(0,184,217,',  y: 0.28, amp: 24, freq: 0.008, phase: 2,   speed: 0.005, opacity: 0.10 },
      { color: 'rgba(140,80,220,', y: 0.18, amp: 20, freq: 0.005, phase: 4,   speed: 0.004, opacity: 0.08 },
      { color: 'rgba(0,232,122,',  y: 0.34, amp: 16, freq: 0.010, phase: 1.5, speed: 0.009, opacity: 0.06 },
    ];

    let t = 0;

    const drawSky = () => {
      const h   = canvas.height;
      const w   = canvas.width;
      const sky = ctx.createLinearGradient(0, 0, 0, h);
      sky.addColorStop(0,    '#020a08');
      sky.addColorStop(0.45, '#06130e');
      sky.addColorStop(0.75, '#0a1c14');
      sky.addColorStop(1,    '#0e2218');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, w, h);
    };

    const drawAurora = () => {
      const w = canvas.width;
      const h = canvas.height;
      auroraWaves.forEach(wave => {
        wave.phase += wave.speed;
        const baseY = h * wave.y;
        for (let layer = 0; layer < 3; layer++) {
          ctx.beginPath();
          ctx.moveTo(0, baseY + layer * 14);
          for (let x = 0; x <= w; x += 4) {
            const y = baseY + layer * 14
              + Math.sin(x * wave.freq + wave.phase + layer) * wave.amp
              + Math.sin(x * wave.freq * 1.8 + wave.phase * 1.2) * wave.amp * 0.35;
            ctx.lineTo(x, y);
          }
          ctx.lineTo(w, 0);
          ctx.lineTo(0, 0);
          ctx.closePath();
          const alpha = wave.opacity * (1 - layer * 0.28) * (0.65 + 0.35 * Math.sin(t * 0.018 + layer));
          ctx.fillStyle = wave.color + alpha + ')';
          ctx.fill();
        }
      });
    };

    const drawStars = () => {
      stars.forEach(s => {
        s.a += s.speed;
        const alpha = 0.35 + 0.65 * Math.abs(Math.sin(s.a));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200,240,220,${alpha})`;
        ctx.fill();
      });
    };

    const drawShooters = () => {
      shooters.forEach(s => {
        s.timer++;
        if (s.timer < s.delay) return;
        const local = s.timer - s.delay;
        if (local > 200) {
          s.timer = 0;
          s.delay = Math.random() * 130 + 50;
          s.x     = Math.random() * canvas.width;
          s.y     = Math.random() * 90;
          s.len   = Math.random() * 90 + 60;
          s.speed = Math.random() * 7 + 5;
          return;
        }
        const progress = local / 70;
        const headX    = s.x + Math.cos(s.angle) * s.speed * local;
        const headY    = s.y + Math.sin(s.angle) * s.speed * local;
        const tailX    = headX - Math.cos(s.angle) * s.len;
        const tailY    = headY - Math.sin(s.angle) * s.len;
        const op       = progress < 1 ? progress : Math.max(0, 1 - (progress - 1));

        const grad = ctx.createLinearGradient(tailX, tailY, headX, headY);
        grad.addColorStop(0, 'rgba(200,255,220,0)');
        grad.addColorStop(1, `rgba(200,255,220,${op * 0.9})`);
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(headX, headY);
        ctx.strokeStyle = grad;
        ctx.lineWidth   = 1.6;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(headX, headY, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(220,255,230,${op})`;
        ctx.fill();
      });
    };

    const drawMountains = () => {
      const w = canvas.width;
      const h = canvas.height;
      const b = h;

      const layers = [
        {
          pts: [[0,b*.80],[w*.12,b*.63],[w*.24,b*.69],[w*.36,b*.57],[w*.46,b*.65],[w*.57,b*.52],[w*.68,b*.61],[w*.80,b*.54],[w*.92,b*.64],[w,b*.58],[w,b],[0,b]],
          fill: '#0a1c14',
        },
        {
          pts: [[0,b*.84],[w*.09,b*.70],[w*.19,b*.74],[w*.30,b*.65],[w*.42,b*.70],[w*.53,b*.61],[w*.65,b*.68],[w*.77,b*.63],[w*.88,b*.70],[w,b*.65],[w,b],[0,b]],
          fill: '#0d2218',
        },
        {
          pts: [[0,b*.87],[w*.10,b*.78],[w*.22,b*.82],[w*.34,b*.74],[w*.46,b*.80],[w*.58,b*.73],[w*.70,b*.77],[w*.83,b*.72],[w*.94,b*.76],[w,b*.73],[w,b],[0,b]],
          fill: '#112a1e',
        },
        {
          pts: [[0,b*.90],[w*.13,b*.85],[w*.26,b*.88],[w*.40,b*.83],[w*.54,b*.87],[w*.66,b*.82],[w*.80,b*.86],[w*.92,b*.82],[w,b*.84],[w,b],[0,b]],
          fill: '#152e22',
        },
        {
          pts: [[0,b*.94],[w*.15,b*.90],[w*.30,b*.93],[w*.45,b*.89],[w*.60,b*.92],[w*.75,b*.88],[w*.90,b*.91],[w,b*.89],[w,b],[0,b]],
          fill: '#1a3428',
        },
      ];

      layers.forEach(layer => {
        ctx.beginPath();
        ctx.moveTo(layer.pts[0][0], layer.pts[0][1]);
        layer.pts.forEach(p => ctx.lineTo(p[0], p[1]));
        ctx.closePath();
        ctx.fillStyle = layer.fill;
        ctx.fill();
      });

      const snowCaps = [
        { peak: [w * 0.36, b * 0.57], spread: w * 0.04 },
        { peak: [w * 0.57, b * 0.52], spread: w * 0.038 },
        { peak: [w * 0.80, b * 0.54], spread: w * 0.035 },
      ];
      snowCaps.forEach(sc => {
        ctx.beginPath();
        ctx.moveTo(sc.peak[0] - sc.spread, sc.peak[1] + sc.spread * 0.9);
        ctx.lineTo(sc.peak[0], sc.peak[1]);
        ctx.lineTo(sc.peak[0] + sc.spread, sc.peak[1] + sc.spread * 0.9);
        ctx.closePath();
        ctx.fillStyle = 'rgba(200,240,218,0.18)';
        ctx.fill();
      });

      const mist = ctx.createLinearGradient(0, b * 0.80, 0, b);
      mist.addColorStop(0, 'rgba(0,232,122,0.04)');
      mist.addColorStop(1, 'rgba(0,232,122,0)');
      ctx.fillStyle = mist;
      ctx.fillRect(0, b * 0.80, w, b * 0.20);
    };

    const loop = () => {
      t++;
      drawSky();
      drawAurora();
      drawStars();
      drawShooters();
      drawMountains();
      animId = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0, left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        display: 'block',
        pointerEvents: 'none',
      }}
    />
  );
};

export default NightBackground;