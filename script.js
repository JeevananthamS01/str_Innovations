const body = document.body;

window.addEventListener("load", () => {
  setTimeout(() => {
    body.classList.add("loaded");
  }, 250);
});

const header = document.querySelector(".site-header");

if (header) {
  window.addEventListener(
    "scroll",
    () => {
      header.classList.toggle("scrolled", window.scrollY > 30);
    },
    { passive: true },
  );
}

document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;

  const header =
    document.querySelector(".site-header");

  const menuToggle =
    document.querySelector(".menu-toggle");

  const mobileMenu =
    document.querySelector(".mobile-menu");

  const mobileLinks =
    document.querySelectorAll(
      ".mobile-menu a"
    );

  function updateHeader() {
    if (!header) return;

    if (window.scrollY > 30) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }

  updateHeader();

  window.addEventListener(
    "scroll",
    updateHeader,
    {
      passive: true
    }
  );

  if (
    !menuToggle ||
    !mobileMenu
  ) {
    return;
  }

  function openMenu() {
    mobileMenu.classList.add("open");

    body.classList.add("menu-open");

    menuToggle.setAttribute(
      "aria-expanded",
      "true"
    );

    menuToggle.setAttribute(
      "aria-label",
      "Close menu"
    );
  }

  function closeMenu() {
    mobileMenu.classList.remove("open");

    body.classList.remove("menu-open");

    menuToggle.setAttribute(
      "aria-expanded",
      "false"
    );

    menuToggle.setAttribute(
      "aria-label",
      "Open menu"
    );
  }

  function toggleMenu() {
    const isOpen =
      mobileMenu.classList.contains(
        "open"
      );

    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  menuToggle.addEventListener(
    "click",
    toggleMenu
  );

  mobileLinks.forEach((link) => {
    link.addEventListener(
      "click",
      () => {
        closeMenu();
      }
    );
  });

  document.addEventListener(
    "keydown",
    (event) => {
      if (
        event.key === "Escape" &&
        mobileMenu.classList.contains(
          "open"
        )
      ) {
        closeMenu();
        menuToggle.focus();
      }
    }
  );

  window.addEventListener(
    "resize",
    () => {
      if (
        window.innerWidth > 991 &&
        mobileMenu.classList.contains(
          "open"
        )
      ) {
        closeMenu();
      }
    }
  );
});

const revealElements = document.querySelectorAll(".reveal");

if (revealElements.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
    },
  );

  revealElements.forEach((element) => {
    observer.observe(element);
  });
}

const contactForm = document.querySelector("#contactForm");

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);

    const name = data.get("name") || "";
    const company = data.get("company") || "";
    const email = data.get("email") || "";
    const phone = data.get("phone") || "";
    const message = data.get("message") || "";

    const subject = encodeURIComponent(`STR INNOVATION Enquiry - ${name}`);

    const bodyText = encodeURIComponent(
      `Name: ${name}
Company: ${company}
Email: ${email}
Phone: ${phone}

Requirement:
${message}`,
    );

    window.location.href = `mailto:strinnovation26@gmail.com?subject=${subject}&body=${bodyText}`;
  });
}

const yearElement = document.querySelector("#year");

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}


document.addEventListener("DOMContentLoaded", () => {
  const carousel = document.querySelector(".services-carousel");

  const track = document.querySelector(".services-grid");

  if (!carousel || !track) return;

  const originalCards = Array.from(track.querySelectorAll(".service-card"));

  if (originalCards.length < 2) return;

  const originalCount = originalCards.length;

  originalCards.forEach((card) => {
    const clone = card.cloneNode(true);

    clone.classList.remove("reveal", "reveal-delay");

    clone.setAttribute("aria-hidden", "true");

    track.appendChild(clone);
  });

  let position = 0;
  let loopWidth = 0;
  let lastTime = performance.now();

  let paused = false;
  let animationFrame = null;
  let resizeTimer = null;

  const speed = 45;

  function calculateLoopWidth() {
    const cards = track.querySelectorAll(".service-card");

    if (cards.length <= originalCount) {
      return;
    }

    const firstCard = cards[0];
    const firstClone = cards[originalCount];

    loopWidth = firstClone.offsetLeft - firstCard.offsetLeft;
  }

  function updatePosition() {
    track.style.transform = `translate3d(${position}px, 0, 0)`;
  }

  function animate(currentTime) {
    const delta = Math.min(currentTime - lastTime, 50) / 1000;

    lastTime = currentTime;

    if (!paused && loopWidth > 0) {
      position -= speed * delta;

      if (position <= -loopWidth) {
        position += loopWidth;
      }

      updatePosition();
    }

    animationFrame = requestAnimationFrame(animate);
  }

  carousel.addEventListener("mouseenter", () => {
    paused = true;
  });

  carousel.addEventListener("mouseleave", () => {
    paused = false;
    lastTime = performance.now();
  });

  carousel.addEventListener(
    "touchstart",
    () => {
      paused = true;
    },
    {
      passive: true,
    },
  );

  carousel.addEventListener(
    "touchend",
    () => {
      paused = false;
      lastTime = performance.now();
    },
    {
      passive: true,
    },
  );

  carousel.addEventListener(
    "touchcancel",
    () => {
      paused = false;
      lastTime = performance.now();
    },
    {
      passive: true,
    },
  );

  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);

    resizeTimer = setTimeout(() => {
      const oldLoopWidth = loopWidth;

      calculateLoopWidth();

      if (oldLoopWidth > 0 && loopWidth > 0 && oldLoopWidth !== loopWidth) {
        position = (position / oldLoopWidth) * loopWidth;
      }

      if (loopWidth > 0 && position <= -loopWidth) {
        position = position % loopWidth;
      }

      updatePosition();
    }, 100);
  });

  requestAnimationFrame(() => {
    calculateLoopWidth();

    updatePosition();

    lastTime = performance.now();

    animationFrame = requestAnimationFrame(animate);
  });

  window.addEventListener("beforeunload", () => {
    if (animationFrame !== null) {
      cancelAnimationFrame(animationFrame);
    }
  });
});

/* What We do section */
document.addEventListener("DOMContentLoaded", () => {
  const processItems = document.querySelectorAll(".process-item");

  if (!processItems.length) return;

  processItems.forEach((item) => {
    const button = item.querySelector(".process-question");

    if (!button) return;

    button.addEventListener("click", () => {
      const isOpen = item.classList.contains("active");

      processItems.forEach((otherItem) => {
        otherItem.classList.remove("active");

        const otherButton = otherItem.querySelector(".process-question");

        if (otherButton) {
          otherButton.setAttribute("aria-expanded", "false");
        }
      });

      if (!isOpen) {
        item.classList.add("active");

        button.setAttribute("aria-expanded", "true");
      }
    });
  });
});

//Gallery Section
document.addEventListener("DOMContentLoaded", () => {
  const gallery = document.querySelector(".gallery");

  if (!gallery) return;

  const columns = [
    gallery.querySelector(".gallery-column-up"),
    gallery.querySelector(".gallery-column-down"),
  ];

  const tracks = [
    gallery.querySelector(".gallery-column-up .gallery-column-track"),
    gallery.querySelector(".gallery-column-down .gallery-column-track"),
  ];

  if (!columns[0] || !columns[1] || !tracks[0] || !tracks[1]) {
    return;
  }

  const speed = 35;
  const imageCount = 9;

  let loopHeight = 0;
  let positionLeft = 0;
  let positionRight = 0;

  let pausedLeft = false;
  let pausedRight = false;

  let animationFrame = null;
  let lastTime = performance.now();

  /* Duplicate the 9-image sequence */

  tracks.forEach((track) => {
    const originalItems = Array.from(track.children);

    if (originalItems.length !== imageCount) {
      return;
    }

    originalItems.forEach((item) => {
      const clone = item.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      track.appendChild(clone);
    });
  });

  /* Calculate exactly one 9-image sequence */

  function calculateLoopHeight() {
    const first = tracks[0].children[0];
    const secondSetFirst = tracks[0].children[imageCount];

    if (!first || !secondSetFirst) {
      return;
    }

    loopHeight = secondSetFirst.offsetTop - first.offsetTop;
  }

  /* Render */

  function render() {
    // LEFT COLUMN → physically UP
    tracks[0].style.transform = `translate3d(0, ${-positionLeft}px, 0)`;

    // RIGHT COLUMN → physically DOWN
    tracks[1].style.transform = `translate3d(0, ${positionRight}px, 0)`;
  }

  function animate(currentTime) {
    const delta = Math.min(currentTime - lastTime, 50) / 1000;

    lastTime = currentTime;

    // LEFT → UP
    if (!pausedLeft && loopHeight > 0) {
      positionLeft += speed * delta;

      if (positionLeft >= loopHeight) {
        positionLeft -= loopHeight;
      }
    }

    // RIGHT → DOWN
    if (!pausedRight && loopHeight > 0) {
      positionRight += speed * delta;

      if (positionRight >= loopHeight) {
        positionRight -= loopHeight;
      }
    }

    render();

    animationFrame = requestAnimationFrame(animate);
  }

  /* Hover */

  columns[0].addEventListener("mouseenter", () => {
    pausedLeft = true;
  });

  columns[0].addEventListener("mouseleave", () => {
    pausedLeft = false;
    lastTime = performance.now();
  });

  columns[1].addEventListener("mouseenter", () => {
    pausedRight = true;
  });

  columns[1].addEventListener("mouseleave", () => {
    pausedRight = false;
    lastTime = performance.now();
  });

  /* Touch */

  columns[0].addEventListener(
    "touchstart",
    () => {
      pausedLeft = true;
    },
    { passive: true },
  );

  columns[0].addEventListener(
    "touchend",
    () => {
      pausedLeft = false;
      lastTime = performance.now();
    },
    { passive: true },
  );

  columns[1].addEventListener(
    "touchstart",
    () => {
      pausedRight = true;
    },
    { passive: true },
  );

  columns[1].addEventListener(
    "touchend",
    () => {
      pausedRight = false;
      lastTime = performance.now();
    },
    { passive: true },
  );

  /* Initialize */

  function initGallery() {
    calculateLoopHeight();

    if (loopHeight <= 0) {
      requestAnimationFrame(initGallery);
      return;
    }

    // Left starts inside first sequence
    positionLeft = loopHeight * 0.2;

    // Right starts inside second sequence
    positionRight = -loopHeight * 0.65;

    render();

    lastTime = performance.now();

    animationFrame = requestAnimationFrame(animate);
  }

  window.addEventListener("resize", () => {
    calculateLoopHeight();
  });

  initGallery();

  /* Popup */

  const modal = document.getElementById("galleryModal");

  const modalImage = document.getElementById("galleryModalImage");

  const modalClose = document.getElementById("galleryModalClose");

  if (modal && modalImage) {
    gallery.addEventListener("click", (event) => {
      const image = event.target.closest(".gallery-image");

      if (!image) return;

      const imagePath = image.dataset.image;

      if (!imagePath) return;

      const source = image.querySelector("img");

      modalImage.src = imagePath;
      modalImage.alt = source ? source.alt : "";

      modal.classList.add("active");
      modal.setAttribute("aria-hidden", "false");

      document.body.style.overflow = "hidden";
    });

    function closeGalleryModal() {
      modal.classList.remove("active");
      modal.setAttribute("aria-hidden", "true");

      modalImage.src = "";

      document.body.style.overflow = "";
    }

    if (modalClose) {
      modalClose.addEventListener("click", closeGalleryModal);
    }

    modal.addEventListener("click", (event) => {
      if (event.target === modal) {
        closeGalleryModal();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && modal.classList.contains("active")) {
        closeGalleryModal();
      }
    });
  }

  window.addEventListener("beforeunload", () => {
    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
    }
  });
});

//Testimonials Section
document.addEventListener("DOMContentLoaded", () => {
  const root = document.getElementById("testimonialDepth");

  const stage = root?.querySelector(".testimonial-stage");

  const cards = root
    ? [...root.querySelectorAll(".testimonial-depth-card")]
    : [];

  const prev = document.getElementById("testimonialPrev");

  const next = document.getElementById("testimonialNext");

  if (!root || !stage || !cards.length || !prev || !next) {
    return;
  }

  let activeIndex = 0;
  let currentPosition = 0;
  let targetPosition = 0;
  let animationFrame = null;

  const depth = 280;
  const spread = 160;
  const tilt = 360;
  const visibleCards = 3;
  const falloff = 0.2;
  const blur = 10;
  const duration = 650;

  function normalizeIndex(index) {
    return ((index % cards.length) + cards.length) % cards.length;
  }

  function getDistance(index, position) {
    let distance = index - position;

    const count = cards.length;

    if (count > 1) {
      distance = ((distance % count) + count) % count;

      if (distance > count / 0.5) {
        distance -= count;
      }
    }

    return distance;
  }

  function render(position) {
    cards.forEach((card, index) => {
      const distance = getDistance(index, position);

      const back = Math.max(0, distance);

      const absoluteDistance = Math.abs(distance);

      const visible = absoluteDistance <= visibleCards + 0.5;

      const translateZ = -depth * distance;

      const translateX = spread * distance;

      const rotateY = tilt * Math.min(Math.max(distance, 0), 1);

      let opacity = distance < 0 ? Math.max(0, 1 + distance) : 1;

      if (!visible) {
        opacity = 0;
      }

      const brightness = Math.max(0.15, 1 - back * falloff);

      const blurAmount =
        blur > 0
          ? Math.min(blur, (back / Math.max(1, visibleCards)) * blur)
          : 0;

      const zIndex = Math.round(2000 - distance * 10);

      card.style.transform = `translate(-50%, -50%) translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg)`;

      card.style.opacity = opacity;

      card.style.filter = `brightness(${brightness}) blur(${blurAmount}px)`;

      card.style.zIndex = zIndex;

      card.style.pointerEvents = visible && opacity > 0.05 ? "auto" : "none";
    });
  }

  function finishPosition() {
    currentPosition = normalizeIndex(Math.round(targetPosition));

    activeIndex = currentPosition;

    render(currentPosition);
  }

  function animateTo(target) {
    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
    }

    const start = currentPosition;

    const difference = target - start;

    const startTime = performance.now();

    targetPosition = target;

    function animate(currentTime) {
      const elapsed = currentTime - startTime;

      const progress = Math.min(elapsed / duration, 1);

      const eased = 1 - Math.pow(1 - progress, 3);

      currentPosition = start + difference * eased;

      render(currentPosition);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        finishPosition();
        animationFrame = null;
      }
    }

    animationFrame = requestAnimationFrame(animate);
  }

  function goTo(index) {
    const target = normalizeIndex(index);

    let difference = target - activeIndex;

    const count = cards.length;

    if (count > 1) {
      difference = ((difference % count) + count) % count;

      if (difference > count / 2) {
        difference -= count;
      }
    }

    activeIndex = normalizeIndex(activeIndex + difference);

    animateTo(currentPosition + difference);
  }

  function goNext() {
    goTo(activeIndex + 1);
  }

  function goPrevious() {
    goTo(activeIndex - 1);
  }

  prev.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();

    goPrevious();
  });

  next.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();

    goNext();
  });

  cards.forEach((card, index) => {
    card.addEventListener("click", () => {
      goTo(index);
    });
  });

  root.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goPrevious();
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      goNext();
    }
  });

  root.setAttribute("tabindex", "0");

  render(0);
});
