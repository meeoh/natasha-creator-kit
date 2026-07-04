# Operations

## Deploying

Pushes to `main` deploy the site to GitHub Pages.

```bash
git push origin main
```

Normal pushes do **not** refresh stats.

## Refreshing stats

Stats refresh is manual only:

```txt
GitHub → Actions → Update stats and deploy GitHub Pages → Run workflow
```

This refreshes Apify stats, commits `data/stats.json`, and deploys.

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
```

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

2. Download thumbnail locally. For Instagram posts, this often works:

```bash
curl -L "https://www.instagram.com/p/SHORTCODE/media/?size=l" -o assets/featured/SHORTCODE.jpg
```

3. Optimize image:

```bash
sips -Z 900 --setProperty format jpeg --setProperty formatOptions 82 assets/featured/SHORTCODE.jpg --out assets/featured/SHORTCODE.jpg
```

4. Commit JSON + image.

## Cost estimate

Current all-time refresh at account size around 35 IG posts + 140 TikTok videos:

```txt
~$0.30–$0.31 per manual refresh
```

If daily:

```txt
~$9–10/month
```

But currently refresh is manual-only.

## Avoid committing secrets

Never commit:

```txt
APIFY_TOKEN
access tokens
refresh tokens
client secrets
```

Secrets belong only in GitHub Actions secrets.
