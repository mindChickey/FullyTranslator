
import { TranslateResultT } from "./types"

export async function detectLanguage(text: string) {
  let LanguageDetector = (window as any).LanguageDetector
  if (!LanguageDetector) return null

  let availability = await LanguageDetector.availability()
  if (availability === 'no') return null

  let detector = await LanguageDetector.create()
  let results = await detector.detect(text)

  return results?.[0]?.detectedLanguage || null
}

async function translateText(srcLang: string, targetLang: string, text: string) {
  let Translator = (window as any).Translator
  if (!Translator) throw new Error('Translator API not available')

  let translator = await Translator.create({ sourceLanguage: srcLang, targetLanguage: targetLang })
  if (translator.ready) await translator.ready
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