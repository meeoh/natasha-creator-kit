# Golf Creator Kit

A sleek static creator/media kit for Natasha Golfing, designed for GitHub Pages and served at:

```txt
https://natashagolfing.com/
https://natashagolfing.com/links
```

`data/stats.json` is intentionally committed so the current public stats are visible in GitHub. Social stats are maintained manually in that file; the GitHub Pages workflow only deploys the committed site and does not refresh Instagram or TikTok automatically.

## Stats setup

Instagram and TikTok stats are manual only.

To update social stats:

1. Edit `data/stats.json`.
2. Commit the change.
3. Push to `main`, or run the GitHub Pages deploy workflow manually.

The deploy workflow does not call Apify, official Instagram/TikTok APIs, or `scripts/update-stats.mjs`.

## Files

- `index.html`, `styles.css`, `script.js` — media kit frontend
- `links/index.html`, `links/styles.css` — Linktree-style links page
- `CNAME` — custom domain for `natashagolfing.com`
- `data/profile.json` — safe-to-commit profile info and handles
- `data/stats.json` — committed/generated stats used by the site
- `data/featured-posts.json` — featured post metadata
- `assets/brands/` — local partner carousel logos, including PUR3 Golf
- `scripts/update-stats.mjs` — legacy/manual utility for pulling stats and writing `data/stats.json`; not run by deploy workflow
- `.github/workflows/pages.yml` — GitHub Pages deploy

## Customize profile and handles

Edit:

```txt
data/profile.json
```

Set her name, email, copy, and handles:

```json
{
  "profile": {
    "name": "Creator Name",
    "bio": "Creator positioning statement...",
    "location": "Canada",
    "avatar": "assets/natasha-avatar.jpg",
    "email": "natashagolfing@gmail.com",
    "instagramUrl": "https://instagram.com/handle",
    "tiktokUrl": "https://www.tiktok.com/@handle"
  },
  "platforms": {
    "instagram": { "username": "handle" },
    "tiktok": { "username": "handle" }
  }
}
```

Circular avatar displays currently use the cropped square image `assets/natasha-avatar.jpg`. The original optimized image is kept as `assets/natasha-cover.jpg`.

## Manual stats values

Instagram performance values in `data/stats.json`:

```json
"performance": {
  "avgEngagementRate": 4.9,
  "avgViews": 22200,
  "reachRate": 73,
  "source": "manual"
}
```

TikTok performance values in `data/stats.json`:

```json
"performance": {
  "totalViews": 2200000,
  "engagementRate": 3.5,
  "profileViews": 39900,
  "source": "manual"
}
```

## Local preview

From this folder:

```bash
python3 -m http.server 8080
```

Open:

```txt
http://localhost:8080
http://localhost:8080/links/
```

## Links page

The `/links` page is a compact Linktree-style page matching the media kit design. It includes:

```txt
Instagram → https://www.instagram.com/natashagolfing/
TikTok → https://www.tiktok.com/@natashagolfing
Media kit → https://natashagolfing.com/
Collabs → mailto:natashagolfing@gmail.com
```

The Collabs link uses plain default `mailto:` behavior. If clicking it does nothing, the browser/device likely does not have a default email app or mail handler configured.

## GitHub Pages deploy

1. Push this project to GitHub.
2. Go to:

   ```txt
   Settings → Pages
   ```

3. Set:

   ```txt
   Build and deployment → Source → GitHub Actions
   ```

4. Custom domain is configured through root `CNAME`:

   ```txt
   natashagolfing.com
   ```

5. Push to `main` or run the deploy workflow manually.

Normal pushes deploy the site without refreshing stats. Manual workflow runs also deploy only. To change stats, edit `data/stats.json`, commit it, and deploy.

## Legacy updater

`scripts/update-stats.mjs` still exists as a legacy/manual utility for Apify or official API pulls, but the current deploy workflow does not use it. Do not add social API secrets or automatic refresh behavior unless explicitly requested.
