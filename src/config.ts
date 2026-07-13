
import { z } from "zod"
import { OpenMapSchema, OpenMapT, RuleMapSchema, RuleMapT } from "./types"

export async function getTargetLangage(){
  let { language } = await chrome.storage.local.get({language: 'en'})
  return z.parse(z.string(), language)
}

export async function getRuleMap(){
  let { ruleMap } = await chrome.storage.local.get({ruleMap: {}})
  return z.parse(RuleMapSchema, ruleMap)
}

export async function getOpen(host: string){
  let { openMap } = await chrome.storage.local.get('openMap')
  let openMap1 = z.parse(OpenMapSchema, openMap)
  let r = openMap1[host]
  return r === true
}

export async function setHostOpen(host: string, open: boolean) {
  let { openMap } = await chrome.storage.local.get('openMap')
  let openMap1 = z.parse(OpenMapSchema, openMap)
  openMap1[host] = open
  await chrome.storage.local.set({ openMap: openMap1 })
}

export async function reverseOpen(host: string){
  let { openMap } = await chrome.storage.local.get('openMap')
  let openMap1 = z.parse(OpenMapSchema, openMap)
  let newOpen = !openMap1[host]
  openMap1[host] = newOpen
  await chrome.storage.local.set({ openMap: openMap1 })
  return newOpen
}