import { expect, test } from "vitest";
import createUrlObjectFromUrl from "./createUrlObjectFromUrl";

const sites = [
  "https://www.algolia.com/doc-beta/framework-integration/django/commands",
  "https://www.algolia.com/doc-beta/framework-integration/django/faq",
  "https://www.algolia.com/doc-beta/framework-integration/django/geo-search",
  "https://www.algolia.com/doc-beta/framework-integration/django/options",
  "https://www.algolia.com/doc-beta/framework-integration/django/search",
  "https://www.algolia.com/doc-beta/framework-integration/django/setup",
  "https://www.algolia.com/doc-beta/framework-integration/django/tags",
  "https://www.algolia.com/doc-beta/framework-integration/django/tests",
];

test("Should get the longest URL from this domain", () => {
  expect(createUrlObjectFromUrl(sites)).toStrictEqual({
    "doc-beta": {
      "framework-integration": {
        django: {
          commands: {},
          faq: {},
          "geo-search": {},
          options: {},
          search: {},
          setup: {},
          tags: {},
          tests: {},
        },
      },
    },
  });
});
