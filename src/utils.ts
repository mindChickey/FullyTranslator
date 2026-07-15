import { TranslateResultT } from "./types"

export function translate(targetLang: string, text: string): Promise<TranslateResultT> {
  return new Promise((resolve) =>
    chrome.runtime.sendMessage({ kind: 'translate', targetLang, text }, resolve)
  )
}

export async function detectLanguage(text: string) {
  let result = await chrome.i18n.detectLanguage(text)
  if (!result || !result.isReliable || result.languages.length === 0) {
    return ""
  } else {
    const topLang = result.languages[0]
    return topLang.percentage > 50 ? topLang.language : ""
  }
}

export function shouldTranslate(srcLang: any, targetLang: any){
  if(typeof(srcLang) === 'string' && srcLang.length > 0){
    if(typeof(targetLang) === 'string' && targetLang.length > 0){
      return srcLang.split("-")[0] !== targetLang.split("-")[0]
    }
  }
  return true
}

export function getHost(url: string | undefined){
  if(url){
    let url1 = new URL(url)
    return url1.host
  } else {
    return ""
  }
}