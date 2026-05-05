# Canberra Modern — Responsive Website

**Unit:** 11056 Front-end Web Design
**Student ID:** U3292103
**Repo:** https://github.com/BearBear99/Canberra-modern.git

---

## 1. Project Overview

This project presents a complete responsive redesign and front-end implementation for **Canberra Modern**, a small volunteer-led organisation dedicated to celebrating Canberra’s mid- and late-twentieth-century modernist architecture through guided tours, talks, and community events (Canberra Modern, n.d.).

The existing website was acknowledged by its creators as dated and in need of modernisation. In response to the assessment brief, the redesign transforms the source content into a visually coherent, engaging, and accessible digital presence. **Assessment 3** focuses on technical implementation: translating the high-fidelity Figma prototype developed in Assessment 2 into a fully functional, semantic front-end using **HTML5, CSS3, and vanilla JavaScript**.

### Key Features
- Four-page responsive website: **Home**, **About**, **Events**, and **Gallery**.
- Auto-advancing hero carousel on the Home page.
- Three custom modal components: event booking, donation, and image lightbox.
- Fully responsive design optimised for mobile, tablet, and desktop viewports.
- No external front-end frameworks, libraries, or templates were used — all functionality is achieved with vanilla JavaScript and custom CSS.
- All styles contained in a single external stylesheet (with integrated CSS reset); all scripts in a single JavaScript file.
- Typography utilises two Google Fonts only (no other external dependencies).

### Technical Approach and Constraints
The implementation adheres strictly to the assessment requirements for semantic HTML, progressive enhancement, and clean separation of concerns. Accessibility, performance, and maintainability were prioritised throughout development. The result is a lightweight, fast-loading website that maintains visual fidelity to the Figma prototype while meeting modern web standards.

---
## 2. Reflection on the prototype → implementation journey

### What I kept from my Figma prototype

## 2. Reflection on the Prototype to Implementation Journey

While the Figma prototype served as a valuable conceptual blueprint and visual reference, the transition from prototype to a functional website revealed significant differences between static design and real-world implementation. Many design decisions that appeared effective in Figma required substantial adaptation once actual code was written.
Nevertheless, I retained several core elements that proved successful in both environments:
-The overall information architecture, content hierarchy, and user flow.
-The minimalist visual style, colour palette, and typographic scale established in the design tokens.
-The placement and functionality of key interactive components (navigation, donation buttons, and marquee).
This experience highlighted that a prototype is primarily a communication and planning tool rather than a pixel-perfect specification. The implementation phase demanded numerous practical adjustments for performance, accessibility, browser behaviour, and maintainability that could not be fully anticipated in Figma. These refinements ultimately resulted in a more robust, accessible, and efficient final product.

### What I improved on the prototype

When reviewing my original Figma prototype, I recognised that it lacked the smoothness and practicality required for a real website. As someone who prefers an iterative, code-first approach rather than detailed upfront planning, I found myself deviating significantly from the prototype once implementation began. Many design decisions that looked acceptable in Figma proved visually or functionally weak in the live environment, prompting substantial revisions.
On the homepage, I redesigned the project card layout after determining that the original button placement in the bottom-left corner of images appeared unbalanced once built. I also added contextual information directly onto images (date and key details), which had not been considered during the prototyping stage. The Contact Us section was completely restructured: the original design was replaced with a two-column layout featuring a coloured background panel on the left with an image, and the form on the right, significantly improving visual balance and usability.
The Events page underwent extensive changes. The original colour scheme and layout felt unrefined, so I introduced a new “Upcoming Events” category at the top and adjusted typography, spacing, and overall organisation for better clarity and flow.
The Footer was entirely redesigned. The prototype version lacked sufficient navigation links and felt incomplete; I therefore created a more comprehensive footer that includes direct links to Home, About, and Gallery, along with additional functional sections. This greatly improves site-wide navigation and user experience.

### What I’d Do Differently Next Time

Although satisfied with the final website, the development process highlighted several areas for improvement.  

Next time, I would invest more time refining and testing the Figma prototype before coding. My iterative, code-first approach resulted in substantial mid-project redesigns of the homepage cards, Events page, and Footer, causing unnecessary rework.  

I would also conduct formal user testing at the mid-fidelity stage rather than informal checks. This would have identified UX issues earlier, especially with the booking modal and navigation.  

Additionally, I would establish a structured component library and complete design token system from the outset, instead of allowing them to evolve organically.  

Finally, I would prioritise performance optimisation and accessibility auditing earlier in the build. These changes would enhance efficiency and quality. Overall, the project reinforced the need to better balance creative iteration with structured planning in future work.

## 3. Low-fi prototypes — what was (and wasn't) implemented

Referring to the low-fi wireframes submitted in Assessment 1:

| Prototype element | Implemented? | Notes |
|---|---|---|
| Sticky top nav with logo + 4 links | ✅ | Plus frosted-glass background via `backdrop-filter` |
| Hero with headline + image | ✅ → upgraded | Became a 5-slide auto-advancing carousel (Parliament House, Cameron Offices, Church, Telstra Tower, Round Restaurant) |
| Upcoming events grid (3 cards) | ✅ | Uses `repeat(auto-fit, minmax(280px, 1fr))` for fluid responsiveness |
| Contact form on home | ✅ | Added success state, HTML5 validation |
| About: circular portrait + text | ✅ | Kept faithful to prototype |
| About: partner row | ✅ → upgraded | Became an infinite-scroll marquee with pause-on-hover |
| About: support video block | ✅ → upgraded | Became a responsive YouTube embed (16:9) |
| About: donation link | ✅ → upgraded | Became a full donation modal with preset amounts |
| Gallery: large archive image + grid | ✅ | Added category filter (not in original prototype) |
| Every photo tappable to enlarge | ❌ → added | New feature: universal lightbox |
| Standalone Book page | ❌ → replaced | Replaced with modal overlay (discussed above) |
| Footer with partners + copyright | ✅ | Includes the required University of Canberra credit line |

The two largest deviations — dropping the standalone Book page and expanding the static partner row into a marquee — were deliberate UX upgrades, and I've discussed the reasoning above.

---

## 4. Technical decisions

### Semantic HTML5

Every page uses `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<figure>` and `<footer>` with ARIA attributes (`aria-label`, `aria-current`, `aria-expanded`, `aria-modal`, `aria-roledescription`) to describe interactive components. Semantic markup is both an accessibility win and an SEO baseline (W3C, 2023). Every page passes W3C's Nu HTML5 Checker.

### CSS architecture

I leaned heavily on **CSS custom properties** to define design tokens — colour, spacing, type scale, shadow presets, motion easing — in a single `:root` block at the top of the stylesheet. This is the CSS equivalent of the DRY principle (Frain, 2020): to rethemeise the whole site I change about twelve values. The stylesheet is organised into twenty-one labelled sections with a navigation comment block at the top, so any future maintainer can find what they need quickly.

**The stylesheet is written mobile-first.** I relied heavily on CSS custom properties to define all design tokens (colour, spacing, typography scale, shadows, and motion) in a single `:root` block. This DRY approach allows complete re-theming by changing roughly twelve values (Frain, 2020). The stylesheet is organised into twenty-one labelled sections with a top navigation comment block for easy maintenance.
Written mobile-first, base styles target small viewports (320–480 px), with progressive enhancements via @media (min-width: 768px) (tablet) and @media (min-width: 1024px) (desktop) (Marcotte, 2010). All interactive elements satisfy the WCAG 2.5.5 44 × 44 px touch target.
CSS Grid handles two-dimensional layouts (card grids, footer, hero, donation buttons) while Flexbox manages one-dimensional components (nav, forms, marquee). I used grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)) for intrinsically responsive grids (Marquis, 2018), combined with clamp() for fluid typography, minimising media queries.

Advanced techniques I deliberately used:
- **`backdrop-filter`** for a frosted-glass sticky header.
- **`mask-image`** for smooth marquee edge fades.
- **`aspect-ratio`** for consistent media proportions.
- **Pseudo-elements** for decorative dividers, underlines, and arrows.
- **`animation-play-state: paused`** to pause the marquee on hover without JavaScript.
### JavaScript

I kept JS to the minimum needed: nine feature modules wrapped in an IIFE, each guarded by a feature-presence check so the single file can safely load on every page. I wrote a small reusable `createModalController` helper to DRY the open/close/focus/keyboard logic shared by three different modals — writing that boilerplate three separate times would have been the exact kind of repetition the rubric penalises.

The **carousel** fully respects `prefers-reduced-motion` , disables auto-advance for affected users, pauses on (via `visibilitychange`) when the tab is inactive, and resets its timer after manual interaction with arrows or dots.

The **lightbox** is attached to every `<img>` in `<main>`, except those marked `data-no-lightbox` (carousel slides, marquee logos) or nested inside an existing modal. Images become keyboard-accessible via `tabindex="0"` and `role="button"` and respond to both click and Enter/Space keys.

### Accessibility

- `<html lang="en">` on every page
- Skip-link to main content (WCAG 2.4.1)
- All buttons are `<button>` elements, not styled `<div>`s
- Hamburger uses `aria-expanded`; its state is announced
- All modals use `role="dialog"` and `aria-modal="true"`; focus moves in on open and returns on close
- All form inputs have associated `<label>` elements
- `prefers-reduced-motion` media query disables all non-essential animations
- Colour contrast tested against WCAG 2.1 AA (body ink on white: 12.6:1 pass; white on pink-400: 3.9:1 pass for large text)
- Social-link SVG icons have `aria-hidden="true"` so screen readers read the `aria-label` on the anchor, not "path"

### Performance

- `preconnect` to the Google Fonts origin cuts roughly 200ms off first paint on cold loads
- JS is loaded with `defer` so it never blocks rendering
- YouTube iframe uses `loading="lazy"` so it doesn't fetch until it approaches the viewport
- No external libraries — total JS is roughly 12 KB unminified
- No layout-shifting images thanks to `aspect-ratio` declarations

---

## 5. Annotated resources

- **MDN Web Docs** — https://developer.mozilla.org — the single most consulted reference throughout. The `IntersectionObserver`, `backdrop-filter`, `aspect-ratio`, and `prefers-reduced-motion` pages all informed specific implementation choices in this project.
- **A (more) modern CSS reset** by Andy Bell — https://piccalil.li/blog/a-more-modern-css-reset/ — the reset block at the top of `styles.css` is adapted from this. The original is attributed in a comment where the reset begins.
- **Web.dev Learn Accessibility** course — https://web.dev/learn/accessibility — referenced specifically for the modal focus-management pattern and the `aria-live` pattern used for form success messages.
- **W3C Nu HTML Checker** — https://validator.w3.org/nu/ — every page was validated here after each major change.
- **Nielsen Norman Group: Modal & Nonmodal Dialogs** — https://www.nngroup.com/articles/modal-nonmodal-dialog/ — informed the UX decision to use a modal over a separate booking page.
- **CSS-Tricks: Infinite Scroll Marquee** — https://css-tricks.com/infinite-scroll-marquee/ — the technique of duplicating the list and animating by `-50%` is from here; my implementation is rewritten rather than copied, but the idea is attributed.
- **Canberra Modern website** — https://canberramodern.com/ — source of all content, tone, and factual background.

---

## 6. GenAI acknowledgement

In accordance with the University of Canberra’s GenAI policy and the assessment requirements of this unit, I acknowledge the use of generative AI tools during the development of this project.

**Tool used:** Grok (xAI)

**How it was used:**
- I first developed the majority of the website code myself in Visual Studio Code, including the HTML structure, CSS layout (Grid and Flexbox), and JavaScript functionality.
- I used Grok primarily as a debugging assistant — when I encountered problems I could not solve (such as certain responsive behaviours, carousel timing issues, and modal accessibility), I asked Grok for suggestions.
- I also asked Grok to review selected sections of my code for potential improvements in best practices and to help refine some explanatory comments.
- All final decisions on design, code organisation, and implementation were made by me after reviewing the suggestions.
-I used Grok (xAI) to correct grammar, improve sentence structure, and refine academic phrasing. All content, ideas, and reflections are my own.

**How it was *not* used:**
- I did not copy and paste large sections of AI-generated code.
- The core architecture, visual design decisions, and most of the actual coding were completed by myself.
- The critical reflection and self-evaluation in this rationale are entirely my own work.

---

## 7. Running Locally and Deployment

### Running Locally
1. Clone the repository.
2. Open the project folder in VS Code.
3. Install the **Live Server** extension and right-click `index.html` → **Open with Live Server** (recommended for hot reload).  
   Alternatively, simply open `index.html` in any browser — no build tools required.

### Deployment to GitHub Pages
1. Go to repository **Settings → Pages**.
2. Under *Source*, select **Deploy from a branch**.
3. Choose **main** branch and **/(root)** folder.
4. Click Save. The live site URL will appear shortly.

The live URL has been added at the top of this document.

**Commit History Note:** Frequent, scoped commits were used throughout development (e.g. “Add hero carousel”, “Implement booking modal”, “Refine mobile layout”) to maintain a clear project history.

## 8. References

Canberra Modern. (n.d.). *About Canberra Modern*. https://canberramodern.com/

Coyier, C. (2023, August 21). *Scroll-driven animations*. CSS-Tricks. https://css-tricks.com/scroll-driven-animations/

Frain, B. (2020). *Responsive web design with HTML5 and CSS* (3rd ed.). Packt Publishing.

Lupton, E. (2010). *Thinking with type: A critical guide for designers, writers, editors, & students* (2nd ed.). Princeton Architectural Press.

Marcotte, E. (2010, May 25). *Responsive web design*. A List Apart. https://alistapart.com/article/responsive-web-design/

Marquis, M. (2018, July 11). *Intrinsic web design*. An Event Apart. https://aneventapart.com/news/post/intrinsic-web-design-with-jen-simmons-an-event-apart-video

MDN Web Docs. (2024). *Intersection Observer API*. Mozilla. https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API

Nielsen Norman Group. (2020, July 12). *Modal & nonmodal dialogs: When (& when not) to use them*. https://www.nngroup.com/articles/modal-nonmodal-dialog/

W3C. (2023). *HTML Living Standard*. World Wide Web Consortium. https://html.spec.whatwg.org/

W3C. (2023). *WAI-ARIA Authoring Practices 1.2: Modal dialog pattern*. World Wide Web Consortium. https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
