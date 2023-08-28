import Sitemapper from "sitemapper";

const sitemap = new Sitemapper({});

class Sitemap {
  sitemapUrl: string;
  sitemapSites: string[];
  fullSites: string[];

  constructor(sitemapUrl: string) {
    this.sitemapUrl = sitemapUrl;
    this.sitemapSites = [];
    this.fullSites = [];
  }

  async fetch() {
    const { errors, sites } = await sitemap.fetch(this.sitemapUrl);
    if (errors.length > 0) {
      throw new Error(`Sitemap ${errors.map((err) => err.type).join("\n")}`);
    }
    this.sitemapSites = sites;
  }

  vary() {
    const fullSites = new Set();
    // Create all subpaths variations
    for (const site of this.sitemapSites) {
      const { pathname } = new URL(site);
      const paths = pathname.split("/").filter((rawPath) => Boolean(rawPath));

      for (let index = 1; index <= paths.length + 1; index++) {
        const currentPath = paths.slice(0, index).join("/");
        if (!fullSites.has(currentPath)) {
          fullSites.add(currentPath);
        }
      }
    }
    const { origin } = new URL(this.sitemapUrl);
    this.fullSites = [...fullSites].map((path) => `${origin}/${path}`);
  }
}

export default Sitemap;
