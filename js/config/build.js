// WWE Legacy build identity + local asset cache-busting.
// `npm run stamp-cache` rewrites this value from package.json on each release.
export const BUILD_VERSION = "0.13.72";

export function assetUrl(path) {
  if (!path || /^(?:data:|blob:)/i.test(path)) return path;
  const joiner = String(path).includes("?") ? "&" : "?";
  return `${path}${joiner}v=${encodeURIComponent(BUILD_VERSION)}`;
}
