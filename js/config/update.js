export function parseBuildVersion(value) {
  const parts = String(value ?? "").trim().replace(/^v/i, "").split(".").map(part => Number.parseInt(part, 10));
  if (parts.length < 3 || parts.some(part => !Number.isFinite(part) || part < 0)) return null;
  return parts.slice(0, 3);
}

export function compareBuildVersions(left, right) {
  const a = parseBuildVersion(left), b = parseBuildVersion(right);
  if (!a || !b) return 0;
  for (let i = 0; i < 3; i += 1) {
    if (a[i] !== b[i]) return a[i] > b[i] ? 1 : -1;
  }
  return 0;
}

export function isNewerBuild(latest, current) {
  return compareBuildVersions(latest, current) > 0;
}

export function updateNavigationUrl(currentHref, latestVersion, now = Date.now()) {
  const url = new URL(currentHref);
  url.searchParams.set("build", String(latestVersion));
  url.searchParams.set("_update", String(now));
  return url.toString();
}

export async function fetchLatestBuild(fetchImpl = globalThis.fetch, { baseUrl = globalThis.location?.href, now = Date.now() } = {}) {
  if (typeof fetchImpl !== "function") throw new Error("Update check is unavailable.");
  if (!baseUrl) throw new Error("Update check has no base URL.");
  const url = new URL("./build.json", baseUrl);
  url.searchParams.set("_", String(now));
  const response = await fetchImpl(url.toString(), { cache: "no-store" });
  if (!response?.ok) throw new Error(`Update check failed (${response?.status ?? "network"}).`);
  const payload = await response.json();
  if (!parseBuildVersion(payload?.version)) throw new Error("Update manifest is invalid.");
  return String(payload.version);
}
