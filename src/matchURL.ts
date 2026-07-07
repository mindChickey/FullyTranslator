
interface Rule {
  pattern: string
  selectors: string[]
}

const rules: Rule[] = [
  { pattern: "https://www.reddit.com/r/*", selectors: ["p", "h1"] },
  { pattern: "https://www.reddit.com/*", selectors: ["a[slot=\"title\"]"] },
  { pattern: "https://lldb.llvm.org/*", selectors: ["p", "h1"] },
  { pattern: "https://medium.com*", selectors: ["h2", "h3"] },
  { pattern: "https://www.infoq.cn*", selectors: ["span"] },
]

function matchRegExp(url: string, rule: Rule): boolean {
  const escaped = rule.pattern.replace(/[.+^${}()|[\]\\]/g, "\\$&")
  const re = new RegExp(`^${escaped.replace(/\*/g, ".*")}$`)
  const r = re.test(url)
  return r
}

export function matchURL(url: string){
  return rules.find((rule) => matchRegExp(url, rule))
}