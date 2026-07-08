
import { TranslateResultT } from "./types"

async function translateText(text: string, sourceLanguage: string, targetLanguage: string) {
  let Translator = (window as any).Translator
  if (!Translator) throw new Error('Translator API not available')

  let translator = await Translator.create({ sourceLanguage, targetLanguage })
  if (translator.ready) await translator.ready
  return await translator.translate(text)
}

export async function translate(text: string): Promise<TranslateResultT> {
  try {
    let r = await translateText(text, "en", "zh")
    return { succ: true, text: r }
  } catch(err){
    return { succ: false, text: "Translate failed" }
  }
}