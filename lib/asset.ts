/**
 * Prefix public asset paths with the deployment base path (e.g. GitHub Pages).
 * Next.js applies `basePath` to links automatically, but plain <img>/CSS URLs
 * are not rewritten, so local images must go through this helper.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function asset(path: string): string {
  if (!path || /^(?:[a-z]+:)?\/\//i.test(path) || path.startsWith("data:")) {
    return path;
  }

  return `${basePath}${path.startsWith("/") ? path : `/${path}`}`;
}
