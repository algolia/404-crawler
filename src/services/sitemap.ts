import fs from "fs";
import Sitemapper from "sitemapper";

const sitemap = new Sitemapper({});

const DEFAULT_OUTPUT_PATH = "paths.json";

class Sitemap {
  sitemapUrl: string;
  fullPaths: string[];

  constructor(sitemapUrl: string) {
    this.sitemapUrl = sitemapUrl;
    this.fullPaths = [];
  }

  async fetch(full?: boolean) {
    const { errors, sites } = await sitemap.fetch(this.sitemapUrl);
    if (errors.length > 0) {
      throw new Error(`Sitemap ${errors.map((err) => err.type).join("\n")}`);
    }

    if (full) {
      const fullPaths = new Set();
      // Create all existing subpaths
      for (const site of sites) {
        const { pathname } = new URL(site);
        const paths = pathname.split("/").filter((rawPath) => Boolean(rawPath));

        for (let index = 1; index <= paths.length + 1; index++) {
          const currentPath = paths.slice(0, index).join("/");
          if (!fullPaths.has(currentPath)) {
            fullPaths.add(currentPath);
          }
        }
      }
      const { origin } = new URL(this.sitemapUrl);
      this.fullPaths = [...fullPaths].map((path) => `${origin}/${path}`);
    } else {
      this.fullPaths = sites;
    }
  }

  write(outputPath = DEFAULT_OUTPUT_PATH) {
    fs.writeFileSync(outputPath, JSON.stringify(this.fullPaths));
  }
}

export default Sitemap;
