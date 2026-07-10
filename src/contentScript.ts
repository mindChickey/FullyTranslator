import { getRuleMap, getStartup, getTargetLangage } from "./config"
import { detectLanguage, initLanguageDetector } from "./langdetect"
import { matchURL } from "./matchURL"
import { newMultiObserve, startMultiObserve } from "./observe"
import { TranslateResultT } from "./types"
import { makeElement, shouldTranslate } from "./utils"

function translate(srcLang: string, targetLang: string, text: string): Promise<TranslateResultT> {
  return new Promise((resolve) =>
    chrome.runtime.sendMessage({ kind: 'translate', srcLang, targetLang, text }, resolve)
  )
}

let elementMap = new Map<Element, Element>()
let revElementMap = new Map<Element, Element>()
let observer: MutationObserver | null = null

function pushNewElement(element: Element, element1: Element) {
  elementMap.set(element, element1)
  revElementMap.set(element1, element)
  element.insertAdjacentElement("afterend", element1)
}

async function handleElement(element: Element) {
  let srcText = element.textContent
  let srcLang = await detectLanguage(srcText)
  let targetLang = await getTargetLangage()

  if (shouldTranslate(srcLang, targetLang, srcText)) {
    let translateResult = await translate(srcLang, targetLang, srcText)
    let element1 = makeElement(element, translateResult)
    pushNewElement(element, element1)
  }
}

async function translateAndPush(element: Element): Promise<void> {
  try {
    if(!elementMap.has(element) && !revElementMap.has(element)) {
      await handleElement(element)
    }
  } catch(err){
    console.log("qqqqqqqqqqqqq", err)
  }
}

// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
// })

function startTranslate(selectors: string[]){
  for (const s of selectors) {
    const elements = document.querySelectorAll(s)
    elements.forEach(translateAndPush)
  }
  if(observer){
    startMultiObserve(observer)
  }
}

async function openTranslate(){
  let url = window.location.href
  let ruleMap = await getRuleMap()
  let matched = matchURL(ruleMap, url)
  if (matched) {
    let selectors = matched.selectors
    observer = newMultiObserve(selectors, translateAndPush)
    await initLanguageDetector()
    startTranslate(selectors)
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
  let startup = await getStartup()
  if(startup){
    openTranslate()
  }
})