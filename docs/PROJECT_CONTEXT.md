# Natasha Creator Kit — Project Context

## What this project is

A static, GitHub Pages-hosted media kit for Natasha Golfing.

Live site:

```txt
https://meeoh.github.io/natasha-creator-kit/
```

Repo:

```txt
https://github.com/meeoh/natasha-creator-kit
```

The site is designed as a sleek one-page creator/media kit with:

- profile card on the left
- social stats and featured post gallery on the right
- manual GitHub Actions refresh for stats
- Apify-powered Instagram/TikTok scraping
- no secrets committed to git

## Current product direction

The visual direction is inspired by CreatorsJet media kits, especially:

```txt
https://www.creatorsjet.com/jet/Sarahnautics
```

But customized for Natasha:

- warm cream/blush/soft-neutral palette
- large rounded cards
- clean media-kit feel
- no heavy green golf tones
- minimal top chrome; top navigation was removed entirely
- left profile card should remain visible while the right side/page scrolls on desktop

## Important UX decisions already made

### Header/nav

The top header/nav was removed completely. Do not re-add it unless asked.

### Left profile card

The left card contains:

- local optimized profile/cover image: `assets/natasha-cover.jpg`
- Creator media kit label
- `Natasha Golfing`
- location: `Canada · Golf content creator`
- bio
- mailto CTA: `Contact to collaborate`

The left card should be sticky on desktop so it stays visible while scrolling the right side/page.

### Right panel

Currently contains:

- `Insights & data`
- Instagram stat section
- TikTok stat section
- Featured posts gallery with filters

Previous iterations had combined metric cards and a contact section in the right panel; those were removed/reworked.

### Featured posts

The featured posts section replaces a generic partnership/info section.

Current filter pills:

- All
- Products
- Play
- Entertainment

`Community` was explicitly removed.

The cards should show real visual post previews, not plain text boxes. The text overlays like “Product feature” were removed from thumbnails. Cards currently show:

- image preview
- platform badge
- category badge
- subtle “View post ↗” on hover

Filtering should not flash. We removed the re-entry animation because it caused visual flicker.

## Contact email

Use this everywhere:

```txt
natashagolfing@gmail.com
```

This is stored in:

- `data/profile.json`
- `data/stats.json`
- fallback values in `script.js`
- fallback values in `scripts/update-stats.mjs`
- static fallback `mailto:` hrefs in `index.html`

## Main files

```txt
index.html                  Page markup
styles.css                  Main styling
script.js                   Client-side rendering + featured post filtering
data/profile.json           Source-of-truth profile info/handles/email
data/stats.json             Tracked/generated social stats
data/featured-posts.json    Featured post data
scripts/update-stats.mjs    Apify + optional official API updater
.github/workflows/pages.yml GitHub Pages deploy + manual stats refresh
assets/natasha-cover.jpg    Optimized profile/cover photo
assets/featured/*.jpg       Optimized featured post thumbnails
```

## Deployment model

GitHub Pages deploys via GitHub Actions.

Workflow:

```txt
.github/workflows/pages.yml
```

Important behavior:

- On normal push to `main`: deploy only, do not refresh stats.
- On manual `workflow_dispatch`: refresh stats, commit `data/stats.json`, deploy.

Stats should **not** refresh on every commit.

## Stats refresh behavior

Stats are refreshed only when manually running:

```txt
Actions → Update stats and deploy GitHub Pages → Run workflow
```

The workflow then:

1. runs `node scripts/update-stats.mjs`
2. updates `data/stats.json`
3. commits `data/stats.json` if changed using `github-actions[bot]`
4. deploys to GitHub Pages

## Apify setup

Required GitHub secrets:

```txt
APIFY_TOKEN
APIFY_INSTAGRAM_ACTOR_ID=apify/instagram-scraper
APIFY_TIKTOK_ACTOR_ID=clockworks/tiktok-scraper
```

Optional vars/secrets:

```txt
INSTAGRAM_USERNAME
TIKTOK_USERNAME
CONTENT_SAMPLE_SIZE
MAX_CONTENT_ITEMS
APIFY_INSTAGRAM_INPUT_JSON
APIFY_INSTAGRAM_RECENT_INPUT_JSON
APIFY_TIKTOK_INPUT_JSON
```

If username vars are absent, code uses handles from `data/profile.json`.

Current handle for both:

```txt
natashagolfing
```

## Social stats

Current stats file tracks:

- profile info
- Instagram followers/posts/following
- TikTok followers/likes/videos/following
- Instagram performance
- TikTok performance
- combined performance

`data/stats.json` is intentionally committed now because the user wanted to see the stats file in GitHub.

## Performance stats calculations

We originally discussed latest 12 posts/videos, then changed to all-time public content.

Current defaults:

```txt
CONTENT_SAMPLE_SIZE=all
MAX_CONTENT_ITEMS=250
```

For Natasha’s current size, refresh scraped approximately:

```txt
Instagram: 35 content items
TikTok: 140 content items
Total sample: 175 content items
```

Metrics calculated:

### Instagram

```txt
avg likes = total likes / like sample size
avg views = total views / view sample size
avg engagement rate = total(likes + comments) / (followers × #sampled posts) × 100
```

Instagram public scraping generally does not provide saves/shares reliably.

### TikTok

```txt
avg likes = total likes / video sample size
avg views = total views / video sample size
avg engagement rate = total(likes + comments + shares + saves/collects) / (followers × #sampled videos) × 100
```

### Combined

Combined performance is computed by aggregating platform totals and denominators.

Current live/generated example after all-time scrape:

```txt
Combined avg engagement: 21.75%
Combined avg views: 8.4K
Combined avg likes: 340
Sample size: 175

Instagram avg engagement: 13.92%
Instagram avg views: 6.6K
Instagram avg likes: 365

TikTok avg engagement: 25.01%
TikTok avg views: 8.9K
TikTok avg likes: 333
```

## Estimated Apify costs

Approximate actor pricing seen during research:

```txt
Instagram Scraper: ~$1.50 / 1,000 results
TikTok Scraper: ~$1.70 / 1,000 results
```

With all-time capped scrape at current account size:

```txt
Instagram: ~35–40 results ≈ $0.05–$0.06
TikTok: ~140–146 results ≈ $0.24–$0.25
Total ≈ $0.30–$0.31 per manual refresh
```

If daily:

```txt
~$9–10/month
```

But workflow is manual-only, so cost occurs only when user explicitly refreshes stats.

## Audience demographics decision

User asked about an audience section like CreatorsJet showing:

- gender
- age
- top countries

Findings:

- CreatorsJet can create username-only kits.
- Sarahnautics had demographics; Natasha’s CreatorsJet free-tier page did not show audience demographics.
- CreatorsJet likely uses third-party influencer analytics / estimated demographics, not OAuth-only data.
- Public Apify scraping does not reliably provide demographics.
- Official Instagram APIs can potentially provide audience demographics for a Professional account, but setup is heavier.
- TikTok official Display API generally does not provide full audience demographics.

Decision:

```txt
Leave audience section out for now.
```

Do not add audience demographics unless asked again.

## Featured posts data

Data file:

```txt
data/featured-posts.json
```

Current categories:

```txt
products
play
entertainment
```

Current links:

Products:

```txt
https://www.instagram.com/p/DZ_Z4OWtHVO/?hl=en
https://www.instagram.com/p/DZPxSoUxpm6/?hl=en
```

Play:

```txt
https://www.instagram.com/p/DYdI7NzHb13/?hl=en
https://www.instagram.com/p/DZBflphMDuF/?hl=en
```

Entertainment:

```txt
https://www.instagram.com/p/DZXToHtx6LJ/?hl=en
https://www.instagram.com/p/DZyUp7RPHfw/?hl=en
https://www.instagram.com/p/DXdIXD6Dc14/?hl=en
```

Thumbnails were downloaded from Instagram `media/?size=l`, optimized with `sips`, and stored in:

```txt
assets/featured/
```

If adding new featured posts, also add optimized local images. Avoid relying on Instagram CDN URLs directly because they expire.

## Local preview

Because the page fetches JSON files, use a local static server:

```bash
python3 -m http.server 8080
```

Open:

```txt
http://localhost:8080
```

Opening `index.html` directly may fail to load JSON due to browser `file://` fetch restrictions.

## Cache busting

We have often bumped query params in `index.html` to force CSS/JS refresh on GitHub Pages, e.g.:

```html
styles.css?v=20260704-ui11
script.js?v=20260704-ui11
```

If UI seems stale after deploy, bump these query params and/or hard refresh.

## Notes for future agents

- Be careful with design changes. User is sensitive to dead space, awkward card heights, and anything that looks less polished than CreatorsJet.
- Avoid adding generic filler cards.
- Use real post previews where possible.
- Keep featured post filter behavior smooth and without flashing.
- Keep the left profile card sticky on desktop.
- Keep stats refresh manual-only unless user explicitly asks otherwise.
- Do not commit secrets. GitHub Actions secrets are used for Apify.
- `data/stats.json` is committed intentionally.
