export default {
  /**
   * 文件转化成 dataURL字符串
   */
  file2DataURL (file: File, progress?: (process: any) => void): Promise<any> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.onloadend = function (e) {
        resolve(e)
      }

      reader.onloadstart = function (e) {
        progress && progress(e)
      }

      reader.onprogress = function (e) {
        progress && progress(e)
      }

      reader.onerror = function (e) {
        reject(e)
      }

      reader.readAsDataURL(file)
    })
  },

  /**
   * dataURL转换成Image类型文件
   * @param  {String}   dataURL dataURL字符串
   * @param  {Function} fn      回调方法，包含一个Image类型参数
   */
  dataURL2Image (dataURL: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => {
        resolve(img)
      }
      img.onerror = reject
      img.src = dataURL
    })
  },

  /**
   * dataURL转换成File类型文件
   */
  dataURL2File (dataURL: string, name: string) {
    const arr = dataURL.split(',')
    const matches = arr[0].match(/:(.*?);/)
    const mimeType = (matches && matches[1]) || ''
    const bstr = atob(arr[1])
    let n = bstr.length
    const u8arr = new Uint8Array(n)

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }

    return new File([u8arr], name, { type: mimeType })
  },

  /**
   * 将canvas转换成Blob类型的数据
   * @param  {HTML CANVAS DOM}   canvas  html canvas DOM
   * @param  {Number}   quality  0到1的图片质量数值
   */
  canvas2Blob (canvas: HTMLCanvasElement, quality = 1, miniType: string): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        canvas.toBlob(function (blob) {
          resolve(blob)
        }, miniType, quality)
      } catch (error) {
        reject(error)
      }
    })
  },

  /**
   * 将canvas转换成dataURL字符串
   * @param  {HTML CANVAS DOM}   canvas  html canvas DOM
   * @param  {Number}   quality  0到1的图片质量数值
   * @param  {String}   miniType  0到1的图片质量数值
   * @return {String}
   */
  canvas2DataURL (canvas: HTMLCanvasElement, quality: number = 1, miniType: string):string {
    return canvas.toDataURL(miniType, quality)
  }
}
