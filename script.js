/* ============================================================
   NickDLC — Landing Page Scripts
   ============================================================ */
(function () {
  "use strict";

  const body = document.body;
  const splash = document.getElementById("splash");
  const content = document.getElementById("content");
  const themeToggle = document.getElementById("themeToggle");

  /* ----------------------------------------------------------
     1. SPLASH SCREEN
     ---------------------------------------------------------- */
  let splashDismissed = false;

  function dismissSplash() {
    if (splashDismissed) return;
    splashDismissed = true;

    splash.classList.add("is-hidden");
    body.classList.remove("loading");

    setTimeout(() => {
      document.querySelectorAll(".hero .fade-up").forEach((el, i) => {
        setTimeout(() => el.classList.add("is-visible"), i * 120);
      });
    }, 180);
  }

  ["click", "keydown", "touchstart"].forEach((evt) => {
    window.addEventListener(evt, dismissSplash, { once: true, passive: true });
  });

  setTimeout(dismissSplash, 6000);

  /* ----------------------------------------------------------
     2. LENIS SMOOTH SCROLL + VELOCITY MOTION BLUR
     ---------------------------------------------------------- */
  let lenis = null;
  let blurTimeout = null;
  let currentBlur = 0;

  if (window.Lenis) {
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      smoothTouch: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    lenis.on("scroll", ({ velocity }) => {
      const abs = Math.abs(velocity);
      const target = Math.min(abs / 12, 3);
      if (Math.abs(target - currentBlur) > 0.15) {
        currentBlur = target;
        content.style.filter = target > 0.05 ? `blur(${target.toFixed(2)}px)` : "none";
      }
      clearTimeout(blurTimeout);
      blurTimeout = setTimeout(() => {
        currentBlur = 0;
        content.style.filter = "none";
      }, 120);
    });

    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener("click", (e) => {
        const id = link.getAttribute("href");
        if (id.length < 2) return;
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        lenis.scrollTo(target, { offset: -80, duration: 1.4 });
      });
    });
  } else {
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener("click", (e) => {
        const id = link.getAttribute("href");
        if (id.length < 2) return;
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  }

  /* ----------------------------------------------------------
     3. THEME TOGGLE
     ---------------------------------------------------------- */
  const THEME_KEY = "nickdlc-theme";

  function applyTheme(theme) {
    if (theme === "light") {
      body.classList.add("light-theme");
      themeToggle.setAttribute("aria-pressed", "true");
    } else {
      body.classList.remove("light-theme");
      themeToggle.setAttribute("aria-pressed", "false");
    }
  }

  const savedTheme = localStorage.getItem(THEME_KEY);
  applyTheme(savedTheme === "light" ? "light" : "dark");

  themeToggle.addEventListener("click", () => {
    const isLight = body.classList.toggle("light-theme");
    localStorage.setItem(THEME_KEY, isLight ? "light" : "dark");
    themeToggle.setAttribute("aria-pressed", String(isLight));
  });

  /* ----------------------------------------------------------
     4. FAQ ACCORDION
     ---------------------------------------------------------- */
  document.querySelectorAll(".faq-item").forEach((item) => {
    const btn = item.querySelector(".faq-item__question");
    if (!btn) return;
    btn.addEventListener("click", () => {
      const isOpen = item.classList.contains("is-open");
      document.querySelectorAll(".faq-item.is-open").forEach((open) => {
        if (open !== item) open.classList.remove("is-open");
      });
      item.classList.toggle("is-open", !isOpen);
    });
  });

  /* ----------------------------------------------------------
     5. INTERSECTION OBSERVER — FADE-UP ON SCROLL
     ---------------------------------------------------------- */
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14, rootMargin: "0px 0px -60px 0px" }
  );

  document.querySelectorAll(".fade-up").forEach((el) => {
    if (!el.closest(".hero")) observer.observe(el);
  });

  /* ----------------------------------------------------------
     6. HEADER HIDE ON SCROLL DOWN
     ---------------------------------------------------------- */
  const header = document.querySelector(".header");
  let lastScroll = 0;
  let headerHidden = false;

  window.addEventListener(
    "scroll",
    () => {
      const y = window.scrollY;
      if (y > 120 && y > lastScroll && !headerHidden) {
        header.style.transform = "translateY(-110%)";
        headerHidden = true;
      } else if (y < lastScroll && headerHidden) {
        header.style.transform = "translateY(0)";
        headerHidden = false;
      }
      lastScroll = y;
    },
    { passive: true }
  );
})();
