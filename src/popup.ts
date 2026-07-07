import { Config, defaultLanguage, getConfig, sendTurnMessage } from "./config"
import { LangItem, languages } from "./language"

const translatorSelect = document.getElementById("translatorSelect") as HTMLSelectElement
const languageSelect = document.getElementById("languageSelect") as HTMLSelectElement
const startupCheckBox = document.getElementById("startup") as HTMLInputElement

function createOption(item: LangItem): HTMLOptionElement {
  const option = document.createElement('option')
  option.value = item.value
  option.textContent = item.name
  return option
}

async function updateSelect({ translator, language, startup }: Config) {
  startupCheckBox.checked = startup
  translatorSelect.value = translator
  const items = languages[translator] || []
  const children = items.map(createOption)
  const hasLanguage = items.some(item => item.value === language)
  
  languageSelect.replaceChildren(...children)
  if (hasLanguage) {
    languageSelect.value = language
  } else {
    languageSelect.value = defaultLanguage
    await chrome.storage.sync.set({ translator, language: defaultLanguage, startup })
  }
}

async function updateConfig(){
  const config: Config = { 
    translator: translatorSelect.value, 
    language: languageSelect.value, 
    startup: startupCheckBox.checked
  }
  await chrome.storage.sync.set(config)
  return config
}

async function translatorChange() {
  let config = await updateConfig()
  updateSelect(config)
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
  translatorSelect.onchange = translatorChange
  let config = await getConfig()
  updateSelect(config)
}

main()