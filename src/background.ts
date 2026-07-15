import { reverseOpen } from "./config"
import { defaultRuleMap } from "./defaultRuleMap"
import { sendTurnMessage } from "./sendMessage"
import { ConfigT, TranslateResultT } from "./types"
import { getHost } from "./utils"

async function googleTranslate(tl: string, text: string): Promise<TranslateResultT> {
  const args = { client: "gtx", hl: tl, sl: "auto", tl, q: text, dj: "1" }
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
    let targetLines =  t.sentences.map((s: { trans: string }) => s.trans).filter((s: string) => s)
    return { succ: true, srcText: text, targetLines}
  } catch(err: any){
    return { succ: false, srcText: text, targetLines: [err.toString()]}
  }
}

let defaultConfig: ConfigT = {
  language: 'zh-CN',
  ruleMap: defaultRuleMap,
  openMap: {}
}

chrome.runtime.onInstalled.addListener((details) => {
  chrome.storage.local.set(defaultConfig)
  chrome.contextMenus.create({
    id: "translatePage",
    title: "translate page",
  })
})

async function turn(){
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
  if(!tab) return
  let host = getHost(tab.url)
  let open = await reverseOpen(host)
  await sendTurnMessage(tab, open)
}

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "translatePage"){
    turn()
  }
})

chrome.commands.onCommand.addListener(async (command, tab) => {
  if (command === "run-translate"){
    turn()
  }
})


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.kind === 'translate') {
    async function f() {
      let { targetLang, text } = request
      const res = await googleTranslate(targetLang, text)
      sendResponse(res)
    }
    f()
  }
  return true
})