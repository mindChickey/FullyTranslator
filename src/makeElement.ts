
// @ts-ignore
import styleContent from "./style.css" with { type: "text" };
import { TranslateResultT } from "./types"
import { translate } from "./utils"

export let elementMap = new Map<Element, Element>()

function makeSuccElement(targetLines: string[]): Element {
  let element1 = document.createElement("translate-text")
  element1.textContent = targetLines.join("\n")
  return element1
}

function makeErrorElement(element: Element, translateResult: TranslateResultT) {
  let { srcLang, targetLang, srcText, targetLines } = translateResult

  let element1 = document.createElement("translate-fail")
  element1.textContent = "Translate Failed ↻"
  element1.onclick = async () => {
    let translateResult1 = await translate(srcLang, targetLang, srcText)
    let { succ, targetLines } = translateResult1
    if(succ){
      let element2 = makeSuccElement(targetLines)
      elementMap.set(element, element2)
      element1.replaceWith(element2)
    }
  }
  return element1
}

export function makeElement(element: Element, translateResult: TranslateResultT){
  let { succ, targetLines } = translateResult
  if(succ){
    return makeSuccElement(targetLines)
  } else {
    return makeErrorElement(element, translateResult)
  }
}

export function initStyleElement(){
  let style = document.createElement("style")
  style.textContent = styleContent
  document.head.appendChild(style)
}