import { LangItem, languages } from "./language"

export type Config = {
  translator: string
  language: string
}

export const defaultLanguage = 'en'
export const defaultConfig: Config = { translator: 'google', language: defaultLanguage }

export function getConfig(callback: (config: Config) => void){
  chrome.storage.sync.get(defaultConfig, callback)
}
