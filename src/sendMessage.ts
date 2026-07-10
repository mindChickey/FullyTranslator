

export async function sendTurnMessage(tab: chrome.tabs.Tab | undefined, open: boolean){
  try {
    if (tab?.id) {
      let kind = open ? "open" : "close"
      await chrome.tabs.sendMessage(tab.id, { kind })
    }
  } catch(err){
  }
}