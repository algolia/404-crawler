# 404 Crawler

A command line interface to crawl pages from sitemap urls and all their sub-path.

![Screenshot](https://github.com/algolia/404-crawler/blob/main/README.png)

## Usage

### Install

> Make sure npm is installed in your computer. To know more about it, visit

In a terminal, run

```sh
npm install -g @algolia/404-crawler
```

After that, you'll be able to use the command `404crawler` in your terminal

### Examples

- Crawl and detect every 404 pages from algolia website's sitemap:

  ```sh
  404crawler crawl -u https://algolia.com/sitemap.xml
  ```

- Use JavaScript rendering to crawl and identify all 404 or 'Not Found' pages on the Algolia website.

  ```sh
  404crawler crawl -u https://algolia.com/sitemap.xml --render-js
  ```

- Crawl and identify all 404 pages on the Algolia website by analyzing its sitemap, including all potential sub-path variations
  ```sh
  404crawler crawl -u https://algolia.com/sitemap.xml --include-variations
  ```

### Options

- `--sitemap-url or -u`: **Required** URL of the `sitemap.xml` file.
- `--render-js or -r`: Use JavaScript rendering to crawl and identify a 'Not Found Page' if the status code isn't a 404. This option is useful for websites that returns a 200 status code even if the page is not found (Next.js with custom not found page for example)
- `--include-variations or -r`: Include all sub-path variations from URLs found in the `sitemap.xml`.
  For example, if https://algolia.com/foo/bar/baz is found in the sitemap, the crawler will test https://algolia.com/foo/bar/baz, https://algolia.com/foo/bar, https://algolia.com/foo and https://algolia.com
- `--output or -o`: Ouput path for the JSON file of the results. Example: `crawler/results.json`. If not set, no file is written after the crawl.

## Get started (maintainers)

This CLI is built with TypeScript and uses `ts-node` to run the code locally.

### Install

Install all dependencies

```sh
pnpm i
```

### Run locally

```
pnpm 404crawler crawl <options>
```

### Deploy

1. Update `package.json` version
2. Commit and push changes
3. Build JS files in `dist/` with

   ```sh
   pnpm build
   ```

4. Initialize npm with Algolia org as scope

   ```sh
   npm init --scope=algolia
   ```

5. Follow instructions
6. Publish package with
   ```sh
   npm publish
   ```

## References

This package uses:

- [TypeScript](https://www.typescriptlang.org/)
- [Commander.js](https://github.com/tj/commander.js)
- [Playwright](https://playwright.dev/)
- [sitemapper](https://github.com/seantomburke/sitemapper)
