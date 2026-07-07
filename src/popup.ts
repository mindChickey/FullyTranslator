import { Config, defaultLanguage, getConfig } from "./config"
import { LangItem, languages } from "./language"

const translatorSelect = document.getElementById("translatorSelect") as HTMLSelectElement
const languageSelect = document.getElementById("languageSelect") as HTMLSelectElement
const translateButton = document.getElementById("translateButton") as HTMLButtonElement

function createOption(item: LangItem): HTMLOptionElement {
  const option = document.createElement('option')
  option.value = item.value
  option.textContent = item.name
  return option
}

function updateSelect({ translator, language }: Config): void {
  translatorSelect.value = translator
  const items = languages[translator] || []
  const children = items.map(createOption)
  const hasLanguage = items.some(item => item.value === language)
  
  languageSelect.replaceChildren(...children)
  if (hasLanguage) {
    languageSelect.value = language
  } else {
    languageSelect.value = defaultLanguage
    chrome.storage.sync.set({ translator, language: defaultLanguage })
  }
}

getConfig(updateSelect)

translatorSelect.onchange = () => {
  const config = { translator: translatorSelect.value, language: languageSelect.value }
  chrome.storage.sync.set(config)
  updateSelect(config)
}

languageSelect.onchange = () => {
  const config = { translator: translatorSelect.value, language: languageSelect.value }
  chrome.storage.sync.set(config)
}