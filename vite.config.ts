import fs from "node:fs";
import path from "node:path";
import { defineConfig, type Plugin } from "vite";
import { pie } from "@tinyvolt/pie/vite";
import { parseFrontmatter } from "./node_modules/@tinyvolt/pie/src/lib/markdown/frontmatter";
import { parseSite } from "./node_modules/@tinyvolt/pie/src/lib/site/vitePlugin";

/** Pages left out of the feed: they only list other pages. */
const NOT_IN_FEED = new Set(["pages/blog.md", "pages/series.md"]);

const escape = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Every `.md` file under `pages/`, except those whose name starts with `_`. Paths relative to `root`. */
function pageFiles(root: string, dir = "pages"): string[] {
  return fs.readdirSync(path.join(root, dir), { withFileTypes: true }).flatMap(entry => {
    const file = `${dir}/${entry.name}`;
    if (entry.isDirectory()) return pageFiles(root, file);
    return entry.name.endsWith(".md") && !entry.name.startsWith("_") ? [file] : [];
  });
}

/** Reads a page's `date: YYYY-MM-DD`. Empty when absent. Throws, naming the file, on a bad date. */
function pageDate(file: string, raw: Record<string, string>): string {
  const date = raw.date ?? "";
  if (date === "") return "";
  const valid = /^\d{4}-\d{2}-\d{2}$/.test(date) && new Date(`${date}T00:00:00Z`).toISOString().startsWith(date);
  if (!valid) throw new Error(`${file}: \`date\` must be a real date as YYYY-MM-DD, got ${JSON.stringify(date)}`);
  return date;
}

/**
 * The feed's pages, newest `date` first, then the undated ones.
 * `href` is the page's URL path, e.g. `/blog/numpy_indexing`. `title` is empty when the page has none.
 */
function feedItems(root: string) {
  return pageFiles(root)
    .filter(file => !NOT_IN_FEED.has(file))
    .map(file => {
      const { frontmatter, raw } = parseFrontmatter(file, fs.readFileSync(path.join(root, file), "utf8"));
      const href = file.slice("pages".length, -".md".length);
      return { href, title: frontmatter.title, description: frontmatter.description, date: pageDate(file, raw) };
    })
    .sort((a, b) => b.date.localeCompare(a.date) || a.href.localeCompare(b.href, "en", { numeric: true }));
}

/**
 * `rss.xml`: every page in `feedItems` order. Each item has the page's title, link and description.
 * `null` when `site.yml` has no `url`.
 */
function rssXml(root: string): string | null {
  const site = parseSite("site.yml", fs.readFileSync(path.join(root, "site.yml"), "utf8"));
  if (!site.url) return null;
  const items = feedItems(root).map(item => {
    const link = site.url + item.href;
    return { ...item, link, title: item.title || link };
  });
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    "  <channel>",
    `    <title>${escape(site.title)}</title>`,
    `    <link>${escape(site.url)}/</link>`,
    `    <description>${escape(site.description)}</description>`,
    `    <atom:link href="${escape(site.url)}/rss.xml" rel="self" type="application/rss+xml"/>`,
    ...items.map(item => [
      "    <item>",
      `      <title>${escape(item.title)}</title>`,
      `      <link>${escape(item.link)}</link>`,
      `      <guid isPermaLink="true">${escape(item.link)}</guid>`,
      ...(item.description ? [`      <description>${escape(item.description)}</description>`] : []),
      ...(item.date ? [`      <pubDate>${new Date(`${item.date}T00:00:00Z`).toUTCString()}</pubDate>`] : []),
      "    </item>",
    ].join("\n")),
    "  </channel>",
    "</rss>",
    "",
  ].join("\n");
}

/** Serves `/rss.xml` in dev, and writes it next to the built pages. Skipped, with a warning, when `site.yml` has no `url`. */
function rssFeed(): Plugin {
  let root = process.cwd();
  return {
    name: "lafp-rss-feed",
    configResolved(config) {
      root = config.root;
    },
    configureServer(server) {
      server.middlewares.use("/rss.xml", (req, res, next) => {
        const xml = rssXml(root);
        if (xml === null) return next();
        res.setHeader("Content-Type", "application/rss+xml; charset=utf-8");
        res.end(xml);
      });
    },
    generateBundle() {
      if (this.environment.name !== "client") return;
      const xml = rssXml(root);
      if (xml === null) this.warn("site.yml has no `url`: skipped rss.xml.");
      else this.emitFile({ type: "asset", fileName: "rss.xml", source: xml });
    },
  };
}

const LATEST_ID = "virtual:latest-pages";
const RESOLVED_LATEST_ID = "\0" + LATEST_ID;
/** How many of the newest feed pages the homepage lists. */
const LATEST_COUNT = 5;

/** `import latest from "virtual:latest-pages"`: the first `LATEST_COUNT` items of the feed, for the homepage. */
function latestPages(): Plugin {
  let root = process.cwd();
  return {
    name: "lafp-latest-pages",
    configResolved(config) {
      root = config.root;
    },
    resolveId(id) {
      if (id === LATEST_ID) return RESOLVED_LATEST_ID;
    },
    load(id) {
      if (id === RESOLVED_LATEST_ID) return `export default ${JSON.stringify(feedItems(root).slice(0, LATEST_COUNT))};`;
    },
    // In dev, a changed, added or removed page makes the list rebuild on the next page load.
    hotUpdate({ file }) {
      if (!file.endsWith(".md") || !file.startsWith(path.join(root, "pages") + path.sep)) return;
      const mod = this.environment.moduleGraph.getModuleById(RESOLVED_LATEST_ID);
      if (mod) this.environment.moduleGraph.invalidateModule(mod);
    },
  };
}

export default defineConfig({
  plugins: [pie(), rssFeed(), latestPages()],
});
