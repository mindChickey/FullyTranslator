
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

async function translateText(srcLang: string, targetLang: string, text: string) {
  let translator = await getTranslator(srcLang, targetLang)
  return await translator.translate(text)
}

export async function translate(srcLang: string, targetLang: string, text: string): Promise<TranslateResultT> {
  try {
    let r = await translateText(srcLang, targetLang, text)
    return { succ: true, text: r }
  } catch(err){
    let msg = `FullyTranslator: srcLang: ${srcLang}, targetLang: ${targetLang}, text: ${text}`
    console.log(msg, err)
    return { succ: false, text: "Translate failed" }
  }
}