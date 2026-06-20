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

  // Formulário de contato: monta a mensagem e envia por WhatsApp ou e-mail
  const form = document.getElementById("contact-form");
  if (form) {
    const WHATSAPP = "5561996885766";
    const EMAIL = "jeffersongabriel.contato@gmail.com";
    const errorEl = document.getElementById("cf-error");

    const val = (id) => (document.getElementById(id)?.value || "").trim();

    const buildMessage = () => {
      const nome = val("cf-nome");
      const contato = val("cf-contato");
      const tipo = val("cf-tipo");
      const resumo = val("cf-resumo");

      const linhas = [
        "Olá Jefferson! Vim pelo seu portfólio.",
        "",
        "Nome: " + nome,
        "Tipo de projeto: " + tipo,
      ];
      if (contato) linhas.push("Contato: " + contato);
      linhas.push("", "Resumo:", resumo);
      return linhas.join("\n");
    };

    const send = (channel) => {
      const nome = val("cf-nome");
      const resumo = val("cf-resumo");

      if (!nome || !resumo) {
        if (errorEl) errorEl.hidden = false;
        (nome ? document.getElementById("cf-resumo") : document.getElementById("cf-nome")).focus();
        return;
      }
      if (errorEl) errorEl.hidden = true;

      const tipo = val("cf-tipo");
      const message = buildMessage();

      if (channel === "email") {
        const subject = "Contato via portfólio: " + tipo;
        window.location.href =
          "mailto:" + EMAIL +
          "?subject=" + encodeURIComponent(subject) +
          "&body=" + encodeURIComponent(message);
      } else {
        window.open(
          "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(message),
          "_blank",
          "noopener"
        );
      }
    };

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      send("whatsapp");
    });

    const emailBtn = form.querySelector('[data-channel="email"]');
    if (emailBtn) emailBtn.addEventListener("click", () => send("email"));

    // some o erro assim que o usuário começa a corrigir
    form.addEventListener("input", () => {
      if (errorEl && !errorEl.hidden) errorEl.hidden = true;
    });
  }
})();
