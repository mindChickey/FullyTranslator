import { getOpen, getTargetLangage, setHostOpen } from "./config"
import { sendTurnMessage } from "./sendMessage"
import { getHost } from "./utils"

const languageSelect = document.getElementById("languageSelect") as HTMLSelectElement
const openCheckBox = document.getElementById("openCheckBox") as HTMLInputElement
const hostIndicator = document.getElementById("hostIndicator") as HTMLDivElement

async function languageChange() {
  let config = { language: languageSelect.value }
  await chrome.storage.local.set(config)
}

function openChange(tab: chrome.tabs.Tab, host: string) {
  return async function(){
    let open = openCheckBox.checked
    await sendTurnMessage(tab, open)
    await setHostOpen(host, open)
  }
}

async function main(){
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
  if(!tab) return
  let host = getHost(tab.url)

  languageSelect.onchange = languageChange
  openCheckBox.onchange = openChange(tab, host)

  hostIndicator.textContent = host
  openCheckBox.checked = await getOpen(host)
  languageSelect.value = await getTargetLangage()
}

main()