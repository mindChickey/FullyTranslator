import { Config, getConfig } from "./config"

type TranslateFn = (sl: string, tl: string, text: string) => Promise<string | undefined>

async function googleTranslate(sl: string, tl: string, text: string): Promise<string | undefined> {
  const args = { client: "gtx", hl: tl, sl, tl, q: text, dj: "1" }
  const query = new URLSearchParams(args)
  const url = "https://translate.googleapis.com/translate_a/single?dt=t&dt=bd&dt=qc&dt=rm&dt=ex&" + query.toString()
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: { 
        Accept: "text/html,application/xhtml+xml,application/xmlq=0.9,*/*q=0.8",
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0 Win64 x64) AppleWebKit/537.36'
      }
    })
    const t = await res.json()
    return t.sentences.map((s: { trans: string }) => s.trans).join('')
  } catch (err) {
    console.log("err", err)
  }
}

const translateMap: Record<string, TranslateFn> = {
  'google': googleTranslate, 
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "translatePage",
    title: "translate page",
  })
})

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "translatePage" && tab?.id !== undefined) {
    chrome.tabs.sendMessage(tab.id, {})
  }
})

chrome.commands.onCommand.addListener((command, tab) => {
  if (command === "run-translate" && tab?.id !== undefined) {
    chrome.tabs.sendMessage(tab.id, {})
  }
})

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.kind === 'translate') {
    async function callback({ translator, language }: Config) {
      const res = await translateMap[translator]( 'auto', language, request.text)
      sendResponse(res)
    }
    getConfig(callback)
  }
  return true
})