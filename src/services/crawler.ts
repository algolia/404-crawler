import type { Page } from "playwright";
import { chromium } from "playwright";
import promiseAllInBatches from "../../utils/promiseAllInBatches";

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
  exitOnDetection?: boolean;
  runInParallel?: boolean;
  batchSize: number;

  constructor(
    sites: string[],
    renderJs: boolean,
    exitOnDetection: boolean,
    runInParallel: boolean,
    batchSize?: number
  ) {
    this.sites = sites;
    this.renderJs = renderJs;
    this.exitOnDetection = exitOnDetection;
    this.runInParallel = runInParallel;
    this.batchSize = batchSize || 10;
  }

  crawl() {
    if (this.runInParallel) {
      return this.crawlInParallel();
    }

    return this.crawlInSeries();
  }

  async crawlInParallel(
    parameters: Parameters<Page["getByRole"]> = [
      "heading",
      { name: "Page not found" },
    ]
  ): Promise<[Error | null, SiteStatus[]]> {
    const browser = await chromium.launch();

    const task = async (site: string) => {
      const page = await browser.newPage();
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

      if (
        this.exitOnDetection &&
        ["404", "not-found"].includes(siteStatus.status)
      ) {
        throw new Error(
          `Page ${siteStatus.url} is a ${siteStatus.status} page`
        );
      }

      await page.close();
      return siteStatus;
    };

    const [error, sitesStatus] = await promiseAllInBatches(
      task,
      this.sites,
      this.batchSize,
      (batchResults) => {
        for (const result of batchResults) {
          console.log(`${STATUS_WORDING[result.status]} - ${result.url}\n`);
        }
      }
    );
    await browser.close();
    if (this.exitOnDetection && error) {
      return [error, sitesStatus];
    }

    return [null, sitesStatus];
  }

  async crawlInSeries(
    parameters: Parameters<Page["getByRole"]> = [
      "heading",
      { name: "Page not found" },
    ]
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

      if (
        this.exitOnDetection &&
        ["404", "not-found"].includes(siteStatus.status)
      ) {
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
