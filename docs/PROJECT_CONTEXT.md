# Natasha Creator Kit — Project Context

## Purpose

A static GitHub Pages media kit for Natasha Golfing:

```txt
https://natashagolfing.com/
https://natashagolfing.com/links
```

The site is intentionally simple: committed data generates static HTML, and deployed pages do not fetch profile/stats data in the browser.

## Source of truth

All editable media-kit content lives in one file:

```txt
data/site.json
```

This includes:

- profile name, bio, location, avatar, email, social URLs
- Instagram and TikTok display stats
- audience gender/age values
- featured post metadata

When changing bio, stats, audience, or featured posts, edit `data/site.json` only, then run:

```bash
node scripts/build-site.mjs
```

The GitHub Pages workflow also runs that build command before deploy, so pushing a `data/site.json` change is enough to update the live site.

## No automatic social stats updates

Instagram and TikTok stats are manual only. Do not add automatic social refresh jobs or client-side JSON fetches for visible stats/profile content.

There should be no flash of stale placeholder content. The visible media-kit content should be present in the generated static `index.html`.

## Main files

```txt
data/site.json             One editable source of truth for media-kit content/stats
index.template.html         HTML template used by the generator
scripts/build-site.mjs      Generates index.html from data/site.json
index.html                  Generated static media-kit page
styles.css                  Media-kit styling
script.js                   Small interaction-only JS for filters/carousel sizing
links/index.template.html   Links-page HTML template
links/index.html            Generated Linktree-style links page
links/styles.css            Links page styling
CNAME                       Custom domain for GitHub Pages
.github/workflows/pages.yml GitHub Pages deploy + static generation
assets/natasha-avatar.jpg   Cropped square avatar used by media kit and /links
assets/brands/*             Local partner carousel logos
assets/featured/*.jpg       Optimized featured post thumbnails
```

## Current profile copy

```txt
I’m Natasha, a golf content creator documenting the journey from beginner to better — the good shots, the bad shots, the lessons, and everything in between.

I partner with brands to create content for paid media, organic social, and everything in between. If you’re looking for content that feels natural to the golf community, let’s work together!
```

## Deployment model

GitHub Pages deploys via:

```txt
.github/workflows/pages.yml
```

Workflow behavior:

1. Check out the repo.
2. Configure Pages.
3. Run `node scripts/build-site.mjs`.
4. Upload the static site artifact.
5. Deploy to GitHub Pages.

## Local preview

```bash
node scripts/build-site.mjs
python3 -m http.server 8080
```

Open:

```txt
http://localhost:8080
http://localhost:8080/links/
```

## Design notes

- Warm cream/white/blush media-kit design.
- No top nav/header.
- Left profile card is sticky on desktop.
- CTA label: `Contact for collabs`.
- The `/links` page is generated from `links/index.template.html`, intentionally has no JS, and uses plain `mailto:` for collabs.
- Partner carousel logos are duplicated in `index.template.html` for seamless scrolling.
- Featured post filtering is static HTML plus interaction-only JS.

## Future maintenance rules

- Edit `data/site.json` for content/stats changes.
- Edit `index.template.html` for layout/markup changes, then regenerate `index.html`.
- Edit `styles.css` for media-kit styles.
- Keep social stats manual unless explicitly asked to build a different workflow.
- Do not commit secrets.
