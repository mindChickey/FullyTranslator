
export type Config = {
  translator: string
  language: string
  startup: boolean
}

export const defaultLanguage = 'en'
export const defaultConfig: Config = { translator: 'google', language: defaultLanguage, startup: true }

export async function getConfig(){
  return chrome.storage.sync.get<Config>(defaultConfig)
}
