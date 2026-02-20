# Quick Deploy Guide

## ✅ Your website is ready to deploy!

### Files to Upload:
```
portfolio/
├── index.html          ✅ Main page
├── styles.css          ✅ Styles
├── script.js           ✅ JavaScript
├── img/                ✅ Images (project slides, about photo, etc.)
├── locales/
│   ├── en.json        ✅ English translations
│   └── ar.json        ✅ Arabic translations
├── .htaccess          ✅ Apache config (optional)
├── netlify.toml       ✅ Netlify config (optional)
├── package.json       ✅ Metadata
└── README.md          ✅ Documentation
```

## 🚀 Deploy Methods

### Method 1: Netlify (Easiest - Recommended)

1. Go to: https://app.netlify.com/drop
2. Drag the entire `portfolio` folder
3. Done! Your site is live in seconds

**No signup required for testing!**

### Method 2: GitHub Pages

```bash
# 1. Initialize git (if not already)
git init
git add .
git commit -m "Initial commit"

# 2. Create repo on GitHub
# 3. Push code
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main

# 4. Enable GitHub Pages in repo settings
# Settings → Pages → Source: main branch
```

Your site will be at: `https://YOUR_USERNAME.github.io/YOUR_REPO`

### Method 3: Vercel

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Deploy
vercel

# Follow the prompts
```

### Method 4: Traditional Hosting (cPanel/FTP)

1. Connect to your hosting via FTP (FileZilla, etc.)
2. Upload ALL files to `public_html` or `www` folder
3. Keep folder structure intact (especially `locales/` folder)
4. Access via your domain

**Important:** Make sure the `locales/` folder is uploaded!

## ✅ Verification Checklist

After deploying, test these features:

- [ ] Website loads correctly
- [ ] Click EN/ع buttons to switch language
- [ ] All text changes to Arabic when clicking ع
- [ ] Direction changes to RTL in Arabic
- [ ] Language persists after page reload
- [ ] All sections work (Hero, About, Projects, Skills, Contact)
- [ ] Responsive on mobile
- [ ] Contact form validation works

## 🔧 Common Issues & Solutions

### Issue: Language not switching
**Solution:** Make sure `locales/` folder is uploaded with both JSON files

### Issue: 404 on JSON files
**Solution:** 
- Check folder structure on server
- Ensure `locales/en.json` and `locales/ar.json` exist
- Check file permissions (should be 644)

### Issue: Arabic text not displaying
**Solution:** 
- Check that `locales/ar.json` is uploaded
- Clear browser cache
- Open browser console to check for errors

### Issue: Fonts not loading
**Solution:** Already using Google Fonts CDN - should work automatically

## 📱 Testing

Test on:
- Desktop browsers (Chrome, Firefox, Safari, Edge)
- Mobile devices (iOS Safari, Chrome Android)
- Different screen sizes

## 🌐 Custom Domain

After deployment, you can add your custom domain:

**Netlify:** Settings → Domain management → Add custom domain
**GitHub Pages:** Settings → Pages → Custom domain
**Vercel:** Settings → Domains → Add

## 📞 Support

If you encounter issues:
1. Check browser console for errors (F12)
2. Verify all files are uploaded
3. Clear browser cache
4. Test in incognito/private mode

---

**Your website is production-ready!** 🎉

All features including bilingual support (EN/AR) will work perfectly on any hosting platform.
