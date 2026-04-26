/* ==========================================================================
   Canberra Modern — script.js
   --------------------------------------------------------------------------
   Vanilla JS. No frameworks, no libraries. Each feature is wrapped in its
   own init function and guarded by a feature-detection check (i.e. "does
   the relevant element exist on this page?") so the same file can safely
   load on every page without errors.
   --------------------------------------------------------------------------
   Feature index
     1.  initMobileNav       — hamburger toggle
     2.  initBookingModal    — event booking popup
     3.  initDonationModal   — one-off donation popup (About page)
     4.  initForms           — shared submit handler + success state
     5.  initGalleryFilter   — category filter on Gallery page
     6.  initCarousels       — auto-advancing slideshows (home + gallery)
     7.  initLightbox        — universal click-to-enlarge for images
     8.  initReveal          — IntersectionObserver scroll animations
     9.  initYear            — current year in the footer
    10.  initScrollTop       — footer logo → smooth scroll to top
   ========================================================================== */

(function () {
  "use strict";


  /* ------------------------------------------------------------------------
     1. Mobile navigation toggle
     ------------------------------------------------------------------------
     aria-expanded drives both the screen-reader state AND the CSS animation
     that morphs the hamburger bars into an "X" (see .nav__toggle rules).
  ------------------------------------------------------------------------ */
  function initMobileNav() {
    const toggle = document.querySelector(".nav__toggle");
    const list = document.querySelector(".nav__list");
    if (!toggle || !list) return;

    toggle.addEventListener("click", function () {
      const isOpen = list.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    // Close the menu when a nav link is clicked (important on mobile where
    // the menu would otherwise stay open covering the next page's content).
    list.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        list.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }


  /* ------------------------------------------------------------------------
     Helper: a reusable modal controller.
     ------------------------------------------------------------------------
     Every modal in the site (booking, donation, lightbox) shares the same
     open/close behaviour — escape to close, click-outside to close, focus
     management, body-scroll lock. DRYing this into one helper avoids
     duplicating the boilerplate three times.
  ------------------------------------------------------------------------ */
  function createModalController(modal, options) {
    options = options || {};
    let lastFocused = null;

    function open() {
      lastFocused = document.activeElement;
      modal.classList.add("is-open");
      modal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";

      // Move focus into the modal once the open transition is mostly done.
      // Without the delay, focus-ring paint can race the opacity transition.
      setTimeout(function () {
        const target = options.focusTarget
          ? modal.querySelector(options.focusTarget)
          : modal.querySelector("input, button, [tabindex]");
        if (target) target.focus();
      }, 200);
    }

    function close() {
      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      if (lastFocused && typeof lastFocused.focus === "function") {
        lastFocused.focus();
      }
      if (typeof options.onClose === "function") options.onClose();
    }

    // Close on backdrop click (but not on clicks inside the panel)
    modal.addEventListener("click", function (e) {
      if (e.target === modal) close();
    });

    // Close on Escape key — only when this modal is the one open
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && modal.classList.contains("is-open")) {
        close();
      }
    });

    // Wire up the panel's close button, if present
    const closeBtn = modal.querySelector(".modal__close");
    if (closeBtn) closeBtn.addEventListener("click", close);

    return { open: open, close: close };
  }


  /* ------------------------------------------------------------------------
     2. Booking modal
     ------------------------------------------------------------------------
     Trigger buttons carry the event details in data-* attributes. This keeps
     the HTML declarative and avoids duplicating a <dialog> per event.
  ------------------------------------------------------------------------ */
  function initBookingModal() {
    const modal = document.getElementById("booking-modal");
    if (!modal) return;

    const triggers = document.querySelectorAll("[data-book-trigger]");
    const titleEl    = modal.querySelector("[data-book-title]");
    const dateEl     = modal.querySelector("[data-book-date]");
    const timeEl     = modal.querySelector("[data-book-time]");
    const locationEl = modal.querySelector("[data-book-location]");
    const imageEl    = modal.querySelector("[data-book-image]");

    const controller = createModalController(modal);

    triggers.forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();

        // Populate modal content from the trigger's data attributes
        titleEl.textContent    = btn.dataset.title    || "";
        dateEl.textContent     = btn.dataset.date     || "";
        timeEl.textContent     = btn.dataset.time     || "";
        locationEl.textContent = btn.dataset.location || "";
        if (btn.dataset.image) {
          imageEl.src = btn.dataset.image;
          imageEl.alt = btn.dataset.title || "";
        }

        // Always reset the form on reopen — otherwise users see the "success"
        // state from the last booking on their next one.
        const form = modal.querySelector(".form");
        const success = modal.querySelector(".form__success");
        if (form) { form.reset(); form.style.display = ""; }
        if (success) success.classList.remove("is-visible");

        controller.open();
      });
    });
  }


  /* ------------------------------------------------------------------------
     3. Donation modal
     ------------------------------------------------------------------------
     Preset amount buttons + custom input + fake card select. No real payment
     processing — this assessment is a front-end demo, so "Donate Now" just
     flips to a thank-you state.
  ------------------------------------------------------------------------ */
  function initDonationModal() {
    const modal = document.getElementById("donation-modal");
    if (!modal) return;

    const triggers = document.querySelectorAll("[data-donate-trigger]");
    const amountButtons = modal.querySelectorAll(".donation__amount");
    const customInput = modal.querySelector("#donation-custom");
    const form = modal.querySelector(".form");
    const success = modal.querySelector(".form__success");

    const controller = createModalController(modal);

    triggers.forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        // Reset state each time the modal opens
        amountButtons.forEach(function (b) { b.classList.remove("is-selected"); });
        if (customInput) customInput.value = "";
        if (form) { form.reset(); form.style.display = ""; }
        if (success) success.classList.remove("is-visible");
        controller.open();
      });
    });

    // Preset-amount buttons — mutually exclusive "radio" behaviour.
    // Selecting a preset clears the custom input, and typing in the custom
    // input clears the preset selection, so the amount is never ambiguous.
    amountButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        amountButtons.forEach(function (b) { b.classList.remove("is-selected"); });
        btn.classList.add("is-selected");
        if (customInput) customInput.value = "";
      });
    });

    if (customInput) {
      customInput.addEventListener("input", function () {
        amountButtons.forEach(function (b) { b.classList.remove("is-selected"); });
      });
    }
  }


  /* ------------------------------------------------------------------------
     4. Forms — submit handler + success state
     ------------------------------------------------------------------------
     Browser-level HTML5 validation (required, type=email, min/max) handles
     the rules. This JS just intercepts a *valid* submission and swaps the
     form for a success message — no backend needed.
  ------------------------------------------------------------------------ */
  function initForms() {
    document.querySelectorAll(".form").forEach(function (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        // If we got here, HTML5 validation has already passed.
        const success = form.parentElement.querySelector(".form__success");
        if (success) {
          form.style.display = "none";
          success.classList.add("is-visible");
        }
      });
    });
  }


  /* ------------------------------------------------------------------------
     5. Gallery filter
     ------------------------------------------------------------------------
     Clicking a filter button shows items whose data-category matches.
     "All" shows everything.
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
     6. Carousels — auto-advancing, dot navigation, prev/next, caption sync.
     ------------------------------------------------------------------------
     Supports *multiple* carousels per page (home hero + gallery hero).
     Each .carousel element is initialised independently with its own
     timer. Per-instance speed comes from `data-autoplay-ms` (default
     5000 ms on home, 3000 ms on the gallery).

     When a slide image has `data-caption-title` and `data-caption-text`
     attributes, the text is mirrored into any elements tagged with
     `data-caption-target="title"` / `"text"` on slide change. This lets
     the gallery carousel show a live caption panel beside the image.

     Why a single generalised function instead of two?
       DRY — one implementation, same behaviour, same a11y attributes.
       One less JS payload to maintain.
  ------------------------------------------------------------------------ */
  function initCarousels() {
    const carousels = document.querySelectorAll(".carousel");
    if (!carousels.length) return;

    carousels.forEach(function (carousel) {
      const slides = carousel.querySelectorAll(".carousel__slide");
      const dots = carousel.querySelectorAll(".carousel__dot");
      const prevBtn = carousel.querySelector(".carousel__btn--prev");
      const nextBtn = carousel.querySelector(".carousel__btn--next");
      if (slides.length < 2) return; // nothing to rotate

      // Per-instance speed from data-autoplay-ms, default 5000 ms.
      const intervalMs = parseInt(carousel.getAttribute("data-autoplay-ms"), 10) || 5000;

      // Caption panel elements — live-updated on slide change.
      // Scope lookup to the carousel's nearest wrapper (<figure>, <section>
      // or the carousel itself) so that one carousel's captions don't
      // leak into another's captions on pages that have multiple.
      const captionScope = carousel.closest("figure, section") || carousel.parentElement || document;
      const captionTitleEls = captionScope.querySelectorAll('[data-caption-target="title"]');
      const captionTextEls  = captionScope.querySelectorAll('[data-caption-target="text"]');
      const captionMetaEls  = captionScope.querySelectorAll('[data-caption-target="meta"]');

      let current = 0;
      let timerId = null;

      function syncCaption(slideImg) {
        if (!slideImg) return;
        const t = slideImg.getAttribute("data-caption-title");
        const d = slideImg.getAttribute("data-caption-text");
        const m = slideImg.getAttribute("data-caption-meta");
        if (t && captionTitleEls.length) {
          captionTitleEls.forEach(function (el) { el.textContent = t; });
        }
        if (captionTextEls.length) {
          // Fallback to empty if slide has no description
          captionTextEls.forEach(function (el) { el.textContent = d || ""; });
        }
        if (captionMetaEls.length) {
          captionMetaEls.forEach(function (el) { el.textContent = m || ""; });
        }
      }

      function goTo(index) {
        current = (index + slides.length) % slides.length;
        slides.forEach(function (slide, i) {
          slide.classList.toggle("is-active", i === current);
          slide.setAttribute("aria-hidden", i === current ? "false" : "true");
        });
        dots.forEach(function (dot, i) {
          dot.classList.toggle("is-active", i === current);
          dot.setAttribute("aria-current", i === current ? "true" : "false");
        });
        const activeImg = slides[current].querySelector("img");
        syncCaption(activeImg);
      }

      function next() { goTo(current + 1); }
      function prev() { goTo(current - 1); }

      function startAuto() {
        stopAuto();
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        timerId = setInterval(next, intervalMs);
      }
      function stopAuto() {
        if (timerId) { clearInterval(timerId); timerId = null; }
      }

      // Manual controls — stopPropagation so clicks on prev/next/dots
      // don't also trigger the lightbox (since carousel images are now
      // lightbox-enabled).
      if (nextBtn) nextBtn.addEventListener("click", function (e) {
        e.stopPropagation(); next(); startAuto();
      });
      if (prevBtn) prevBtn.addEventListener("click", function (e) {
        e.stopPropagation(); prev(); startAuto();
      });
      dots.forEach(function (dot, i) {
        dot.addEventListener("click", function (e) {
          e.stopPropagation(); goTo(i); startAuto();
        });
      });

      carousel.addEventListener("mouseenter", stopAuto);
      carousel.addEventListener("mouseleave", startAuto);
      carousel.addEventListener("focusin", stopAuto);
      carousel.addEventListener("focusout", startAuto);

      document.addEventListener("visibilitychange", function () {
        if (document.hidden) stopAuto(); else startAuto();
      });

      goTo(0);
      startAuto();
    });
  }


  /* ------------------------------------------------------------------------
     7. Lightbox — universal click-to-enlarge
     ------------------------------------------------------------------------
     Attaches click listeners to every <img> inside <main> that isn't
     explicitly excluded. Opens a full-screen overlay with the enlarged
     image, smooth fade-in, close button, ESC-to-close, click-outside.
  ------------------------------------------------------------------------ */
  function initLightbox() {
    const lightbox = document.getElementById("lightbox");
    if (!lightbox) return;

    const lightboxImg = lightbox.querySelector(".lightbox__img");
    const lightboxCaption = lightbox.querySelector(".lightbox__caption");
    const controller = createModalController(lightbox);

    // Target every content image in <main>, but skip:
    //   - images inside modals (the booking modal's event image)
    //   - carousel slide images handle themselves via their parent
    //   - images explicitly opted out with data-no-lightbox
    const imgs = document.querySelectorAll("main img");

    imgs.forEach(function (img) {
      if (img.closest(".modal")) return;             // inside a modal
      if (img.hasAttribute("data-no-lightbox")) return;

      // Make the image feel clickable
      img.setAttribute("tabindex", "0");             // keyboard-reachable
      img.setAttribute("role", "button");
      img.setAttribute("aria-label",
        "Enlarge image: " + (img.alt || "image"));
      img.classList.add("is-zoomable");              // CSS adds zoom cursor

      function openIt() {
        lightboxImg.src = img.currentSrc || img.src;
        lightboxImg.alt = img.alt || "";
        lightboxCaption.textContent = img.alt || "";
        controller.open();
      }

      img.addEventListener("click", openIt);
      // Enter / Space from the keyboard also triggers it
      img.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openIt();
        }
      });
    });
  }


  /* ------------------------------------------------------------------------
     8. Scroll-reveal with IntersectionObserver
     ------------------------------------------------------------------------
     Far cheaper than listening to the scroll event — the browser notifies
     us only when visibility actually changes (MDN, 2024).
  ------------------------------------------------------------------------ */
  function initReveal() {
    const targets = document.querySelectorAll(".reveal");
    if (!targets.length) return;

    // Fallback for ancient browsers — just show everything
    if (!("IntersectionObserver" in window)) {
      targets.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target); // reveal once only
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });

    targets.forEach(function (el) { observer.observe(el); });
  }


  /* ------------------------------------------------------------------------
     9. Current-year injection
     ------------------------------------------------------------------------
     Tiny DRY touch — no need to manually bump the copyright year.
  ------------------------------------------------------------------------ */
  function initYear() {
    document.querySelectorAll("[data-year]").forEach(function (el) {
      el.textContent = new Date().getFullYear();
    });
  }


  /* ------------------------------------------------------------------------
     10. Scroll-to-top — footer logo link.
     ------------------------------------------------------------------------
     Any element tagged with `data-scroll-top` smoothly scrolls the window
     to the top on click, regardless of its href. We use smooth behaviour
     unless prefers-reduced-motion is set (then jump instantly).
  ------------------------------------------------------------------------ */
  function initScrollTop() {
    const triggers = document.querySelectorAll("[data-scroll-top]");
    triggers.forEach(function (el) {
      el.addEventListener("click", function (e) {
        e.preventDefault();
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({
          top: 0,
          behavior: reduced ? "auto" : "smooth"
        });
      });
    });
  }


  /* ------------------------------------------------------------------------
     Boot — run everything once the DOM is parsed.
  ------------------------------------------------------------------------ */
  document.addEventListener("DOMContentLoaded", function () {
    initMobileNav();
    initBookingModal();
    initDonationModal();
    initForms();
    initGalleryFilter();
    initCarousels();
    initLightbox();
    initReveal();
    initYear();
    initScrollTop();
  });
})();
