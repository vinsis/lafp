// The newest pages in the RSS feed, made by `latestPages` in `vite.config.ts`.
declare module "virtual:latest-pages" {
  /** `href`: the page's URL path. `title` and `description`: empty when the page has none. `date`: YYYY-MM-DD, or empty. */
  const latest: { href: string; title: string; description: string; date: string }[];
  export default latest;
}
