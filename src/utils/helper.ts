export default {
  screen () {
    return {
      width: Math.min(window.innerWidth, document.documentElement.clientWidth),
      height: Math.min(window.innerHeight, document.documentElement.clientHeight),
      ratio: window.devicePixelRatio
    }
  },

  offsetFromRoot (element: HTMLElement): any {
    let parent: any = element.offsetParent
    const offset = {
      left: element.offsetLeft || 0,
      top: element.offsetTop || 0
    }

    while (parent && parent.nodeType === 1) {
      offset.left += (parent.offsetLeft || 0)
      offset.top += (parent.offsetTop || 0)
      parent = parent.offsetParent
    }

    return offset
  },

  getImage (url: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const cover = new Image()
      cover.src = url
      cover.onload = () => {
        resolve(cover)
      }
      cover.onerror = (error) => {
        reject(error)
      }
    })
  }
}
