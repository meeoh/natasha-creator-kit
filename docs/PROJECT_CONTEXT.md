# Natasha Creator Kit — Project Context

## What this project is

A static, GitHub Pages-hosted media kit for Natasha Golfing.

Live sites:

```txt
https://natashagolfing.com/
https://natashagolfing.com/links
```

GitHub Pages fallback:

```txt
https://meeoh.github.io/natasha-creator-kit/
```

Repo:

```txt
https://github.com/meeoh/natasha-creator-kit
```

The project contains:

- a sleek one-page creator/media kit at `/`
- a Linktree-style links page at `/links`
- social stats and featured post gallery on the media kit
- manually entered audience charts on the media kit
- manual GitHub Actions refresh for stats
- Apify-powered Instagram/TikTok scraping for profile stats/TikTok performance
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

- local cropped avatar image: `assets/natasha-avatar.jpg`
- `Media kit` label
- `Natasha Golfing`
- location: `Canada · Golf content creator`
- bio: `Sharing my golf journey from beginner to better through relatable moments, lessons learned along the way, golf fits, and product discoveries.`
- mailto CTA: `Contact for collabs`

The left card should be sticky on desktop so it stays visible while scrolling the right side/page.

### Right panel

Currently contains:

- `Insights & data`
- Instagram stat section
- TikTok stat section
- small info tooltip beside `Avg engagement` labels; Instagram shows the manual-insights definition, TikTok shows the formula
- manual audience section with gender + age charts
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
index.html                  Media kit page markup
styles.css                  Media kit styling
script.js                   Client-side rendering + featured post filtering
links/index.html            Linktree-style links page
links/styles.css            Links page styling
(no links/script.js)        /links intentionally has no JS; mailto uses browser default behavior
CNAME                       Custom domain for GitHub Pages: natashagolfing.com
data/profile.json           Source-of-truth profile info/handles/email
data/stats.json             Tracked/generated social stats
data/featured-posts.json    Featured post data
scripts/update-stats.mjs    Apify + optional official API updater
.github/workflows/pages.yml GitHub Pages deploy + manual stats refresh
assets/natasha-cover.jpg    Original optimized cover/profile photo
assets/natasha-avatar.jpg   Cropped square avatar used by media kit and /links
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

Stats should **not** refresh on every commit. Instagram performance fields should remain manually maintained.

## Stats refresh behavior

Stats are refreshed when manually running:

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
- manually maintained Instagram performance (avg engagement, avg views, reach rate)
- TikTok performance
- combined auto-calculated performance for platforms with sampled totals

`data/stats.json` is intentionally committed now because the user wanted to see the stats file in GitHub.

## Performance stats calculations

Instagram follower count can still update automatically, but Instagram performance is manually maintained in `data/stats.json` and shown in the Instagram section:

```json
"performance": {
  "avgEngagementRate": 4.9,
  "avgViews": 22200,
  "reachRate": 73,
  "source": "manual"
}
```

The Instagram UI shows:

```txt
Avg engagement: 4.9%
Avg views: 22.2K
Reach rate: 73%
```

The Instagram avg engagement tooltip definition is:

```txt
(Likes + Comments + Shares + Saves) ÷ Views, averaged across posts
```

TikTok performance still uses public content scraping.

Current defaults:

```txt
CONTENT_SAMPLE_SIZE=all
MAX_CONTENT_ITEMS=250
```

### TikTok

```txt
avg likes = total likes / video sample size
avg views = total views / video sample size
avg engagement rate = total(likes + comments + shares + saves/collects) / (followers × #sampled videos) × 100
```

Tooltip shown in the UI:

```txt
Avg engagement = (likes + comments + shares + saves) ÷ (followers × videos sampled)
```

### Combined

Combined performance is computed by aggregating platform totals and denominators for platforms that have sampled totals. Manually maintained Instagram performance is not included in this automatic combined calculation.

Current generated example:

```txt
Instagram avg engagement: 4.9%
Instagram avg views: 22.2K
Instagram reach rate: 73%

TikTok avg engagement: 24.2%
TikTok avg views: 12.8K
TikTok avg likes: 385
```

## Estimated Apify costs

Approximate actor pricing seen during research:

```txt
Instagram Scraper: ~$1.50 / 1,000 results
TikTok Scraper: ~$1.70 / 1,000 results
```

Instagram content performance is no longer scraped automatically. Manual refreshes update Instagram profile stats and TikTok stats/performance, so current Apify cost depends mostly on the selected TikTok sample size plus one Instagram profile-details result.

## Audience demographics

Audience data is manually provided, not scraped. The current media kit has two individual charts:

Gender:

```txt
Men: 52%
Women: 48%
```

Age, combined from user-provided Instagram/TikTok screenshots:

```txt
18–24: 15.6%
25–34: 40.4%
35–44: 22.5%
45–54: 12.3%
55+: 9.2%
```

Do not try to automate demographics with Apify unless the user explicitly asks. Public scraping does not reliably provide real audience demographics.

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
https://www.tiktok.com/@natashagolfing/video/7632421241474862343?_r=1&_t=ZS-97juxsKcEJb
https://www.instagram.com/reels/DaOOTzGhwm1/
```

Play:

```txt
https://www.instagram.com/p/DYdI7NzHb13/?hl=en
https://www.instagram.com/p/DZBflphMDuF/?hl=en
https://www.instagram.com/reels/DZn_d5lhGHX/
https://www.tiktok.com/@natashagolfing/photo/7589137311741267207?_r=1&_t=ZS-97jv1xUFB4S&image_index=2
https://www.tiktok.com/@natashagolfing/video/7635450570861579527?_r=1&_t=ZS-97jv0ZZlEfA
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

If adding new featured posts, also add optimized local images. Avoid relying on Instagram/TikTok CDN URLs directly because they expire.

## `/links` page

The links page lives at:

```txt
links/index.html
links/styles.css
```

Public URL:

```txt
https://natashagolfing.com/links
```

Current links, in order:

```txt
Instagram → https://www.instagram.com/natashagolfing/
TikTok → https://www.tiktok.com/@natashagolfing
Media kit → https://natashagolfing.com/
Collabs → mailto:natashagolfing@gmail.com
```

The Collabs link is a plain `mailto:` link. It intentionally uses default browser/device behavior and does not copy to clipboard or show a custom toast. If clicking does nothing, the visitor likely does not have a default mail app/handler configured.

Design notes:

- Match the media kit: warm card, blush glow, rounded edges.
- Use the cropped avatar `assets/natasha-avatar.jpg`.
- Keep the page fitting in the viewport without scroll where possible.
- Icons should be black/outline glyphs in light pink/white card icons, not bright multicolor gradients.
- Main title is just `Natasha Golfing`, not `Golf creator links`.
- One-liner: `Golf girlie learning, styling, and sharing the journey ⛳️✨`.

## Custom domain

Primary domain:

```txt
natashagolfing.com
```

`CNAME` at repo root contains:

```txt
natashagolfing.com
```

DNS should point apex A records at GitHub Pages and `www` CNAME at `meeoh.github.io`. Enforce HTTPS in GitHub Pages once DNS is verified.

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
styles.css?v=20260704-ui28
script.js?v=20260704-ui28
```

If UI seems stale after deploy, bump these query params and/or hard refresh.

## Notes for future agents

- Be careful with design changes. User is sensitive to dead space, awkward card heights, and anything that looks less polished than CreatorsJet.
- Avoid adding generic filler cards.
- Use real post previews where possible.
- Keep featured post filter behavior smooth and without flashing.
- Keep the left profile card sticky on desktop.
- Keep stats refresh manual unless user explicitly asks otherwise; Instagram performance figures are maintained manually.
- Keep `/links` simple, compact, and no-scroll where possible.
- Use `assets/natasha-avatar.jpg` for circular avatar displays.
- Do not commit secrets. GitHub Actions secrets are used for Apify.
- `data/stats.json` is committed intentionally.
