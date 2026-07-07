
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

export async function sendTurnMessage(tab: chrome.tabs.Tab | undefined, startup: boolean){
  if (tab?.id) {
    let kind = startup ? "open" : "close"
    await chrome.tabs.sendMessage(tab.id, { kind })
  }
}

export async function reverseStartup(tab: chrome.tabs.Tab | undefined){
  let { translator, language, startup } = await getConfig()
  let newStartup = !startup
  let config1 = { translator, language, startup: newStartup }
  await chrome.storage.sync.set(config1)
  await sendTurnMessage(tab, newStartup)
}