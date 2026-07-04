# Operations

## Deploying

Pushes to `main` deploy the site to GitHub Pages.

```bash
git push origin main
```

Normal pushes do **not** refresh stats.

## Refreshing stats

Stats refresh automatically runs every two weeks by default, plus it can still be run manually:

```txt
GitHub → Actions → Update stats and deploy GitHub Pages → Run workflow
```

The first scheduled refresh is 2026-07-18 at 14:00 UTC. After that, the workflow refreshes every 14 days. GitHub Actions does not support a true biweekly cron expression, so the workflow is scheduled weekly on Saturdays and gates paid Apify refreshes by date. On refresh runs, it updates Apify stats, commits `data/stats.json`, and deploys.

## Required GitHub secrets

```txt
APIFY_TOKEN
APIFY_INSTAGRAM_ACTOR_ID
APIFY_TIKTOK_ACTOR_ID
```

Expected actor IDs:

```txt
APIFY_INSTAGRAM_ACTOR_ID=apify/instagram-scraper
APIFY_TIKTOK_ACTOR_ID=clockworks/tiktok-scraper
```

## Optional GitHub vars/secrets

```txt
INSTAGRAM_USERNAME
TIKTOK_USERNAME
CONTENT_SAMPLE_SIZE
MAX_CONTENT_ITEMS
APIFY_INSTAGRAM_INPUT_JSON
APIFY_INSTAGRAM_RECENT_INPUT_JSON
APIFY_TIKTOK_INPUT_JSON
```

Defaults for performance scrape:

```txt
CONTENT_SAMPLE_SIZE=all
MAX_CONTENT_ITEMS=250
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

Current all-time refresh at account size around 35 IG posts + 140 TikTok videos:

```txt
~$0.30–$0.31 per manual refresh
```

If daily:

```txt
~$9–10/month
```

With the current biweekly schedule:

```txt
~$0.60–$0.62/month, plus any manual refreshes
```

## Avoid committing secrets

Never commit:

```txt
APIFY_TOKEN
access tokens
refresh tokens
client secrets
```

Secrets belong only in GitHub Actions secrets.
