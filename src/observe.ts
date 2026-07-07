

function matchAnySelector(node: Element, selectors: string[]): Element[] {
  const isMatch = selectors.some((s) => node.matches?.(s))
  const current = isMatch ? [node] : []
  const children = selectors.flatMap((s) => Array.from(node.querySelectorAll?.(s) || []))
  return [...current, ...children] as Element[]
}

function extractBySelectors(mutations: MutationRecord[], selectors: string[]): Element[] {
  return mutations
    .flatMap((m) => Array.from(m.addedNodes))
    .filter((node): node is Element => node.nodeType === 1)
    .flatMap((node) => matchAnySelector(node, selectors))
}

export
function startMultiObserve(selectors: string[], callback: (el: Element) => void): MutationObserver {
  const observer = new MutationObserver((mutations) => {
    const targets = extractBySelectors(mutations, selectors)
    targets.forEach(callback)
  })
  observer.observe(document.body, { childList: true, subtree: true })
  return observer
}