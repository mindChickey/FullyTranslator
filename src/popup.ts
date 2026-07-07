import { Config, defaultLanguage, getConfig } from "./config"
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

function updateSelect({ translator, language, startup }: Config): void {
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
    chrome.storage.sync.set({ translator, language: defaultLanguage, startup })
  }
}

function updateConfig(){
  const config: Config = { 
    translator: translatorSelect.value, 
    language: languageSelect.value, 
    startup: startupCheckBox.checked
  }
  chrome.storage.sync.set(config)

  if(startupCheckBox.checked){
  } else {
  }
}

function translatorChangle() {
  const config: Config = { 
    translator: translatorSelect.value, 
    language: languageSelect.value, 
    startup: startupCheckBox.checked
  }
  chrome.storage.sync.set(config)
  updateSelect(config)
}

async function main(){
  languageSelect.onchange = updateConfig
  startupCheckBox.onchange = updateConfig
  translatorSelect.onchange = translatorChangle
  let config = await getConfig()
  updateSelect(config)
}

main()