# Portfolio Website - Meriem Benfekhadou

Modern, responsive portfolio website with dark neon gradient theme and bilingual support (English/Arabic).

## Features

- ✨ Modern dark neon gradient design
- 🌍 Bilingual support (English/Arabic) with RTL
- 📱 Fully responsive (Mobile, Tablet, Desktop)
- 🎨 Smooth animations and scroll effects
- ⚡ Fast and lightweight
- ♿ Accessible (WCAG compliant)

## Project Structure

```
portfolio/
├── index.html          # Main HTML file
├── styles.css          # All styles and responsive design
├── script.js           # JavaScript (animations, i18n, interactions)
├── locales/
│   ├── en.json        # English translations
│   └── ar.json        # Arabic translations
├── info.json          # Design specifications
└── README.md          # This file
```

## How to Deploy

### Option 1: Upload to Web Hosting (Recommended)

1. Upload all files to your web hosting via FTP/SFTP or hosting control panel
2. Maintain the folder structure (keep `locales/` folder intact)
3. Access your website via your domain

**Supported Hosting Providers:**
- Netlify (recommended, drag & drop deployment)
- Vercel
- GitHub Pages
- Traditional web hosting (cPanel, etc.)

### Option 2: Netlify (Easiest)

1. Go to [netlify.com](https://netlify.com)
2. Drag and drop the entire `portfolio` folder
3. Your site will be live instantly

### Option 3: GitHub Pages

1. Create a new GitHub repository
2. Push all files to the repository
3. Enable GitHub Pages in repository settings
4. Your site will be available at `https://username.github.io/repo-name`

### Option 4: Traditional Hosting (cPanel, etc.)

1. Login to your hosting control panel
2. Upload all files to `public_html` or `www` directory
3. Ensure folder structure is preserved
4. Access via your domain

## Language System

The website supports English and Arabic with automatic RTL support:

- **Default language:** English
- **Language persistence:** Selected language is saved in browser localStorage
- **Translation files:** Located in `locales/en.json` and `locales/ar.json`

### How to Add/Edit Translations

Edit the JSON files in the `locales/` folder:

```json
{
  "nav": {
    "home": "Home",
    "about": "About"
  }
}
```

No need to edit HTML - translations are automatically applied.

## Customization

### Update Personal Information

Edit the text in `locales/en.json` and `locales/ar.json`:
- Name, title, description
- Projects, skills
- Contact information

### Update Links

Edit `index.html`:
- Social media links (lines 49-57)
- Project links (Repository and Demo buttons)

### Update Colors

Edit `styles.css` (lines 2-19):
```css
:root {
  --primary: #9B4DFF;
  --secondary: #FF5EA8;
  --accent: #00E5FF;
  /* ... other colors */
}
```

### Add/Remove Projects

1. Add project data to `locales/en.json` and `locales/ar.json`
2. Add project card HTML in `index.html` (follow existing pattern)

### Update Skills

Edit the skills section in `index.html` (lines 182-229)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## Performance

- Lightweight: ~50KB total (HTML + CSS + JS)
- No external dependencies
- Optimized loading
- SEO friendly

## License

© 2025 Meriem Benfekhadou. All rights reserved.

## Technical Notes

- Uses vanilla JavaScript (no frameworks)
- CSS Grid + Flexbox for layout
- Google Fonts: Poppins, Inter, Tajawal
- Fetch API for loading translations
- LocalStorage for language persistence
- IntersectionObserver for scroll animations

## Support

For issues or questions, contact: contact@meriem.dev
