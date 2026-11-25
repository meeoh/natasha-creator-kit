import { readFile, writeFile } from "node:fs/promises";

const siteDataPath = new URL("../data/site.json", import.meta.url);
const mediaKitTemplatePath = new URL("../mediakit/index.template.html", import.meta.url);
const mediaKitOutputPath = new URL("../mediakit/index.html", import.meta.url);
const linksTemplatePath = new URL("../index.template.html", import.meta.url);
const linksOutputPath = new URL("../index.html", import.meta.url);

const compactFormatter = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 1
});

const numberFormatter = new Intl.NumberFormat("en", {
  maximumFractionDigits: 1
});

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function formatCompact(value) {
  const number = Number(value || 0);
  return number > 0 ? compactFormatter.format(number) : "—";
}

function formatPercent(value) {
  const number = Number(value);
  return Number.isFinite(number) ? `${numberFormatter.format(number)}%` : "—";
}

function platformLabel(platform = "") {
  return platform.toLowerCase() === "tiktok" ? "TikTok" : "Instagram";
}

function categoryLabel(category = "") {
  const labels = {
    entertainment: "Personality",
    places: "Places",
    play: "Play",
    products: "Products"
  };

  return labels[category.toLowerCase()] || category;
}

function ageRowsHtml(ageRows = []) {
  return ageRows.map((row) => {
    const label = escapeHtml(row.label);
    const value = formatPercent(row.value);
    const cssValue = escapeHtml(value);

    return `                    <div class="age-row" style="--value: ${cssValue}"><div class="age-meta"><span>${label}</span><strong>${value}</strong></div><div class="age-track"><i></i></div></div>`;
  }).join("\n");
}

function featuredPostsHtml(posts = []) {
  return posts.map((post) => {
    const title = escapeHtml(post.title || post.url || "Featured post");
    const category = escapeHtml((post.category || "").toLowerCase());
    const image = post.image ? `\n                  <img src="../${escapeHtml(post.image)}" alt="${title}" loading="lazy" />` : "";

    return `                <a class="featured-post-card ${image ? "has-image" : ""}" data-category="${category}" href="${escapeHtml(post.url)}" target="_blank" rel="noreferrer">${image}
                  <span class="post-platform">${platformLabel(post.platform)}</span>
                  <span class="post-category">${categoryLabel(post.category)}</span>
                  <span class="post-open">View post ↗</span>
                </a>`;
  }).join("\n");
}

function affiliateLinksHtml(links = []) {
  return links.map((link) => {
    const name = escapeHtml(link.name);
    const label = link.region ? `${name} <em>${escapeHtml(link.region)}</em>` : name;
    const code = link.code ? escapeHtml(link.code) : "";
    const detail = code ? `Code <b>${code}</b>` : "Affiliate link";
    const copyButton = code ? `
            <button class="copy-code" type="button" data-code="${code}" aria-label="Copy ${name} code ${code}">
              <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true"><path d="M7 9.667a2.667 2.667 0 0 1 2.667-2.667h8.666a2.667 2.667 0 0 1 2.667 2.667v8.666a2.667 2.667 0 0 1-2.667 2.667h-8.666a2.667 2.667 0 0 1-2.667-2.667z" /><path d="M4.012 16.737a2 2 0 0 1-1.012-1.737v-10c0-1.1.9-2 2-2h10c.75 0 1.158.385 1.5 1" /></svg>
              <svg class="check" viewBox="0 0 24 24" focusable="false" aria-hidden="true"><path d="M5 12l5 5l10-10" /></svg>
            </button>` : "";

    return `          <div class="code-card">
            <a class="link-button" href="${escapeHtml(link.url)}" target="_blank" rel="noreferrer"${code ? ` data-code="${code}"` : ""}>
              <span class="link-icon brand-icon${link.logoFill ? " fill" : ""}" aria-hidden="true"><img src="${escapeHtml(link.logo)}" alt="" /></span>
              <span>
                <strong>${label}</strong>
                <small>${detail}</small>
              </span>
            </a>${copyButton}
          </div>`;
  }).join("\n");
}

function replacements(data) {
  const instagram = data.stats.instagram;
  const tiktok = data.stats.tiktok;

  return {
    escaped: {
      "profile.name": data.profile.name,
      "profile.bio": data.profile.bio,
      "profile.location": data.profile.location,
      "profile.category": data.profile.category,
      "profile.avatar": data.profile.avatar,
      "profile.email": data.profile.email,
      "profile.instagramUrl": data.profile.instagramUrl,
      "profile.tiktokUrl": data.profile.tiktokUrl,
      "profile.youtubeUrl": data.profile.youtubeUrl,
      "profile.mediaKitUrl": data.profile.mediaKitUrl,
      "profile.linksIntro": data.profile.linksIntro,
      "stats.instagram.username": instagram.username,
      "stats.instagram.followers": formatCompact(instagram.followers),
      "stats.instagram.avgEngagementRate": formatPercent(instagram.avgEngagementRate),
      "stats.instagram.avgViews": formatCompact(instagram.avgViews),
      "stats.instagram.reachRate": formatPercent(instagram.reachRate),
      "stats.tiktok.username": tiktok.username,
      "stats.tiktok.followers": formatCompact(tiktok.followers),
      "stats.tiktok.totalViews": formatCompact(tiktok.totalViews),
      "stats.tiktok.engagementRate": formatPercent(tiktok.engagementRate),
      "stats.tiktok.profileViews": formatCompact(tiktok.profileViews),
      "audience.gender.men": numberFormatter.format(data.audience.gender.men),
      "audience.gender.women": numberFormatter.format(data.audience.gender.women),
      "audience.gender.menPercent": formatPercent(data.audience.gender.men),
      "audience.gender.womenPercent": formatPercent(data.audience.gender.women)
    },
    html: {
      "audience.ageRows": ageRowsHtml(data.audience.age),
      featuredPosts: featuredPostsHtml(data.featuredPosts),
      affiliateLinks: affiliateLinksHtml(data.affiliateLinks)
    }
  };
}

async function renderTemplate(templatePath, outputPath, replacementValues) {
  let html = await readFile(templatePath, "utf8");

  for (const [key, value] of Object.entries(replacementValues.escaped)) {
    html = html.replaceAll(`{{${key}}}`, escapeHtml(value));
  }

  for (const [key, value] of Object.entries(replacementValues.html)) {
    html = html.replaceAll(`{{${key}}}`, value);
  }

  if (/{{[^}]+}}/.test(html)) {
    throw new Error(`Unresolved template placeholders remain in ${templatePath.pathname}`);
  }

  await writeFile(outputPath, html);
}

const data = JSON.parse(await readFile(siteDataPath, "utf8"));
const replacementValues = replacements(data);

await renderTemplate(mediaKitTemplatePath, mediaKitOutputPath, replacementValues);
await renderTemplate(linksTemplatePath, linksOutputPath, replacementValues);
console.log("Generated static pages from data/site.json.");
