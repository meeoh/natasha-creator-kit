# Golf Creator Kit

A sleek static creator/media kit for Natasha Golfing, designed for GitHub Pages and served at:

```txt
https://natashagolfing.com/
https://natashagolfing.com/links
```

`data/stats.json` is intentionally committed so the current public stats are visible in GitHub. The workflow updates it during scheduled/manual refreshes, then GitHub Pages serves the committed file.

## Recommended no-platform-app setup

If you do not want to create Meta/TikTok developer apps, use a username-based third-party fetcher. The best fit for this project is **Apify**:

```txt
GitHub Action every two weeks by default, plus manual runs on demand
→ Apify Instagram profile actor by username
→ Apify TikTok profile actor by username
→ update data/stats.json
→ deploy GitHub Pages
```

Why this path:

- no Meta app setup
- no TikTok app setup
- username-based
- can run on a schedule, currently every two weeks by default
- API key stays private in GitHub Actions
- likely enough on Apify's free credits for one creator on a biweekly cadence, depending on actor pricing

Tradeoff: Apify actors are generally scraper-based, so they are less official than platform APIs and can occasionally break. But for ASAP and username-only setup, this is the most practical path.

## Files

- `index.html`, `styles.css`, `script.js` — media kit frontend
- `links/index.html`, `links/styles.css` — Linktree-style links page
- `CNAME` — custom domain for `natashagolfing.com`
- `data/profile.json` — safe-to-commit profile info and handles
- `data/stats.json` — committed/generated stats used by the site
- `data/featured-posts.json` — featured post metadata
- `scripts/update-stats.mjs` — pulls stats and writes `data/stats.json`
- `.github/workflows/pages.yml` — biweekly/manual refresh and GitHub Pages deploy

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

## Apify setup

1. Create an Apify account:
   ```txt
   https://apify.com
   ```

2. Find an Instagram profile scraper actor and a TikTok profile scraper actor.

3. Create an Apify API token.

4. In GitHub, add repository secrets:

   ```txt
   Settings → Secrets and variables → Actions → New repository secret
   ```

   Required:

   | Secret | Example | Notes |
   | --- | --- | --- |
   | `APIFY_TOKEN` | `apify_api_...` | Your Apify API token |
   | `APIFY_INSTAGRAM_ACTOR_ID` | `apify/instagram-profile-scraper` | Exact actor ID from Apify |
   | `APIFY_TIKTOK_ACTOR_ID` | `clockworks/tiktok-scraper` | Exact actor ID from Apify |

5. Optional but useful: add GitHub repository variables:

   ```txt
   Settings → Secrets and variables → Actions → Variables
   ```

   | Variable | Example |
   | --- | --- |
   | `INSTAGRAM_USERNAME` | `herhandle` |
   | `TIKTOK_USERNAME` | `herhandle` |

   If you do not add these variables, the script uses the usernames from `data/profile.json`.

6. If your chosen Apify actor expects a different input shape, add these optional secrets:

   | Secret | Example |
   | --- | --- |
   | `APIFY_INSTAGRAM_INPUT_JSON` | `{ "resultsType": "details", "directUrls": ["https://www.instagram.com/herhandle/"], "resultsLimit": 1, "addProfileStatistics": true }` |
   | `APIFY_TIKTOK_INPUT_JSON` | `{ "profiles": ["herhandle"], "resultsPerPage": 1, "profileScrapeSections": ["videos"], "profileSorting": "latest" }` |

The updater tries to normalize common actor output fields like `followersCount`, `followerCount`, `likesCount`, `videoCount`, etc.

By default, performance metrics use all available public content up to `MAX_CONTENT_ITEMS` per platform. Defaults:

```txt
CONTENT_SAMPLE_SIZE=all
MAX_CONTENT_ITEMS=250
```

This is used to calculate average engagement rate, average views, and average likes. You can set `CONTENT_SAMPLE_SIZE` to a number like `12` if you want recent-content metrics instead.

## Local test with Apify

From this folder:

```bash
APIFY_TOKEN="..." \
APIFY_INSTAGRAM_ACTOR_ID="actor/id" \
APIFY_TIKTOK_ACTOR_ID="actor/id" \
INSTAGRAM_USERNAME="natashagolfing" \
TIKTOK_USERNAME="natashagolfing" \
node scripts/update-stats.mjs
```

Then preview:

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

5. Run:

   ```txt
   Actions → Update stats and deploy GitHub Pages → Run workflow
   ```

The workflow also runs every two weeks by default, starting 2026-07-18 at 14:00 UTC. Technically it is scheduled weekly on Saturdays and gates the stats refresh by date because GitHub Actions does not support a true biweekly cron expression.

## Official API fallback

The updater still supports official APIs if you later want more reliability:

Instagram secrets:

```txt
IG_GRAPH_ACCESS_TOKEN
IG_USER_ID
```

TikTok secrets:

```txt
TIKTOK_REFRESH_TOKEN
TIKTOK_CLIENT_KEY
TIKTOK_CLIENT_SECRET
```

But for the current goal — no platform apps and no hardcoded stats — Apify is the best next step.
