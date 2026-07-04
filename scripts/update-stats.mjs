import { readFile, writeFile } from "node:fs/promises";

const statsPath = new URL("../data/stats.json", import.meta.url);
const profilePath = new URL("../data/profile.json", import.meta.url);

const emptyStats = {
  profile: {
    name: "Golf Creator",
    bio: "Short-form golf tips, course-day outfits, practice routines, and relatable on-course moments for an audience that loves style, improvement, and the joy of golf.",
    location: "Toronto, Canada",
    avatar: "assets/avatar.svg",
    email: "hello@example.com",
    instagramUrl: "https://instagram.com/",
    tiktokUrl: "https://www.tiktok.com/"
  },
  platforms: {
    instagram: { username: "", followers: null, posts: null },
    tiktok: { username: "", followers: null, likes: null, videos: null }
  },
  performance: {
    avgEngagementRate: null,
    avgViews: null,
    avgLikes: null,
    sampleSize: 0
  },
  updatedAt: null
};

function env(name) {
  return process.env[name]?.trim();
}

async function readJsonIfExists(url) {
  try {
    return JSON.parse(await readFile(url, "utf8"));
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw error;
  }
}

async function readBaseStats() {
  const generated = await readJsonIfExists(statsPath);
  const profileConfig = await readJsonIfExists(profilePath);

  return {
    ...emptyStats,
    ...(generated || {}),
    profile: {
      ...emptyStats.profile,
      ...(generated?.profile || {}),
      ...(profileConfig?.profile || {})
    },
    platforms: {
      instagram: {
        ...emptyStats.platforms.instagram,
        ...(profileConfig?.platforms?.instagram || {}),
        ...(generated?.platforms?.instagram || {})
      },
      tiktok: {
        ...emptyStats.platforms.tiktok,
        ...(profileConfig?.platforms?.tiktok || {}),
        ...(generated?.platforms?.tiktok || {})
      }
    }
  };
}

function asNumber(value, fallback = null) {
  if (value === null || value === undefined || value === "") return fallback;
  const cleaned = typeof value === "string" ? value.replace(/,/g, "") : value;
  const number = Number(cleaned);
  return Number.isFinite(number) ? number : fallback;
}

function getPath(object, path) {
  if (object && Object.hasOwn(object, path)) return object[path];
  return path.split(".").reduce((value, key) => value?.[key], object);
}

function firstValue(object, paths) {
  for (const path of paths) {
    const value = getPath(object, path);
    if (value !== undefined && value !== null && value !== "") return value;
  }
  return undefined;
}

function maxContentItems() {
  return asNumber(env("MAX_CONTENT_ITEMS"), 250);
}

function contentSampleLimit(totalAvailable = null) {
  const requested = (env("CONTENT_SAMPLE_SIZE") || "all").toLowerCase();
  const max = maxContentItems();

  if (requested === "all") {
    return Math.max(1, Math.min(asNumber(totalAvailable, max), max));
  }

  return Math.max(1, Math.min(asNumber(requested, 12), max));
}

function normalizeContentItem(item, platform) {
  const likes = asNumber(firstValue(item, platform === "instagram"
    ? ["likesCount", "likeCount", "likes", "edge_liked_by.count", "statistics.likes"]
    : ["diggCount", "likeCount", "likes", "stats.diggCount"]));
  const comments = asNumber(firstValue(item, platform === "instagram"
    ? ["commentsCount", "commentCount", "comments", "edge_media_to_comment.count", "statistics.comments"]
    : ["commentCount", "comments", "stats.commentCount"]));
  const shares = asNumber(firstValue(item, ["shareCount", "shares", "stats.shareCount"]));
  const saves = asNumber(firstValue(item, ["collectCount", "saveCount", "saves", "stats.collectCount"]));
  const views = asNumber(firstValue(item, platform === "instagram"
    ? ["videoViewCount", "videoPlayCount", "videoViews", "viewsCount", "views", "playCount"]
    : ["playCount", "viewCount", "views", "stats.playCount"]));

  return { likes, comments, shares, saves, views };
}

function summarizeContent(items, followers, platform) {
  const normalized = items.map((item) => normalizeContentItem(item, platform));
  const likeSamples = normalized.filter((item) => item.likes !== null);
  const viewSamples = normalized.filter((item) => item.views !== null && item.views > 0);
  const engagementSamples = normalized.filter((item) => [item.likes, item.comments, item.shares, item.saves].some((value) => value !== null));

  const totalLikes = likeSamples.reduce((sum, item) => sum + item.likes, 0);
  const totalViews = viewSamples.reduce((sum, item) => sum + item.views, 0);
  const totalEngagement = engagementSamples.reduce((sum, item) => sum + (item.likes || 0) + (item.comments || 0) + (item.shares || 0) + (item.saves || 0), 0);
  const engagementDenominator = Number(followers || 0) * engagementSamples.length;

  return {
    sampleSize: normalized.length,
    engagementSampleSize: engagementSamples.length,
    viewSampleSize: viewSamples.length,
    likeSampleSize: likeSamples.length,
    totalLikes,
    totalViews,
    totalEngagement,
    engagementDenominator,
    avgLikes: likeSamples.length ? Math.round(totalLikes / likeSamples.length) : null,
    avgViews: viewSamples.length ? Math.round(totalViews / viewSamples.length) : null,
    avgEngagementRate: engagementDenominator ? Number(((totalEngagement / engagementDenominator) * 100).toFixed(2)) : null
  };
}

function summarizeCombined(...summaries) {
  const valid = summaries.filter(Boolean);
  const totalLikes = valid.reduce((sum, item) => sum + item.totalLikes, 0);
  const totalViews = valid.reduce((sum, item) => sum + item.totalViews, 0);
  const totalEngagement = valid.reduce((sum, item) => sum + item.totalEngagement, 0);
  const engagementDenominator = valid.reduce((sum, item) => sum + item.engagementDenominator, 0);
  const likeSampleSize = valid.reduce((sum, item) => sum + item.likeSampleSize, 0);
  const viewSampleSize = valid.reduce((sum, item) => sum + item.viewSampleSize, 0);
  const sampleSize = valid.reduce((sum, item) => sum + item.sampleSize, 0);

  return {
    avgEngagementRate: engagementDenominator ? Number(((totalEngagement / engagementDenominator) * 100).toFixed(2)) : null,
    avgViews: viewSampleSize ? Math.round(totalViews / viewSampleSize) : null,
    avgLikes: likeSampleSize ? Math.round(totalLikes / likeSampleSize) : null,
    sampleSize
  };
}

async function fetchJson(url, options = {}) {
  const response = await fetch(url, options);
  const text = await response.text();
  let body;
  try {
    body = text ? JSON.parse(text) : {};
  } catch {
    body = { raw: text };
  }

  if (!response.ok) {
    const message = body?.error?.message || body?.message || response.statusText;
    throw new Error(`${response.status} ${message}`);
  }

  return body;
}

function apifyActorUrl(actorId) {
  const normalized = actorId.includes("~") ? actorId : actorId.replace("/", "~");
  const url = new URL(`https://api.apify.com/v2/acts/${normalized}/run-sync-get-dataset-items`);
  url.searchParams.set("token", env("APIFY_TOKEN"));
  return url;
}

async function runApifyActorItems(actorId, input) {
  const items = await fetchJson(apifyActorUrl(actorId), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input)
  });

  if (!Array.isArray(items)) {
    throw new Error(`Apify actor ${actorId} did not return a dataset array.`);
  }

  if (!items.length) {
    throw new Error(`Apify actor ${actorId} returned no items.`);
  }

  return items;
}

async function runApifyActor(actorId, input) {
  const items = await runApifyActorItems(actorId, input);
  return items[0];
}

function parseInputJson(envName, fallback) {
  const value = env(envName);
  return value ? JSON.parse(value) : fallback;
}

async function updateInstagramFromApify(stats) {
  if (!env("APIFY_TOKEN") || !env("APIFY_INSTAGRAM_ACTOR_ID")) return false;

  const username = env("INSTAGRAM_USERNAME") || stats.platforms.instagram.username;
  if (!username) throw new Error("Set INSTAGRAM_USERNAME or data/profile.json platforms.instagram.username.");

  const input = parseInputJson("APIFY_INSTAGRAM_INPUT_JSON", {
    resultsType: "details",
    directUrls: [`https://www.instagram.com/${username}/`],
    resultsLimit: 1,
    addProfileStatistics: true
  });
  const item = await runApifyActor(env("APIFY_INSTAGRAM_ACTOR_ID"), input);

  stats.platforms.instagram = {
    ...stats.platforms.instagram,
    username: firstValue(item, ["username", "userName", "ownerUsername"]) || username,
    followers: asNumber(firstValue(item, ["followersCount", "followerCount", "followers", "followers_count"]), stats.platforms.instagram.followers),
    following: asNumber(firstValue(item, ["followsCount", "followingCount", "following", "follows_count"]), stats.platforms.instagram.following),
    posts: asNumber(firstValue(item, ["postsCount", "mediaCount", "media_count", "posts", "posts_count"]), stats.platforms.instagram.posts)
  };

  const avatar = firstValue(item, ["profilePicUrl", "profilePictureUrl", "profile_picture_url", "avatarUrl"]);
  if (avatar && (!stats.profile.avatar || stats.profile.avatar === "assets/avatar.svg")) stats.profile.avatar = avatar;

  stats.profile.instagramUrl = `https://instagram.com/${stats.platforms.instagram.username}`;

  try {
    const recentInput = parseInputJson("APIFY_INSTAGRAM_RECENT_INPUT_JSON", {
      resultsType: "posts",
      directUrls: [`https://www.instagram.com/${username}/`],
      resultsLimit: contentSampleLimit(stats.platforms.instagram.posts),
      skipPinnedPosts: true
    });
    const recentItems = await runApifyActorItems(env("APIFY_INSTAGRAM_ACTOR_ID"), recentInput);
    stats.platforms.instagram.performance = summarizeContent(recentItems, stats.platforms.instagram.followers, "instagram");
    console.log(`Updated Instagram content metrics from ${recentItems.length} items.`);
  } catch (error) {
    console.warn(`Instagram content metrics skipped: ${error.message}`);
  }

  console.log(`Updated Instagram from Apify @${stats.platforms.instagram.username}.`);
  return true;
}

async function updateTikTokFromApify(stats) {
  if (!env("APIFY_TOKEN") || !env("APIFY_TIKTOK_ACTOR_ID")) return false;

  const username = env("TIKTOK_USERNAME") || stats.platforms.tiktok.username;
  if (!username) throw new Error("Set TIKTOK_USERNAME or data/profile.json platforms.tiktok.username.");

  const input = parseInputJson("APIFY_TIKTOK_INPUT_JSON", {
    profiles: [username],
    resultsPerPage: contentSampleLimit(stats.platforms.tiktok.videos),
    profileScrapeSections: ["videos"],
    profileSorting: "latest",
    excludePinnedPosts: false,
    proxyCountryCode: "None",
    scrapeRelatedVideos: false,
    shouldDownloadAvatars: false,
    shouldDownloadCovers: false,
    shouldDownloadMusicCovers: false,
    shouldDownloadSlideshowImages: false,
    shouldDownloadSubtitles: false,
    shouldDownloadVideos: false,
    maxProfilesPerQuery: 1
  });
  const items = await runApifyActorItems(env("APIFY_TIKTOK_ACTOR_ID"), input);
  const item = items[0];

  stats.platforms.tiktok = {
    ...stats.platforms.tiktok,
    username: firstValue(item, ["username", "userName", "uniqueId", "authorMeta.name", "author.uniqueId"]) || username,
    followers: asNumber(firstValue(item, ["followersCount", "followerCount", "followers", "fans", "fanCount", "stats.followerCount", "authorMeta.fans"]), stats.platforms.tiktok.followers),
    following: asNumber(firstValue(item, ["followingCount", "following", "stats.followingCount", "authorMeta.following"]), stats.platforms.tiktok.following),
    likes: asNumber(firstValue(item, ["likesCount", "likeCount", "heartCount", "hearts", "stats.heartCount", "authorMeta.heart"]), stats.platforms.tiktok.likes),
    videos: asNumber(firstValue(item, ["videoCount", "videosCount", "awemeCount", "stats.videoCount", "authorMeta.video"]), stats.platforms.tiktok.videos)
  };

  const avatar = firstValue(item, ["avatar", "avatarUrl", "avatarLarger", "authorMeta.avatar", "author.avatarLarger"]);
  if (avatar && (!stats.profile.avatar || stats.profile.avatar === "assets/avatar.svg")) stats.profile.avatar = avatar;

  stats.profile.tiktokUrl = `https://www.tiktok.com/@${stats.platforms.tiktok.username}`;
  stats.platforms.tiktok.performance = summarizeContent(items, stats.platforms.tiktok.followers, "tiktok");
  console.log(`Updated TikTok content metrics from ${items.length} items.`);
  console.log(`Updated TikTok from Apify @${stats.platforms.tiktok.username}.`);
  return true;
}

async function updateInstagramFromOfficialApi(stats) {
  const token = env("IG_GRAPH_ACCESS_TOKEN");
  const userId = env("IG_USER_ID");
  if (!token || !userId) return false;

  const fields = ["username", "followers_count", "follows_count", "media_count", "biography", "website", "profile_picture_url"].join(",");
  const url = new URL(`https://graph.facebook.com/v20.0/${userId}`);
  url.searchParams.set("fields", fields);
  url.searchParams.set("access_token", token);

  const data = await fetchJson(url);
  stats.platforms.instagram = {
    ...stats.platforms.instagram,
    username: data.username || stats.platforms.instagram.username,
    followers: asNumber(data.followers_count, stats.platforms.instagram.followers),
    following: asNumber(data.follows_count, stats.platforms.instagram.following),
    posts: asNumber(data.media_count, stats.platforms.instagram.posts)
  };

  if (data.profile_picture_url && (!stats.profile.avatar || stats.profile.avatar === "assets/avatar.svg")) stats.profile.avatar = data.profile_picture_url;
  if (data.biography && !env("KEEP_PROFILE_BIO")) stats.profile.bio = data.biography;
  stats.profile.instagramUrl = `https://instagram.com/${stats.platforms.instagram.username}`;

  console.log(`Updated Instagram from official API @${stats.platforms.instagram.username}.`);
  return true;
}

async function refreshTikTokAccessToken() {
  const refreshToken = env("TIKTOK_REFRESH_TOKEN");
  const clientKey = env("TIKTOK_CLIENT_KEY");
  const clientSecret = env("TIKTOK_CLIENT_SECRET");

  if (!refreshToken || !clientKey || !clientSecret) return env("TIKTOK_ACCESS_TOKEN");

  const body = new URLSearchParams({
    client_key: clientKey,
    client_secret: clientSecret,
    grant_type: "refresh_token",
    refresh_token: refreshToken
  });

  const data = await fetchJson("https://open.tiktokapis.com/v2/oauth/token/", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body
  });

  if (data.refresh_token && data.refresh_token !== refreshToken) {
    console.warn("TikTok returned a rotated refresh token. Update the TIKTOK_REFRESH_TOKEN GitHub secret.");
  }

  return data.access_token;
}

async function updateTikTokFromOfficialApi(stats) {
  const accessToken = await refreshTikTokAccessToken();
  if (!accessToken) return false;

  const fields = ["open_id", "union_id", "avatar_url", "display_name", "bio_description", "profile_deep_link", "is_verified", "follower_count", "following_count", "likes_count", "video_count"].join(",");
  const url = new URL("https://open.tiktokapis.com/v2/user/info/");
  url.searchParams.set("fields", fields);

  const data = await fetchJson(url, { headers: { Authorization: `Bearer ${accessToken}` } });
  const user = data.data?.user || data.user || {};

  stats.platforms.tiktok = {
    ...stats.platforms.tiktok,
    username: user.display_name || stats.platforms.tiktok.username,
    followers: asNumber(user.follower_count, stats.platforms.tiktok.followers),
    following: asNumber(user.following_count, stats.platforms.tiktok.following),
    likes: asNumber(user.likes_count, stats.platforms.tiktok.likes),
    videos: asNumber(user.video_count, stats.platforms.tiktok.videos)
  };

  if (user.profile_deep_link) stats.profile.tiktokUrl = user.profile_deep_link;
  if (user.avatar_url && (!stats.profile.avatar || stats.profile.avatar === "assets/avatar.svg")) stats.profile.avatar = user.avatar_url;

  console.log(`Updated TikTok from official API ${stats.platforms.tiktok.username}.`);
  return true;
}

async function main() {
  const stats = await readBaseStats();

  // Prefer username-only Apify if configured. Fall back to official APIs if configured.
  const updatedInstagram = await updateInstagramFromApify(stats) || await updateInstagramFromOfficialApi(stats);
  const updatedTikTok = await updateTikTokFromApify(stats) || await updateTikTokFromOfficialApi(stats);

  if (!updatedInstagram) console.log("Instagram not updated. Configure Apify or official Instagram API secrets.");
  if (!updatedTikTok) console.log("TikTok not updated. Configure Apify or official TikTok API secrets.");

  stats.performance = summarizeCombined(stats.platforms.instagram.performance, stats.platforms.tiktok.performance);

  if (updatedInstagram || updatedTikTok) {
    stats.updatedAt = new Date().toISOString();
  }

  await writeFile(statsPath, `${JSON.stringify(stats, null, 2)}\n`);
  console.log("Wrote generated data/stats.json.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
