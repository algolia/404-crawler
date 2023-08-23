import fs from "fs";
import Sitemapper from "sitemapper";
import createUrlObjectFromUrl from "./helpers/createUrlObjectFromUrl";

const sitemap = new Sitemapper({});

const main = async () => {
  const { url, sites } = await sitemap.fetch(
    "https://www.algolia.com/doc-beta/sitemap.xml"
  );

  console.log(`Showing sites from ${url}:\n\n`);

  const data = createUrlObjectFromUrl(sites);
  const dataToWrite = JSON.stringify({ data });
  fs.writeFileSync("sites.json", dataToWrite);

  console.log(data);
};

main().then(() => {
  console.log("\n✅ Done!");
});
