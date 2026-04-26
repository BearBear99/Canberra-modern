/* ==========================================================================
   Canberra Modern — javascript.js
   --------------------------------------------------------------------------
   Vanilla JS. No frameworks, no libraries. Each feature is wrapped in its
   own init function and gated behind a feature-detection check (e.g. "does
   the element exist on this page?") so the same file can safely load on
   every page without errors.
   ========================================================================== */

(function () {
  "use strict";

  /* ------------------------------------------------------------------------
     1. Mobile navigation toggle
     ------------------------------------------------------------------------
     Uses aria-expanded for state — screen readers announce the change and
     the CSS uses the attribute selector to animate the hamburger into an X.
  ------------------------------------------------------------------------ */
  function initMobileNav() {
    const toggle = document.querySelector(".nav__toggle");
    const list = document.querySelector(".nav__list");
    if (!toggle || !list) return;

    toggle.addEventListener("click", function () {
      const isOpen = list.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    // Close the menu when a nav link is clicked (useful on mobile)
    list.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        list.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }


  /* ------------------------------------------------------------------------
     2. Booking modal
     ------------------------------------------------------------------------
     Trigger buttons carry the event details in data-* attributes. This keeps
     the HTML semantic and avoids duplicating a <dialog> for each event.

     Accessibility features implemented:
       - Escape key closes the modal
       - Click on backdrop closes the modal
       - Focus is moved into the modal on open, and returned on close
       - Body scroll is locked while the modal is open
  ------------------------------------------------------------------------ */
  function initBookingModal() {
    const modal = document.getElementById("booking-modal");
    if (!modal) return;

    const panel = modal.querySelector(".modal__panel");
    const closeBtn = modal.querySelector(".modal__close");
    const triggers = document.querySelectorAll("[data-book-trigger]");

    // Fields inside the modal that we'll populate from the trigger data
    const titleEl = modal.querySelector("[data-book-title]");
    const dateEl = modal.querySelector("[data-book-date]");
    const timeEl = modal.querySelector("[data-book-time]");
    const locationEl = modal.querySelector("[data-book-location]");
    const imageEl = modal.querySelector("[data-book-image]");

    let lastFocused = null;

    function openModal(trigger) {
      // Populate modal content from trigger's data attributes
      titleEl.textContent = trigger.dataset.title || "";
      dateEl.textContent = trigger.dataset.date || "";
      timeEl.textContent = trigger.dataset.time || "";
      locationEl.textContent = trigger.dataset.location || "";
      if (trigger.dataset.image) {
        imageEl.src = trigger.dataset.image;
        imageEl.alt = trigger.dataset.title || "";
      }

      // Reset the form and success message whenever we open
      const form = modal.querySelector(".form");
      const success = modal.querySelector(".form__success");
      if (form) form.reset();
      if (form) form.style.display = "";
      if (success) success.classList.remove("is-visible");

      lastFocused = document.activeElement;
      modal.classList.add("is-open");
      modal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden"; // lock scroll

      // Delay focus until the transition has (mostly) finished
      setTimeout(function () {
        const firstInput = modal.querySelector("input");
        if (firstInput) firstInput.focus();
      }, 200);
    }

    function closeModal() {
      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      if (lastFocused) lastFocused.focus();
    }

    // Attach listeners to every "Book Now" trigger on the page
    triggers.forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        openModal(btn);
      });
    });

    closeBtn.addEventListener("click", closeModal);

    // Click outside the panel to close (but not clicks inside it)
    modal.addEventListener("click", function (e) {
      if (e.target === modal) closeModal();
    });

    // Escape key to close
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && modal.classList.contains("is-open")) {
        closeModal();
      }
    });
  }


  /* ------------------------------------------------------------------------
     3. Form submission (with validation + success message)
     ------------------------------------------------------------------------
     We let the browser handle HTML5 validation (required, type=email, etc.)
     via the `required` and `type` attributes. This JS just intercepts a
     valid submission, hides the form, and shows the success state — no
     backend required for this assessment.
  ------------------------------------------------------------------------ */
  function initForms() {
    document.querySelectorAll(".form").forEach(function (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();

        // Browser-level validation already runs, so by this point the form
        // is valid (the submit event wouldn't fire otherwise).
        const success = form.parentElement.querySelector(".form__success");
        if (success) {
          form.style.display = "none";
          success.classList.add("is-visible");
        }
      });
    });
  }


  /* ------------------------------------------------------------------------
     4. Gallery filter
     ------------------------------------------------------------------------
     Simple category filter: clicking a filter button shows items whose
     data-category matches, hides the rest. "All" shows everything.
  ------------------------------------------------------------------------ */
  function initGalleryFilter() {
    const buttons = document.querySelectorAll(".gallery-filter button");
    const items = document.querySelectorAll("[data-category]");
    if (!buttons.length || !items.length) return;

    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        const filter = btn.dataset.filter;

        buttons.forEach(function (b) { b.classList.remove("is-active"); });
        btn.classList.add("is-active");

        items.forEach(function (item) {
          const show = filter === "all" || item.dataset.category === filter;
          item.classList.toggle("is-hidden", !show);
        });
      });
    });
  }


  /* ------------------------------------------------------------------------
     5. Scroll-reveal with IntersectionObserver
     ------------------------------------------------------------------------
     Reveals `.reveal` elements as they enter the viewport. Far more
     performant than listening to the scroll event (MDN, 2024).
  ------------------------------------------------------------------------ */
  function initReveal() {
    const targets = document.querySelectorAll(".reveal");
    if (!targets.length || !("IntersectionObserver" in window)) {
      // Fallback: show everything if the API isn't supported
      targets.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target); // reveal once, then stop watching
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });

    targets.forEach(function (el) { observer.observe(el); });
  }


  /* ------------------------------------------------------------------------
     6. Current-year injection (footer)
     ------------------------------------------------------------------------
     Small DRY touch so I don't have to update the copyright date by hand.
  ------------------------------------------------------------------------ */
  function initYear() {
    const el = document.querySelector("[data-year]");
    if (el) el.textContent = new Date().getFullYear();
  }


  /* ------------------------------------------------------------------------
     Boot — run all initialisers once the DOM is ready
  ------------------------------------------------------------------------ */
  document.addEventListener("DOMContentLoaded", function () {
    initMobileNav();
    initBookingModal();
    initForms();
    initGalleryFilter();
    initReveal();
    initYear();
  });
})();
