

export function newMultiObserve(callback: (el: Element) => void): MutationObserver {
  const observer = new MutationObserver((mutations) => {
    let r0 = mutations.flatMap((m) => Array.from(m.addedNodes))
    let r1 = r0.filter((node): node is Element => node.nodeType === 1)
    r1.flatMap(callback)
  })
  return observer
}

export function startMultiObserve(observer: MutationObserver){
  observer.observe(document.body, { childList: true, subtree: true })
}