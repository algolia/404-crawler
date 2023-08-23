import { expect, test } from "vitest";
import createUrlObjectFromPath from "./createUrlObjectFromPath";

test.each([
  [[], {}],
  [
    ["doc-beta"],
    {
      "doc-beta": {},
    },
  ],
  [
    ["doc-beta", "framework-integration", "django", "faq"],
    {
      "doc-beta": {
        "framework-integration": {
          django: {
            faq: {},
          },
        },
      },
    },
  ],
])("Should create an nested object with %s as keys", (paths, expected) => {
  expect(createUrlObjectFromPath(paths)).toStrictEqual(expected);
});
