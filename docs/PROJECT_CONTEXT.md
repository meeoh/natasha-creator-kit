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
- manually maintained social stats in `data/stats.json`
- deploy-only GitHub Actions workflow; no automatic Instagram/TikTok refreshes
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
- Partners carousel
- Featured posts gallery with filters

Previous iterations had combined metric cards and a contact section in the right panel; those were removed/reworked.

### Partners carousel

Current partner logos, in order:

- GolfNorth (`assets/brands/golfnorth.png`)
- GrooveIt (`assets/brands/grooveit.png`)
- PUR3 Golf (`assets/brands/pur3-golf.png`, linked to `https://pur3golf.com/`)
- Trust Golf Ball (`assets/brands/trust-golf.svg`)
- Transcend Golf Simulators (`assets/brands/transcend-golf.png`)
- SeeMore Putter Company (`assets/brands/seemore.png`)

WhyGolf was removed from the carousel and replaced with PUR3 Golf. The PUR3 logo is a local dark transparent PNG derived from the PUR3 site logo and sized with `.brand-logo-tile-pur3`.

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
data/stats.json             Manually maintained social stats
data/featured-posts.json    Featured post data
scripts/update-stats.mjs    Legacy/manual Apify + optional official API updater; not used by deploy workflow
.github/workflows/pages.yml GitHub Pages deploy only
assets/natasha-cover.jpg    Original optimized cover/profile photo
assets/natasha-avatar.jpg   Cropped square avatar used by media kit and /links
assets/brands/*             Local partner carousel logos
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
- On manual `workflow_dispatch`: deploy only, do not refresh stats.

Instagram and TikTok stats should only change when `data/stats.json` is edited and committed manually.

## Stats update behavior

Stats are manual only. To change Instagram or TikTok stats, edit `data/stats.json`, commit, and deploy.

The GitHub Actions workflow deploys the committed static site only. It does not run `scripts/update-stats.mjs`, Apify, or official Instagram/TikTok APIs.

## Apify setup

Apify is no longer used by the GitHub Actions deploy workflow. No Apify secrets or vars are required for deployment.

`scripts/update-stats.mjs` remains in the repo as a legacy/manual utility if the user explicitly asks to run a scraper-based update later, but the current requirement is that Instagram and TikTok stats are updated by manually editing `data/stats.json`.

Current handle for both:

```txt
natashagolfing
```

## Social stats

Current stats file tracks:

- profile info
- manually maintained Instagram followers/posts/following
- manually maintained TikTok followers/likes/videos/following
- manually maintained Instagram performance (avg engagement, avg views, reach rate)
- manually maintained TikTok performance (total views, engagement rate, profile views)

`data/stats.json` is intentionally committed now because the user wanted to see the stats file in GitHub.

## Performance stats calculations

Instagram stats are manually maintained in `data/stats.json` and shown in the Instagram section:

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

TikTok stats are also manually maintained in `data/stats.json` and shown in the TikTok section:

```json
"performance": {
  "totalViews": 2200000,
  "engagementRate": 3.5,
  "profileViews": 39900,
  "source": "manual"
}
```

Current displayed example:

```txt
Instagram avg engagement: 4.9%
Instagram avg views: 22.2K
Instagram reach rate: 73%

TikTok followers: 2.3K
TikTok total views: 2.2M
TikTok engagement rate: 3.5%
TikTok profile views: 39.9K
```

## Estimated Apify costs

The deploy workflow no longer runs Apify or official social APIs, so normal deploys have no social-scraping cost. If the legacy updater is run manually later, costs depend on the selected actors and sample size.

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
- Keep all social stats manual unless user explicitly asks otherwise; the deploy workflow must not refresh Instagram or TikTok automatically.
- Keep `/links` simple, compact, and no-scroll where possible.
- Use `assets/natasha-avatar.jpg` for circular avatar displays.
- Do not commit secrets. The current deploy workflow does not need social API/Apify secrets.
- `data/stats.json` is committed intentionally.
