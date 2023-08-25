import { program } from "commander";
import main from "./src";

program.version("1.0.0");

program
  .command("crawl")
  .command("404")
  .description("Detect 404 pages from sitemap urls and all their sub-paths")
  .requiredOption(
    "-u, --url [url]",
    "URL of the sitemap containing urls to crawl"
  )
  .option(
    "-m, --method [method]",
    "Method used to detect 404 page. Default to 'status-code'"
  )
  .action(({ method, url }) => {
    main({
      sitemapUrl: url,
      method,
    });
  });

program.parse(process.argv);
