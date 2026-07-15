import { getRuleMap, getOpen } from "./config"
import { commonSelectors } from "./defaultRuleMap"
import { initStyleElement } from "./makeElement"
import { matchURL } from "./matchURL"
import { newMultiObserve, startMultiObserve } from "./observe"
import { clearAll, translateElement } from "./translateElement"
import { getHost } from "./utils"

let observer: MutationObserver | null = null

function make_walk(selectors: string[]) {
  function walk(el: Element) {
    if (selectors.some(s => el.matches(s))) {
      translateElement(el)
    } else {
      Array.from(el.children).forEach(walk)
    }
  }
  return walk
}

function startTranslate(walk: (el: Element) => void) {
  walk(document.body)
  observer = newMultiObserve(walk)
  startMultiObserve(observer)
}

async function getSelectors(){
  let url = window.location.href
  let ruleMap = await getRuleMap()
  let matched = matchURL(ruleMap, url)
  return matched ? matched.selectors : commonSelectors
}

async function openTranslate(){
  initStyleElement()

  let selectors = await getSelectors()
  let walk = make_walk(selectors)
  startTranslate(walk)
}

function closeTranslate(){
  if(observer){
    observer.disconnect()
  }
  clearAll()
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.kind === "open") {
    openTranslate()
  } else if (message.kind === "close") {
    closeTranslate()
  }
})

document.addEventListener('DOMContentLoaded', async () => {
  let url = window.location.href
  let host = getHost(url)
  let open = await getOpen(host)
  if(open){
    openTranslate()
  }
})