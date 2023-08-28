export type Options = {
  sitemapUrl: string;
  renderJs?: boolean;
  output?: string;
  includeVariations?: boolean;
};

const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const validateOptions = ({ sitemapUrl }: Options) => {
  if (!isValidUrl) {
    throw new Error(`error: '${sitemapUrl}' is not a correct URL`);
  }
};

export default validateOptions;
