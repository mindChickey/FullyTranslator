import { RuleMapT } from "./types"

export const defaultRuleMap: RuleMapT = {
  "www.reddit.com": [
    { pattern: "/r/*", selectors: ["p", "h1", 'a[slot="title"]', 'a.absolute'] },
    { pattern: "/user/*", selectors: [
      'a[slot="title"]',
      "div.text-neutral-content-strong.overflow-hidden",
      "div.md.feed-card-text-preview.text-ellipsis",
      "a.text-neutral-content-strong.font-normal.a"
    ] },
    { pattern: "/search/*", selectors: ['a[data-testid="post-title-text"]', "faceplate-screen-reader-content"] },
    { pattern: "/r/*/search/*", selectors: ['a[data-testid="post-title-text"]', "faceplate-screen-reader-content"] },
    { pattern: "/notifications*", selectors: [".line-clamp-2"] },
    { pattern: "*", selectors: ["p", 'a[slot="title"]'] },
  ],
  "news.ycombinator.com": [
    { pattern: "/", selectors: ["td.title"] },
    { pattern: "/news", selectors: ["td.title"] },
    { pattern: "/newest", selectors: ["td.title"] },
    { pattern: "/front", selectors: ["td.title"] },
    { pattern: "/ask", selectors: ["td.title"] },
    { pattern: "/show", selectors: ["td.title"] },
    { pattern: "/jobs", selectors: ["td.title"] },
    { pattern: "/newcomments", selectors: ["div.comment"] }
  ]
}

export const commonSelectors = [
  "h1", "h2", "h3", "h4", "h5", "h6", "p",
  "li", "dt", "dd",
  "span", "a", "strong", "em", "small", "time", "bdi", "bdo",
  "th", "td", "caption"
]