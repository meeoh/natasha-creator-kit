const numberFormatter = new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 });
const fullNumberFormatter = new Intl.NumberFormat("en");

const fallbackStats = {
  profile: {
    name: "Golf Creator",
    bio: "Short-form golf tips, course-day outfits, practice routines, and relatable on-course moments for an audience that loves style, improvement, and the joy of golf.",
    location: "Toronto, Canada",
    avatar: "assets/avatar.svg",
    email: "natashagolfing@gmail.com",
    instagramUrl: "https://instagram.com/",
    tiktokUrl: "https://tiktok.com/"
  },
  platforms: {
    instagram: { username: "handle", followers: 0, posts: 0 },
    tiktok: { username: "handle", followers: 0, likes: 0, videos: 0 }
  },
  performance: {
    avgEngagementRate: null,
    avgViews: null,
    avgLikes: null,
    sampleSize: 0
  },
  updatedAt: null
};

function formatCompact(value) {
  const number = Number(value || 0);
  return number > 0 ? numberFormatter.format(number) : "—";
}

function formatFull(value) {
  const number = Number(value || 0);
  return number > 0 ? fullNumberFormatter.format(number) : "—";
}

function formatPercent(value) {
  const number = Number(value);
  return Number.isFinite(number) ? `${number.toFixed(number >= 10 ? 1 : 2)}%` : "—";
}

function setText(selector, value) {
  document.querySelectorAll(selector).forEach((node) => { node.textContent = value; });
}

function setAttr(selector, attr, value) {
  if (!value) return;
  document.querySelectorAll(selector).forEach((node) => { node.setAttribute(attr, value); });
}

function normalizeStats(stats) {
  return {
    ...fallbackStats,
    ...stats,
    profile: { ...fallbackStats.profile, ...(stats.profile || {}) },
    platforms: {
      instagram: { ...fallbackStats.platforms.instagram, ...(stats.platforms?.instagram || {}) },
      tiktok: { ...fallbackStats.platforms.tiktok, ...(stats.platforms?.tiktok || {}) }
    },
    performance: { ...fallbackStats.performance, ...(stats.performance || {}) }
  };
}

function render(stats) {
  const data = normalizeStats(stats);
  const { profile } = data;
  const instagram = data.platforms.instagram;
  const tiktok = data.platforms.tiktok;
  const combinedFollowers = Number(instagram.followers || 0) + Number(tiktok.followers || 0);
  const updated = data.updatedAt ? new Date(data.updatedAt) : null;

  setText('[data-profile="name"]', profile.name);
  setText('[data-profile="bio"]', profile.bio);
  setText('[data-profile="location"]', profile.location);
  setAttr('[data-profile="avatar"]', "src", profile.avatar);
  setAttr('[data-profile="instagramUrl"]', "href", profile.instagramUrl);
  setAttr('[data-profile="tiktokUrl"]', "href", profile.tiktokUrl);
  setAttr('[data-profile="emailLink"]', "href", `mailto:${profile.email}`);

  setText('[data-stat="instagramFollowers"]', formatCompact(instagram.followers));
  setText('[data-stat="instagramPosts"]', formatFull(instagram.posts));
  setText('[data-stat="instagramUsername"]', instagram.username || "handle");
  setText('[data-stat="instagramAvgEngagementRate"]', formatPercent(instagram.performance?.avgEngagementRate));
  setText('[data-stat="instagramAvgViews"]', formatCompact(instagram.performance?.avgViews));
  setText('[data-stat="instagramAvgLikes"]', formatCompact(instagram.performance?.avgLikes));
  setText('[data-stat="tiktokFollowers"]', formatCompact(tiktok.followers));
  setText('[data-stat="tiktokLikes"]', formatCompact(tiktok.likes));
  setText('[data-stat="tiktokVideos"]', formatFull(tiktok.videos));
  setText('[data-stat="tiktokAvgEngagementRate"]', formatPercent(tiktok.performance?.avgEngagementRate));
  setText('[data-stat="tiktokAvgViews"]', formatCompact(tiktok.performance?.avgViews));
  setText('[data-stat="tiktokAvgLikes"]', formatCompact(tiktok.performance?.avgLikes));
  setText('[data-stat="combinedFollowers"]', formatCompact(combinedFollowers));
  setText('[data-stat="avgEngagementRate"]', formatPercent(data.performance.avgEngagementRate));
  setText('[data-stat="avgViews"]', formatCompact(data.performance.avgViews));
  setText('[data-stat="avgLikes"]', formatCompact(data.performance.avgLikes));
  setText('[data-stat="performanceSampleSize"]', formatFull(data.performance.sampleSize));
  setText('[data-stat="updatedAt"]', updated ? updated.toLocaleDateString(undefined, { month: "short", day: "numeric" }) : "daily");

  document.title = `${profile.name} · Golf Creator Kit`;
}

async function loadStats() {
  const statsResponse = await fetch("data/stats.json", { cache: "no-store" });
  if (statsResponse.ok) return statsResponse.json();

  const profileResponse = await fetch("data/profile.json", { cache: "no-store" });
  if (profileResponse.ok) return profileResponse.json();

  return fallbackStats;
}

function postPlatformLabel(platform = "") {
  return platform.toLowerCase() === "tiktok" ? "TikTok" : "Instagram";
}

function renderFeaturedPosts(posts = []) {
  const grid = document.querySelector("[data-featured-posts]");
  if (!grid) return;

  if (!posts.length) {
    grid.innerHTML = '<p class="featured-empty">Featured posts will appear here once links are added.</p>';
    return;
  }

  grid.innerHTML = posts.map((post) => {
    const category = (post.category || "").toLowerCase();
    const title = post.title || post.url || "Featured post";
    const image = post.image ? `<img src="${post.image}" alt="${title}" loading="lazy" />` : "";
    return `
      <a class="featured-post-card ${image ? "has-image" : ""}" data-category="${category}" href="${post.url}" target="_blank" rel="noreferrer">
        ${image}
        <span class="post-platform">${postPlatformLabel(post.platform)}</span>
        <span class="post-category">${category}</span>
        <div class="post-overlay">
          <p class="post-title">${title}</p>
          <span>View post ↗</span>
        </div>
      </a>
    `;
  }).join("");
}

function setupFeaturedFilters() {
  const buttons = document.querySelectorAll("[data-filter]");
  const cards = document.querySelectorAll(".featured-post-card");
  if (!buttons.length || !cards.length) return;

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;
      buttons.forEach((node) => node.classList.toggle("active", node === button));

      cards.forEach((card) => {
        const visible = filter === "all" || card.dataset.category === filter;

        if (visible) {
          card.hidden = false;
          requestAnimationFrame(() => card.classList.remove("is-hidden"));
        } else {
          card.classList.add("is-hidden");
          window.setTimeout(() => { card.hidden = true; }, 220);
        }
      });
    });
  });
}

async function loadFeaturedPosts() {
  const response = await fetch("data/featured-posts.json", { cache: "no-store" });
  if (!response.ok) return [];
  return response.json();
}

loadStats().then(render).catch(() => render(fallbackStats));
loadFeaturedPosts()
  .then((posts) => {
    renderFeaturedPosts(posts);
    setupFeaturedFilters();
  })
  .catch(() => renderFeaturedPosts([]));
