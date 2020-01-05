import validator from './validator'

interface Options<T> {
  [key: string]: T;
}

interface CreateElementOption {
  class?: any;
  attrs?: Options<string>,
  style?: Options<string>,
  on?: any
}

/**
 * get style value.
 * @param  {Element} element target html dom
 * @param  {String} attr     css attribute
 * @return {String}
 */
export function getStyle (element: any, attr: string) {
  if (window.getComputedStyle) {
    const styles = window.getComputedStyle(element, null)
    return styles ? styles.getPropertyValue(attr) : null
  } else if (element.currentStyle) {
    return element.currentStyle[attr]
  } else {
    return element.style[attr]
  }
}

/**
 * 获取离startNode与endNode最近的公共的祖先节点
 * @method  ancestor
 * @param { Node } startNode 开始节点
 * @param { Node } endNode 结束节点
 * @remind 如果给定的两个节点是同一个节点， 将直接返回该节点。
 * @return { Node | NULL } 如果未找到公共节点， 返回NULL， 否则返回最近的公共祖先节点。
 */
export function ancestor (startNode: Node, endNode: Node): (Node|null) {
  if (startNode === endNode) return startNode

  const parentsStart = [startNode]
  const parentsEnd = [endNode]
  let parent = startNode.parentNode
  let i = 0

  // 结束节点是开始节点的祖先节点
  while (parent) {
    if (parent === endNode) {
      return parent
    }

    parentsStart.push(parent)
    parent = parent.parentNode
  }

  parent = endNode.parentNode
  // 开始节点是结束节点的祖先节点
  while (parent) {
    if (parent === startNode) {
      return parent
    }

    parentsEnd.push(parent)
    parent = parent.parentNode
  }

  parentsStart.reverse()
  parentsEnd.reverse()

  while (parentsStart[i] === parentsEnd[i]) {
    i++
  }

  return i === 0 ? null : parentsStart[i - 1]
}

export function object2className (data: Options<boolean>): string {
  const _classes = <string[]>[]

  Object.entries(data).forEach(([_key, _value]) => {
    if (_value) {
      _classes.push(_key)
    }
  })

  return _classes.join(' ')
}

export function object2style (data: Options<string>): string {
  const _styles = <string[]>[]

  Object.entries(data).forEach(([_key, _value]) => {
    _styles.push(`${_key}: ${_value};`)
  })

  return _styles.join(' ')
}

export function createElement (tagName: string, options: CreateElementOption = {}, children?: Array<Node|string>): HTMLElement {
  const element = document.createElement(tagName)

  if (validator.isString(options.class)) {
    element.className = <string>options.class
  } else if (validator.isObject(options.class)) {
    element.className = object2className(<{[key: string]: boolean}>options.class)
  } else if (validator.isArray(options.class)) {
    element.className = (<any[]>options.class).map((item: any) => {
      if (validator.isString(item)) {
        return item
      }

      if (validator.isObject(item)) {
        return object2className(<{[key: string]: boolean}>item)
      }
    }).join(' ')
  }

  if (options.on) {
    Object.entries(options.on).forEach(([_key, _value]) => {
      element.addEventListener(_key, <any>_value)
    })
  }

  if (options.attrs) {
    Object.entries(options.attrs).forEach(([_key, _value]) => {
      _key !== 'style' && element.setAttribute(_key, _value)
    })
  }

  if (options.style) {
    element.setAttribute('style', object2style(options.style))
  }

  if (children) {
    children.forEach(item => {
      if (!item) return null

      let _child = item

      if (validator.isString(item)) {
        _child = document.createTextNode(<string>item)
      }

      element.appendChild(<Node>_child)
    })
  }

  return element
}

export function isBr (node: Node): boolean {
  return node.nodeType === 1 && node.nodeName === 'BR'
}

export function isWhitespace (node: Node): boolean {
  return /^\s+$/.test(node.nodeValue || '')
}

export function isEmptyNode (node: Node): boolean {
  if (!node.firstChild) return true

  let child = <Node> node.firstChild
  let count = 0

  while (child) {
    if (!isBr(child) && !isWhitespace(node)) {
      count++
    }

    child = <Node> child.nextSibling
  }

  return count === 0
}

/**
 * Get the scrolling parent of the given element.
 * @param {Element} element given element
 * @returns {Element} scroll parent
 */
export function getScrollParent (element: HTMLElement): HTMLElement {
  if (!/element/.test(validator.typeof(element))) return document.body

  switch (element.nodeName) {
    case 'HTML':
    case 'BODY':
      return (<Document> element.ownerDocument).body
    case '#document':
      return (<any> element).body
  }

  const overflow = getStyle(element, 'overflow')
  const overflowX = getStyle(element, 'overflowX')
  const overflowY = getStyle(element, 'overflowY')

  if (/auto|scroll/.test(overflow + overflowX + overflowY)) return element

  return getScrollParent(element.parentNode as HTMLElement)
}
