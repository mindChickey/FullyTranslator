
import { TranslateResultT } from "./types"
import { translate } from "./utils"

// @ts-ignore
import styleContent from "./style.css" with { type: "text" };

function makeSuccElement(targetText: string): Element {
  let element1 = document.createElement("translate-text")
  element1.textContent = targetText
  return element1
}

function makeErrorElement(element: Element, translateResult: TranslateResultT) {
  let { srcLang, targetLang, srcText, targetText } = translateResult

  let element1 = document.createElement("translate-fail")
  element1.textContent = targetText + " ↻"
  element1.onclick = async () => {
    let translateResult1 = await translate(srcLang, targetLang, srcText)
    let element2 = makeElement(element, translateResult1)
    element1.replaceWith(element2)
  }
  return element1
}

export function makeElement(element: Element, translateResult: TranslateResultT){
  let { succ, targetText } = translateResult
  if(succ){
    return makeSuccElement(targetText)
  } else {
    return makeErrorElement(element, translateResult)
  }
}

export function initStyleElement(){
  let style = document.createElement("style")
  style.textContent = styleContent
  document.head.appendChild(style)
}