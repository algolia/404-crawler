#!/usr/bin/env node

import { program } from "commander";
import main from "./src";
import formatError from "./utils/formatError";
import type { Options } from "./utils/options";
import { sanitizeOptions, validateOptions } from "./utils/options";

program
  .name("404crawler")
  .description("Detect 404 and 'Not found' pages from sitemap URL")
  .version("1.0.0");

program
  .command("crawl")
  .description(
    "Crawl pages from sitemap urls and all their sub-paths and detect 404 or not found pages"
  )
  .requiredOption(
    "-u, --sitemap-url <url>",
    "URL of the sitemap containing URLs to crawl"
  )
  .option(
    "-r, --render-js",
    "Render JavaScript to detect a 'Page not found' page if the page doesn't return a 404 status code"
  )
  .option("-o, --output <path>", "Output path of the results (JSON format)")
  .option(
    "-v, --include-variations",
    "Crawl all URLs found in the sitemap AND their sub-paths variations"
  )
  .option(
    "-e, --exit-on-detection",
    "Exit when a 404 or a 'Not Found' page is detected"
  )
  .option(
    "-p, --run-in-parallel",
    "Run the crawler with multiple instances in parallel."
  )
  .option(
    "-b, --batch-size <size>",
    "Number of crawls to trigger in parallel when using --run-in-parallel option. If not set, default to 10"
  )
  .action(async (options: Options) => {
    try {
      validateOptions(options);
      await main(sanitizeOptions(options));
    } catch (error) {
      formatError(error);
    }
  });

program.parse(process.argv);
