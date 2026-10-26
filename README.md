# Bashayer Alhawsawi — Portfolio

Static, bilingual (English / Arabic, RTL) portfolio site. Vanilla HTML, CSS and JavaScript, no build step.

## Structure

```
index.html             Page markup (hero, about, projects timeline, contact)
styles.css             Base styles and responsive rules
titanic.css / .js      Atmospheric theme layer (loads after styles.css)
projects.css           Projects timeline layout
script.js              i18n, navigation, scroll reveal, typewriter, cursor
locales/en.json, ar.json   All visible copy
img/                   Original screenshots (used by portfolio-cv.html / the PDF + DOCX export)
img/web/               Compressed WebP copies used by the site
portfolio-cv.html      Printable portfolio; scripts/generate_docx.py builds the .docx
```

## Run locally

```bash
npm start   # python3 -m http.server 8080
```

Open http://localhost:8080. Translations are fetched, so opening `index.html` from disk will not load the copy.

## Add a project

1. Copy a `.tl-entry` block in `index.html`, bump `data-project-index`, and alternate `tl-left` / `tl-right`.
2. Add the matching item to `projects.items` in both `locales/en.json` and `locales/ar.json`
   (`title`, `subtitle`, `categoryLabel`, `description`, `result`).
3. Put screenshots in `img/`, then add WebP copies (max 1200px, quality ~80) to `img/web/`.

## Deploy

Any static host. `netlify.toml` and `.htaccess` set headers; CSS/JS are revalidated on each load because filenames are not hashed.

© Bashayer Alhawsawi
