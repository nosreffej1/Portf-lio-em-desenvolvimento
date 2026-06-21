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

  // -------------------------------------------------------------------------
  // Idioma (PT/EN). O HTML está em português; o dicionário abaixo traz o EN.
  // Ao voltar para PT, restauramos o texto original capturado do DOM.
  // -------------------------------------------------------------------------
  const EN = {
    "skip": "Skip to content",
    "nav.sobre": "About", "nav.exp": "Experience", "nav.stack": "Stack",
    "nav.proj": "Projects", "nav.contato": "Contact",
    "hero.eyebrow": "Available for freelance work",
    "hero.title": 'A <em>full stack</em> developer building enterprise systems, <span class="hl">REST APIs</span> and end-to-end <span class="hl">automation</span>.',
    "hero.lead": "I'm Jefferson. Based in Brasília, I have spent over three years building enterprise software in <strong>PHP&nbsp;/&nbsp;Yii2</strong>, from gathering requirements with business teams to delivery and sign-off with managers.",
    "btn.projetos": "View projects",
    "btn.contato": 'Get in touch <span aria-hidden="true">&rarr;</span>',
    "btn.cv": "Download CV",
    "facts.now.t": "Currently",
    "facts.now.d": "Mid-level Full Stack Developer<br /><span>Stefanini, at BBTS</span>",
    "facts.stack.t": "Stack",
    "facts.stack.d": "PHP &middot; Yii2 &middot; REST APIs<br /><span>BPMN &middot; Supravizio &middot; IronPython</span>",
    "facts.base.t": "Based in",
    "facts.base.d": "Taguatinga, Brazil<br /><span>Remote</span>",
    "facts.lang.t": "Languages",
    "facts.lang.d": "Portuguese (native)<br /><span>English (professional)</span>",
    "sec.01.num": "01, About",
    "sec.01.h": "Focused on systems that must be secure, integrated and scalable.",
    "about.p1": "I work as a mid-level full stack developer focused on enterprise systems, REST APIs and business process automation. Today I am responsible for architecting and evolving a contract management system, going through the whole cycle: requirements, data modeling, code, cross-platform integrations and presenting deliverables.",
    "about.p2": "I value clean code, thinking through the architecture before jumping into implementation, and understanding the business problem behind each feature. I am analytical and move easily between technical and business teams.",
    "about.p3": "In parallel, I am deepening my studies in <strong>cybersecurity</strong> and <strong>software engineering</strong> through postgraduate programs, and I build my own projects, usually high-performance landing pages and automations.",
    "sec.02.num": "02, Experience",
    "sec.02.h": "Over three years building and maintaining enterprise software.",
    "exp.1.role": "Mid-level Full Stack Developer",
    "exp.1.desc": "Promoted to a role with greater technical autonomy maintaining and evolving the corporate contract management system. I architect and implement advanced cross-platform integrations, write complex IronPython automation scripts, and ensure the performance, security and scalability of the RESTful APIs consumed by internal clients and Supravizio / BPMN flows. Agile team (Scrum).",
    "exp.2.role": "IT Analyst",
    "exp.2.desc": "Web application development with PHP and Yii2: building robust CRUDs, maintaining existing systems and implementing REST APIs for integration between corporate systems. Process automation with BPMN, Supravizio and IronPython, advanced form validations and SQL/MySQL database modeling.",
    "exp.3.role": "IT Intern",
    "exp.3.desc": "My first professional experience in the field: supporting the development and automation of corporate processes, with Python / IronPython scripts, building and maintaining Supravizio workflows and mapping processes with BPMN.",
    "edu.title": "Education",
    "edu.1.t": "Cybersecurity Specialization",
    "edu.1.s": "Cruzeiro do Sul Virtual &middot; Postgraduate <em>(in progress)</em>",
    "edu.2.t": "Software Engineering",
    "edu.2.s": "Uniamérica &middot; Postgraduate (Lato Sensu)",
    "edu.3.t": "Systems Analysis and Development",
    "edu.3.s": "Estácio &middot; Technologist degree",
    "sec.03.num": "03, Stack",
    "sec.03.h": "Tools I use day to day, grouped by the role they play.",
    "stack.mvc": "MVC architecture",
    "stack.auth": "Authentication &amp; security",
    "stack.responsive": "Responsive layout",
    "stack.auto.h": "Automation &amp; data",
    "stack.integration": "Systems integration",
    "sec.04.num": "04, Projects",
    "sec.04.h": "Recent work, focused on performance and conversion.",
    "proj.case.type": "Corporate project, under NDA",
    "proj.case.h": "Contract Management System",
    "proj.case.desc": "A corporate system I help architect and evolve: secure REST APIs, BPMN / Supravizio process automation and IronPython scripts, integrating platforms and serving internal clients end to end.",
    "proj.case.note": "Internal project, no public link.",
    "proj.ionia.type": "Landing page, product",
    "proj.ionia.desc": "Launch landing page for a fictional gaming mouse, simulating a real premium product site. Focus on UX, advanced animations and technical storytelling.",
    "proj.nos.type": "Landing page, consulting",
    "proj.nos.desc": "Consulting landing page for software development and architecture. Dark layout, neon accents, responsive cards and a clear booking CTA.",
    "proj.fit.type": "Landing page, digital product",
    "proj.fit.desc": "Page for a smart training program, aimed at people seeking performance based on methodology, technology and follow-up. Clean, conversion-focused layout.",
    "tag.responsive": "Responsive",
    "proj.dev.type": "Landing page, digital product",
    "proj.dev.desc": "Landing page for a program aimed at developers who want to launch digital products in a lean, professional way.",
    "link.live": "View live",
    "link.code": "Code",
    "sec.05.num": "05, Contact",
    "contact.title": "Let's bring your idea to life?",
    "contact.lead": "Whether you want to evolve an existing system, build something new or talk about process automation, just fill in the form below.",
    "form.nome": "Name",
    "form.nome.ph": "What's your name?",
    "form.contato": "Your email or phone <span>(so I can reply)</span>",
    "form.contato.ph": "email@example.com or +55 61 9....",
    "form.tipo": "What do you need?",
    "form.resumo": "Project summary",
    "form.resumo.ph": "Tell me in a few lines what you have in mind.",
    "opt.landing": "Landing page",
    "opt.site": "Company website",
    "opt.api": "System / REST API",
    "opt.auto": "Process automation",
    "opt.maint": "System maintenance / evolution",
    "opt.other": "Other / not sure yet",
    "form.error": "Please fill in your name and the summary to send.",
    "btn.wpp": "Send via WhatsApp",
    "btn.email": "Rather use email",
    "contact.or": "or reach me directly:",
    "label.email": "Email",
    "footer.role": "Full Stack Developer &middot; PHP &middot; Yii2 &middot; REST APIs",
  };

  const i18nNodes = Array.from(document.querySelectorAll("[data-i18n]"));
  const phNodes = Array.from(document.querySelectorAll("[data-i18n-ph]"));
  const ptHTML = new Map();
  const ptPh = new Map();
  i18nNodes.forEach((n) => ptHTML.set(n, n.innerHTML));
  phNodes.forEach((n) => ptPh.set(n, n.getAttribute("placeholder") || ""));

  const toggleBtn = document.querySelector("[data-lang-toggle]");

  const applyLang = (lang) => {
    const en = lang === "en";
    i18nNodes.forEach((n) => {
      const key = n.getAttribute("data-i18n");
      n.innerHTML = en ? (key in EN ? EN[key] : ptHTML.get(n)) : ptHTML.get(n);
    });
    phNodes.forEach((n) => {
      const key = n.getAttribute("data-i18n-ph");
      n.setAttribute("placeholder", en ? (key in EN ? EN[key] : ptPh.get(n)) : ptPh.get(n));
    });
    document.documentElement.lang = en ? "en" : "pt-BR";
    if (toggleBtn) {
      toggleBtn.textContent = en ? "PT" : "EN";
      toggleBtn.setAttribute("aria-label", en ? "Mudar para português" : "Switch to English");
    }
    try { localStorage.setItem("lang", lang); } catch (e) {}
  };

  let saved = null;
  try { saved = localStorage.getItem("lang"); } catch (e) {}
  applyLang(saved === "en" ? "en" : "pt");

  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      applyLang(document.documentElement.lang === "en" ? "pt" : "en");
    });
  }
})();
