import { TranslateResultT } from "./types"

export function translate(srcLang: string, targetLang: string, text: string): Promise<TranslateResultT> {
  return new Promise((resolve) =>
    chrome.runtime.sendMessage({ kind: 'translate', srcLang, targetLang, text }, resolve)
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

function makeErrorElement(element: Element, translateResult: TranslateResultT) {
  let element1 = document.createElement("div")
  element1.style.backgroundColor = "#f1dada"
  element1.style.color = "#ef0505"
  element1.style.display = "inline-block"
  element1.style.padding = "2px 8px"
  element1.style.borderRadius = "12px"
  element1.style.fontSize = "12px"
  element1.style.cursor = "pointer"

  element1.onclick = async () => {
    let { srcLang, targetLang, srcText } = translateResult
    let translateResult1 = await translate(srcLang, targetLang, srcText)
    let element2 = makeElement(element, translateResult1)
    element1.replaceWith(element2)
  }
  return element1
}

export function makeElement(element: Element, translateResult: TranslateResultT){
  let { succ, targetText } = translateResult
  if(succ){
    let element1 = cloneElement(element)
    element1.textContent = targetText
    return element1
  } else {
    let element1 = makeErrorElement(element, translateResult)
    element1.textContent = targetText + " ↻"
    return element1
  }
}

export function shouldTranslate(srcLang: any, targetLang: any, srcText: string){
  if(typeof(srcLang) === 'string' && srcLang.length > 0){
    if(typeof(targetLang) === 'string' && targetLang.length > 0){
      return srcLang.split("-")[0] !== targetLang.split("-")[0]
    }
  }
  return false
}

export function getHost(url: string | undefined){
  if(url){
    let url1 = new URL(url)
    return url1.host
  } else {
    return ""
  }
}