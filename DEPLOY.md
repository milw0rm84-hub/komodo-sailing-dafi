# Deployment Guide: cPanel + Railway

## Overview
- **Frontend**: Upload to cPanel as static files
- **Backend**: Deploy on Railway (free Node.js hosting)
- **Database**: Railway MySQL (free tier)

---

## Part 1: Deploy Backend to Railway

### Step 1.1: Create Railway Account
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Click **"New Project"** → **"Deploy from GitHub repo"**

### Step 1.2: Connect Repository
1. Select this repository
2. Choose the `server` folder as the root directory

### Step 1.3: Add MySQL Database
1. In your Railway project, click **"Add Plugin"**
2. Select **"MySQL"**
3. Railway will create a MySQL database automatically

### Step 1.4: Set Environment Variables
In Railway Dashboard → Variables, add:

```
PORT=5000
DB_HOST=<from MySQL plugin - click on MySQL to see>
DB_PORT=3306
DB_USER=<from MySQL plugin>
DB_PASSWORD=<from MySQL plugin>
DB_NAME=komodo_sailing
JWT_SECRET=your-random-secret-key-here
JWT_EXPIRES=7d
FRONTEND_URL=https://yourdomain.com
ADMIN_EMAIL=admin@komodosailing.com
ADMIN_PASSWORD=komodo123
```

### Step 1.5: Deploy
1. Railway will auto-deploy from GitHub
2. Wait for deployment to complete (green status)
3. Copy your backend URL: `https://your-project.railway.app`

---

## Part 2: Configure Frontend for Production

### Step 2.1: Update API URL
Edit `src/utils/api.js` and `src/context/SettingsContext.jsx`:

Change:
```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
```

To your Railway URL:
```javascript
const API_URL = 'https://your-project.railway.app/api';
```

Or use environment variable:
```
VITE_API_URL=https://your-project.railway.app/api
```

### Step 2.2: Build for Production
```bash
npm run build
```

This creates a `dist/` folder with production files.

---

## Part 3: Upload to cPanel

### Step 3.1: Login to cPanel
1. Go to your hosting cPanel URL (usually `https://yourdomain.com/cpanel`)
2. Login with your credentials

### Step 3.2: Open File Manager
1. Click **"File Manager"**
2. Navigate to `public_html` folder

### Step 3.3: Upload Files
1. Click **"Upload"**
2. Upload all files from the `dist` folder
3. Or upload the entire `dist` folder contents to `public_html`

### Step 3.4: Set Permissions
1. Right-click on uploaded files
2. Click **"Change Permissions"**
3. Set to `644` for files, `755` for folders

---

## Part 4: Domain Configuration

### If using subdomain for API:
1. In cPanel, go to **"Subdomains"**
2. Create subdomain: `api.yourdomain.com`
3. Point to a separate folder (optional)
4. Update Railway custom domain settings

### DNS Settings:
- Add CNAME record: `api` → `your-project.railway.app` (if Railway supports custom domain)

---

## Part 5: Admin Panel Deployment

### Option A: Subfolder
1. Create folder `public_html/admin`
2. Build admin: `cd admin && npm run build`
3. Upload admin `dist` contents to `public_html/admin`

### Option B: Separate subdomain
1. Create subdomain: `admin.yourdomain.com`
2. Upload admin build to that subdomain's folder

---

## Part 6: Verify Installation

### Check Backend:
Visit: `https://your-project.railway.app/api/health`

Should return: `{"status":"ok","message":"Komodo Sailing API Running"}`

### Check Frontend:
Visit: `https://yourdomain.com`

---

## Troubleshooting

### CORS Errors
- Make sure `FRONTEND_URL` in Railway matches your domain exactly
- Include `https://` and no trailing slash

### Database Connection Failed
- Check Railway MySQL credentials are correct
- Ensure database name matches

### 404 on API calls
- Verify `VITE_API_URL` ends with `/api`
- Check Railway deployment is successful (no red errors)

### White Screen on Frontend
- Check browser console for errors
- Verify all files uploaded correctly
- Check `.htaccess` configuration

---

## Updating Your Site

### Frontend (cPanel):
1. Run `npm run build` locally
2. Upload new `dist` folder contents to `public_html`

### Backend (Railway):
1. Push changes to GitHub
2. Railway auto-deploys

---

## File Structure After Upload

```
public_html/
├── index.html
├── assets/
├── logo.svg
├── favicon.svg
└── ... (other built files)
```

Admin (if using subfolder):
```
public_html/
├── admin/
│   ├── index.html
│   └── assets/
└── ... (main site files)
```
