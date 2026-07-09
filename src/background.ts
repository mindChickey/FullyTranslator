import { reverseStartup } from "./config"
import { sendTurnMessage } from "./sendMessage"

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "translatePage",
    title: "translate page",
  })
})

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "translatePage"){
    let startup = await reverseStartup()
    await sendTurnMessage(tab, startup)
  }
})

chrome.commands.onCommand.addListener(async (command, tab) => {
  if (command === "run-translate"){
    let startup = await reverseStartup()
    await sendTurnMessage(tab, startup)
  }
})