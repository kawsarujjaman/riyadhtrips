(() => {
  "use strict";

  const nav = document.querySelector(".nav-glass");
  const floatingBook = document.querySelector(".floating-book");
  const languageToggle = document.getElementById("languageToggle");
  const bookingForm = document.getElementById("bookingForm");
  const exitForm = document.getElementById("exitForm");
  const toast = document.getElementById("liveToast");
  const exitModalElement = document.getElementById("exitModal");
  const thankYouModalElement = document.getElementById("thankYouModal");
  const canUseBootstrap = Boolean(window.bootstrap?.Modal);
  const exitModal = canUseBootstrap && exitModalElement ? new bootstrap.Modal(exitModalElement) : null;
  const thankYouModal = canUseBootstrap && thankYouModalElement ? new bootstrap.Modal(thankYouModalElement) : null;

  const bookingMessages = [
    "Ahmed from Riyadh booked 2 minutes ago",
    "Noura from Dammam requested AlUla package",
    "Faisal from Jeddah booked 4 seats",
    "Sara from Khobar claimed the Eid offer",
    "Khalid from Riyadh confirmed Taif weekend"
  ];

  // Keep sticky CTAs and nav styling in sync with scroll position.
  function handleScrollState() {
    const scrolled = window.scrollY > 36;
    nav?.classList.toggle("scrolled", scrolled);
    floatingBook?.classList.toggle("visible", window.scrollY > 680);
  }

  // IntersectionObserver keeps animations smooth without scroll polling.
  function initScrollAnimations() {
    const animatedItems = document.querySelectorAll(".animate-on-scroll");

    if (!("IntersectionObserver" in window)) {
      animatedItems.forEach((item) => item.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.16 });

    animatedItems.forEach((item) => observer.observe(item));
  }

  // The timer uses a rolling seven-day deadline for evergreen ad campaigns.
  function initCountdown() {
    const timer = document.getElementById("countdownTimer");
    if (!timer) return;

    const daysEl = timer.querySelector("[data-days]");
    const hoursEl = timer.querySelector("[data-hours]");
    const minutesEl = timer.querySelector("[data-minutes]");
    const secondsEl = timer.querySelector("[data-seconds]");

    const deadline = new Date();
    deadline.setDate(deadline.getDate() + 7);
    deadline.setHours(23, 59, 59, 999);

    const pad = (value) => String(value).padStart(2, "0");

    function updateCountdown() {
      const distance = Math.max(0, deadline.getTime() - Date.now());
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((distance / (1000 * 60)) % 60);
      const seconds = Math.floor((distance / 1000) % 60);

      daysEl.textContent = pad(days);
      hoursEl.textContent = pad(hours);
      minutesEl.textContent = pad(minutes);
      secondsEl.textContent = pad(seconds);
    }

    updateCountdown();
    window.setInterval(updateCountdown, 1000);
  }

  // Forms validate locally and then display the thank-you modal.
  function initForms() {
    bookingForm?.addEventListener("submit", (event) => {
      event.preventDefault();
      event.stopPropagation();

      if (!bookingForm.checkValidity()) {
        bookingForm.classList.add("was-validated");
        return;
      }

      bookingForm.reset();
      bookingForm.classList.remove("was-validated");
      thankYouModal?.show();
    });

    exitForm?.addEventListener("submit", (event) => {
      event.preventDefault();
      exitForm.reset();
      exitModal?.hide();
      thankYouModal?.show();
    });
  }

  // Toggle document direction to prove RTL readiness for Arabic content.
  function initLanguageToggle() {
    languageToggle?.addEventListener("click", () => {
      const html = document.documentElement;
      const isRtl = html.getAttribute("dir") === "rtl";
      html.setAttribute("dir", isRtl ? "ltr" : "rtl");
      html.setAttribute("lang", isRtl ? "en" : "ar");
      languageToggle.textContent = isRtl ? "عربي" : "English";
    });
  }

  // Desktop exit intent and mobile timed offer are shown once per session.
  function initExitIntent() {
    let hasShown = sessionStorage.getItem("exitIntentShown") === "true";

    document.addEventListener("mouseleave", (event) => {
      if (hasShown || event.clientY > 12 || window.innerWidth < 768) return;
      hasShown = true;
      sessionStorage.setItem("exitIntentShown", "true");
      exitModal?.show();
    });

    window.setTimeout(() => {
      if (hasShown || window.innerWidth >= 768) return;
      hasShown = true;
      sessionStorage.setItem("exitIntentShown", "true");
      exitModal?.show();
    }, 22000);
  }

  // Lightweight social proof notifications rotate through dummy bookings.
  function showLiveNotification() {
    if (!toast) return;

    const message = bookingMessages[Math.floor(Math.random() * bookingMessages.length)];
    toast.querySelector("span").textContent = message;
    toast.classList.add("show");

    window.setTimeout(() => {
      toast.classList.remove("show");
    }, 5200);
  }

  function initLiveNotifications() {
    window.setTimeout(showLiveNotification, 4500);
    window.setInterval(showLiveNotification, 17000);
  }

  document.addEventListener("DOMContentLoaded", () => {
    const travelDate = document.getElementById("travelDate");
    if (travelDate) {
      travelDate.min = new Date().toISOString().split("T")[0];
    }

    handleScrollState();
    initScrollAnimations();
    initCountdown();
    initForms();
    initLanguageToggle();
    initExitIntent();
    initLiveNotifications();
  });

  window.addEventListener("scroll", handleScrollState, { passive: true });
})();
