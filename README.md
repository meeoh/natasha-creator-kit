# Golf Creator Kit

A sleek static creator/media kit for a golf creator, designed for GitHub Pages.

The source repo does **not** hardcode follower counts. The workflow generates `data/stats.json` during deploy, then GitHub Pages serves that generated file.

## Recommended no-platform-app setup

If you do not want to create Meta/TikTok developer apps, use a username-based third-party fetcher. The best fit for this project is **Apify**:

```txt
GitHub Action once daily
→ Apify Instagram profile actor by username
→ Apify TikTok profile actor by username
→ generate data/stats.json
→ deploy GitHub Pages
```

Why this path:

- no Meta app setup
- no TikTok app setup
- username-based
- can run on a daily schedule
- API key stays private in GitHub Actions
- likely enough on Apify's free credits for one creator once daily, depending on actor pricing

Tradeoff: Apify actors are generally scraper-based, so they are less official than platform APIs and can occasionally break. But for ASAP and username-only setup, this is the most practical path.

## Files

- `data/profile.json` — safe-to-commit profile info and handles, but no stats
- `data/stats.json` — generated at build/deploy time and ignored by git
- `scripts/update-stats.mjs` — pulls stats and writes `data/stats.json`
- `.github/workflows/pages.yml` — daily refresh and GitHub Pages deploy
- `index.html`, `styles.css`, `script.js` — static frontend

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
    "location": "Toronto, Canada",
    "avatar": "assets/avatar.svg",
    "email": "hello@example.com",
    "instagramUrl": "https://instagram.com/handle",
    "tiktokUrl": "https://www.tiktok.com/@handle"
  },
  "platforms": {
    "instagram": { "username": "handle" },
    "tiktok": { "username": "handle" }
  }
}
```

You can also replace `assets/avatar.svg` with a real image, for example `assets/avatar.jpg`, then update `profile.avatar`.

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

Open <http://localhost:8080>.

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

4. Run:

   ```txt
   Actions → Update stats and deploy GitHub Pages → Run workflow
   ```

The workflow also runs once daily.

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
