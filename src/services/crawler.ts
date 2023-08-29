import type { Page } from "playwright";
import { chromium } from "playwright";

const STATUS_WORDING = {
  "404": "🚩 Returned status code 404",
  "not-found": "🚩 Rendered a 'Not Found Page'",
  ok: "☑️  Valid",
};

type SiteStatus = {
  url: string;
  status: keyof typeof STATUS_WORDING;
};

class Crawler {
  renderJs: boolean;
  sites: string[];

  constructor(sites: string[], renderJs?: boolean) {
    this.sites = sites;
    this.renderJs = Boolean(renderJs);
  }

  async crawl(
    parameters: Parameters<Page["getByRole"]> = [
      "heading",
      { name: "Page not found" },
    ],
    exitOnDetection?: boolean
  ): Promise<[Error | null, SiteStatus[]]> {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    const sitesStatus: SiteStatus[] = [];

    for (const [index, site] of this.sites.entries()) {
      console.log(`Crawling ${index + 1}/${this.sites.length}...`);
      const result = await page.goto(site);
      let siteStatus: SiteStatus = {
        url: site,
        status: "ok",
      };

      if (result?.status() === 404) {
        siteStatus.status = "404";
      }
      // If not a 404 status code and js-rendering is enabled, check 'Not found page'
      if (siteStatus.status === "ok" && this.renderJs) {
        const locator = page.getByRole(...parameters);
        const notFoundElements = await locator.evaluateAll((list) =>
          list.map((element) => element)
        );
        if (notFoundElements.length > 0) {
          siteStatus.status = "not-found";
        }
      }

      sitesStatus.push(siteStatus);

      if (exitOnDetection && ["404", "not-found"].includes(siteStatus.status)) {
        await browser.close();
        return [
          new Error(`Page ${siteStatus.url} is a ${siteStatus.status} page`),
          sitesStatus,
        ];
      }
      console.log(`${STATUS_WORDING[siteStatus.status]} - ${siteStatus.url}\n`);
    }

    await browser.close();
    return [null, sitesStatus];
  }
}

export default Crawler;
