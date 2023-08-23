import { expect, test } from "vitest";
import { insertObjectFromPath } from "./insertObjectFromPath";

test.each([
  [
    {
      "doc-beta": {},
    },
    ["doc-beta"],
    { framework: {} },
    {
      "doc-beta": {
        framework: {},
      },
    },
  ],
  [
    {
      "doc-beta": { framework: {} },
    },
    ["doc-beta", "framework"],
    { faq: {} },
    {
      "doc-beta": {
        framework: { faq: {} },
      },
    },
  ],
  [
    {
      "doc-beta": { framework: { faq: {} } },
    },
    ["doc-beta", "framework"],
    { tags: {} },
    {
      "doc-beta": {
        framework: { faq: {}, tags: {} },
      },
    },
  ],
])(
  "Should insert in %j at the path %s the object %j",
  (existingObject, path, objectToInsert, expected) => {
    const finalObject = existingObject;
    insertObjectFromPath(finalObject, path, objectToInsert);
    expect(finalObject).toStrictEqual(expected);
  }
);
