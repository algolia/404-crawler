import { program } from "commander";

export type Options = {
  sitemapUrl: string;
  renderJs?: boolean;
  output?: string;
  includeVariations?: boolean;
  exitOnDetection?: boolean;
  runInParallel?: boolean;
  batchSize?: string;
};

export type SanitizedOptions = {
  sitemapUrl: string;
  renderJs: boolean;
  includeVariations: boolean;
  exitOnDetection: boolean;
  runInParallel: boolean;
  output?: string;
  batchSize?: number;
};

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
}: Options) => {
  if (!isValidUrl) {
    program.error(`'${sitemapUrl}' is not a correct URL`);
  }
  if (!runInParallel && batchSize !== undefined) {
    program.error(
      `--batch-size can't be set if --run-in-parallel is set to false`
    );
  }
  if (Number.isNaN(Number(batchSize))) {
    program.error(`--batch-size can only be a number`);
  }
};

export const sanitizeOptions = ({
  sitemapUrl,
  renderJs,
  output,
  includeVariations,
  exitOnDetection,
  runInParallel,
  batchSize,
}: Options) => ({
  sitemapUrl,
  output,
  renderJs: Boolean(renderJs),
  includeVariations: Boolean(includeVariations),
  exitOnDetection: Boolean(exitOnDetection),
  runInParallel: Boolean(runInParallel),
  batchSize: batchSize === undefined ? undefined : Number(batchSize),
});
