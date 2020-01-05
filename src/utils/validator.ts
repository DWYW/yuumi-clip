export default {
  /**
   * The type of the unevaluated opearand.
   * @param {any}[required] data
   * @param {string} type The type of expected
   * @returns {(string|boolean)}
   */
  typeof (data:any): string {
    var _type = Object.prototype.toString.call(data).slice(8, -1).toLowerCase()

    return _type
  },

  isFunction (data: any): boolean {
    return this.typeof(data) === 'function'
  },

  isObject (data: any): boolean {
    return this.typeof(data) === 'object'
  },

  isArray (data: any): boolean {
    return this.typeof(data) === 'array'
  },

  isString (data: any): boolean {
    return this.typeof(data) === 'string'
  },

  isAndroid () {
    return /Android/i.test(navigator.userAgent)
  },

  isiPhone () {
    return /iPhone/i.test(navigator.userAgent)
  },

  isiPad () {
    return /iPad/i.test(navigator.userAgent)
  },

  isiPod () {
    return /iPod/i.test(navigator.userAgent)
  },

  isBlackBerry () {
    return /BlackBerry/i.test(navigator.userAgent)
  },

  isWindowsPhone () {
    return /Windows Phone/i.test(navigator.userAgent)
  },

  isMobileDevice () {
    return this.isAndroid() ||
      this.isiPhone() ||
      this.isiPod() ||
      this.isBlackBerry() ||
      this.isWindowsPhone()
  }
}
