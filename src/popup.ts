import { Config, getConfig, sendTurnMessage } from "./config"

const languageSelect = document.getElementById("languageSelect") as HTMLSelectElement
const startupCheckBox = document.getElementById("startup") as HTMLInputElement

async function updateSelect({ language, startup }: Config) {
  startupCheckBox.checked = startup
  languageSelect.value = language
}

async function updateConfig(){
  const config: Config = { 
    language: languageSelect.value, 
    startup: startupCheckBox.checked
  }
  await chrome.storage.sync.set(config)
  return config
}

async function languageChange() {
  let config = await updateConfig()
}

async function startupChange() {
  let { startup } = await updateConfig()
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
  await sendTurnMessage(tab, startup)
}

async function main(){
  languageSelect.onchange = languageChange
  startupCheckBox.onchange = startupChange
  let config = await getConfig()
  updateSelect(config)
}

main()