#!/usr/bin/env node

import { program } from "commander";
import main from "./src";
import type { Options } from "./validation";
import validateOptions from "./validation";

program
  .name("404crawler")
  .description("CLI to detect 404 pages from sitemap")
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
  .action((options: Options) => {
    try {
      validateOptions(options);
      main(options);
    } catch (error) {
      if (error instanceof Error) {
        console.log(`❌ error: ${error.message}`);
        return;
      }
      console.log(`❌ error: ${String(error)}`);
    }
  });

program.parse(process.argv);
