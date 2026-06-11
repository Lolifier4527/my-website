(function () {

  /* ── Navbar toggle ─────────────────────────── */
  const toggle = document.querySelector(".navbar__toggle");
  const nav = document.querySelector(".navbar__nav");
  const navLinks = document.querySelectorAll(".navbar__link");

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      nav.classList.toggle("is-open", !open);
    });
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        toggle.setAttribute("aria-expanded", "false");
        nav.classList.remove("is-open");
      });
    });
  }

  /* ── Software dropdown ─────────────────────── */
  const dropdownToggle = document.querySelector(".navbar__dropdown-toggle");
  const dropdownMenu   = document.querySelector(".navbar__dropdown-menu");
  if (dropdownToggle && dropdownMenu) {
    dropdownToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      const open = dropdownToggle.getAttribute("aria-expanded") === "true";
      dropdownToggle.setAttribute("aria-expanded", String(!open));
      dropdownMenu.classList.toggle("is-open", !open);
    });
    document.addEventListener("click", () => {
      dropdownToggle.setAttribute("aria-expanded", "false");
      dropdownMenu.classList.remove("is-open");
    });
  }

  /* ── Contact form ──────────────────────────── */
  const form = document.querySelector(".contact__form form");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      btn.textContent = "Sending…";
      btn.disabled = true;
      try {
        const response = await fetch(form.action, {
          method: "POST",
          body: new FormData(form),
          headers: { Accept: "application/json" }
        });
        if (response.ok) {
          btn.textContent = "Message Sent!";
          form.reset();
          setTimeout(() => { btn.textContent = "Send Message"; btn.disabled = false; }, 4000);
        } else { throw new Error(); }
      } catch {
        btn.textContent = "Failed — Try Again";
        btn.disabled = false;
      }
    });
  }

  /* ── Scroll-reveal ─────────────────────────── */
  const revealEls = document.querySelectorAll(
    ".card, .why__item, .contact__info, .contact__form, .section-title, .section-subtitle"
  );
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

  revealEls.forEach((el, i) => {
    el.style.transitionDelay = `${(i % 4) * 80}ms`;
    observer.observe(el);
  });

  /* ── Hero typing effect ────────────────────── */
  const tagline = document.querySelector(".hero__tagline");
  if (tagline) {
    const text = tagline.textContent.trim();
    tagline.textContent = "";
    tagline.style.visibility = "visible";
    let idx = 0;
    const cursor = document.createElement("span");
    cursor.className = "typing-cursor";
    tagline.appendChild(cursor);
    const type = () => {
      if (idx < text.length) {
        tagline.insertBefore(document.createTextNode(text[idx++]), cursor);
        setTimeout(type, 55 + Math.random() * 30);
      } else {
        setTimeout(() => cursor.classList.add("blink-stop"), 1200);
      }
    };
    setTimeout(type, 800);
  }

  /* ── Floating particles ────────────────────── */
  const hero = document.querySelector(".hero");
  if (hero) {
    const canvas = document.createElement("canvas");
    canvas.className = "hero__particles";
    canvas.setAttribute("aria-hidden", "true");
    hero.insertBefore(canvas, hero.firstChild);

    const ctx = canvas.getContext("2d");
    let W, H, particles;

    const colors = ["rgba(176,110,243,", "rgba(34,211,238,", "rgba(74,222,128,"];

    function resize() {
      W = canvas.width = hero.offsetWidth;
      H = canvas.height = hero.offsetHeight;
    }

    function makeParticle() {
      return {
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.8 + 0.4,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.5 + 0.15,
        pulse: Math.random() * Math.PI * 2
      };
    }

    function init() {
      resize();
      particles = Array.from({ length: 80 }, makeParticle);
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      const t = Date.now() * 0.001;
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H;
        if (p.y > H) p.y = 0;
        const a = p.alpha * (0.7 + 0.3 * Math.sin(t * 1.5 + p.pulse));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color + a + ")";
        ctx.fill();
      });

      /* draw faint connecting lines */
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 90) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(34,211,238,${0.06 * (1 - dist / 90)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(draw);
    }

    init();
    draw();
    window.addEventListener("resize", () => { resize(); });
  }

  /* ── Glitch effect on logo text ────────────── */
  const logo = document.querySelector(".navbar__logo");
  if (logo) {
    setInterval(() => {
      if (Math.random() > 0.85) {
        logo.classList.add("glitch");
        setTimeout(() => logo.classList.remove("glitch"), 180);
      }
    }, 2500);
  }

  /* ── Stat counter animation ────────────────── */
  const statEl = document.querySelector(".why__stat");
  if (statEl) {
    const statObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("stat-animate");
          statObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    statObserver.observe(statEl);
  }

  /* ── Navbar active link highlight ─────────── */
  const sections = document.querySelectorAll("section[id]");
  const allNavLinks = document.querySelectorAll(".navbar__link");
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        allNavLinks.forEach((l) => l.classList.remove("is-active"));
        const active = document.querySelector(`.navbar__link[href="#${entry.target.id}"]`);
        if (active) active.classList.add("is-active");
      }
    });
  }, { threshold: 0.4 });
  sections.forEach((s) => navObserver.observe(s));

  /* ── Card tilt on hover ─────────────────────── */
  document.querySelectorAll(".card, .why__item").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `translateY(-6px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });

})();
