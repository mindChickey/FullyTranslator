import { Config, getConfig } from "./config"
import { detectLanguage, initLanguageDetector } from "./langdetect"
import { matchURL } from "./matchURL"
import { newMultiObserve, startMultiObserve } from "./observe"
import { translate } from "./translate"
import { TranslateResultT } from "./types"
import { makeElement } from "./utils"

let elementMap = new Map<Element, Element>()
let revElementMap = new Map<Element, Element>()
let observer: MutationObserver | null = null
let selectors: string[] = []

function pushNewElement(element: Element, translateResult: TranslateResultT) {
  let element1 = makeElement(element, translateResult)
  elementMap.set(element, element1)
  revElementMap.set(element1, element)
  element.insertAdjacentElement("afterend", element1)
}

async function translateAndPush(element: Element): Promise<void> {
  try {
    if(!elementMap.has(element) && !revElementMap.has(element)) {
      let srcText = element.textContent
      let srcLang = await detectLanguage(srcText)
      let { language } = await getConfig()
      if(srcLang !== language){
        let translateResult = await translate(srcLang, language, srcText)
        pushNewElement(element, translateResult)
      }
    }
  } catch(err){
    console.log("qqqqqqqqqqqqq", err)
  }
}

// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
// })

function openTranslate() {
  for (const s of selectors) {
    const elements = document.querySelectorAll(s)
    elements.forEach(translateAndPush)
  }
  if(observer){
    startMultiObserve(observer)
  }
}

function closeTranslate(){
  if(observer){
    observer.disconnect()
  }
  for (const el of revElementMap.keys()) {
    el.remove()
  }
  elementMap.clear()
  revElementMap.clear()
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
  let matched = matchURL(url)
  if (matched) {
    selectors = matched.selectors
    observer = newMultiObserve(selectors, translateAndPush)
    await initLanguageDetector()
 
    let { startup } = await getConfig()
    if(startup){
      openTranslate()
    }
  }
})