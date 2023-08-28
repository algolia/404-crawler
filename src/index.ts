import fs from "fs";
import Crawler from "./services/crawler";
import Sitemap from "./services/sitemap";

import type { Method } from "./services/crawler";

type MainArgs = {
  sitemapUrl: string;
  method?: Method;
  output?: string;
  full?: boolean;
};

const main = async ({ sitemapUrl, method, output, full }: MainArgs) => {
  try {
    console.log(`\n🔄 Loading sitemap.xml at ${sitemapUrl}...`);
    const sitemap = new Sitemap(sitemapUrl);
    await sitemap.fetch(full);
    console.log(`\n✅ Sitemap fetched and parsed successfully`);
    console.log(
      `\n🚀 Crawling sites ${
        full ? "and sub-domains sites " : ""
      }from sitemap...\n`
    );
    const crawler = new Crawler(sitemap.fullPaths, method || "status-code");
    const siteStatus = await crawler.crawl();
    console.log(`\n✅ All sites and sub-domains sites have been crawled.`);
    if (output) {
      fs.writeFileSync(output, JSON.stringify(siteStatus));
      console.log(`\n✅ Results saved at ${output}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      console.log(`❌ error: ${error.message}`);
      return;
    }
    console.log(`❌ error: ${String(error)}`);
  }
};

export default main;
