import { matchURL } from "./matchURL"
import { startMultiObserve } from "./observe"

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

async function translateAndPush1(element: Element): Promise<Element> {
  const text = element.textContent || ''
  const translated = await translate(text)
  const clone = element.cloneNode(true) as HTMLElement
  
  clone.removeAttribute('id')
  copyAllStyles(element, clone)
  
  clone.textContent = translated
  clone.style.backgroundColor = "#e2f0d9"
  element.insertAdjacentElement("afterend", clone)
  return clone
} 

let elementMap = new WeakMap<Element, Element>();

async function translateAndPush(element: Element): Promise<void> {
  if(!elementMap.has(element)) {
    let element1 = await translateAndPush1(element)
    elementMap.set(element, element1);
  }
}

// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
// })


function executeBestRule(url: string): void {
  let matched = matchURL(url)
  if (matched) {
    let { selectors } = matched
    for (const s of selectors) {
      const elements = document.querySelectorAll(s)
      elements.forEach(translateAndPush)
    }
    startMultiObserve(selectors, translateAndPush)
  }
}

document.addEventListener('DOMContentLoaded', () => {
  executeBestRule(window.location.href)
})