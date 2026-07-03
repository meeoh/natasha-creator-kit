const scopes = ["user.info.basic", "user.info.profile", "user.info.stats"];

function requireEnv(name) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing ${name}`);
  return value;
}

function authUrl() {
  const clientKey = requireEnv("TIKTOK_CLIENT_KEY");
  const redirectUri = requireEnv("TIKTOK_REDIRECT_URI");
  const state = process.env.TIKTOK_STATE || crypto.randomUUID();

  const url = new URL("https://www.tiktok.com/v2/auth/authorize/");
  url.searchParams.set("client_key", clientKey);
  url.searchParams.set("scope", scopes.join(","));
  url.searchParams.set("response_type", "code");
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("state", state);

  console.log("Open this URL and authorize TikTok:\n");
  console.log(url.toString());
  console.log("\nState:", state);
}

async function exchangeCode() {
  const clientKey = requireEnv("TIKTOK_CLIENT_KEY");
  const clientSecret = requireEnv("TIKTOK_CLIENT_SECRET");
  const redirectUri = requireEnv("TIKTOK_REDIRECT_URI");
  const code = requireEnv("TIKTOK_AUTH_CODE");

  const body = new URLSearchParams({
    client_key: clientKey,
    client_secret: clientSecret,
    code,
    grant_type: "authorization_code",
    redirect_uri: redirectUri
  });

  const response = await fetch("https://open.tiktokapis.com/v2/oauth/token/", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    console.error(JSON.stringify(data, null, 2));
    throw new Error(`Token exchange failed: ${response.status} ${response.statusText}`);
  }

  console.log("Token exchange succeeded. Add these to GitHub secrets:\n");
  console.log("TIKTOK_CLIENT_KEY=", clientKey);
  console.log("TIKTOK_CLIENT_SECRET=", clientSecret);
  console.log("TIKTOK_REFRESH_TOKEN=", data.refresh_token);
  console.log("\nAccess token for quick local testing only:");
  console.log("TIKTOK_ACCESS_TOKEN=", data.access_token);
  console.log("\nFull response:");
  console.log(JSON.stringify(data, null, 2));
}

const command = process.argv[2];

try {
  if (command === "auth-url") authUrl();
  else if (command === "exchange") await exchangeCode();
  else {
    console.log(`Usage:

Generate auth URL:
  TIKTOK_CLIENT_KEY="..." TIKTOK_REDIRECT_URI="https://.../tiktok-callback.html" node scripts/tiktok-oauth.mjs auth-url

Exchange returned code:
  TIKTOK_CLIENT_KEY="..." TIKTOK_CLIENT_SECRET="..." TIKTOK_REDIRECT_URI="https://.../tiktok-callback.html" TIKTOK_AUTH_CODE="..." node scripts/tiktok-oauth.mjs exchange
`);
  }
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
