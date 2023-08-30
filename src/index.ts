#!/usr/bin/env node

import fs from "fs";
import type { SanitizedOptions } from "../utils/options";
import Crawler from "./services/crawler";
import Sitemap from "./services/sitemap";

const main = async ({
  sitemapUrl,
  renderJs,
  output,
  includeVariations,
  exitOnDetection,
  runInParallel,
  batchSize,
  browserType,
}: SanitizedOptions) => {
  console.log(`\n🔄 Loading sitemap.xml at ${sitemapUrl}...`);
  const sitemap = new Sitemap(sitemapUrl);
  await sitemap.fetch();
  let sites = sitemap.sitemapSites;
  if (includeVariations) {
    sitemap.fillVariations();
    sites = sitemap.sitemapSitesWithVariations;
  }
  console.log(`\n✅ Sitemap fetched and parsed successfully`);
  console.log(
    `\n🚀 Crawling sites ${
      includeVariations ? "and sub-domains sites " : ""
    }from sitemap...\n`
  );
  const crawler = new Crawler(
    sites,
    renderJs,
    exitOnDetection,
    runInParallel,
    browserType,
    batchSize
  );
  const [error, siteStatus] = await crawler.crawl();
  if (output) {
    fs.writeFileSync(output, JSON.stringify(siteStatus));
    console.log(`\n✅ Results saved at ${output}`);
  }
  if (error) {
    throw error;
  }
  console.log(`\n✅ All sites and sub-domains sites have been crawled.`);
};

export default main;
