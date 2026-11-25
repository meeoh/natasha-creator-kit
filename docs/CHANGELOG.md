# Changelog / Work Completed

## Links page becomes the homepage

- The links page now lives at `/`, the media kit at `/mediakit/`; `/links` redirects to `/`.
- Instagram, TikTok, YouTube (@natashagolfing) and Email are a row of text-free icons under the intro.
- First card is the media kit, followed by a "Codes and affiliate links" section (ShopMy, Awesome Golf, Vistaget Canada, Vistaget US, Rapsodo, PUR3 Gloves, Hazard Hunters) driven by `affiliateLinks` in `data/site.json`, with brand logos and copy-to-clipboard codes. ShopMy and Rapsodo are plain links with no code to copy; ShopMy's logo is its official app icon (`assets/brands/shopmy-icon.png`). PUR3 Gloves (code NATASHA) uses the PUR3 Golf wordmark fitted to a square (`assets/brands/pur3-icon.png`).
- The page background now covers the full scrolled height (it used to repeat with a hard band below the first screen), and the card has room below it at the bottom.
- Theme colour changed to green and font to Helvetica; the Google Fonts load was dropped.

## Partner carousel update

- Added Golf Town, Awesome Golf, and Rapsodo logos to the partner carousel (`assets/brands/golf-town.png`, `awesome-golf.svg`, `rapsodo.svg`).
- Removed GrooveIt from the partner carousel.
- Awesome Golf SVG is the official logo recolored from white to `#191817` for the light background.

## Static one-source content update

- Added `data/site.json` as the single editable source of truth for media-kit profile copy, stats, audience values, and featured posts.
- Added `index.template.html` and `scripts/build-site.mjs` to generate static `index.html` from `data/site.json`.
- Updated GitHub Pages deploy to generate static HTML before upload.
- Removed the legacy automatic social stats files and split profile/stats/featured JSON files.
- Removed client-side profile/stats/post data fetching so the page renders committed content immediately without a placeholder flash.
- Updated Natasha’s bio copy.

## Current site features

- Static GitHub Pages media kit at `natashagolfing.com`.
- Linktree-style `/links` page.
- Warm cream/white/blush media-kit design.
- Sticky desktop profile card.
- Instagram and TikTok stats sections.
- Manual audience charts for gender and age.
- Partner logo carousel.
- Featured posts gallery with filter pills.
