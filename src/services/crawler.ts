import { chromium } from "playwright";
import type { Page } from "playwright";

export const METHODS = ["status-code", "js-rendering"] as const;
export type Method = (typeof METHODS)[number];

type SiteStatus = {
  url: string;
  status: "404" | "not-found" | "ok";
};

const STATUS_WORDING = {
  "404": "🚩 Returned status code 404",
  "not-found": "🚩 Rendered a 'Not Found Page'",
  ok: "☑️  Valid",
};

class Crawler {
  method: Method;
  sites: string[];

  constructor(sites: string[], method: Method) {
    this.sites = sites;
    this.method = method;
  }

  async crawl(parameters?: Parameters<Page["getByRole"]>) {
    switch (this.method) {
      case "status-code":
        return this.crawlByStatus();
      case "js-rendering":
        return this.crawlJsRendering(parameters);
    }
  }

  async crawlByStatus() {
    const sitesStatus: SiteStatus[] = [];

    for (const [index, site] of this.sites.entries()) {
      const response = await fetch(site);

      let siteStatus: SiteStatus = {
        url: site,
        status: "ok",
      };
      if (response.status === 404) {
        siteStatus.status = "404";
      }
      console.log(`Crawling ${index + 1}/${this.sites.length}...`);
      console.log(`${STATUS_WORDING[siteStatus.status]} - ${siteStatus.url}\n`);
      sitesStatus.push(siteStatus);
    }

    return sitesStatus;
  }

  async crawlJsRendering(
    parameters: Parameters<Page["getByRole"]> = [
      "heading",
      { name: "Page not found" },
    ]
  ) {
    const sitesStatus: SiteStatus[] = [];
    const browser = await chromium.launch();
    const page = await browser.newPage();

    for (const [index, site] of this.sites.entries()) {
      await page.goto(site);
      const locator = page.getByRole(...parameters);
      const notFoundElements = await locator.evaluateAll((list) =>
        list.map((element) => element)
      );
      let siteStatus: SiteStatus = {
        url: site,
        status: "ok",
      };
      if (notFoundElements.length > 0) {
        siteStatus.status = "not-found";
      }
      console.log(`Crawling ${index + 1}/${this.sites.length}...`);
      console.log(`${STATUS_WORDING[siteStatus.status]} - ${siteStatus.url}\n`);
      sitesStatus.push(siteStatus);
    }

    await browser.close();
    return sitesStatus;
  }
}

export default Crawler;
