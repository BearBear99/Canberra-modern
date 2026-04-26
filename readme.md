# Canberra Modern — Responsive Website

**Unit:** 11056 Front-end Web Design
**Semester:** 1, 2026 · BRUCE [ON-CAMPUS]
**Student ID:** *[insert your student ID here]*
**Live site:** *[insert your GitHub Pages URL once deployed]*
**Repo:** *[insert your GitHub repo URL]*

---

## 1. Project overview

This project is a responsive website redesign for **Canberra Modern** — a small volunteer-led organisation that celebrates the city's mid and late-twentieth-century architecture through tours, talks and community events (Canberra Modern, n.d.). The existing CM site is acknowledged by its authors as dated, so the brief across all three assessments was to transform its source content into a more engaging and visually coherent presence. Assessment 3 is the implementation stage: turning the Figma prototype from Assessment 2 into a working front-end built in semantic HTML5, CSS3 and vanilla JavaScript, with no front-end libraries or templates.

The site has four pages — **Home**, **About**, **Events** and **Gallery** — plus three different modal components (booking, donation, image lightbox) and an auto-advancing hero carousel. All CSS lives in a single external stylesheet (with a small CSS reset merged at the top), all JS in a single file. Nothing is imported from a CDN except the two Google Fonts used for display and body type.

---

## 2. Reflection on the prototype → implementation journey

### What I kept from my Figma prototype

The **dusty pink, cream and navy palette** pulled from the CM logo was the backbone of the identity from the first moodboard in Assessment 1, and I carried it through unchanged. The circular portrait treatment on the About page, the card-based event listings, the section–soft alternating backgrounds, and the dotted-line typographic flourishes between sections all come straight from the Figma work.

These choices came out of the Visual Direction research in Assessment 1, where I identified mid-century modernism as the aesthetic anchor. That period was defined by restraint, grid-based layouts, humanist sans-serif typography paired with sturdy display serifs, and muted earth-tone palettes (Lupton, 2010), and I wanted the site to feel like it belonged to its subject matter rather than imposing a generic tech aesthetic on it.

### What I improved on the prototype

Looking critically at my Figma, the original **Book page** was a weak link — a whole page dedicated to a booking form felt clunky and broke the flow from the Events grid. In this build I replaced it with a **modal overlay** triggered from any "Book Now" button. Nielsen Norman Group (2020) recommends modals specifically for "small, focused tasks" like a booking form, where keeping the user on the page preserves their context. The same modal infrastructure is now reused for the one-off **donation popup** and, with slightly different styling, for the image **lightbox** — a good example of the DRY principle that Frain (2020) argues for as the single biggest predictor of CSS maintainability.

I also tightened the typographic hierarchy. The original used a single sans-serif throughout, and I paired **DM Serif Display** (for headings) with **Manrope** (for body) to get the editorial feel I wanted. Mid-century printing itself mixed heavy serifs with geometric sans-serifs, so the pairing is both currently on-trend and historically sympathetic.

Beyond the original prototype, I added several features that weren't in the Figma but that I felt the site needed to hit a professional standard: the **hero carousel** (gives the homepage a dynamic feel without heavy imagery), the **partner marquee** (more memorable than a static row of logos), the **image lightbox** (essential on a site where photography is the primary content), and a **responsive YouTube embed** on the About page. Each of these was a deliberate UX decision, not feature bloat — I'll defend them specifically in the sections below.

### What I'd do differently next time

Three things stand out. First, the **booking modal markup is duplicated on all four pages** because static HTML has no server-side includes. I considered having JavaScript inject the markup dynamically, but that would have meant large chunks of content living outside the HTML — arguably worse for a markup-focused assessment. A better solution would be a static-site generator like Eleventy or a build step with partials, which I'd explore in a next iteration.

Second, I used **`localStorage` nowhere**. A real booking site would at least remember a user's name/email across a session so they don't have to re-type it. I left this out to keep the JS focused on the brief's asked features, but it's a natural next step.

Third, I'd like to add real **keyboard focus trapping** inside the modals. My implementation moves focus in on open and restores it on close, and ESC always closes — but a truly accessible modal would cycle Tab within the panel. The W3C (2023) ARIA authoring practices describe the full pattern; I've implemented a subset and flagged the gap here.

---

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

**The stylesheet is written mobile-first.** All base declarations outside `@media` queries target phones (320–480 px); larger screens progressively enhance the layout via `@media (min-width: 768px)` (tablet) and `@media (min-width: 1024px)` (desktop). Writing mobile-first forces me to prioritise the smallest viewport first — where content hierarchy matters most — and keeps the CSS-parsing cost low on the devices that can least afford it (Marcotte, 2010). Every interactive element meets the WCAG 2.5.5 minimum touch target of 44 × 44 pixels, enforced via a `--tap-min` custom property.

For layout I used **CSS Grid** where I needed 2D control (card grids, footer columns, hero split, donation amount buttons) and **Flexbox** for 1D component layouts (nav bar, button rows, form fields, marquee track). I made deliberate use of `grid-template-columns: repeat(auto-fit, minmax(260px, 1fr))` so the card grids reflow to whatever viewport is presented without needing per-breakpoint media queries for column count — this is sometimes called "intrinsic web design" (Marquis, 2018) and it's more resilient than fixed breakpoints. Combined with `clamp()` fluid typography, most of the responsive behaviour is achieved without media queries at all.

Advanced techniques I deliberately used:
- **`backdrop-filter`** on the sticky header for a frosted-glass effect that reads well over any content the user is scrolling past.
- **`mask-image`** on the marquee to fade the left and right edges, so logos drift in and out of view rather than popping on at the container boundary.
- **`aspect-ratio`** everywhere (carousel, video embed, feature images) instead of the old `padding-top: 56.25%` hack.
- **Pseudo-elements** for the decorative dotted section dividers, button underlines, and dropdown arrow — no extra markup needed.
- **`animation-play-state: paused`** to pause the marquee on hover without needing JavaScript.

### JavaScript

I kept JS to the minimum needed: nine feature modules wrapped in an IIFE, each guarded by a feature-presence check so the single file can safely load on every page. I wrote a small reusable `createModalController` helper to DRY the open/close/focus/keyboard logic shared by three different modals — writing that boilerplate three separate times would have been the exact kind of repetition the rubric penalises.

The **carousel** respects `prefers-reduced-motion` (auto-advance is disabled for users who've asked for less motion), pauses when the browser tab isn't visible (via `visibilitychange`), and resets its timer when a user clicks an arrow or dot so it doesn't immediately jump forward.

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

In line with the University of Canberra's GenAI policy and this unit's assessment rules, I acknowledge my use of generative AI in this project.

**Tool used:** Anthropic's Claude (web interface)

**How it was used:**
- I uploaded my Figma screenshots and the assessment brief and asked Claude to help plan a file structure that matched the brief's stated requirements.
- I used Claude to review my HTML for semantic-tag choices and to suggest accessibility patterns — specifically the skip-link, the ARIA pattern on the modal, and the `prefers-reduced-motion` handling.
- I used Claude to draft explanatory comments in my CSS and JS, which I then edited for voice and correctness.
- I used Claude to help debug a few CSS issues where my grid wasn't behaving as expected.

**How it was *not* used:**
- I did not paste Claude-generated code into my files without reading it. Every file was opened in VS Code and inspected line by line, with edits to naming, spacing, and logic where my preferences differed.
- I did not use Claude to write the reflective sections of this rationale — the critical self-assessment in Section 2 and the "what I'd do differently" paragraphs are my own observations on the work.

The parts of the codebase where I genuinely learned something new were: the `clamp()`-based fluid type scale (I'd read about it but not built one), the marquee loop technique using a duplicated list, and the `createModalController` pattern — my first time writing a reusable factory function for UI behaviour.

---

## 7. Running locally + deployment

### Running locally
1. Clone this repo.
2. Open the folder in VS Code.
3. Install the **Live Server** extension, then right-click `index.html` → "Open with Live Server" for hot reload.
4. Or simply double-click `index.html` to open in any browser — no build step required.

### Pushing to GitHub
```bash
git init
git add .
git commit -m "Initial commit: Canberra Modern responsive site"
git branch -M main
git remote add origin https://github.com/<your-username>/canberra-modern.git
git push -u origin main
```

Subsequent commits should be frequent and scoped (e.g. `Add hero carousel`, `Implement lightbox modal`, `Refine responsive layout`). The rubric specifically rewards a committed history over one large push.

### Deploying to GitHub Pages
1. In your repo, go to **Settings → Pages**.
2. Under *Source*, select **Deploy from a branch**.
3. Choose branch **main** and folder **/ (root)**.
4. Save. The live URL appears at the top of the Pages settings after about a minute.

Add the live URL to the top of this file before submission.

---

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
