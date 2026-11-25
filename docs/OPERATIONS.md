# Operations

## Deploying

Pushes to `main` deploy the site to GitHub Pages.

```bash
git push origin main
```

The deploy workflow only generates static HTML from committed data and deploys it.

## Updating site content and stats

All media-kit content and stats are manual and live in:

```txt
data/site.json
```

To update them:

1. Edit `data/site.json`.
2. Commit the change.
3. Push to `main`.

GitHub Actions runs:

```bash
node scripts/build-site.mjs
```

That generates `index.html` (links page) and `mediakit/index.html` before upload. Social stats are never refreshed automatically.

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

## Custom domain

The repo has a root `CNAME` file:

```txt
natashagolfing.com
```

GitHub Pages should serve:

```txt
https://natashagolfing.com/           links page
https://natashagolfing.com/mediakit/  media kit
https://natashagolfing.com/links      redirects to /
```

DNS setup should include GitHub Pages apex A records and a `www` CNAME to `meeoh.github.io`. Enable `Enforce HTTPS` in GitHub Pages after DNS verification.

## Links page (`/`)

Files:

```txt
index.template.html
index.html
styles.css
links/index.html   redirect from /links to /, not generated
```

Layout, top to bottom:

```txt
Avatar, name, intro
Icon row: Instagram, TikTok, YouTube, Email (no text, aria-labels only)
Media kit card → /mediakit/
"Codes and affiliate links" section
```

The codes and affiliate links come from `affiliateLinks` in `data/site.json`: `name`, optional `region`, `url`, optional `code`, `logo` (a square brand mark in `assets/brands/*-icon.png`) and optional `logoFill` for logos that are already a full app icon. A card with a code shows it and gets a copy button; tapping the card itself also copies the code before opening the store.

The Email icon is a plain `mailto:` link. If clicking it appears to do nothing, the visitor probably does not have a default mail app/handler configured.

Design rules:

- Green theme (`--green: #2f7a4a`), Helvetica font stack, no web fonts.
- Use `assets/natasha-avatar.jpg`.
- Use subtle green/white icon tiles with black/outline glyphs, not bright gradients.
- All glyph icons are inline outline SVGs from one style (Tabler-style: 24px grid, round caps/joins, shared stroke width in CSS). Don't mix in emoji/unicode glyphs or icons from other sets. Brand cards use the company's real logo.
- Bump the query string in `index.template.html` when changing `styles.css`, then regenerate.

## Updating partner logos

Partner logos live in `assets/brands/` and are referenced twice in `mediakit/index.template.html` because the carousel repeats one logo set for seamless scrolling.

When replacing a partner logo:

1. Add the optimized local asset under `assets/brands/`.
2. Update both repeated carousel logo sets in `mediakit/index.template.html`.
3. Add or adjust a logo-specific CSS class in `mediakit/styles.css` for alignment/sizing.
4. Run `node scripts/build-site.mjs`.
5. Preview locally and verify the logo is visually aligned in the carousel before pushing.

## Adding featured posts

Featured posts live in the `featuredPosts` array in `data/site.json`:

```json
{
  "title": "Optional internal title",
  "platform": "instagram",
  "category": "products",
  "url": "https://www.instagram.com/p/SHORTCODE/?hl=en",
  "image": "assets/featured/SHORTCODE.jpg"
}
```

Then add/download the thumbnail locally. For Instagram posts/reels, this often works with `/p/SHORTCODE/` even when the public URL is `/reels/SHORTCODE/`:

```bash
curl -L "https://www.instagram.com/p/SHORTCODE/media/?size=l" -o assets/featured/SHORTCODE.jpg
```

Optimize image:

```bash
sips -Z 900 --setProperty format jpeg --setProperty formatOptions 82 assets/featured/SHORTCODE.jpg --out assets/featured/SHORTCODE.jpg
```

For TikTok thumbnails, use the post thumbnail URL from TikTok/oEmbed or another manual source, download it locally, then optimize with `sips`.

## Avoid committing secrets

Never commit access tokens, refresh tokens, or client secrets.
