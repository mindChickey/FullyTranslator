
export async function getTargetLangage(){
  let {language} = await chrome.storage.local.get({language: 'en'})
  return language as string
}

export async function getStartup(){
  let {startup} = await chrome.storage.local.get({startup: true})
  return startup  as boolean
}

export async function reverseStartup(){
  let oldStartup = await getStartup()
  let newStartup = !oldStartup
  await chrome.storage.local.set({ startup: newStartup })
  return newStartup
}