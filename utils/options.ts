import { program } from "commander";

export type Options = {
  sitemapUrl: string;
  renderJs?: boolean;
  output?: string;
  includeVariations?: boolean;
  exitOnDetection?: boolean;
  runInParallel?: boolean;
  batchSize?: string;
  browserType?: string;
};

export type SanitizedOptions = {
  sitemapUrl: string;
  renderJs: boolean;
  includeVariations: boolean;
  exitOnDetection: boolean;
  runInParallel: boolean;
  browserType: BrowserType;
  output?: string;
  batchSize?: number;
};

export type BrowserType = "firefox" | "chromium" | "webkit";

const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const validateOptions = ({
  sitemapUrl,
  runInParallel,
  batchSize,
  browserType,
}: Options) => {
  if (!isValidUrl) {
    program.error(`'${sitemapUrl}' is not a correct URL`);
  }
  if (!runInParallel && batchSize !== undefined) {
    program.error(
      `--batch-size can't be set if --run-in-parallel is set to false`
    );
  }
  if (batchSize && Number.isNaN(Number(batchSize))) {
    program.error(`--batch-size can only be a number`);
  }
  if (browserType && !["firefox", "chromium", "webkit"].includes(browserType)) {
    program.error(`--browser-type must be 'firefox', 'chromium' or 'webkit'`);
  }
};

export const sanitizeOptions: (options: Options) => SanitizedOptions = ({
  sitemapUrl,
  renderJs,
  output,
  includeVariations,
  exitOnDetection,
  runInParallel,
  batchSize,
  browserType,
}: Options) => ({
  sitemapUrl,
  output,
  renderJs: Boolean(renderJs),
  includeVariations: Boolean(includeVariations),
  exitOnDetection: Boolean(exitOnDetection),
  runInParallel: Boolean(runInParallel),
  batchSize: batchSize === undefined ? undefined : Number(batchSize),
  browserType: (browserType || "firefox") as BrowserType,
});
