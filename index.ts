import dotenv from "dotenv";
import Crawler from "./services/crawler";
import Sitemap from "./services/sitemap";

dotenv.config();

const main = async () => {
  if (!process.env.SITEMAP_URL) {
    throw new Error(
      "Cannot find SITEMAP_URL environment variable: maybe you forgot to add it?"
    );
  }
  console.log(`\n🔄 Loading sitemap.xml...`);
  const sitemap = new Sitemap(process.env.SITEMAP_URL);
  await sitemap.fetch();
  console.log(`\n🚀 Crawling sites and sub-domains sites...`);
  const crawler = new Crawler(sitemap.fullPaths, "js-rendering");
  await crawler.crawl();
};

main()
  .then(() => {
    console.log(`\n✅ All sites and sub-domains sites have been crawled.`);
  })
  .catch((error) => {
    console.log(`\n❌ An error occured: ${error}`);
  });
