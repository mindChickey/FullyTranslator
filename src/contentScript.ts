import { getRuleMap, getOpen } from "./config"
import { commonSelectors } from "./defaultRuleMap"
import { initLanguageDetector } from "./langdetect"
import { matchURL } from "./matchURL"
import { newMultiObserve, startMultiObserve } from "./observe"
import { clearAll, translateElement } from "./translateElement"
import { getHost } from "./utils"

let observer: MutationObserver | null = null

function startTranslate(selectors: string[]){
  for (const s of selectors) {
    const elements = document.querySelectorAll(s)
    elements.forEach(translateElement)
  }
  if(observer){
    startMultiObserve(observer)
  }
}

async function getSelectors(){
  let url = window.location.href
  let ruleMap = await getRuleMap()
  let matched = matchURL(ruleMap, url)
  return matched ? matched.selectors : commonSelectors
}

async function openTranslate(){
  let selectors = await getSelectors()
  observer = newMultiObserve(selectors, translateElement)
  await initLanguageDetector()
  startTranslate(selectors)
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