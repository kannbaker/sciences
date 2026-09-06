declare const __BASE_URL__: string;

export const BASE_URL = __BASE_URL__;

export function resolveAppPath(path: string): string {
  return `${BASE_URL}${path.replace(/^\/+/, "")}`;
}

export function getRoutePath(pathname: string): string {
  const basePath = BASE_URL.replace(/\/$/, "");
  const routePath = basePath && pathname.startsWith(basePath)
    ? pathname.slice(basePath.length)
    : pathname;
  return routePath.replace(/\/$/, "") || "/";
}
