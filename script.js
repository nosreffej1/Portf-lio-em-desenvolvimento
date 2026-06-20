/* ================================================================
   Portfólio · Jefferson Gabriel
   Interações leves, sem dependências externas.
   ================================================================ */

(function () {
  "use strict";

  // Ano atual no rodapé
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Sombra/borda do header ao rolar
  const header = document.querySelector("[data-header]");
  if (header) {
    const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  // Menu mobile
  const navToggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".primary-nav");

  if (navToggle && nav) {
    const setOpen = (open) => {
      nav.classList.toggle("is-open", open);
      navToggle.setAttribute("aria-expanded", String(open));
      navToggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    };

    navToggle.addEventListener("click", () =>
      setOpen(!nav.classList.contains("is-open"))
    );
    nav.querySelectorAll("a").forEach((link) =>
      link.addEventListener("click", () => setOpen(false))
    );
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        setOpen(false);
        navToggle.focus();
      }
    });
  }

  // Animações de entrada (fade-up)
  const animated = document.querySelectorAll("[data-animate]");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    animated.forEach((el) => io.observe(el));
  } else {
    animated.forEach((el) => el.classList.add("is-visible"));
  }

  // Destaca o link da seção atual (scrollspy)
  const sections = document.querySelectorAll("main section[id]");
  const navLinks = document.querySelectorAll(".primary-nav a");

  if (sections.length && navLinks.length && "IntersectionObserver" in window) {
    const linkMap = new Map();
    navLinks.forEach((link) => {
      const id = (link.getAttribute("href") || "").replace("#", "");
      if (id) linkMap.set(id, link);
    });

    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const link = linkMap.get(entry.target.id);
          if (!link) return;
          if (entry.isIntersecting) {
            navLinks.forEach((l) => l.classList.remove("is-active"));
            link.classList.add("is-active");
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((section) => spy.observe(section));
  }
})();
