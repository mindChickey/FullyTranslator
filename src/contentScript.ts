import { Config, getConfig } from "./config"
import { matchURL } from "./matchURL"
import { newMultiObserve, startMultiObserve } from "./observe"

function translate(text: string): Promise<string> {
  return new Promise((resolve) =>
    chrome.runtime.sendMessage({ kind: 'translate', text }, resolve)
  )
}

function copyAllStyles(source: Element, target: HTMLElement) {
  let styles = window.getComputedStyle(source)
  Array.from(styles).forEach(key => {
    target.style.setProperty(key, styles.getPropertyValue(key))
  })
}

function cloneElement(element: Element): Element {
  let element1 = element.cloneNode(true) as HTMLElement
  element1.removeAttribute('id')
  copyAllStyles(element, element1)
  element1.style.backgroundColor = "#e2f0d9"
  return element1
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