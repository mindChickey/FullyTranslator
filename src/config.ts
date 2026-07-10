import { RuleMap } from "./matchURL"

export type OpenMap = {[domain: string]: boolean}

export async function getTargetLangage(){
  let { language } = await chrome.storage.local.get({language: 'en'})
  return language as string
}

export async function getRuleMap(){
  let { ruleMap } = await chrome.storage.local.get({ruleMap: {}})
  return ruleMap as RuleMap
}

export async function getOpen(host: string){
  let { openMap } = await chrome.storage.local.get('openMap')
  if(!openMap){
    return false
  } else {
    let r = (openMap as OpenMap)[host]
    return r === true
  }  
}

export async function setHostOpen(host: string, open: boolean) {
  let { openMap } = await chrome.storage.local.get('openMap')
  let openMap1 = openMap as OpenMap
  openMap1[host] = open
  await chrome.storage.local.set({ openMap: openMap1 })
}

export async function reverseOpen(host: string){
  let { openMap } = await chrome.storage.local.get('openMap')
  let openMap1 = openMap as OpenMap
  let newOpen = !openMap1[host]
  openMap1[host] = newOpen
  await chrome.storage.local.set({ openMap: openMap1 })
  return newOpen
}