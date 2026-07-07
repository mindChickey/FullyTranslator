import { matchURL } from "./matchURL"
import { startMultiObserve } from "./observe"

function translate(text: string): Promise<string> {
  return new Promise((resolve) =>
    chrome.runtime.sendMessage({ kind: 'translate', text }, resolve)
  )
}

async function translateAndPush(element: Element): Promise<void> {
  const text = element.textContent || ''
  const translated = await translate(text)
  const clone = element.cloneNode(true) as HTMLElement
  clone.textContent = translated
  clone.style.backgroundColor = "#e2f0d9"
  element.insertAdjacentElement("afterend", clone)
}

// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
// })


function executeBestRule(url: string): void {
  let matched = matchURL(url)
  if (matched) {
    for (const s of matched.selectors) {
      const elements = document.querySelectorAll(s)
      elements.forEach(translateAndPush)
    }
    startMultiObserve(matched.selectors, translateAndPush)
  }
}

document.addEventListener('DOMContentLoaded', () => {
  executeBestRule(window.location.href)
})