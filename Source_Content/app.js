/* ============================================================
   TECHNOFEST 2026 — Main Application Script
   All event rendering, interactions and UI behaviour
   ============================================================ */

"use strict";

// ── Initialise when DOM is ready ──────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  initNavbar();
  initParticles();
  initCountdown();
  initEvents();
  initFAQ();
  initScrollReveal();
  initScrollProgress();
  initBackToTop();
  initRegisterButtons();
  initMobileNav();
  initModal();
  initSpotlight();
});

// ── Register button central handler ──────────────────────────
function initRegisterButtons() {
  document.querySelectorAll(".register-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const url = CONFIG.GOOGLE_FORM_URL;
      if (!url || url === "PASTE_GOOGLE_FORM_URL_HERE") {
        // Graceful fallback — alert organiser to configure URL
        showConfigAlert();
        return;
      }
      const newWindow = window.open(url, "_blank", "noopener,noreferrer");
      if (!newWindow || newWindow.closed || typeof newWindow.closed === "undefined") {
        window.location.href = url;
      }
    });
  });
}

function showConfigAlert() {
  // Small non-blocking notification
  const el = document.createElement("div");
  el.setAttribute("role", "alert");
  el.style.cssText = `
    position:fixed; bottom:5rem; left:50%; transform:translateX(-50%);
    background:#0c1220; border:1px solid rgba(0,195,255,0.4);
    color:#f0f4ff; padding:1rem 1.5rem; border-radius:10px;
    font-family:'Inter',sans-serif; font-size:0.85rem; z-index:9999;
    box-shadow:0 8px 32px rgba(0,0,0,0.5); max-width:360px; text-align:center;
    animation: fadeSlideUp 0.3s ease;
  `;
  el.innerHTML = `
    <strong style="color:#00c3ff;">Registration coming soon!</strong><br />
    The Google Form link will be active shortly. Stay tuned.
  `;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 4000);
}

// ── NAVBAR ────────────────────────────────────────────────────
function initNavbar() {
  const navbar = document.getElementById("navbar");
  const siteHeader = document.getElementById("site-header");
  const sections = document.querySelectorAll("section[id], #hero");
  const navLinks = document.querySelectorAll(".nav-links a");

  window.addEventListener("scroll", () => {
    const isScrolled = window.scrollY > 40;
    if (navbar) navbar.classList.toggle("scrolled", isScrolled);
    if (siteHeader) siteHeader.classList.toggle("scrolled", isScrolled);

    // Active link highlight
    let current = "";
    sections.forEach((s) => {
      const offset = s.offsetTop - 120;
      if (window.scrollY >= offset) current = s.id;
    });
    navLinks.forEach((a) => {
      a.classList.remove("active");
      if (a.getAttribute("href") === `#${current}`) a.classList.add("active");
    });
  }, { passive: true });
}

// ── MOBILE NAV ────────────────────────────────────────────────
function initMobileNav() {
  const btn = document.getElementById("hamburger-btn");
  const mobileNav = document.getElementById("mobile-nav");
  const links = mobileNav.querySelectorAll(".mobile-nav-link, .mobile-register");

  const open = () => {
    btn.classList.add("open");
    mobileNav.classList.add("open");
    btn.setAttribute("aria-expanded", "true");
    links.forEach((l) => l.setAttribute("tabindex", "0"));
    document.body.style.overflow = "hidden";
  };

  const close = () => {
    btn.classList.remove("open");
    mobileNav.classList.remove("open");
    btn.setAttribute("aria-expanded", "false");
    links.forEach((l) => l.setAttribute("tabindex", "-1"));
    document.body.style.overflow = "";
  };

  btn.addEventListener("click", () => {
    mobileNav.classList.contains("open") ? close() : open();
  });

  links.forEach((l) => {
    l.addEventListener("click", close);
  });

  // Close on Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && mobileNav.classList.contains("open")) close();
  });
}

// ── PARTICLES ─────────────────────────────────────────────────
function initParticles() {
  const container = document.getElementById("particles-container");
  if (!container) return;

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) return;

  const count = window.innerWidth < 768 ? 12 : 25;

  for (let i = 0; i < count; i++) {
    const p = document.createElement("div");
    p.className = "particle";
    p.style.cssText = `
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      animation-delay: ${Math.random() * 6}s;
      animation-duration: ${4 + Math.random() * 4}s;
      width: ${1 + Math.random() * 2}px;
      height: ${1 + Math.random() * 2}px;
      background: ${["#00c3ff", "#9b59ff", "#00ffe7", "#e040fb"][Math.floor(Math.random() * 4)]};
    `;
    container.appendChild(p);
  }
}

// ── COUNTDOWN ─────────────────────────────────────────────────
function initCountdown() {
  const display = document.getElementById("countdown-display");
  if (!display) return;

  const target = new Date(CONFIG.EVENT_DATE).getTime();

  function render() {
    const now = Date.now();
    const diff = target - now;

    if (diff <= 0) {
      display.innerHTML = `<p class="countdown-live">🎉 TECHNOFEST 2026 IS LIVE!</p>`;
      return;
    }

    const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours   = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    const pad = (n) => String(n).padStart(2, "0");

    display.innerHTML = `
      <div class="countdown-unit">
        <div class="countdown-value" aria-label="${days} days">${pad(days)}</div>
        <div class="countdown-unit-label">Days</div>
      </div>
      <div class="countdown-sep" aria-hidden="true">:</div>
      <div class="countdown-unit">
        <div class="countdown-value" aria-label="${hours} hours">${pad(hours)}</div>
        <div class="countdown-unit-label">Hours</div>
      </div>
      <div class="countdown-sep" aria-hidden="true">:</div>
      <div class="countdown-unit">
        <div class="countdown-value" aria-label="${minutes} minutes">${pad(minutes)}</div>
        <div class="countdown-unit-label">Minutes</div>
      </div>
      <div class="countdown-sep" aria-hidden="true">:</div>
      <div class="countdown-unit">
        <div class="countdown-value" aria-label="${seconds} seconds">${pad(seconds)}</div>
        <div class="countdown-unit-label">Seconds</div>
      </div>
    `;
  }

  render();
  setInterval(render, 1000);
}

// ── EVENTS ────────────────────────────────────────────────────
let allEvents = [];
let activeFilter = "all";
let searchQuery = "";

function initEvents() {
  allEvents = [
    ...TECHNICAL_EVENTS.map((e) => ({ ...e, filterKey: "technical" })),
    ...NON_TECHNICAL_EVENTS.map((e) => ({ ...e, filterKey: "non-technical" })),
  ];

  renderEvents();

  // Filter buttons
  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".filter-btn").forEach((b) => {
        b.classList.remove("active");
        b.setAttribute("aria-pressed", "false");
      });
      btn.classList.add("active");
      btn.setAttribute("aria-pressed", "true");
      activeFilter = btn.dataset.filter;
      renderEvents();
    });
  });

  // Search
  const searchInput = document.getElementById("event-search");
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      searchQuery = searchInput.value.toLowerCase().trim();
      renderEvents();
    });
  }
}

function renderEvents() {
  const techGrid    = document.getElementById("tech-grid");
  const nontechGrid = document.getElementById("nontech-grid");
  const techSection    = document.getElementById("tech-section");
  const nontechSection = document.getElementById("nontech-section");
  const noResults  = document.getElementById("no-results");
  const counter    = document.getElementById("event-count-visible");

  const filtered = allEvents.filter((e) => {
    const matchesFilter = activeFilter === "all" || e.filterKey === activeFilter;
    const matchesSearch = !searchQuery
      || e.name.toLowerCase().includes(searchQuery)
      || e.description.toLowerCase().includes(searchQuery);
    return matchesFilter && matchesSearch;
  });

  const filteredTech    = filtered.filter((e) => e.category === "Technical");
  const filteredNontech = filtered.filter((e) => e.category === "Non-Technical");

  techGrid.innerHTML    = filteredTech.map(buildEventCard).join("");
  nontechGrid.innerHTML = filteredNontech.map(buildEventCard).join("");

  techSection.style.display    = filteredTech.length    ? "" : "none";
  nontechSection.style.display = filteredNontech.length ? "" : "none";

  if (noResults) noResults.classList.toggle("visible", filtered.length === 0);
  if (counter) counter.textContent = filtered.length;

  // Attach card click handlers
  document.querySelectorAll(".event-card").forEach((card) => {
    card.addEventListener("click", () => openModal(card.dataset.eventId));
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openModal(card.dataset.eventId);
      }
    });
  });
}

function buildEventCard(event) {
  const isTech = event.category === "Technical";
  const badgeClass = isTech ? "tech" : "nontech";
  const cardClass  = isTech ? "tech" : "nontech";

  return `
    <article class="event-card ${cardClass}" data-event-id="${event.id}"
      role="listitem" tabindex="0"
      aria-label="${event.name} — ${event.category} event. Press Enter to view details.">
      <div class="event-card-top">
        <span class="event-icon" aria-hidden="true">${event.icon}</span>
        <span class="event-badge ${badgeClass}">${event.category}</span>
      </div>
      <h3>${escHtml(event.name)}</h3>
      <p>${escHtml(event.description)}</p>
      <div class="event-card-footer">
        <button class="view-details-btn" tabindex="-1" aria-hidden="true">
          View Details
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12,5 19,12 12,19"/>
          </svg>
        </button>
      </div>
    </article>
  `;
}

// ── MODAL ─────────────────────────────────────────────────────
function initModal() {
  const overlay  = document.getElementById("event-modal");
  const closeBtn = document.getElementById("modal-close-btn");

  closeBtn.addEventListener("click", closeModal);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay.classList.contains("open")) closeModal();
  });

  // Trap focus inside modal when open
  overlay.addEventListener("keydown", (e) => {
    if (e.key !== "Tab") return;
    const focusable = overlay.querySelectorAll(
      'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last  = focusable[focusable.length - 1];
    if (e.shiftKey ? document.activeElement === first : document.activeElement === last) {
      e.preventDefault();
      (e.shiftKey ? last : first).focus();
    }
  });
}

function openModal(eventId) {
  const event = allEvents.find((e) => e.id === eventId);
  if (!event) return;

  const overlay = document.getElementById("event-modal");
  const isTech  = event.category === "Technical";

  document.getElementById("modal-icon").textContent = event.icon;
  document.getElementById("modal-event-title").textContent = event.name;

  const catEl = document.getElementById("modal-category");
  catEl.textContent = event.category;
  catEl.className   = "modal-category " + (isTech ? "event-badge tech" : "event-badge nontech");

  document.getElementById("modal-body").innerHTML = buildModalBody(event);

  // Attach register button inside modal
  overlay.querySelector(".modal-footer .register-btn").addEventListener("click", () => {
    const url = CONFIG.GOOGLE_FORM_URL;
    if (!url || url === "PASTE_GOOGLE_FORM_URL_HERE") { showConfigAlert(); return; }
    window.location.href = url;
  });

  overlay.classList.add("open");
  overlay.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";

  // Focus close button
  setTimeout(() => document.getElementById("modal-close-btn").focus(), 100);
}

function closeModal() {
  const overlay = document.getElementById("event-modal");
  overlay.classList.remove("open");
  overlay.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function buildModalBody(event) {
  const coming = "Details will be announced soon.";

  const infoItems = [
    { label: "Category",  value: event.category },
    { label: "Team Size", value: event.teamSize || coming },
    { label: "Duration",  value: event.duration  || coming },
    { label: "Venue",     value: event.venue      || coming },
  ];

  const infoGrid = `
    <div class="modal-info-grid">
      ${infoItems.map(({ label, value }) => `
        <div class="modal-info-item">
          <div class="label">${escHtml(label)}</div>
          <div class="value">${escHtml(value)}</div>
        </div>
      `).join("")}
    </div>
  `;

  const rulesHtml = event.rules && event.rules.length > 0
    ? `<ul>${event.rules.map((r) => `<li>${escHtml(r)}</li>`).join("")}</ul>`
    : `<p>${coming}</p>`;

  const coordHtml = event.coordinators && event.coordinators.length > 0
    ? `<p>${event.coordinators.join(", ")}</p>`
    : `<p>${coming}</p>`;

  return `
    <div class="modal-section">
      <span class="modal-section-label">Description</span>
      <p>${escHtml(event.description)}</p>
    </div>
    <div class="modal-section">
      <span class="modal-section-label">Event Details</span>
      ${infoGrid}
    </div>
    <div class="modal-section">
      <span class="modal-section-label">Eligibility</span>
      <p>${escHtml(event.eligibility || coming)}</p>
    </div>
    <div class="modal-section">
      <span class="modal-section-label">Rules &amp; Guidelines</span>
      ${rulesHtml}
    </div>
    <div class="modal-section">
      <span class="modal-section-label">Coordinators</span>
      ${coordHtml}
    </div>
    ${event.additionalInfo ? `
    <div class="modal-section">
      <span class="modal-section-label">Additional Information</span>
      <p>${escHtml(event.additionalInfo)}</p>
    </div>` : ""}
  `;
}

// ── FAQ ───────────────────────────────────────────────────────
const FAQ_DATA = [
  {
    q: "How do I register for Technofest 2026?",
    a: "Click any <strong>Register Now</strong> button on this page. You will be redirected to the official Technofest 2026 Google Form where you can complete your registration.",
  },
  {
    q: "Can I participate in both technical and non-technical events?",
    a: "Yes! Select <strong>'Both'</strong> in the Event Participation section of the registration form, then choose your preferred technical and non-technical events.",
  },
  {
    q: "Can I select multiple events within a category?",
    a: "The registration form allows multiple event selections within your chosen category (Technical, Non-Technical or Both). Select all the events you wish to participate in.",
  },
  {
    q: "When is Technofest 2026?",
    a: "Technofest 2026 is on <strong>30 September 2026</strong>. Mark your calendar!",
  },
  {
    q: "Where do I submit my registration?",
    a: "Registration is completed entirely through the official Technofest 2026 Google Form. Click any <strong>Register Now</strong> button to access the form.",
  },
  {
    q: "Where can I find event-specific rules?",
    a: "Click on any event card to view its details. Event-specific rules, eligibility criteria and additional information will be updated here as they become available from the organisers.",
  },
  {
    q: "What information do I need to register?",
    a: "You will need: your college name, your full name, a 10-digit mobile number, your email address, your department, your event participation category, and the names of the events you wish to join.",
  },
  {
    q: "Is there any registration fee?",
    a: "Details about registration fees will be announced soon. Please check back here or contact the organisers for the latest information.",
  },
  {
    q: "What is the venue for Technofest 2026?",
    a: "The venue for Technofest 2026 will be announced soon. Stay tuned for updates.",
  },
];

function initFAQ() {
  const list = document.getElementById("faq-list");
  if (!list) return;

  list.innerHTML = FAQ_DATA.map((item, i) => `
    <div class="faq-item" role="listitem">
      <button class="faq-question" id="faq-btn-${i}" aria-expanded="false" aria-controls="faq-answer-${i}">
        ${escHtml(item.q)}
        <svg class="faq-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
          <polyline points="6,9 12,15 18,9"/>
        </svg>
      </button>
      <div class="faq-answer" id="faq-answer-${i}" role="region" aria-labelledby="faq-btn-${i}">
        <div class="faq-answer-inner">${item.a}</div>
      </div>
    </div>
  `).join("");

  list.querySelectorAll(".faq-question").forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = btn.closest(".faq-item");
      const isOpen = item.classList.contains("open");

      // Close all
      list.querySelectorAll(".faq-item.open").forEach((el) => {
        el.classList.remove("open");
        el.querySelector(".faq-question").setAttribute("aria-expanded", "false");
      });

      if (!isOpen) {
        item.classList.add("open");
        btn.setAttribute("aria-expanded", "true");
      }
    });
  });
}

// ── SCROLL REVEAL ─────────────────────────────────────────────
function initScrollReveal() {
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) {
    document.querySelectorAll(".reveal").forEach((el) => el.classList.add("visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
  );

  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
}

// ── SCROLL PROGRESS ───────────────────────────────────────────
function initScrollProgress() {
  const bar = document.getElementById("scroll-progress");
  if (!bar) return;

  window.addEventListener("scroll", () => {
    const winH   = document.documentElement.scrollHeight - window.innerHeight;
    const pct    = winH > 0 ? (window.scrollY / winH) * 100 : 0;
    bar.style.width = pct + "%";
    bar.setAttribute("aria-valuenow", Math.round(pct));
  }, { passive: true });
}

// ── BACK TO TOP ───────────────────────────────────────────────
function initBackToTop() {
  const btn = document.getElementById("back-to-top");
  if (!btn) return;

  window.addEventListener("scroll", () => {
    btn.classList.toggle("visible", window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// ── UTILITY ───────────────────────────────────────────────────
function escHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// ── AMBIENT CYBER CURSOR SPOTLIGHT ────────────────────────────
function initSpotlight() {
  const spotlight = document.getElementById("cursor-spotlight");
  if (!spotlight) return;

  const isTouch = window.matchMedia("(pointer: coarse)").matches;
  if (isTouch) {
    spotlight.style.display = "none";
    return;
  }

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let currentX = mouseX;
  let currentY = mouseY;
  let isMoving = false;

  window.addEventListener("pointermove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!isMoving) {
      isMoving = true;
      spotlight.style.opacity = "1";
    }
  }, { passive: true });

  document.addEventListener("mouseleave", () => {
    spotlight.style.opacity = "0";
    isMoving = false;
  });

  function renderSpotlight() {
    currentX += (mouseX - currentX) * 0.12;
    currentY += (mouseY - currentY) * 0.12;

    spotlight.style.left = `${currentX}px`;
    spotlight.style.top = `${currentY}px`;

    requestAnimationFrame(renderSpotlight);
  }
  requestAnimationFrame(renderSpotlight);
}
