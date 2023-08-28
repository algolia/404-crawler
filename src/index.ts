#!/usr/bin/env node

import fs from "fs";
import type { Options } from "../validation";
import Crawler from "./services/crawler";
import Sitemap from "./services/sitemap";

const main = async ({
  sitemapUrl,
  renderJs,
  output,
  includeVariations,
}: Options) => {
  try {
    console.log(`\n🔄 Loading sitemap.xml at ${sitemapUrl}...`);
    const sitemap = new Sitemap(sitemapUrl);
    await sitemap.fetch();
    let sites = sitemap.sitemapSites;
    if (includeVariations) {
      sitemap.vary();
      sites = sitemap.fullSites;
    }
    console.log(`\n✅ Sitemap fetched and parsed successfully`);
    console.log(
      `\n🚀 Crawling sites ${
        includeVariations ? "and sub-domains sites " : ""
      }from sitemap...\n`
    );
    const crawler = new Crawler(sites, renderJs);
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
