
let statusDiv = document.getElementById("status") as HTMLDivElement
let saveButton = document.getElementById("save") as HTMLButtonElement
let editor = document.getElementById("editor") as HTMLTextAreaElement

/*
function showMessage(text: string, isErr: boolean): void {
  statusDiv.textContent = text
  statusDiv.className = `msg ${isErr ? 'error' : 'success'}`
}

function saveConfig(rawText: string): Promise<void> {
  try {
    let parsed = JSON.parse(rawText)
    return chrome.storage.local.set({ config: parsed })
      .then(() => showMessage('Configuration saved successfully.', false))
  } catch (err) {
    showMessage('Invalid JSON syntax. Please check your commas and quotes.', true)
    return Promise.reject(err)
  }
}

function loadConfig() {
  chrome.storage.local.get(['config'])
    .then(data => data.config || { version: "1.0", settings: {} })
    .then(obj => {
      editor.value = JSON.stringify(obj, null, 2)
    })
}

document.addEventListener('DOMContentLoaded', () => {
  loadConfig()
  saveButton.addEventListener('click', () => 
    saveConfig(editor.value).catch(() => {})
  )
})
*/