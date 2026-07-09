import { getStartup, getTargetLangage } from "./config"
import { sendTurnMessage } from "./sendMessage"

const languageSelect = document.getElementById("languageSelect") as HTMLSelectElement
const startupCheckBox = document.getElementById("startup") as HTMLInputElement

async function languageChange() {
  let config = { language: languageSelect.value }
  await chrome.storage.local.set(config)
}

async function startupChange() {
  let startup = startupCheckBox.checked
  await chrome.storage.local.set({ startup })
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
  await sendTurnMessage(tab, startup)
}

async function main(){
  languageSelect.onchange = languageChange
  startupCheckBox.onchange = startupChange

  startupCheckBox.checked = await getStartup()
  languageSelect.value = await getTargetLangage()
}

main()