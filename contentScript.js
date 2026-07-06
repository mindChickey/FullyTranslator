
function translate(text) {
  return new Promise((resolve, reject) =>
    chrome.runtime.sendMessage({kind:'translate', text}, resolve)
  )
}

async function translateAndPush(element) {
  let text = element.textContent
  let translated = await translate(text)
  let clone = element.cloneNode(true)
  clone.textContent = translated
  clone.style.backgroundColor = "#e2f0d9"
  element.insertAdjacentElement("afterend", clone)
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
 // let elements = document.querySelectorAll("p")
 // elements.forEach(translateAndPush)
})

/////////////////////////////
function matchAnySelector(node, selectors) {
  const isMatch = selectors.some((s) => node.matches?.(s));
  const current = isMatch ? [node] : [];
  const children = selectors.flatMap((s) => Array.from(node.querySelectorAll?.(s) || []));
  return [...current, ...children];
}

function extractBySelectors(mutations, selectors) {
  return mutations
    .flatMap((m) => Array.from(m.addedNodes))
    .filter((node) => node.nodeType === 1)
    .flatMap((node) => matchAnySelector(node, selectors));
}

function startMultiObserve(selectors, callback) {
  const observer = new MutationObserver((mutations) => {
    const targets = extractBySelectors(mutations, selectors);
    targets.forEach(callback);
  });
  observer.observe(document.body, { childList: true, subtree: true });
  return observer;
}

const rules = [
  { pattern: "https://www.reddit.com/r/*", selectors: ["p", "h1"] },
  { pattern: "https://www.reddit.com/*", selectors: ["a[slot=\"title\"]"] },
  { pattern: "https://lldb.llvm.org/*", selectors: ["p", "h1"] },
  { pattern: "https://medium.com*", selectors: ["h2", "h3"] },
  { pattern: "https://www.infoq.cn*", selectors: ["span"] },
]

function matchRegExp(url, rule) {
  let escaped = rule.pattern.replace(/[.+^${}()|[\]\\]/g, "\\$&")
  let re = new RegExp(`^${escaped.replace(/\*/g, ".*")}$`)
  let r = re.test(url)
  console.log(url, rule, r)
  return r
}

function executeBestRule(url, ruleList) {
  const matched = ruleList.find((rule) => matchRegExp(url, rule))
  console.log("matched", matched)
  if (matched) {
    for(let s of matched.selectors){
      let elements = document.querySelectorAll(s)
      console.log("xxxxxxxxxx", elements.length)
      elements.forEach(translateAndPush)
    }
    const observer = startMultiObserve(matched.selectors, translateAndPush);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  executeBestRule(window.location.href, rules)
})
