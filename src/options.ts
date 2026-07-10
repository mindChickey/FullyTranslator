
let statusDiv = document.getElementById("status") as HTMLDivElement
let saveButton = document.getElementById("save") as HTMLButtonElement
let editor = document.getElementById("editor") as HTMLTextAreaElement

function showMessage(text: string, isErr: boolean): void {
  statusDiv.textContent = text
  statusDiv.className = `msg ${isErr ? 'error' : 'success'}`
}

async function saveConfig(): Promise<void> {
  try {
    let config = JSON.parse(editor.value)
    await chrome.storage.local.set(config)
    showMessage('Configuration saved successfully.', false)
  } catch (err) {
    showMessage('Invalid JSON syntax. Please check your commas and quotes.', true)
    return Promise.reject(err)
  }
}

async function loadConfig() {
  let defaultConfig = { language: 'en', ruleMap: {}, openMap: {} }
  let config = await chrome.storage.local.get(defaultConfig)
  editor.value = JSON.stringify(config, null, 2)
}

document.addEventListener('DOMContentLoaded', () => {
  saveButton.onclick = saveConfig
  loadConfig()
})