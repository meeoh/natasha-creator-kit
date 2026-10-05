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

That generates `index.html` before upload. Social stats are never refreshed automatically.

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

## Custom domain

The repo has a root `CNAME` file:

```txt
natashagolfing.com
```

GitHub Pages should serve:

```txt
https://natashagolfing.com/
https://natashagolfing.com/links
```

DNS setup should include GitHub Pages apex A records and a `www` CNAME to `meeoh.github.io`. Enable `Enforce HTTPS` in GitHub Pages after DNS verification.

## `/links` page

Files:

```txt
links/index.template.html
links/index.html
links/styles.css
```

Current links, in order:

```txt
Instagram
TikTok
Media kit
Collabs
Rapsodo (affiliate link)
```

The Collabs link is a plain `mailto:` link. It uses default browser/device behavior. If clicking it appears to do nothing, the visitor probably does not have a default mail app/handler configured.

Design rules:

- Match the media kit design.
- Keep it compact and fitting in the viewport without scroll where possible.
- Use `assets/natasha-avatar.jpg`.
- Use subtle pink/white icon cards with black/outline glyphs, not bright gradients.
- All link icons are inline outline SVGs from one style (Tabler-style: 24px grid, round caps/joins, shared stroke width in CSS). Don't mix in emoji/unicode glyphs or icons from other sets.
- Bump the query string in `links/index.template.html` when changing `links/styles.css`, then regenerate.

## Updating partner logos

Partner logos live in `assets/brands/` and are referenced twice in `index.template.html` because the carousel repeats one logo set for seamless scrolling.

When replacing a partner logo:

1. Add the optimized local asset under `assets/brands/`.
2. Update both repeated carousel logo sets in `index.template.html`.
3. Add or adjust a logo-specific CSS class in `styles.css` for alignment/sizing.
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
