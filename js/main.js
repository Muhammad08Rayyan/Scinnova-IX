const cursorDot = document.querySelector(".cursor-dot");
const cursorOutline = document.querySelector(".cursor-outline");
window.addEventListener("mousemove", function (e) {
  const posX = e.clientX;
  const posY = e.clientY;
  if (cursorDot && cursorOutline) {
    cursorDot.style.left = `${posX}px`;
    cursorDot.style.top = `${posY}px`;
    cursorOutline.animate(
      {
        left: `${posX}px`,
        top: `${posY}px`,
      },
      { duration: 500, fill: "forwards" }
    );
  }
});
const hoverables = document.querySelectorAll(
  "a:not(.magick-nav a):not(.cta-btn):not(.partner-link), button, .magnetic-btn, .module-card"
);
hoverables.forEach((el) => {
  el.addEventListener("mouseenter", () => {
    cursorOutline.style.width = "60px";
    cursorOutline.style.height = "60px";
    cursorOutline.style.backgroundColor = "rgba(212, 175, 55, 0.1)";
  });
  el.addEventListener("mouseleave", () => {
    cursorOutline.style.width = "40px";
    cursorOutline.style.height = "40px";
    cursorOutline.style.backgroundColor = "transparent";
  });
});
window.lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  direction: "vertical",
  gestureDirection: "vertical",
  smooth: true,
  mouseMultiplier: 1,
  smoothTouch: false,
  touchMultiplier: 2,
  infinite: false,
  syncTouch: true,
});
window.lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((time) => {
  window.lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

ScrollTrigger.refresh();
window.addEventListener("load", () => {
  initLoader();
  tryAutoPlay();
  initHero();
  initModulesScroll();
  initScroll();
  initFAQ();
  initCountdown();
  initMagneticButtons();
  initGallery();
  initMobileMenu();
  initSponsorsScroll();
});
/* === LOADER === */
function initLoader() {
  const tl = gsap.timeline();
  tl.from(".loader-text", {
    opacity: 0,
    y: 20,
    duration: 1,
    ease: "power2.out",
  })
    .from(
      ".loader-subtext",
      {
        opacity: 0,
        y: 20,
        duration: 1,
        ease: "power2.out",
      },
      "-=0.5"
    )
    .to(".loader", {
      opacity: 0,
      duration: 1,
      delay: 1,
      pointerEvents: "none",
      ease: "power2.inOut",
    });
}
/* === HERO ANIMATION === */
function initHero() {
  const tl = gsap.timeline({ delay: 0.5 });
  tl.from(".fire-timer", {
    scale: 0.8,
    opacity: 0,
    filter: "blur(10px)",
    duration: 2,
    ease: "power4.out",
  }).from(
    ".hero-title-small",
    {
      opacity: 0,
      letterSpacing: "1em",
      duration: 1.5,
      ease: "power2.out",
    },
    "-=1.5"
  );
}
/* === GENERAL SCROLL ANIMATIONS === */
function initScroll() {
  if (window.innerWidth > 1024) {
    gsap.fromTo(
      ".parallax-img",
      {
        yPercent: -10,
      },
      {
        yPercent: 10,
        ease: "none",
        scrollTrigger: {
          trigger: ".editorial-image",
          start: "top bottom",
          end: "bottom top",
          scrub: 0.5,
        },
      }
    );
  }
  gsap.to(".image-frame", {
    clipPath: "inset(0 0 0 0)",
    duration: 1.5,
    ease: "power4.out",
    scrollTrigger: {
      trigger: ".editorial-image",
      start: "top 70%",
    },
  });
  const revealElements = document.querySelectorAll(".reveal-text");
  revealElements.forEach((el) => {
    gsap.from(el, {
      y: 50,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
      },
    });
  });
  initStackingCards();
}
function initStackingCards() {
  const cards = gsap.utils.toArray(".testimonial-card-stack");
  cards.forEach((card, index) => {
    gsap.from(card, {
      opacity: 0,
      y: 50,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: card,
        start: "top 80%",
      },
    });
    ScrollTrigger.create({
      trigger: card,
      start: "top top",
      onEnter: () => {
        if (audio.enabled && index < 2 && window.innerWidth > 768) {
          const flipSound = audio.flip.cloneNode();
          flipSound.volume = 0.5;
          flipSound.play().catch(() => {});
        }
      },
      once: false,
    });
  });
}
function initMagneticButtons() {
  const magnets = document.querySelectorAll(".magnetic-btn");
  magnets.forEach((magnet) => {
    if (magnet.closest(".magick-nav")) {
      return;
    }
    magnet.addEventListener("mousemove", (e) => {
      const rect = magnet.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      gsap.to(magnet, {
        x: x * 0.3,
        y: y * 0.3,
        duration: 0.3,
        ease: "power2.out",
      });
    });
    magnet.addEventListener("mouseleave", () => {
      gsap.to(magnet, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: "elastic.out(1, 0.3)",
      });
    });
  });
}
/* === FAQ / ORACLE === */
function initFAQ() {
  const items = document.querySelectorAll(".faq-item");
  items.forEach((item) => {
    const question = item.querySelector(".faq-question");
    question.addEventListener("click", () => {
      const isActive = item.classList.contains("active");

      if (window.lenis) {
        window.lenis.stop();
      }

      items.forEach((i) => {
        i.classList.remove("active");
        i.querySelector(".faq-answer").style.maxHeight = null;
      });
      if (!isActive) {
        item.classList.add("active");
        const answer = item.querySelector(".faq-answer");
        answer.style.maxHeight = answer.scrollHeight + "px";
      }

      setTimeout(() => {
        if (typeof ScrollTrigger !== "undefined") {
          ScrollTrigger.refresh();
        }
        if (window.lenis) {
          window.lenis.start();
        }
      }, 500);
    });
  });
}
/* === COUNTDOWN TIMER === */
function initCountdown() {
  const targetDate = new Date("2026-01-09T08:00:00+05:00").getTime();
  let fireworksTriggered = false;
  function updateTimer() {
    const now = new Date().getTime();
    const distance = targetDate - now;
    if (distance < 0) {
      document.getElementById("days").innerText = "00";
      document.getElementById("hours").innerText = "00";
      document.getElementById("minutes").innerText = "00";
      document.getElementById("seconds").innerText = "00";
      if (!fireworksTriggered) {
        startFireworks();
        fireworksTriggered = true;
      }
      return;
    }
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    document.getElementById("days").innerText = days < 10 ? "0" + days : days;
    document.getElementById("hours").innerText =
      hours < 10 ? "0" + hours : hours;
    document.getElementById("minutes").innerText =
      minutes < 10 ? "0" + minutes : minutes;
    const prevSeconds = document.getElementById("seconds").innerText;
    const newSeconds = seconds < 10 ? "0" + seconds : seconds;
    if (prevSeconds !== newSeconds) {
      document.getElementById("seconds").innerText = newSeconds;
      if (
        audio.enabled &&
        !fireworksTriggered &&
        isHeroVisible() &&
        !document.hidden
      ) {
        audio.tick.currentTime = 0;
        audio.tick.volume = 0.5;
        audio.tick.play().catch(() => {});
      }
    }
  }
  setInterval(updateTimer, 1000);
  updateTimer();
}
function startFireworks() {
  const canvas = document.getElementById("fireworks-canvas");
  const ctx = canvas.getContext("2d");
  let width = window.innerWidth;
  let height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
  window.addEventListener("resize", () => {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
  });
  const fireworks = [];
  const particles = [];
  let activeSoundCount = 0;
  function random(min, max) {
    return Math.random() * (max - min) + min;
  }
  class Firework {
    constructor(sx, sy, tx, ty) {
      this.x = sx;
      this.y = sy;
      this.sx = sx;
      this.sy = sy;
      this.tx = tx;
      this.ty = ty;
      this.distanceToTarget = Math.sqrt(
        Math.pow(tx - sx, 2) + Math.pow(ty - sy, 2)
      );
      this.distanceTraveled = 0;
      this.coordinates = [];
      this.coordinateCount = 3;
      while (this.coordinateCount--) {
        this.coordinates.push([this.x, this.y]);
      }
      this.angle = Math.atan2(ty - sy, tx - sx);
      this.speed = 2;
      this.acceleration = 1.05;
      this.brightness = random(50, 70);
      this.targetRadius = 1;
    }
    update(index) {
      this.coordinates.pop();
      this.coordinates.unshift([this.x, this.y]);
      if (this.targetRadius < 8) {
        this.targetRadius += 0.3;
      } else {
        this.targetRadius = 1;
      }
      this.speed *= this.acceleration;
      const vx = Math.cos(this.angle) * this.speed;
      const vy = Math.sin(this.angle) * this.speed;
      this.distanceTraveled = Math.sqrt(
        Math.pow(this.sx - this.x, 2) + Math.pow(this.sy - this.y, 2)
      );
      if (this.distanceTraveled >= this.distanceToTarget) {
        createParticles(this.tx, this.ty);
        fireworks.splice(index, 1);
        if (audio.enabled && isHeroVisible() && activeSoundCount < 2) {
          const fwSound = audio.fireworks.cloneNode();
          fwSound.volume = 0.4 + Math.random() * 0.2;
          fwSound.playbackRate = 0.8 + Math.random() * 0.4;
          activeSoundCount++;
          fwSound.onended = () => {
            activeSoundCount--;
          };
          fwSound.play().catch(() => {
            activeSoundCount--;
          });
        }
      } else {
        this.x += vx;
        this.y += vy;
      }
    }
    draw() {
      ctx.beginPath();
      ctx.moveTo(
        this.coordinates[this.coordinates.length - 1][0],
        this.coordinates[this.coordinates.length - 1][1]
      );
      ctx.lineTo(this.x, this.y);
      ctx.strokeStyle =
        "hsl(" + random(40, 60) + ", 100%, " + this.brightness + "%)";
      ctx.stroke();
    }
  }
  class Particle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.coordinates = [];
      this.coordinateCount = 5;
      while (this.coordinateCount--) {
        this.coordinates.push([this.x, this.y]);
      }
      this.angle = random(0, Math.PI * 2);
      this.speed = random(2, 15);
      this.friction = 0.95;
      this.gravity = 1;
      this.hue = random(40, 60);
      this.brightness = random(50, 80);
      this.alpha = 1;
      this.decay = random(0.015, 0.03);
    }
    update(index) {
      this.coordinates.pop();
      this.coordinates.unshift([this.x, this.y]);
      this.speed *= this.friction;
      this.x += Math.cos(this.angle) * this.speed;
      this.y += Math.sin(this.angle) * this.speed + this.gravity;
      this.alpha -= this.decay;
      if (this.alpha <= this.decay) {
        particles.splice(index, 1);
      }
    }
    draw() {
      ctx.beginPath();
      ctx.moveTo(
        this.coordinates[this.coordinates.length - 1][0],
        this.coordinates[this.coordinates.length - 1][1]
      );
      ctx.lineTo(this.x, this.y);
      ctx.strokeStyle =
        "hsla(" +
        this.hue +
        ", 100%, " +
        this.brightness +
        "%, " +
        this.alpha +
        ")";
      ctx.stroke();
    }
  }
  function createParticles(x, y) {
    let particleCount = 60;
    while (particleCount--) {
      particles.push(new Particle(x, y));
    }
  }
  function loop() {
    requestAnimationFrame(loop);
    ctx.globalCompositeOperation = "destination-out";
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(0, 0, width, height);
    ctx.globalCompositeOperation = "lighter";
    let i = fireworks.length;
    while (i--) {
      fireworks[i].draw();
      fireworks[i].update(i);
    }
    let j = particles.length;
    while (j--) {
      particles[j].draw();
      particles[j].update(j);
    }
    if (Math.random() < 0.05) {
      fireworks.push(
        new Firework(width / 2, height, random(0, width), random(0, height / 2))
      );
    }
  }
  loop();
}
/* === GALLERY SECTION === */
function initGallery() {
  if (window.innerWidth < 768) return;
  const columns = document.querySelectorAll(".gallery-col");
  gsap.to(columns[0], {
    yPercent: -20,
    ease: "none",
    scrollTrigger: {
      trigger: ".gallery-section",
      start: "top bottom",
      end: "bottom top",
      scrub: 1,
    },
  });
  gsap.fromTo(
    columns[1],
    {
      yPercent: -20,
    },
    {
      yPercent: 10,
      ease: "none",
      scrollTrigger: {
        trigger: ".gallery-section",
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
      },
    }
  );
  gsap.to(columns[2], {
    yPercent: -15,
    ease: "none",
    scrollTrigger: {
      trigger: ".gallery-section",
      start: "top bottom",
      end: "bottom top",
      scrub: 1.5,
    },
  });
}

/* === MODULES HORIZONTAL SCROLL === */
function initModulesScroll() {
  const section = document.querySelector(".horizontal-scroll-section");
  const wrapper = document.querySelector(".horizontal-scroll-wrapper");
  const content = document.querySelector(".hs-content");
  if (!section || !wrapper || !content) return;

  if (window.innerWidth > 1024) {
    wrapper.style.overflowX = "hidden";

    const getScrollAmount = () => {
      let contentWidth = content.scrollWidth;
      return -(contentWidth - window.innerWidth);
    };

    const tween = gsap.to(content, {
      x: getScrollAmount,
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: () => `+=${Math.abs(getScrollAmount())}`,
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
      },
    });
  }
}

/* === MOBILE MENU === */
function initMobileMenu() {
  const toggle = document.querySelector(".mobile-menu-toggle");
  const closeBtn = document.querySelector(".mobile-menu-close");
  const overlay = document.querySelector(".mobile-menu-overlay");
  const links = document.querySelectorAll(".mobile-nav-link");
  function toggleMenu() {
    if (!overlay) return;
    overlay.classList.toggle("active");
    if (toggle) toggle.classList.toggle("hidden");
    document.body.style.overflow = overlay.classList.contains("active")
      ? "hidden"
      : "";
  }
  if (toggle) toggle.addEventListener("click", toggleMenu);
  if (closeBtn) closeBtn.addEventListener("click", toggleMenu);
  links.forEach((link) => {
    link.addEventListener("click", () => {
      toggleMenu();
    });
  });
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;
      if (window.lenis) {
        window.lenis.scrollTo(targetId);
      } else {
        document
          .querySelector(targetId)
          ?.scrollIntoView({ behavior: "smooth" });
      }
    });
  });
}
const audio = {
  tick: new Audio("public/Audio/clock-tick.mp3"),
  flip: new Audio("public/Audio/paper-flip.mp3"),
  fireworks: new Audio("public/Audio/fireworks.mp3"),
  enabled: false,
};
function tryAutoPlay() {
  audio.tick.volume = 0.5;
  const promise = audio.tick.play();
  if (promise !== undefined) {
    promise
      .then(() => {
        audio.enabled = true;
        audio.tick.pause();
        audio.tick.currentTime = 0;
      })
      .catch((error) => {});
  }
}
const unlockEvents = [
  "click",
  "keydown",
  "touchstart",
  "mousedown",
  "pointerdown",
  "mousemove",
  "wheel",
  "scroll",
];
unlockEvents.forEach((event) => {
  window.addEventListener(
    event,
    () => {
      if (!audio.enabled) {
        audio.enabled = true;
        [audio.tick, audio.flip, audio.fireworks].forEach((snd) => {
          snd.muted = false;
          snd.volume = 0.5;
          snd.preload = "auto";
          const playPromise = snd.play();
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                snd.pause();
                snd.currentTime = 0;
              })
              .catch((error) => {});
          }
        });
      }
    },
    { once: true, passive: true }
  );
});
function isHeroVisible() {
  const hero = document.getElementById("hero");
  if (!hero) return false;
  const rect = hero.getBoundingClientRect();
  return rect.top < window.innerHeight && rect.bottom > 0;
}

/* === SPONSORS SCROLL === */
function initSponsorsScroll() {
  const wrapper = document.querySelector(".sponsors-scroll-wrapper");
  const pinContainer = document.querySelector(".sponsors-pin-container");

  if (!wrapper || !pinContainer) return;

  if (window.innerWidth <= 768) return;

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: wrapper,
      start: "top top",
      end: "bottom bottom",
      pin: pinContainer,
      scrub: 1,
    },
  });

  gsap.set(".card-platinum", { scale: 1.4, opacity: 1, y: 0, x: 0 });
  gsap.set(".card-bronze", { scale: 0.5, opacity: 0, x: -100, y: 100 });
  gsap.set(".card-gift", { scale: 0.5, opacity: 0, x: 100, y: 100 });

  tl.to(".card-platinum", {
    scale: 0.8,
    y: "-15vh",
    duration: 1.5,
    ease: "power2.inOut",
  });

  tl.to(
    ".card-bronze",
    {
      scale: 1,
      opacity: 1,
      x: "-20vw",
      y: "10vh",
      duration: 1.2,
      ease: "power2.out",
    },
    "-=0.5"
  );

  tl.to(
    ".card-gift",
    {
      scale: 1,
      opacity: 1,
      x: "20vw",
      y: "20vh",
      duration: 1.2,
      ease: "power2.out",
    },
    "-=0.2"
  );
}

/* === ROUND 2 MOBILE LOGIC === */
const ROUND_2_DATA = [
  {
    module: "Arcanum",
    icon: "public/Logos/Module Logos/arcanum trans2.webp",
    teams: ["Team Alpha", "Team Beta", "Team Gamma"],
  },
  {
    module: "Illuminatio",
    icon: "public/Logos/Module Logos/illuminatio.webp",
    teams: ["Team Delta", "Team Epsilon"],
  },
  {
    module: "Ptolemy's Puzzle",
    icon: "public/Logos/Module Logos/Ptolemy’s.webp",
    teams: Array.from({ length: 40 }, (_, i) => `Team Ptolemy ${i + 1}`),
  },
  {
    module: "Planck's Paradox",
    icon: "public/Logos/Module Logos/planks paradoc (1 line).webp",
    teams: ["Team Iota", "Team Kappa"],
  },
  {
    module: "Asclepius",
    icon: "public/Logos/Module Logos/Asclepius.webp",
    teams: ["Team Lambda", "Team Mu", "Team Nu"],
  },
  {
    module: "Redshift",
    icon: "public/Logos/Module Logos/Redshift logo.webp",
    teams: ["Team Xi", "Team Omicron"],
  },
  {
    module: "Automaton",
    icon: "public/Logos/Module Logos/Automaton Logo.webp",
    teams: ["Team Pi", "Team Rho"],
  },
  {
    module: "Freud's Foresit",
    icon: "public/Logos/Module Logos/Freud logo.webp",
    teams: ["Team Sigma", "Team Tau"],
  },
  {
    module: "QWERTY",
    icon: "public/Logos/Module Logos/Qwerty.webp",
    teams: ["Team Upsilon", "Team Phi", "Team Chi"],
  },
];

function initRound2Mobile() {
  const overlay = document.querySelector(".r2-overlay");
  const closeBtn = document.querySelector(".r2-close-btn");
  const contentArea = document.querySelector(".r2-content-area");
  const triggers = document.querySelectorAll(".round-2-trigger");
  const prevBtn = document.querySelector(".r2-prev");
  const nextBtn = document.querySelector(".r2-next");
  const counter = document.querySelector(".r2-counter");

  let currentIndex = 0;

  function renderSlide(index) {
    if (!contentArea) return;
    const data = ROUND_2_DATA[index];

    // Render Card
    contentArea.innerHTML = `
      <div class="r2-card">
        <img src="${data.icon}" alt="${data.module}" class="r2-module-icon">
        <h3 class="r2-module-name">${data.module}</h3>
        <ul class="r2-team-list">
          ${
            data.teams.length
              ? data.teams.map((t) => `<li class="r2-team">${t}</li>`).join("")
              : '<li class="r2-team" style="font-style:italic; opacity:0.7;">Pending...</li>'
          }
        </ul>
      </div>
    `;

    // Update Counter
    if (counter) counter.textContent = `${index + 1} / ${ROUND_2_DATA.length}`;

    // Update Buttons
    if (prevBtn) prevBtn.disabled = index === 0;
    if (nextBtn) nextBtn.disabled = index === ROUND_2_DATA.length - 1;
  }

  function openModal() {
    if (overlay) {
      overlay.classList.add("active");
      document.body.style.overflow = "hidden";
      if (window.lenis) window.lenis.stop();
      renderSlide(currentIndex);
    }
  }

  function closeModal() {
    if (overlay) {
      overlay.classList.remove("active");
      document.body.style.overflow = "";
      if (window.lenis) window.lenis.start();
    }
  }

  // Event Listeners
  triggers.forEach((btn) =>
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      openModal();
    })
  );

  if (closeBtn) closeBtn.addEventListener("click", closeModal);

  if (prevBtn)
    prevBtn.addEventListener("click", () => {
      if (currentIndex > 0) {
        currentIndex--;
        renderSlide(currentIndex);
      }
    });

  if (nextBtn)
    nextBtn.addEventListener("click", () => {
      if (currentIndex < ROUND_2_DATA.length - 1) {
        currentIndex++;
        renderSlide(currentIndex);
      }
    });

  // Close on outside click
  if (overlay)
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) closeModal();
    });
}

// Call init function if we missed the load event or simply run it now
initRound2Mobile();
