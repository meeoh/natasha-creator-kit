# Operations

## Deploying

Pushes to `main` deploy the site to GitHub Pages.

```bash
git push origin main
```

Normal pushes do **not** refresh stats.

## Updating stats

Instagram and TikTok stats are manual only.

To update them:

1. Edit `data/stats.json`.
2. Commit the change.
3. Push to `main`, or run the GitHub Pages deploy workflow manually.

The GitHub Actions workflow deploys only. It does not call Apify, official APIs, or `scripts/update-stats.mjs`.

## GitHub secrets

No GitHub Actions secrets are required for deployment. Social stats are not refreshed automatically.

Current Instagram performance fields are manual:

```json
"performance": {
  "avgEngagementRate": 4.9,
  "avgViews": 22200,
  "reachRate": 73,
  "source": "manual"
}
```

Current TikTok performance fields are manual:

```json
"performance": {
  "totalViews": 2200000,
  "engagementRate": 3.5,
  "profileViews": 39900,
  "source": "manual"
}
```

## Local preview

```bash
python3 -m http.server 8080
```

Open:

```txt
http://localhost:8080
http://localhost:8080/links/
```

## Custom domain

The repo has a root `CNAME` file:

```txt
natashagolfing.com
```

GitHub Pages should serve:

```txt
https://natashagolfing.com/
https://natashagolfing.com/links
```

DNS setup should include GitHub Pages apex A records and a `www` CNAME to `meeoh.github.io`. Enable `Enforce HTTPS` in GitHub Pages after DNS verification.

## `/links` page

Files:

```txt
links/index.html
links/styles.css
```

Current links, in order:

```txt
Instagram
TikTok
Media kit
Collabs
```

The Collabs link is a plain `mailto:` link. It uses default browser/device behavior. If clicking it appears to do nothing, the visitor probably does not have a default mail app/handler configured.

Design rules:

- Match the media kit design.
- Keep it compact and fitting in the viewport without scroll where possible.
- Use `assets/natasha-avatar.jpg`.
- Use subtle pink/white icon cards with black/outline glyphs, not bright gradients.
- Bump the query string in `links/index.html` when changing `links/styles.css`.

## Updating partner logos

Partner logos live in `assets/brands/` and are referenced twice in `index.html` because the carousel repeats one logo set for seamless scrolling.

Current partner list:

```txt
GolfNorth
GrooveIt
PUR3 Golf
Trust Golf Ball
Transcend Golf Simulators
SeeMore Putter Company
```

When replacing a partner logo:

1. Add the optimized local asset under `assets/brands/`.
2. Update both repeated carousel logo sets in `index.html`.
3. Add or adjust a logo-specific CSS class in `styles.css` for alignment/sizing.
4. Preview locally and verify the logo is visually aligned in the carousel before pushing.

## Adding featured posts

1. Add item to `data/featured-posts.json`:

```json
{
  "title": "Optional internal title",
  "platform": "instagram",
  "category": "products",
  "url": "https://www.instagram.com/p/SHORTCODE/?hl=en",
  "image": "assets/featured/SHORTCODE.jpg"
}
```

2. Download thumbnail locally. For Instagram posts/reels, this often works with `/p/SHORTCODE/` even when the public URL is `/reels/SHORTCODE/`:

```bash
curl -L "https://www.instagram.com/p/SHORTCODE/media/?size=l" -o assets/featured/SHORTCODE.jpg
```

3. Optimize image:

```bash
sips -Z 900 --setProperty format jpeg --setProperty formatOptions 82 assets/featured/SHORTCODE.jpg --out assets/featured/SHORTCODE.jpg
```

4. For TikTok thumbnails, use TikTok oEmbed to find `thumbnail_url`, download it locally, then optimize with `sips`.

5. Commit JSON + image.

## Cost estimate

The deploy workflow no longer runs Apify or official social APIs, so normal deploys have no social-scraping cost.

## Avoid committing secrets

Never commit:

```txt
APIFY_TOKEN
access tokens
refresh tokens
client secrets
```

Secrets belong only in GitHub Actions secrets.
