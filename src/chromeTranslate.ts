
import { TranslateResultT } from "./types"

async function makeTranslator(sourceLanguage: string, targetLanguage: string){
  let Translator = (window as any).Translator
  if (!Translator) throw new Error('Translator API not available')

  let translator = await Translator.create({ sourceLanguage, targetLanguage })
  if (translator.ready) await translator.ready
  return translator
}

let translatorMap: {[key: string]: any} = {}

async function getTranslator(sourceLanguage: string, targetLanguage: string){
  let key = `${sourceLanguage} ${targetLanguage}`
  let translator = translatorMap[key]
  if(translator){
    return translator
  } else {
    let t1 = await makeTranslator(sourceLanguage, targetLanguage)
    translatorMap[key] = t1
    return t1
  }
}

function splitSentences(text: string): string[] {
  if (!text) return []
  const separator = /(?<=[。！？!?…]|\.\s+|\n+)\s*/

  let text0 = text.split(separator)
  let text1 = text0.map(s => s.trim())
  let text2 = text1.filter(s => s.length > 0)
  return text2
}

async function translateText(srcLang: string, targetLang: string, text: string) {
  let srcLang1 = srcLang ? srcLang : "en"
  let translator = await getTranslator(srcLang1, targetLang)
  let text1 = await translator.translate(text)
  return splitSentences(text1)
}

export async function chromeTranslate(srcLang: string, targetLang: string, text: string): Promise<TranslateResultT> {
  try {
    let r = await translateText(srcLang, targetLang, text)
    return { succ: true, srcLang, srcText: text, targetLines: r }
  } catch(err: any){
    let msg = `FullyTranslator: srcLang: ${srcLang}, targetLang: ${targetLang}, text: ${text}`
    console.log(msg, err)
    return { succ: false, srcLang, srcText: text, targetLines: [err.toString()]}
  }
}
