
type Rule = {
  pattern: string
  selectors: string[]
}

export type RuleMap = {[domain: string]: Rule[]}

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