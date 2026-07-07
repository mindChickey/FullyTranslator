
export type Config = {
  translator: string
  language: string
  startup: boolean
}

export const defaultLanguage = 'en'
export const defaultConfig: Config = { translator: 'google', language: defaultLanguage, startup: true }

export function getConfig(callback: (config: Config) => void){
  chrome.storage.sync.get(defaultConfig, callback)
}
