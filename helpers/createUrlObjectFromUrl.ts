import type { UrlObject } from "../types";
import createUrlObjectFromPath from "./createUrlObjectFromPath";
import insertObjectFromPath from "./insertObjectFromPath";

const createUrlObjectFromUrl = (urls: string[]) => {
  let urlObject: UrlObject = {};

  for (const fullUrl of urls) {
    const { pathname } = new URL(fullUrl);
    const paths = pathname.split("/").filter((rawPath) => Boolean(rawPath));

    let urlObjectTracker = urlObject;
    let objectToInsert: UrlObject | null = null;
    let knownPath: string[] = [];

    for (const [index, currentPath] of paths.entries()) {
      // Path already exist, keep track of the paths
      if (urlObjectTracker[currentPath]) {
        knownPath = [...knownPath, currentPath];
        urlObjectTracker = urlObjectTracker[currentPath];
        continue;
      }
      // Unknown path, create the object to insert from there
      objectToInsert = createUrlObjectFromPath(paths.slice(index));
      break;
    }

    if (objectToInsert === null) {
      continue;
    }

    if (knownPath.length > 0) {
      insertObjectFromPath(urlObject, knownPath, objectToInsert);
    } else {
      urlObject = { ...urlObject, ...objectToInsert };
    }
  }

  return urlObject;
};

export default createUrlObjectFromUrl;
