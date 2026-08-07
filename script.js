const numberFormatter = new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 });
const fullNumberFormatter = new Intl.NumberFormat("en");

const fallbackStats = {
  profile: {
    name: "Golf Creator",
    bio: "Sharing my golf journey from beginner to better through relatable moments, lessons learned along the way, golf fits, and product discoveries.",
    location: "Toronto, Canada",
    avatar: "assets/natasha-avatar.jpg",
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

const fallbackFeaturedPosts = [
  {
    title: "Product feature",
    platform: "instagram",
    category: "products",
    url: "https://www.instagram.com/p/DZ_Z4OWtHVO/?hl=en",
    image: "assets/featured/DZ_Z4OWtHVO.jpg"
  },
  {
    title: "Product feature",
    platform: "instagram",
    category: "products",
    url: "https://www.instagram.com/p/DZPxSoUxpm6/?hl=en",
    image: "assets/featured/DZPxSoUxpm6.jpg"
  },
  {
    title: "Product feature",
    platform: "tiktok",
    category: "products",
    url: "https://www.tiktok.com/@natashagolfing/video/7632421241474862343?_r=1&_t=ZS-97juxsKcEJb",
    image: "assets/featured/7632421241474862343.jpg"
  },
  {
    title: "Product feature",
    platform: "instagram",
    category: "products",
    url: "https://www.instagram.com/reels/DaOOTzGhwm1/",
    image: "assets/featured/DaOOTzGhwm1.jpg"
  },
  {
    title: "Golf play moment",
    platform: "instagram",
    category: "play",
    url: "https://www.instagram.com/p/DYdI7NzHb13/?hl=en",
    image: "assets/featured/DYdI7NzHb13.jpg"
  },
  {
    title: "Golf play moment",
    platform: "instagram",
    category: "play",
    url: "https://www.instagram.com/p/DZBflphMDuF/?hl=en",
    image: "assets/featured/DZBflphMDuF.jpg"
  },
  {
    title: "Golf play moment",
    platform: "instagram",
    category: "play",
    url: "https://www.instagram.com/reels/DZn_d5lhGHX/",
    image: "assets/featured/DZn_d5lhGHX.jpg"
  },
  {
    title: "Golf play moment",
    platform: "tiktok",
    category: "play",
    url: "https://www.tiktok.com/@natashagolfing/photo/7589137311741267207?_r=1&_t=ZS-97jv1xUFB4S&image_index=2",
    image: "assets/featured/7589137311741267207.jpg"
  },
  {
    title: "Golf play moment",
    platform: "tiktok",
    category: "play",
    url: "https://www.tiktok.com/@natashagolfing/video/7635450570861579527?_r=1&_t=ZS-97jv0ZZlEfA",
    image: "assets/featured/7635450570861579527.jpg"
  },
  {
    title: "Personality post",
    platform: "instagram",
    category: "entertainment",
    url: "https://www.instagram.com/p/DZXToHtx6LJ/?hl=en",
    image: "assets/featured/DZXToHtx6LJ.jpg"
  },
  {
    title: "Personality post",
    platform: "instagram",
    category: "entertainment",
    url: "https://www.instagram.com/p/DZyUp7RPHfw/?hl=en",
    image: "assets/featured/DZyUp7RPHfw.jpg"
  },
  {
    title: "Personality post",
    platform: "instagram",
    category: "entertainment",
    url: "https://www.instagram.com/p/DXdIXD6Dc14/?hl=en",
    image: "assets/featured/DXdIXD6Dc14.jpg"
  },
  {
    title: "Places post",
    platform: "instagram",
    category: "places",
    url: "https://www.instagram.com/p/Dbf6AlBxIib/"
  },
  {
    title: "Places post",
    platform: "instagram",
    category: "places",
    url: "https://www.instagram.com/p/DaaYbVPxy8-/"
  },
  {
    title: "Places post",
    platform: "instagram",
    category: "places",
    url: "https://www.instagram.com/p/DZ43mtZxYMU/"
  }
];

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

function postCategoryLabel(category = "") {
  const labels = {
    entertainment: "Personality",
    places: "Places",
    play: "Play",
    products: "Products"
  };

  return labels[category.toLowerCase()] || category;
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
        <span class="post-category">${postCategoryLabel(category)}</span>
        <span class="post-open">View post ↗</span>
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
        card.hidden = !visible;
      });
    });
  });
}

async function loadFeaturedPosts() {
  try {
    const response = await fetch("data/featured-posts.json", { cache: "no-store" });
    if (response.ok) return response.json();
  } catch (_) {
    // Opening index.html directly from disk blocks fetch(), so use the bundled posts.
  }

  return fallbackFeaturedPosts;
}

loadStats().then(render).catch(() => render(fallbackStats));
loadFeaturedPosts()
  .then((posts) => {
    renderFeaturedPosts(posts);
    setupFeaturedFilters();
  })
  .catch(() => renderFeaturedPosts(fallbackFeaturedPosts));
