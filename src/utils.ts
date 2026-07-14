import { TranslateResultT } from "./types"

export function translate(srcLang: string, targetLang: string, text: string): Promise<TranslateResultT> {
  return new Promise((resolve) =>
    chrome.runtime.sendMessage({ kind: 'translate', srcLang, targetLang, text }, resolve)
  )
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