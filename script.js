// Ano automático no rodapé
document.getElementById("year").textContent = new Date().getFullYear();

// Menu mobile
const navToggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".nav");

if (navToggle && nav) {
  navToggle.addEventListener("click", () => {
    nav.classList.toggle("is-open");
  });

  // Fecha o menu ao clicar em um link
  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
    });
  });
}

// Animação de entrada suave com IntersectionObserver
const animated = document.querySelectorAll("[data-animate]");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const delay = entry.target.dataset.delay || 0;
          setTimeout(() => {
            entry.target.classList.add("is-visible");
          }, Number(delay));
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.2,
    }
  );

  animated.forEach((el) => observer.observe(el));
} else {
  // fallback simples
  animated.forEach((el) => el.classList.add("is-visible"));
}

// -------- Vitrine de projetos (carrossel) --------
const projectGrid = document.querySelector(".project-grid");
const prevBtn = document.querySelector(".carousel-btn.prev");
const nextBtn = document.querySelector(".carousel-btn.next");

if (projectGrid && prevBtn && nextBtn) {
  const getScrollAmount = () => {
    const card = projectGrid.querySelector(".project-card");
    if (!card) return projectGrid.clientWidth;

    const cardRect = card.getBoundingClientRect();
    return cardRect.width + 24; // 24px ~ gap
  };

  const updateButtons = () => {
    const maxScroll = projectGrid.scrollWidth - projectGrid.clientWidth - 4; // folguinha

    prevBtn.disabled = projectGrid.scrollLeft <= 0;
    nextBtn.disabled = projectGrid.scrollLeft >= maxScroll;
  };

  prevBtn.addEventListener("click", () => {
    projectGrid.scrollBy({
      left: -getScrollAmount(),
      behavior: "smooth",
    });
  });

  nextBtn.addEventListener("click", () => {
    projectGrid.scrollBy({
      left: getScrollAmount(),
      behavior: "smooth",
    });
  });

  projectGrid.addEventListener("scroll", updateButtons);

  // estado inicial
  updateButtons();
}
