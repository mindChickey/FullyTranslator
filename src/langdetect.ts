
async function makeLanguageDetector(){
  let LanguageDetector = (window as any).LanguageDetector
  if (!LanguageDetector) return null

  let availability = await LanguageDetector.availability()
  if (availability === 'no') return null

  return await LanguageDetector.create()
}

let langDetector: any = null

export async function initLanguageDetector(){
  langDetector = await makeLanguageDetector()
}

export async function detectLanguage(text: string) {
  let results = await langDetector.detect(text)
  return results?.[0]?.detectedLanguage || 'en'
}