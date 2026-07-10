import { TranslateResultT } from "./types"

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

function makeErrorElement() {
  let element1 = document.createElement("div")
  element1.style.backgroundColor = "#f1dada"
  element1.style.color = "#ef0505"
  element1.style.display = "inline-block"
  element1.style.padding = "2px 8px"
  element1.style.borderRadius = "12px"
  element1.style.fontSize = "12px"
  return element1
}

export function makeElement(element: Element, { succ, text }: TranslateResultT){
  let element1 = succ ? cloneElement(element) : makeErrorElement()
  element1.textContent = text
  return element1
}

export function shouldTranslate(srcLang: any, targetLang: any, srcText: string){
  if(typeof(srcLang) === 'string' && srcLang.length > 0){
    if(typeof(targetLang) === 'string' && targetLang.length > 0){
      if(srcLang.split("-")[0] !== targetLang.split("-")[0]){
        return srcText.trim().length > 0
      }
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