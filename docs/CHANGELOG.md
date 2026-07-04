# Changelog / Work Completed

## Initial build

- Created static GitHub Pages media kit.
- Added `index.html`, `styles.css`, `script.js`.
- Added `data/profile.json` and `data/stats.json`.
- Added GitHub Actions deployment workflow.
- Added Apify + optional official API updater in `scripts/update-stats.mjs`.
- Added placeholder avatar, later replaced by real optimized cover/profile image.

## Data integration

- Researched official Instagram/TikTok APIs vs third-party options.
- Chose Apify for username-based scraping to avoid Meta/TikTok app setup.
- Configured support for:
  - `apify/instagram-scraper`
  - `clockworks/tiktok-scraper`
- Confirmed actor input shapes:
  - Instagram profile details: `resultsType: details`, `directUrls`, `addProfileStatistics`
  - Instagram content: `resultsType: posts`, `directUrls`, `resultsLimit`
  - TikTok profile/videos: `profiles`, `resultsPerPage`, `profileScrapeSections: ["videos"]`
- Added manual-only GitHub Action refresh.
- Changed workflow so normal pushes deploy without refreshing stats.
- Changed workflow so manual run refreshes stats and commits `data/stats.json`.

## Stats

- Initial stats: followers/posts/likes/videos.
- Added performance metrics from public content.
- Switched from proposed latest-12 sample to all-time public content with safety cap.
- Defaults:
  - `CONTENT_SAMPLE_SIZE=all`
  - `MAX_CONTENT_ITEMS=250`
- Added platform-specific performance stats:
  - Instagram avg engagement/views/likes
  - TikTok avg engagement/views/likes
- Added combined performance stats in `data/stats.json`.

## UI iterations

- Started as custom golf landing page.
- Pivoted toward CreatorsJet-inspired one-page media kit.
- Removed heavy green tones.
- Switched to warm cream/white/blush design.
- Removed top nav/header entirely.
- Made left profile card sticky on desktop.
- Made page scroll normally while left card remains visible.
- Reduced `Natasha Golfing` heading size.
- Removed top updated-date pill.
- Changed location from `Toronto, Canada` to `Canada`.
- Replaced profile category tags with `Contact to collaborate` button.
- Removed post/video counts from stat cards.
- Added platform-specific Instagram/TikTok sections.
- Added featured posts gallery with filter pills.
- Added real thumbnail previews for featured posts.
- Removed text overlays like `Product feature` from thumbnails.
- Removed filter flash animation.

## Featured posts

- Added `data/featured-posts.json`.
- Added filters:
  - All
  - Products
  - Play
  - Entertainment
- Removed Community filter per user request.
- Added local thumbnails in `assets/featured/`.

## Current known design direction

- Left sticky creator profile card.
- Right side contains stats + featured posts.
- Featured posts should be visual and polished.
- Avoid dead space and generic filler.
- Use CreatorsJet as visual reference but improve/customize.
