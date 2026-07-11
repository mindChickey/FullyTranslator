import { getTargetLangage } from "./config"
import { detectLanguage } from "./langdetect"
import { TranslateResultT } from "./types"
import { makeElement, shouldTranslate } from "./utils"

function translate(srcLang: string, targetLang: string, text: string): Promise<TranslateResultT> {
  return new Promise((resolve) =>
    chrome.runtime.sendMessage({ kind: 'translate', srcLang, targetLang, text }, resolve)
  )
}

let elementMap = new Map<Element, Element>()
let revElementMap = new Map<Element, Element>()

function pushNewElement(element: Element, element1: Element) {
  elementMap.set(element, element1)
  revElementMap.set(element1, element)
  element.insertAdjacentElement("afterend", element1)
}

async function handleElement(element: Element) {
  let srcText = element.textContent || ""
  if(srcText.trim().length === 0) return

  let srcLang = await detectLanguage(srcText)
  let targetLang = await getTargetLangage()

  if (shouldTranslate(srcLang, targetLang, srcText)) {
    let translateResult = await translate(srcLang, targetLang, srcText)
    let element1 = makeElement(element, translateResult)
    pushNewElement(element, element1)
  }
}

export async function translateElement(element: Element): Promise<void> {
  try {
    if(!elementMap.has(element) && !revElementMap.has(element)) {
      await handleElement(element)
    }
  } catch(err){
    console.log("translateElement:", err)
  }
}

export function clearAll(){
  for (const el of revElementMap.keys()) {
    el.remove()
  }
  elementMap.clear()
  revElementMap.clear()
}