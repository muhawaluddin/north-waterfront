const docReady = (fn) => {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", fn);
  } else {
    fn();
  }
};

docReady(() => {
  const nav = document.querySelector("[data-nav]");
  const toggle = document.querySelector("[data-nav-toggle]");
  const menu = document.querySelector("[data-nav-menu]");
  const parallaxMedia = document.querySelector("[data-parallax]");
  const parallaxContent = document.querySelector("[data-parallax-content]");

  const setNavState = () => {
    if (!nav) return;
    const threshold = 120;
    if (window.scrollY > threshold) {
      nav.classList.add("is-scrolled");
    } else {
      nav.classList.remove("is-scrolled");
    }
  };

  setNavState();
  window.addEventListener("scroll", setNavState, { passive: true });

  if (toggle && menu) {
    toggle.addEventListener("click", () => {
      const expanded = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!expanded));
      menu.classList.toggle("is-active");
    });

    menu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        if (window.innerWidth <= 900) {
          toggle.setAttribute("aria-expanded", "false");
          menu.classList.remove("is-active");
        }
      });
    });
  }

  const parallax = () => {
    const scrollY = window.scrollY;
    if (parallaxMedia) {
      parallaxMedia.style.transform = `translateY(${scrollY * 0.2}px)`;
    }
    if (parallaxContent) {
      parallaxContent.style.transform = `translateY(${scrollY * 0.1}px)`;
    }
  };

  window.addEventListener("scroll", parallax, { passive: true });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll("[data-animate]").forEach((element) => observer.observe(element));

  const uploadForms = document.querySelectorAll("[data-upload-form]");
  uploadForms.forEach((form) => {
    form.addEventListener("submit", () => {
      form.classList.add("is-submitting");
    });
  });

  const lightbox = document.querySelector("[data-lightbox]");
  const lightboxImage = document.querySelector("[data-lightbox-image]");
  const lightboxCaption = document.querySelector("[data-lightbox-caption]");
  const lightboxClose = document.querySelector("[data-lightbox-close]");
  const galleryLinks = document.querySelectorAll("[data-gallery-item]");

  if (lightbox && lightboxImage && lightboxCaption) {
    const openLightbox = (event, link) => {
      event.preventDefault();
      const img = link.querySelector("img");
      lightboxImage.src = link.getAttribute("href");
      lightboxImage.alt = img ? img.alt : "";
      lightboxCaption.textContent = img ? img.alt : "";
      lightbox.classList.add("is-open");
      document.body.style.overflow = "hidden";
    };

    const closeLightbox = () => {
      lightbox.classList.remove("is-open");
      lightboxImage.src = "";
      lightboxCaption.textContent = "";
      document.body.style.overflow = "";
    };

    galleryLinks.forEach((link) => {
      link.addEventListener("click", (event) => openLightbox(event, link));
      link.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          openLightbox(event, link);
        }
      });
      link.setAttribute("role", "button");
      link.setAttribute("tabindex", "0");
    });

    if (lightboxClose) {
      lightboxClose.addEventListener("click", closeLightbox);
    }

    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) {
        closeLightbox();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && lightbox.classList.contains("is-open")) {
        closeLightbox();
      }
    });
  }
});
