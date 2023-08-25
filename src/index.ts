import Crawler from "./services/crawler";
import Sitemap from "./services/sitemap";

import type { Method } from "./services/crawler";

type MainArgs = {
  sitemapUrl: string;
  method?: Method;
  write?: boolean;
};

const main = async ({ sitemapUrl, method }: MainArgs) => {
  try {
    console.log(`\n🔄 Loading sitemap.xml...`);
    const sitemap = new Sitemap(sitemapUrl);
    await sitemap.fetch();
    console.log(`\n🚀 Crawling sites and sub-domains sites...\n`);
    const crawler = new Crawler(sitemap.fullPaths, method || "status-code");
    const siteStatus = await crawler.crawl();

    // fs.writeFileSync(
    //   "sitesStatus.json",
    //   JSON.stringify({
    //     siteStatus,
    //   })
    // );
    console.log(`\n✅ All sites and sub-domains sites have been crawled.`);
  } catch (error) {
    console.log(`\n❌ An error occured: ${error}`);
  }
};

export default main;
