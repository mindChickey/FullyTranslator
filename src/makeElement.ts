
// @ts-ignore
import styleContent from "./style.css" with { type: "text" }
import { TranslateResultT } from "./types"
import { getTargetLangage } from "./config"
import { cacheTranslate } from "./cacheTranslate"

export let elementMap = new Map<Element, Element>()

function makeSuccElement(translateResult: TranslateResultT): Element {
  let { targetLines, isCache } = translateResult
  let element1 = document.createElement("translate-text")
  
  element1.textContent = targetLines.join("\n")
  if(isCache) element1.classList.add("cache")
  return element1
}

function makeErrorElement(element: Element, translateResult: TranslateResultT) {
  let element1 = document.createElement("translate-fail")
  element1.textContent = "Translate Failed ↻"
  element1.onclick = async () => {
    let { srcText, srcLang } = translateResult
    let targetLang = await getTargetLangage()

    let translateResult1 = await cacheTranslate(srcLang, targetLang, srcText)
    let { succ, targetLines } = translateResult1
    if(succ){
      let element2 = makeSuccElement(translateResult1)
      elementMap.set(element, element2)
      element1.replaceWith(element2)
    }
  }
  return element1
}

export function makeElement(element: Element, translateResult: TranslateResultT){
  let { succ, targetLines } = translateResult
  if(succ){
    return makeSuccElement(translateResult)
  } else {
    return makeErrorElement(element, translateResult)
  }
}

export function initStyleElement(){
  let style = document.createElement("style")
  style.textContent = styleContent
  document.head.appendChild(style)
}