(function initBloodInkBackground() {
  const MAX_PARTICLES = 150;
  const INK_COLORS = ['#8B0000', '#660000', '#990000'];
  const canvas = document.getElementById('blood-ink-background');

  if (!canvas) return;

  const context = canvas.getContext('2d');

  if (!context) {
    console.warn('[Javier Dibujos] El fondo de tinta no pudo iniciarse.');
    return;
  }

  const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  let animationFrameId = null;
  let particles = [];
  let width = window.innerWidth;
  let height = window.innerHeight;
  let lastTime = performance.now();
  let lastPointer = null;
  let lastBurstTime = 0;

  const randomBetween = (min, max) => Math.random() * (max - min) + min;

  const hexToRgb = (hex) => {
    const value = hex.slice(1);
    return {
      r: parseInt(value.slice(0, 2), 16),
      g: parseInt(value.slice(2, 4), 16),
      b: parseInt(value.slice(4, 6), 16)
    };
  };

  const resizeCanvas = () => {
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * pixelRatio);
    canvas.height = Math.floor(height * pixelRatio);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  };

  const createParticle = (x, y) => {
    const angle = randomBetween(0, Math.PI * 2);
    const speed = randomBetween(0.15, 1.05);
    const size = randomBetween(2, 8);
    const color = hexToRgb(INK_COLORS[Math.floor(Math.random() * INK_COLORS.length)]);

    return {
      x,
      y,
      radius: size,
      maxRadius: size + randomBetween(4, 14),
      growth: randomBetween(0.015, 0.06),
      opacity: randomBetween(0.1, 0.6),
      fadeSpeed: randomBetween(0.0025, 0.008),
      velocityX: Math.cos(angle) * speed,
      velocityY: Math.sin(angle) * speed,
      drag: randomBetween(0.985, 0.997),
      color
    };
  };

  const spawnBurst = (x, y, amount = 4) => {
    const availableSlots = MAX_PARTICLES - particles.length;
    const particlesToCreate = Math.min(amount, availableSlots);

    for (let index = 0; index < particlesToCreate; index += 1) {
      particles.push(createParticle(x, y));
    }
  };

  const seedParticles = () => {
    for (let index = 0; index < 18; index += 1) {
      const particle = createParticle(
        randomBetween(0, width),
        randomBetween(0, height)
      );

      particle.opacity *= 0.45;
      particles.push(particle);
    }
  };

  const drawParticle = (particle) => {
    const { r, g, b } = particle.color;
    const gradient = context.createRadialGradient(
      particle.x,
      particle.y,
      0,
      particle.x,
      particle.y,
      particle.radius
    );

    gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${particle.opacity})`);
    gradient.addColorStop(0.55, `rgba(${r}, ${g}, ${b}, ${particle.opacity * 0.45})`);
    gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

    context.beginPath();
    context.fillStyle = gradient;
    context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
    context.fill();
  };

  const animate = (time) => {
    const frameScale = Math.min((time - lastTime) / 16.67, 2);

    lastTime = time;
    context.clearRect(0, 0, width, height);

    particles = particles.filter((particle) => {
      particle.x += particle.velocityX * frameScale;
      particle.y += particle.velocityY * frameScale;
      particle.velocityX *= particle.drag ** frameScale;
      particle.velocityY *= particle.drag ** frameScale;
      particle.radius = Math.min(
        particle.radius + particle.growth * frameScale,
        particle.maxRadius
      );
      particle.opacity -= particle.fadeSpeed * frameScale;

      if (particle.opacity <= 0) return false;

      drawParticle(particle);
      return true;
    });

    animationFrameId = window.requestAnimationFrame(animate);
  };

  const handlePointerMove = (event) => {
    const now = performance.now();
    const bounds = canvas.getBoundingClientRect();
    const x = event.clientX - bounds.left;
    const y = event.clientY - bounds.top;

    if (!lastPointer) {
      lastPointer = { x, y };
      spawnBurst(x, y, 6);
      lastBurstTime = now;
      return;
    }

    const distance = Math.hypot(x - lastPointer.x, y - lastPointer.y);
    const enoughTimePassed = now - lastBurstTime > 28;

    if (distance > 5 && enoughTimePassed) {
      const amount = Math.min(7, Math.max(2, Math.round(distance / 12)));
      spawnBurst(x, y, amount);
      lastBurstTime = now;
    }

    lastPointer = { x, y };
  };

  resizeCanvas();
  seedParticles();
  window.addEventListener('resize', resizeCanvas, { passive: true });

  if (!reducedMotion) {
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    animationFrameId = window.requestAnimationFrame(animate);
  } else {
    particles = [];
    context.clearRect(0, 0, width, height);
  }
})();
