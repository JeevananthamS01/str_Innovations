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

const menuToggle = document.querySelector(".menu-toggle");
const mobileMenu = document.querySelector(".mobile-menu");

if (menuToggle && mobileMenu) {
  menuToggle.addEventListener("click", () => {
    const open = mobileMenu.classList.toggle("open");

    body.classList.toggle("menu-open", open);

    menuToggle.setAttribute("aria-expanded", String(open));
  });

  document.querySelectorAll(".mobile-menu a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("open");
      body.classList.remove("menu-open");

      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

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
  const visionGradient = document.getElementById("visionGradientBlinds");

  if (visionGradient && typeof window.initGradientBlinds === "function") {
    window.initGradientBlinds(visionGradient, {
      gradientColors: ["#233154", "#D7B15E", "#233154"],
      angle: 0,
      noise: 0.3,
      blindCount: 16,
      blindMinWidth: 60,
      mouseDampening: 0.15,
      mirrorGradient: false,
      spotlightRadius: 0.5,
      spotlightSoftness: 1,
      spotlightOpacity: 1,
      distortAmount: 0,
      shineDirection: "left",
      mixBlendMode: "lighten",
      lightMode: false,
    });
  }
});

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
  const gallery =
    document.querySelector(
      ".gallery"
    );

  if (!gallery) return;

  const columns =
    gallery.querySelectorAll(
      ".gallery-column"
    );

  if (
    columns.length < 2
  ) {
    return;
  }

  const speed = 35;

  const tracks =
    gallery.querySelectorAll(
      ".gallery-column-track"
    );

  const originalItems =
    [];

  tracks.forEach(
    (track) => {
      originalItems.push(
        [
          ...track.children
        ]
      );
    }
  );

  function prepareTrack(
    track
  ) {
    const items =
      [
        ...track.children
      ];

    items.forEach(
      (item) => {
        const clone =
          item.cloneNode(
            true
          );

        track.appendChild(
          clone
        );
      }
    );
  }

  tracks.forEach(
    (track) => {
      prepareTrack(track);
    }
  );

  let positions = [
    0,
    0
  ];

  let lastTime =
    performance.now();

  let animationFrame =
    null;

  let paused = [
    false,
    false
  ];

  function getLoopHeight(
    track
  ) {
    const originalCount =
      track.children.length /
      2;

    if (!originalCount) {
      return 0;
    }

    const first =
      track.children[0];

    const repeated =
      track.children[
        originalCount
      ];

    if (
      !first ||
      !repeated
    ) {
      return 0;
    }

    return (
      repeated.offsetTop -
      first.offsetTop
    );
  }

  function animate(
    currentTime
  ) {
    const delta =
      Math.min(
        currentTime -
          lastTime,
        50
      ) / 1000;

    lastTime =
      currentTime;

    tracks.forEach(
      (
        track,
        index
      ) => {
        if (
          paused[index]
        ) {
          return;
        }

        const loopHeight =
          getLoopHeight(
            track
          );

        if (
          loopHeight <= 0
        ) {
          return;
        }

        const direction =
          index === 0
            ? 1
            : -1;

        positions[index] +=
          speed *
          delta *
          direction;

        if (
          positions[index] >=
          loopHeight
        ) {
          positions[index] -=
            loopHeight;
        }

        if (
          positions[index] <=
          -loopHeight
        ) {
          positions[index] +=
            loopHeight;
        }

        track.style.transform =
          `translate3d(0, ${-positions[index]}px, 0)`;
      }
    );

    animationFrame =
      requestAnimationFrame(
        animate
      );
  }

  columns.forEach(
    (
      column,
      index
    ) => {
      column.addEventListener(
        "mouseenter",
        () => {
          paused[index] =
            true;
        }
      );

      column.addEventListener(
        "mouseleave",
        () => {
          paused[index] =
            false;

          lastTime =
            performance.now();
        }
      );

      column.addEventListener(
        "touchstart",
        () => {
          paused[index] =
            true;
        },
        {
          passive: true
        }
      );

      column.addEventListener(
        "touchend",
        () => {
          paused[index] =
            false;

          lastTime =
            performance.now();
        },
        {
          passive: true
        }
      );
    }
  );

  requestAnimationFrame(
    () => {
      tracks.forEach(
        (
          track,
          index
        ) => {
          const loopHeight =
            getLoopHeight(
              track
            );

          if (
            loopHeight <= 0
          ) {
            return;
          }

          if (
            index === 0
          ) {
            positions[index] =
              loopHeight *
              0.2;
          } else {
            positions[index] =
              loopHeight *
              0.65;
          }
        }
      );

      lastTime =
        performance.now();

      animationFrame =
        requestAnimationFrame(
          animate
        );
    }
  );


  /* Gallery Popup */

  const modal =
    document.getElementById(
      "galleryModal"
    );

  const modalImage =
    document.getElementById(
      "galleryModalImage"
    );

  const modalClose =
    document.getElementById(
      "galleryModalClose"
    );

  if (
    modal &&
    modalImage
  ) {
    gallery.addEventListener(
      "click",
      (event) => {
        const image =
          event.target.closest(
            ".gallery-image"
          );

        if (!image) {
          return;
        }

        const imagePath =
          image.dataset
            .image;

        if (!imagePath) {
          return;
        }

        const source =
          image.querySelector(
            "img"
          );

        modalImage.src =
          imagePath;

        modalImage.alt =
          source
            ? source.alt
            : "";

        modal.classList.add(
          "active"
        );

        modal.setAttribute(
          "aria-hidden",
          "false"
        );

        document.body.style.overflow =
          "hidden";
      }
    );

    function closeGalleryModal() {
      modal.classList.remove(
        "active"
      );

      modal.setAttribute(
        "aria-hidden",
        "true"
      );

      document.body.style.overflow =
        "";
    }

    if (modalClose) {
      modalClose.addEventListener(
        "click",
        closeGalleryModal
      );
    }

    modal.addEventListener(
      "click",
      (event) => {
        if (
          event.target ===
          modal
        ) {
          closeGalleryModal();
        }
      }
    );

    document.addEventListener(
      "keydown",
      (event) => {
        if (
          event.key ===
          "Escape"
        ) {
          closeGalleryModal();
        }
      }
    );
  }


  window.addEventListener(
    "beforeunload",
    () => {
      if (
        animationFrame
      ) {
        cancelAnimationFrame(
          animationFrame
        );
      }
    }
  );
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

  const depth = 220;
  const spread = 90;
  const tilt = 22;
  const visibleCards = 3;
  const falloff = 0.2;
  const blur = 6;
  const duration = 650;

  function normalizeIndex(index) {
    return ((index % cards.length) + cards.length) % cards.length;
  }

  function getDistance(index, position) {
    let distance = index - position;

    const count = cards.length;

    if (count > 1) {
      distance = ((distance % count) + count) % count;

      if (distance > count / 2) {
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

      const zIndex = Math.round(2000 - distance * 20);

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
