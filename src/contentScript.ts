import { Config, getConfig } from "./config"
import { matchURL } from "./matchURL"
import { newMultiObserve, startMultiObserve } from "./observe"
import { cloneElement } from "./utils"

function translate(text: string): Promise<string> {
  return new Promise((resolve) =>
    chrome.runtime.sendMessage({ kind: 'translate', text }, resolve)
  )
}

let elementMap = new Map<Element, Element>()
let revElementMap = new Map<Element, Element>()
let observer: MutationObserver | null = null
let selectors: string[] = []

async function translateAndPush(element: Element): Promise<void> {
  if(!elementMap.has(element) && !revElementMap.has(element)) {
    let translated = await translate(element.textContent)
    let element1 = cloneElement(element)
    element1.textContent = translated
    elementMap.set(element, element1)
    revElementMap.set(element1, element)
    element.insertAdjacentElement("afterend", element1)
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
 
    let { startup } = await getConfig()
    if(startup){
      openTranslate()
    }
  }
})