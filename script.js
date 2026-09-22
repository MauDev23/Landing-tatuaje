/**
 * Arquitectura modular separada por responsabilidades.
 */

class UIManager {
  constructor() {
    this.body = document.body;
    this.loader = document.getElementById('loader');
    this.menuToggle = document.getElementById('menuToggle');
    this.nav = document.getElementById('nav');
    this.cursor = document.getElementById('cursor');
    this.reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    this.gsapReady = Boolean(window.gsap && window.ScrollTrigger);

    this.initLoader();
    this.initMobileMenu();
    this.initHeaderScroll();
    this.initScrollReveal();
    this.initParallax();
    this.initContactForm();
    this.initLightbox();
    this.initWorksCarousel();
    this.initActiveNavigation();
    this.initHeroMotion();

    if (!this.reducedMotion && this.gsapReady && window.matchMedia?.('(pointer:fine)').matches) {
      this.initCustomCursor();
      this.initMagneticButtons();
      this.initTiltCards();
    }
  }

  initLoader() {
    const hideLoader = () => {
      if (!this.loader) return;
      this.loader.classList.add('hide');
      this.loader.setAttribute('aria-hidden', 'true');
    };
    window.addEventListener('load', hideLoader, { once: true });
    setTimeout(hideLoader, 1200);
  }

  initMobileMenu() {
    if (!this.menuToggle || !this.nav) return;
    this.menuToggle.addEventListener('click', () => {
      const open = this.nav.classList.toggle('open');
      this.menuToggle.classList.toggle('active', open);
      this.menuToggle.setAttribute('aria-expanded', String(open));
      this.body.classList.toggle('menu-open', open);
    });

    this.nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        this.nav.classList.remove('open');
        this.menuToggle.classList.remove('active');
        this.menuToggle.setAttribute('aria-expanded', 'false');
        this.body.classList.remove('menu-open');
      });
    });

    window.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && this.nav.classList.contains('open')) {
        this.nav.classList.remove('open');
        this.menuToggle.classList.remove('active');
        this.menuToggle.setAttribute('aria-expanded', 'false');
        this.body.classList.remove('menu-open');
        this.menuToggle.focus();
      }
    });
  }

  initHeaderScroll() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    let ticking = false;
    const updateHeader = () => {
      header.classList.toggle('is-scrolled', window.scrollY > 36);
      ticking = false;
    };

    updateHeader();
    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(updateHeader);
    }, { passive: true });
  }

  initScrollReveal() {
    if (this.reducedMotion || !this.gsapReady) {
      document.querySelectorAll('.reveal, .reveal-tilt, .image-reveal').forEach((element) => {
        element.style.opacity = '1';
        element.style.clipPath = 'inset(0% 0% 0% 0%)';
      });
      return;
    }

    window.gsap.registerPlugin(window.ScrollTrigger);

    const reveals = document.querySelectorAll('.reveal');
    reveals.forEach(el => {
      window.gsap.fromTo(el,
        { y: 35, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.9, ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none none" }
        }
      );
    });

    const workCards = document.querySelectorAll('.works-carousel .work-card');
    if (workCards.length > 0) {
      window.gsap.fromTo(workCards,
        { y: 35, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.9, stagger: 0.07, ease: "power3.out",
          scrollTrigger: { trigger: ".works-carousel", start: "top 80%" }
        }
      );
    }

    const imageReveals = document.querySelectorAll('.image-reveal');
    imageReveals.forEach(el => {
      window.gsap.fromTo(el,
        { clipPath: "inset(100% 0% 0% 0%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)", duration: 1.2, ease: "power3.inOut",
          scrollTrigger: { trigger: el, start: "top 85%" }
        }
      );
    });
  }

  initParallax() {
    if (this.reducedMotion) return;

    let parallaxTicking = false;
    window.addEventListener('scroll', () => {
      if (parallaxTicking) return;
      parallaxTicking = true;
      window.requestAnimationFrame(() => {
        document.querySelectorAll('.parallax').forEach(el => {
          const speed = parseFloat(el.dataset.speed || '0.1');
          const rect = el.getBoundingClientRect();
          const offset = (window.innerHeight / 2) - (rect.top + rect.height / 2);
          el.style.transform = `translate3d(0, ${offset * speed * -0.12}px, 0)`;
        });
        parallaxTicking = false;
      });
    }, { passive: true });
  }

  initHeroMotion() {
    const heroArt = document.querySelector('.hero-art');
    if (!heroArt || this.reducedMotion) return;

    heroArt.addEventListener('pointermove', (event) => {
      const rect = heroArt.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      heroArt.style.setProperty('--hero-x', `${x}%`);
      heroArt.style.setProperty('--hero-y', `${y}%`);
    }, { passive: true });

    heroArt.addEventListener('pointerleave', () => {
      heroArt.style.setProperty('--hero-x', '50%');
      heroArt.style.setProperty('--hero-y', '50%');
    });
  }

  initCustomCursor() {
    if (!this.cursor) return;

    const xTo = window.gsap.quickTo(this.cursor, "left", { duration: 0.15, ease: "power3" });
    const yTo = window.gsap.quickTo(this.cursor, "top", { duration: 0.15, ease: "power3" });

    window.addEventListener('pointermove', (e) => {
      xTo(e.clientX);
      yTo(e.clientY);
      this.cursor.style.opacity = '1';
    }, { passive: true });

    document.querySelectorAll('a, button, input, textarea, .work-card').forEach(el => {
      el.addEventListener('mouseenter', () => this.cursor.classList.add('hover'));
      el.addEventListener('mouseleave', () => this.cursor.classList.remove('hover'));
    });
  }

  initMagneticButtons() {
    document.querySelectorAll('.magnetic').forEach(el => {
      const xTo = window.gsap.quickTo(el, "x", { duration: 0.4, ease: "power3.out" });
      const yTo = window.gsap.quickTo(el, "y", { duration: 0.4, ease: "power3.out" });

      el.addEventListener('pointermove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = (e.clientX - (rect.left + rect.width / 2)) * 0.25;
        const y = (e.clientY - (rect.top + rect.height / 2)) * 0.25;
        xTo(x);
        yTo(y);
      });
      el.addEventListener('pointerleave', () => {
        xTo(0);
        yTo(0);
      });
    });
  }

  initTiltCards() {
    document.querySelectorAll('.reveal-tilt').forEach(card => {
      const rotXTo = window.gsap.quickTo(card, "rotationX", { duration: 0.4, ease: "power2" });
      const rotYTo = window.gsap.quickTo(card, "rotationY", { duration: 0.4, ease: "power2" });

      card.addEventListener('pointermove', (event) => {
        const rect = card.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) - 0.5;
        const y = ((event.clientY - rect.top) / rect.height) - 0.5;
        window.gsap.set(card, { transformPerspective: 900 });
        rotXTo(y * -8);
        rotYTo(x * 8);
      });
      card.addEventListener('pointerleave', () => {
        rotXTo(0);
        rotYTo(0);
      });
    });
  }

  initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', (event) => {
      if (!form.reportValidity()) {
        event.preventDefault();
        return;
      }

      if (form.action.startsWith('https://formspree.io/f/')) return;

      event.preventDefault();

      const status = document.getElementById('formStatus');
      if (status) {
        status.textContent = 'Tu mensaje está listo. Para recibirlo, conecta este formulario a Formspree, EmailJS o a tu propio backend.';
      }
    });
  }

  initLightbox() {
    const dialog = document.getElementById('workDialog');
    const image = document.getElementById('dialogImage');
    const title = document.getElementById('dialogTitle');
    const closeButton = dialog?.querySelector('.dialog-close');
    const cta = document.getElementById('dialogCta');

    if (!dialog || !image || !title || !closeButton || typeof dialog.showModal !== 'function') return;

    document.querySelectorAll('[data-lightbox-title]').forEach((work) => {
      work.addEventListener('click', (event) => {
        event.preventDefault();
        const source = work.querySelector('img');
        image.src = work.getAttribute('href') || source?.src || '';
        image.alt = source?.alt || '';
        title.textContent = work.dataset.lightboxTitle || '';

        window.requestAnimationFrame(() => {
          if (!dialog.open) dialog.showModal();
        });
      });
    });

    closeButton.addEventListener('click', () => dialog.close());
    cta?.addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) dialog.close();
    });
  }

  initWorksCarousel() {
    const carousel = document.querySelector('[data-carousel]');
    const track = carousel?.querySelector('.works-grid');
    const cards = track ? [...track.querySelectorAll('.work-card')] : [];

    if (!carousel || !track || cards.length === 0) return;

    const getStep = () => {
      const card = cards[0];
      const styles = window.getComputedStyle(track);
      return card.getBoundingClientRect().width + parseFloat(styles.columnGap || styles.gap || '0');
    };

    const scrollByCard = (direction) => {
      track.scrollBy({ left: getStep() * direction, behavior: this.reducedMotion ? 'auto' : 'smooth' });
    };

    let diffusionFrame = null;
    let previousScrollLeft = track.scrollLeft;
    let diffusionStrength = 0;
    let wheelFrame = null;
    let wheelTarget = track.scrollLeft;
    let isDragging = false;

    const renderDiffusion = () => {
      diffusionFrame = null;
      const movement = Math.abs(track.scrollLeft - previousScrollLeft);
      previousScrollLeft = track.scrollLeft;
      diffusionStrength = Math.max(diffusionStrength * 0.82, Math.min(1, movement / 32));

      const viewportCenter = track.getBoundingClientRect().left + track.clientWidth / 2;
      cards.forEach((card) => {
        const cardCenter = card.getBoundingClientRect().left + card.offsetWidth / 2;
        const distanceFromCenter = Math.min(
          1,
          Math.abs(cardCenter - viewportCenter) / Math.max(1, track.clientWidth * 0.65)
        );
        const cardStrength = diffusionStrength * (0.62 + distanceFromCenter * 0.38);
        card.style.setProperty('--diffusion-blur', `${(cardStrength * 2.6).toFixed(2)}px`);
        card.style.setProperty('--diffusion-scale', (cardStrength * 0.035).toFixed(4));
        card.style.setProperty('--diffusion-opacity', (1 - cardStrength * 0.12).toFixed(3));
      });

      track.classList.toggle('is-diffusing', diffusionStrength > 0.015);
      if (diffusionStrength > 0.015) {
        diffusionFrame = window.requestAnimationFrame(renderDiffusion);
      }
    };

    const requestDiffusion = () => {
      if (this.reducedMotion || diffusionFrame) return;
      diffusionFrame = window.requestAnimationFrame(renderDiffusion);
    };

    track.addEventListener('scroll', () => {
      if (!wheelFrame && !isDragging) wheelTarget = track.scrollLeft;
      requestDiffusion();
    }, { passive: true });
    track.addEventListener('wheel', (event) => {
      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
      const maxScroll = track.scrollWidth - track.clientWidth;
      const atStart = track.scrollLeft <= 0 && event.deltaY < 0;
      const atEnd = track.scrollLeft >= maxScroll - 1 && event.deltaY > 0;
      if (atStart || atEnd) return;
      event.preventDefault();

      wheelTarget = Math.max(
        0,
        Math.min(maxScroll, wheelTarget + event.deltaY * 1.15)
      );

      if (wheelFrame) return;

      const animateWheel = () => {
        const distance = wheelTarget - track.scrollLeft;
        if (Math.abs(distance) < 0.5) {
          track.scrollLeft = wheelTarget;
          wheelFrame = null;
          return;
        }
        track.scrollLeft += distance * 0.28;
        wheelFrame = window.requestAnimationFrame(animateWheel);
      };

      wheelFrame = window.requestAnimationFrame(animateWheel);
    }, { passive: false });

    track.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        scrollByCard(-1);
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        scrollByCard(1);
      }
    });

    let hasDragged = false;
    let suppressClick = false;
    let dragStartX = 0;
    let scrollStart = 0;

    track.addEventListener('pointerdown', (event) => {
      if (event.pointerType !== 'mouse' || event.button !== 0) return;
      isDragging = true;
      hasDragged = false;
      dragStartX = event.clientX;
      scrollStart = track.scrollLeft;
      wheelTarget = track.scrollLeft;
    });

    track.addEventListener('pointermove', (event) => {
      if (!isDragging) return;
      const distance = event.clientX - dragStartX;
      if (!hasDragged && Math.abs(distance) < 8) return;
      if (!hasDragged) {
        track.setPointerCapture(event.pointerId);
        track.classList.add('is-dragging');
      }
      track.scrollLeft = scrollStart - distance;
      hasDragged = true;
    });

    const stopDragging = () => {
      if (hasDragged) suppressClick = true;
      isDragging = false;
      track.classList.remove('is-dragging');
    };

    track.addEventListener('pointerup', stopDragging);
    track.addEventListener('pointercancel', stopDragging);
    track.addEventListener('lostpointercapture', stopDragging);
    window.addEventListener('pointerup', stopDragging, { passive: true });
    window.addEventListener('pointercancel', stopDragging, { passive: true });
    track.addEventListener('click', (event) => {
      if (!suppressClick) return;
      event.preventDefault();
      event.stopPropagation();
      suppressClick = false;
    }, true);
    track.addEventListener('dragstart', (event) => event.preventDefault());
  }

  initActiveNavigation() {
    const links = [...document.querySelectorAll('.nav a[href^="#"]')];
    const sections = links
      .map((link) => document.querySelector(link.getAttribute('href')))
      .filter(Boolean);

    if (!('IntersectionObserver' in window) || sections.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((link) => {
          const isActive = link.getAttribute('href') === `#${entry.target.id}`;
          link.classList.toggle('is-active', isActive);
          if (isActive) {
            link.setAttribute('aria-current', 'page');
          } else {
            link.removeAttribute('aria-current');
          }
        });
      });
    }, { rootMargin: '-35% 0px -55% 0px' });

    sections.forEach((section) => observer.observe(section));
  }
}

class CharcoalExperience {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    if (!this.container || this.reducedMotion) return;
    this.loadThree();
  }

  async loadThree() {
    try {
      const THREE = await import('https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js');
      this.initScene(THREE);
    } catch (error) {
      console.warn('[Javier Dibujos] WebGL desactivado:', error);
    }
  }

  initScene(THREE) {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(48, window.innerWidth / window.innerHeight, 0.1, 100);
    this.camera.position.z = 8;

    this.renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: 'high-performance' });
    this.dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    this.renderer.setPixelRatio(this.dpr);
    this.renderer.setSize(window.innerWidth, window.innerHeight, false);
    this.container.appendChild(this.renderer.domElement);

    this.createCharcoalDust(THREE);
    this.addInteractivity(THREE);

    this.clock = new THREE.Clock();
    this.isDocumentVisible = !document.hidden;
    this.animate();

    window.addEventListener('resize', () => this.resize(), { passive: true });
    document.addEventListener('visibilitychange', () => {
      this.isDocumentVisible = !document.hidden;
      if (this.isDocumentVisible && !this.frameId) this.animate();
    });
  }

  createCharcoalDust(THREE) {
    const isMobile = window.innerWidth < 700;
    const count = isMobile ? 400 : 1200;
    const positions = new Float32Array(count * 3);
    const phases = new Float32Array(count);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const n = i * 3;
      positions[n] = (Math.random() - 0.5) * 20;
      positions[n + 1] = (Math.random() - 0.5) * 12;
      positions[n + 2] = (Math.random() - 0.5) * 8;
      phases[i] = Math.random() * Math.PI * 2;
      sizes[i] = 0.015 + Math.random() * 0.04;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));
    geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));

    this.material = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2() },
        uPixelRatio: { value: this.dpr }
      },
      vertexShader: `
        attribute float aPhase;
        attribute float aSize;
        uniform float uTime;
        uniform float uPixelRatio;
        uniform vec2 uMouse;
        varying float vAlpha;
        void main() {
          vec3 p = position;
          vec2 force = uMouse * 3.0 - p.xy * 0.2;
          float dist = length(force);
          float effect = smoothstep(2.5, 0.0, dist);
          float angle = effect * 3.0;
          float s = sin(angle);
          float c = cos(angle);
          float tempX = p.x;
          p.x = tempX * c - p.y * s;
          p.y = tempX * s + p.y * c;
          p.xy += normalize(force + 0.0001) * (effect * 0.8);
          p.x += cos(uTime * 0.15 + aPhase) * 0.15;
          p.y += sin(uTime * 0.2 + aPhase) * 0.15;
          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          gl_Position = projectionMatrix * mv;
          float pulse = 0.5 + 0.5 * sin(uTime + aPhase);
          gl_PointSize = aSize * 900.0 * uPixelRatio * pulse / max(1.0, -mv.z);
          vAlpha = pulse * (1.0 - effect * 0.5);
        }
      `,
      fragmentShader: `
        varying float vAlpha;
        void main() {
          vec2 uv = gl_PointCoord - 0.5;
          float d = length(uv);
          float alpha = smoothstep(0.5, 0.1, d) * 0.5 * vAlpha;
          gl_FragColor = vec4(0.76, 0.76, 0.76, alpha * 0.7);
        }
      `
    });

    this.particles = new THREE.Points(geometry, this.material);
    this.scene.add(this.particles);
  }

  addInteractivity(THREE) {
    this.target = new THREE.Vector2();
    this.mouse = new THREE.Vector2();

    window.addEventListener('pointermove', (event) => {
      this.target.x = (event.clientX / window.innerWidth - 0.5) * 2;
      this.target.y = -(event.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });

    if (window.gsap && window.ScrollTrigger) {
      window.gsap.to(this.camera.position, {
        z: 2.5,
        y: -1.5,
        ease: "none",
        scrollTrigger: {
          trigger: "body",
          start: "top top",
          end: "bottom bottom",
          scrub: 1.2
        }
      });

      window.gsap.to(this.particles.rotation, {
        y: Math.PI * 0.4,
        x: Math.PI * 0.1,
        ease: "none",
        scrollTrigger: {
          trigger: "body",
          start: "top top",
          end: "bottom bottom",
          scrub: 2
        }
      });
    }
  }

  animate() {
    if (!this.isDocumentVisible) {
      this.frameId = null;
      return;
    }

    this.frameId = window.requestAnimationFrame(() => this.animate());
    const time = this.clock.getElapsedTime();

    this.mouse.lerp(this.target, 0.06);

    this.material.uniforms.uTime.value = time;
    this.material.uniforms.uMouse.value.copy(this.mouse);

    this.particles.rotation.y += (this.mouse.x * 0.2 - this.particles.rotation.y) * 0.05;
    this.particles.rotation.x += (-this.mouse.y * 0.2 - this.particles.rotation.x) * 0.05;

    this.renderer.render(this.scene, this.camera);
  }

  resize() {
    this.dpr = Math.min(window.devicePixelRatio || 1, window.innerWidth < 700 ? 1.05 : 1.5);
    this.renderer.setPixelRatio(this.dpr);
    this.renderer.setSize(window.innerWidth, window.innerHeight, false);
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new UIManager();
});