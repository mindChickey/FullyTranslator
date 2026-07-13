import { RuleMapT } from "./types"

export const defaultRuleMap: RuleMapT = {
  "www.reddit.com": [
    { pattern: "/r/*", selectors: ["p", "h1", 'a[slot="title"]'] },
    { pattern: "/user/*", selectors: ["p", "h1"] },
    { pattern: "/search/*", selectors: ['a[data-testid="post-title-text"]', "faceplate-screen-reader-content"] },
    { pattern: "*", selectors: ["p", 'a[slot="title"]'] },
  ],
}

export const commonSelectors = [
  "h1", "h2", "h3", "h4", "h5", "h6", "p",
  "li", "dt", "dd",
  "span", "a", "strong", "em", "small", "time", "bdi", "bdo",
  "th", "td", "caption"
]