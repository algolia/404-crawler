import type { UrlObject } from "../types";

const createUrlObjectFromPath = (paths: string[]) =>
  paths.reduceRight<UrlObject>((acc, path) => ({ [path]: acc }), {});

export default createUrlObjectFromPath;
