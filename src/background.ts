
import { reverseStartup } from "./config"

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "translatePage",
    title: "translate page",
  })
})

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "translatePage"){
    await reverseStartup(tab)
  }
})

chrome.commands.onCommand.addListener(async (command, tab) => {
  if (command === "run-translate"){
    await reverseStartup(tab)
  }
})