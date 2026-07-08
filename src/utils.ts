
function copyAllStyles(source: Element, target: HTMLElement) {
  let styles = window.getComputedStyle(source)
  Array.from(styles).forEach(key => {
    target.style.setProperty(key, styles.getPropertyValue(key))
  })
}

export function cloneElement(element: Element): Element {
  let element1 = element.cloneNode(true) as HTMLElement
  element1.removeAttribute('id')
  copyAllStyles(element, element1)
  element1.style.backgroundColor = "#e2f0d9"
  return element1
}