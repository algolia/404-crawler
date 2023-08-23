import { UrlObject } from "../types";

export const insertObjectFromPath = (
  initialObject: UrlObject,
  path: string[],
  objectToInsert: UrlObject
) => {
  let current = initialObject;
  for (const [index, key] of path.entries()) {
    // If this is the last item in the loop, assign the value
    if (index === path.length - 1) {
      current[key] = { ...current[key], ...objectToInsert };
    }
    // Otherwise, update the current place in the object
    else {
      if (!current[key]) {
        current[key] = {};
      }
      current = current[key];
    }
  }
};

export default insertObjectFromPath;
