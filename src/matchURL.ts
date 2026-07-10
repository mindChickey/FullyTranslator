
type Rule = {
  pattern: string
  selectors: string[]
}

export type RuleMap = {[domain: string]: Rule[]}

export const defaultRuleMap: RuleMap = {
  "www.reddit.com": [
    { pattern: "/r/*", selectors: ["p", "h1", 'a[slot="title"]'] },
    { pattern: "/user/*", selectors: ["p", "h1"] },
    { pattern: "/search/*", selectors: ['a[data-testid="post-title-text"]'] },
    { pattern: "*", selectors: ["p", 'a[slot="title"]'] },
  ]
}

let commonSelectors = [
  "h1", "h2", "h3", "h4", "h5", "h6", "p",
  "li", "dt", "dd",
  "span", "a", "strong", "em", "small", "time", "bdi", "bdo",
  "th", "td", "caption"
]

function matchRegExp(path: string, rule: Rule): boolean {
  const escaped = rule.pattern.replace(/[.+^${}()|[\]\\]/g, "\\$&")
  const re = new RegExp(`^${escaped.replace(/\*/g, ".*")}$`)
  const r = re.test(path)
  return r
}

export function matchURL(ruleMap: RuleMap, url: string){
  let url1 = new URL(url)
  let rules = ruleMap[url1.host]
  if(!rules){
    return null
  } else {
    return rules.find((rule) => matchRegExp(url1.pathname, rule))
  }
}