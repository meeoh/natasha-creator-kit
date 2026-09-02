# Changelog / Work Completed

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
