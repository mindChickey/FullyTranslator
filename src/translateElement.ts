import { getTargetLangage } from "./config"
import { elementMap, makeElement } from "./makeElement"
import { detectLanguage, shouldTranslate, translate } from "./utils"

async function translateAndPush(element: Element, srcLang: any, targetLang: string, srcText: string) {
  if (shouldTranslate(srcLang, targetLang)) {
    let translateResult = await translate(targetLang, srcText)
    let element1 = makeElement(element, translateResult)
    elementMap.set(element, element1)
    element.appendChild(element1)
  }
}

async function handleElement(element: Element) {
  let srcText = element instanceof HTMLElement ? element.innerText : element.textContent
  if(typeof srcText !== 'string') return
  if(srcText.trim().length === 0) return

  let srcLang = await detectLanguage(srcText)
  let targetLang = await getTargetLangage()

  await translateAndPush(element, srcLang, targetLang, srcText)
}

export async function translateElement(element: Element): Promise<void> {
  try {
    if(!elementMap.has(element)) {
      await handleElement(element)
    }
  } catch(err){
    console.log("translateElement:", err)
  }
}

export function clearAll(){
  for (const el of elementMap.values()) {
    el.remove()
  }
  elementMap.clear()
}