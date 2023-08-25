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

  async fetch() {
    const { errors, sites } = await sitemap.fetch(process.env.SITEMAP_URL);
    if (errors.length > 0) {
      throw new Error(
        `An error occured while fetching the sitemap: ${errors.join("\n")}`
      );
    }

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
  }

  write(outputPath = DEFAULT_OUTPUT_PATH) {
    fs.writeFileSync(
      outputPath,
      JSON.stringify({
        sites: this.fullPaths,
      })
    );
  }
}

export default Sitemap;
