import { RuleT, RuleMapT } from "./types"

function matchRegExp(path: string, rule: RuleT): boolean {
  const escaped = rule.pattern.replace(/[.+^${}()|[\]\\]/g, "\\$&")
  const re = new RegExp(`^${escaped.replace(/\*/g, ".*")}$`)
  const r = re.test(path)
  return r
}

export function matchURL(ruleMap: RuleMapT, url: string){
  let url1 = new URL(url)
  let rules = ruleMap[url1.host]
  if(!rules){
    return null
  } else {
    return rules.find((rule) => matchRegExp(url1.pathname, rule))
  }
}