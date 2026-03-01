# Portfolio Website – Brief & Requirements

Use this prompt when you need to build, update, or describe this portfolio. It reflects the current formation (structure, content, and behavior) of the site.

---

## 1. Overview

- **Type:** Personal portfolio (single-page).
- **Owner:** Bashayer Alhawsawi (mobile developer).
- **Audience:** Recruiters, tech companies, clients.
- **Tone:** Professional, modern, elegant.
- **Stack:** HTML, CSS, JavaScript only (no framework). Bilingual EN/AR with RTL support.

---

## 2. Branding & Design

- **Logo text:** `AlBashayer </>` in the navbar.
- **Title:** “Bashayer | Mobile Developer”.
- **Fonts:** Poppins (headings), Inter (body), Tajawal (Arabic).
- **Theme:** Dark with neon gradient accents.
- **Colors:**
  - Primary: `#9B4DFF`
  - Secondary: `#FF5EA8`
  - Accent: `#00E5FF`
  - Background: `#0B0014` with radial/linear gradients.
  - Text: white / `#B9A7C8` (secondary).
- **Layout:** Max width 1200px, section padding, CSS Grid + Flexbox. Cards: blur background, 20px radius, glow border, hover lift.

---

## 3. Language & Accessibility

- **Languages:** English (LTR) and Arabic (RTL).
- **Toggle:** EN | ع in navbar (desktop); on mobile, same row as hero social icons.
- **Translations:** All UI and section text via `data-i18n`; keys in `locales/en.json` and `locales/ar.json`. Use `getNestedValue` for keys like `projects.items.0.title`.
- **Direction:** `dir` and `lang` on `<html>` switch with language; RTL styles under `[dir="rtl"]`.
- **Accessibility:** Semantic HTML, ARIA where needed (e.g. resume dropdown, sliders), keyboard-friendly.

---

## 4. Sections & Content

### 4.1 Navigation
- Fixed top navbar: logo, links (Home, About, Projects, Skills, Contact), language toggle.
- Mobile: hamburger menu; language toggle visible in hero on same row as social icons.
- Smooth scroll to sections.

### 4.2 Hero (#home)
- Two columns: left = headline (“Hi, I’m **Bashayer**”), subtitle (“Mobile developer”), short description, CTA, socials; right = profile area + floating tech icons.
- **Headline:** “Hi, I’m” + highlighted name (translated).
- **CTA – Resume:** One “Download Resume” trigger; on tap/click, show a dropdown with:
  - **Open in Drive** (Drive view link).
  - **Open in new tab** (same link, new tab).
- **Social (hero):** WhatsApp, Email (icons + links). Same row as language toggle on mobile.
- **Floating icons:** HTML5, Kotlin, GitHub, Android, Dart, Firebase, Git (decorative).
- **Animations:** Reveal on load (fade + slide) for hero blocks.

### 4.3 About (#about)
- Layout: about image (left), content (right). Mobile: stacked, image on top.
- Content: section title “About Me”, name “Bashayer Alhawsawi”, bullet list (studies, freelance, delivery, Tuwaiq Academy).
- Service cards: Mobile Development, 4+ years experience, Problem Solving (icon + short text).
- All text translatable via `data-i18n` and locale files.

### 4.4 Skills (#skills)
- Grid of **skill cards** (square, icon on top, name below).
- Skills: Kotlin, Flutter, JavaScript, Java, HTML/CSS, Android, Dart, Firebase, Git, GitHub (or as per current list).
- No progress bars/dots; icon + label only. Responsive grid.

### 4.5 Projects (#projects)
- Section title, then **filter tabs:** All | Web Application | Mobile Application.
- **Project cards:** Each card has:
  - **Image slider:** Multiple images per project; prev/next + dots; LTR-only so RTL doesn’t break layout (`direction: ltr` on slider).
  - **Title and description** (from `projects.items.N` in locales).
  - **“Features used”** block with tags (e.g. HTML5, CSS3, JavaScript, Flutter, Kotlin).
  - **Optional links per project:** e.g. “Open in Drive” (web icon + link), “demo” (video), Google Play icon (link to store). Use classes like `project-tag`, `project-tag-icon`, `project-tag-web`, `project-tag-play`, `project-tag-demo`.
- **Index mapping:** Card order must match locale keys: `items.0`, `items.1`, `items.2`, `items.3` for Maan, Minute driver, Minute client, Minhaj (or current set). Each card uses its own `data-i18n="projects.items.N.title"` and `projects.items.N.description`.
- Images: under `img/` or Google Drive direct URLs; see MISSING-IMAGES.md and GOOGLE-DRIVE-IMAGES-GUIDE.md for deployment.

### 4.6 Contact (#contact)
- **“How to reach me”:** WhatsApp, Email (icons + links).
- **“Social media”:** Twitter/X, LinkedIn, GitHub (or as configured).
- **Contact form:** Name, Email, Message; submit button (e.g. “Send Message” / “Message Sent!”). Form can be client-side only (no backend required for the brief).
- All labels and placeholders translatable.

---

## 5. Technical Requirements

- **No build step:** Plain HTML, CSS, JS. One `index.html`, one `styles.css`, one `script.js`.
- **Assets:** `img/` for images; `locales/en.json`, `locales/ar.json` for i18n.
- **Resume:** Single Drive file; one view URL used for both “Open in Drive” and “Open in new tab”. Dropdown opens on “Download Resume” tap/click; closes on outside click; `aria-expanded` / `aria-hidden` for menu.
- **Sliders:** Each project card’s slider: track width = `n * 100%`, each slide `flex: 0 0 (100/n)%`; `translateX(-index * (100/n)%)` for position. Re-apply position on image load and when card becomes visible (reveal). Add `slider-ready` after first paint for transition. `direction: ltr` on slider and container in RTL.
- **Reveal:** `.reveal` + `.active` (e.g. IntersectionObserver); project cards use opacity-only reveal (no transform on card) to avoid breaking slider.
- **Deployment:** Include `index.html`, `styles.css`, `script.js`, `locales/`, `img/` (all referenced images). See DEPLOY.md and DEPLOYMENT-CHECKLIST.md.

---

## 6. What the portfolio must do (summary)

1. Present **Bashayer** as a **mobile developer** with a clear hero, about, skills, projects, and contact.
2. Be **bilingual (EN/AR)** with RTL and all copy coming from locale files.
3. Offer **resume access** via a single “Download Resume” control that reveals **Open in Drive** and **Open in new tab**.
4. Show **projects** with image sliders, filters (All / Web / Mobile), and correct per-card translations and optional links (web, demo, Play Store).
5. Work well on **mobile** (nav, hero CTA, language toggle with socials, touch-friendly sliders).
6. Keep **design consistent**: dark theme, neon accents, Poppins/Inter/Tajawal, card style, and accessibility.

Use this document as the single source of what the portfolio is and what it needs when you implement or modify the site.
