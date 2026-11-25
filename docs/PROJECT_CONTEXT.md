# Natasha Creator Kit — Project Context

## Purpose

A static GitHub Pages links page and media kit for Natasha Golfing:

```txt
https://natashagolfing.com/           links page
https://natashagolfing.com/mediakit/  media kit
https://natashagolfing.com/links      redirects to /
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
- codes and affiliate links on the links page

When changing bio, stats, audience, or featured posts, edit `data/site.json` only, then run:

```bash
node scripts/build-site.mjs
```

The GitHub Pages workflow also runs that build command before deploy, so pushing a `data/site.json` change is enough to update the live site.

## No automatic social stats updates

Instagram and TikTok stats are manual only. Do not add automatic social refresh jobs or client-side JSON fetches for visible stats/profile content.

There should be no flash of stale placeholder content. The visible content should be present in the generated static `index.html` and `mediakit/index.html`.

## Main files

```txt
data/site.json             One editable source of truth for media-kit content/stats
scripts/build-site.mjs      Generates both pages from data/site.json
index.template.html         Links-page HTML template
index.html                  Generated Linktree-style links page (site root)
styles.css                  Links page styling
mediakit/index.template.html Media-kit HTML template
mediakit/index.html         Generated static media-kit page
mediakit/styles.css         Media-kit styling
mediakit/script.js          Small interaction-only JS for filters/carousel sizing
links/index.html            Hand-written redirect from /links to /
CNAME                       Custom domain for GitHub Pages
.github/workflows/pages.yml GitHub Pages deploy + static generation
assets/natasha-avatar.jpg   Cropped square avatar used by both pages
assets/brands/*             Local partner carousel logos and *-icon.png brand marks for link cards
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
http://localhost:8080/mediakit/
```

## Design notes

- Green/white design on both pages (`--green: #2f7a4a`), Helvetica font stack, no web fonts.
- No top nav/header.
- Left profile card is sticky on desktop.
- CTA label: `Contact for collabs`.
- The links page at `/` is generated from `index.template.html`; its only JS is a small inline copy-code handler, and email is a plain `mailto:`.
- Partner carousel logos are duplicated in `mediakit/index.template.html` for seamless scrolling.
- Featured post filtering is static HTML plus interaction-only JS.

## Future maintenance rules

- Edit `data/site.json` for content/stats changes.
- Edit `index.template.html` / `mediakit/index.template.html` for layout/markup changes, then regenerate.
- Edit `styles.css` for links-page styles, `mediakit/styles.css` for media-kit styles.
- Keep social stats manual unless explicitly asked to build a different workflow.
- Do not commit secrets.
