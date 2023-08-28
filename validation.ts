import { METHODS } from "./src/services/crawler";
import type { Method } from "./src/services/crawler";

export type Options = {
  sitemapUrl: string;
  method?: string;
  output?: string;
  full?: boolean;
};

const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const validateOptions = ({ sitemapUrl, method, full }: Options) => {
  if (!isValidUrl) {
    throw new Error(`error: '${sitemapUrl}' is not a correct URL`);
  }
  if (method && !METHODS.includes(method as Method)) {
    throw new Error(
      "error: method option can only be 'status-code' or 'js-rendering'"
    );
  }
};

export default validateOptions;
