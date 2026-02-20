# Deployment Checklist for Images

## ⚠️ CRITICAL: Before Deploying

### 1. Fix Filename Issues
- ✅ **Fixed:** `me logo.PNG` → Rename file to `me-logo.png` (remove space, lowercase extension)
- **Action Required:** Rename the file `img/me logo.PNG` to `img/me-logo.png` on your computer

### 2. Verify All Image Files Exist
Make sure ALL these files are in your `img/` folder before uploading:

**About Section:**
- `me-logo.png` (renamed from `me logo.PNG`)

**Maan Web Project:**
- `maan_1.png`
- `maan02.png`
- `maan03.png`
- `maan_5.png`
- `maan06.png`
- `maan07.png`

**Minute App Driver:**
- `driver_logo.png`
- `driver01.jpg`
- `driver02.jpg`
- `driver03.jpg`

**Minute App Client:**
- `clinet_logo.png`
- `clinet01.jpg`
- `clinet02.jpg`
- `clinet03.jpg`
- `clinet04.jpg`
- `clinet06.jpg`

**Minhaj App:**
- `minhag_logo.png`
- `minhaj01.jpg`
- `minhaj02.jpg`
- `minhaj03.jpg`
- `minhaj04.jpg`

### 3. Case Sensitivity (Linux Servers)
- ✅ All filenames use lowercase (good!)
- ✅ All extensions are lowercase: `.png`, `.jpg` (good!)
- ⚠️ Ensure your local filenames match exactly (case-sensitive)

### 4. Upload Checklist
When uploading to your web server:
- [ ] Upload the entire `img/` folder with ALL images
- [ ] Keep the folder structure: `your-site/img/`
- [ ] Verify `img/` folder is in the same directory as `index.html`
- [ ] Check file permissions (images should be readable: 644)

### 5. Test After Deployment
1. Open browser console (F12)
2. Go to Network tab → Filter by "Img"
3. Refresh the page
4. Check for any 404 (red) errors
5. If you see 404s, note which files are missing

### 6. Common Deployment Issues

**Issue:** Images show locally but not on server
- **Cause:** Files not uploaded or wrong path
- **Fix:** Verify `img/` folder exists on server

**Issue:** Only first image shows in slider
- **Cause:** Missing image files (404 errors)
- **Fix:** Check browser console for missing files

**Issue:** Images load slowly
- **Cause:** Large file sizes
- **Fix:** Optimize images (compress before upload)

**Issue:** Some images show, others don't
- **Cause:** Case sensitivity or typos in filenames
- **Fix:** Double-check filenames match exactly

### 7. Quick Fix Script (Optional)
If you have SSH access, you can check for missing files:
```bash
# List all image files referenced in HTML
grep -o 'img/[^"]*' index.html | sort -u

# Compare with actual files in img/ folder
ls img/
```

## ✅ Pre-Deployment Checklist
- [ ] Renamed `me logo.PNG` → `me-logo.png` locally
- [ ] Verified all 20+ image files exist in `img/` folder
- [ ] All filenames use lowercase (no spaces, no uppercase)
- [ ] Tested locally - all images load correctly
- [ ] Ready to upload entire `img/` folder to server

## 🚀 Deployment Steps
1. Rename `me logo.PNG` to `me-logo.png` locally
2. Upload entire `img/` folder to your web server
3. Upload `index.html`, `styles.css`, `script.js`
4. Upload `locales/` folder
5. Test the website - check browser console for errors
