const numberFormatter = new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 });
const fullNumberFormatter = new Intl.NumberFormat("en");

const fallbackStats = {
  profile: {
    name: "Golf Creator",
    bio: "Short-form golf tips, course-day outfits, practice routines, and relatable on-course moments for an audience that loves style, improvement, and the joy of golf.",
    location: "Toronto, Canada",
    avatar: "assets/avatar.svg",
    email: "hello@example.com",
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
  setText('[data-stat="tiktokFollowers"]', formatCompact(tiktok.followers));
  setText('[data-stat="tiktokLikes"]', formatCompact(tiktok.likes));
  setText('[data-stat="tiktokVideos"]', formatFull(tiktok.videos));
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

loadStats().then(render).catch(() => render(fallbackStats));
