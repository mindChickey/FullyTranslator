

export async function sendTurnMessage(tab: chrome.tabs.Tab | undefined, startup: boolean){
  try {
    if (tab?.id) {
      let kind = startup ? "open" : "close"
      await chrome.tabs.sendMessage(tab.id, { kind })
    }
  } catch(err){
  }
}