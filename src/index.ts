import * as render from './render'
import $file from './utils/file'
import { createElement } from './utils/node'
import validator from './utils/validator'

export default class YuumiClip {
  readonly rectSize: number = 30
  private file: File = null
  private scale: number = 0
  private minScale: number = 0
  private firstTouches: any = []
  private finalTouches: any = []
  public $el!: HTMLElement
  public $image!: any
  public $clipParent!: HTMLElement
  public $clip!: HTMLElement
  private clipOffset: any = null
  private $options: _YuumiClip.ConstructorOptions = {}
  private rotate: number = 0

  constructor (file: File, options?: _YuumiClip.ConstructorOptions) {
    if (file instanceof File) {
      this.file = file
      this.$options = Object.assign({
        expect: 'file',
        ratio: 0
      }, options)
      this.mounte()
    } else {
      console.warn('the file must be File, please check it.')
    }
  }

  mounte () {
    this.$el = render.renderMain(this.file)
    this.$clipParent = this.$el.querySelector('.clip-wrapper')
    document.body.appendChild(this.$el)

    $file.file2DataURL(this.file).then((res) => {
      const dataURL = res.target.result
      $file.dataURL2Image(dataURL).then((image: any) => {
        this.$image = image
        this.minScale = this.initScale()
        this.scale = this.minScale

        this.renderImage()
        this.renderClip()
        this.bindEvents()
      })
    })
  }

  initScale (): number {
    const ratio = this.$clipParent.clientWidth / this.$clipParent.clientHeight
    const imageRatio = this.$image.width / this.$image.height
    return ratio > imageRatio ? this.$clipParent.clientHeight / this.$image.height : this.$clipParent.clientWidth / this.$image.width
  }

  getDesgin (scale: number) {
    const width = this.$image.width * scale
    const height = this.$image.height * scale
    const x = (this.$clipParent.clientWidth - width) / 2
    const y = (this.$clipParent.clientHeight - height) / 2
    return { x, y, width, height }
  }

  renderImage () {
    const data = this.getDesgin(this.scale)
    this.$image.dataset.width = this.$image.width
    this.$image.dataset.height = this.$image.height
    this.$image.dataset.left = 0
    this.$image.dataset.top = 0
    this.$image.setAttribute('width', data.width)
    this.$image.setAttribute('height', data.height)
    const imageParent = createElement('div', {
      class: 'source-wrapper',
      style: {
        left: `${data.x}px`,
        top: `${data.y}px`,
        height: `${data.height}px`,
        width: `${data.width}px`
      }
    }, [this.$image])
    this.$clipParent.appendChild(imageParent)
  }

  renderClip () {
    const { ratio } = this.$options

    if (ratio) {
      const offset = this.getElementOffset(this.$clipParent)
      const _ratio: number = offset.width / offset.height
      const _width: number = ratio > _ratio ? offset.width : offset.height * ratio
      const _height: number = ratio > _ratio ? offset.width / ratio : offset.height
      const _left: number = (offset.width - _width) / 2
      const _top: number = (offset.height - _height) / 2

      this.$clip = render.renderClip({
        left: _left,
        top: _top,
        width: _width,
        height: _height
      })
    } else {
      this.$clip = render.renderClip(this.getElementOffset(this.$image.parentNode))
    }
    this.$clipParent.appendChild(this.$clip)
  }

  getElementOffset (element: HTMLElement) {
    return {
      left: element.offsetLeft,
      top: element.offsetTop,
      width: element.offsetWidth,
      height: element.offsetHeight
    }
  }

  bindEvents () {
    const element = this.$clipParent
    element.addEventListener('touchstart', this.touchstart.bind(this))
    element.addEventListener('touchend', this.touchend.bind(this))
    element.addEventListener('touchcancel', this.touchend.bind(this))

    element.addEventListener('touchmove', (e: TouchEvent) => {
      e.preventDefault()

      if (this.firstTouches.length === 1 && e.touches.length === 1) {
        const _target = this.firstTouches[0].target

        if (_target.classList.contains('left-top')) {
          !this.$options.ratio && this.resizeFromLeftTop(e.touches[0])
        } else if (_target.classList.contains('left-bottom')) {
          !this.$options.ratio && this.resizeFromLeftBottom(e.touches[0])
        } else if (_target.classList.contains('right-top')) {
          !this.$options.ratio && this.resizeFromRightTop(e.touches[0])
        } else if (_target.classList.contains('right-bottom')) {
          !this.$options.ratio && this.resizeFromRightBottom(e.touches[0])
        } else {
          this.updateImagePosition(e.touches)
        }
      }

      if (this.firstTouches.length === 2 && e.touches.length === 2) {
        this.imageScale(e.touches)
      }

      this.finalTouches = e.touches
    })

    this.$el.querySelector('.footer-cancel').addEventListener('click', this.onCancel.bind(this))
    this.$el.querySelector('.footer-confirm').addEventListener('click', this.onConfirm.bind(this))
    this.$el.querySelector('.footer-rotate').addEventListener('click', this.onRotate.bind(this))
  }

  touchstart (e: TouchEvent) {
    this.firstTouches = e.touches

    if (e.touches.length === 1) {
      const _target: any = e.touches[0].target

      if (_target.classList.contains('rect')) {
        this.clipOffset = this.getElementOffset(this.$clip)
      }
    }

    e.preventDefault()
  }

  touchend (e: TouchEvent) {
    if (this.clipOffset) {
      this.clipOffset = null
    }

    if (this.firstTouches.length === 2 && this.finalTouches.length === 2) {
      const _scale = this.getScale(this.firstTouches, this.finalTouches)
      const _style = this.getImageStyle(_scale)

      // save the [top, left, scale] for next scale action.
      this.$image.dataset.top = _style.top
      this.$image.dataset.left = _style.left
      this.scale = _scale
    }

    if (this.firstTouches.length === 1 && this.finalTouches.length === 1) {
      if (!this.finalTouches[0].target.classList.contains('rect')) {
        // save the [top, left] from next move.
        const position = this.getImagePosition(this.finalTouches)
        this.$image.dataset.top = position.top
        this.$image.dataset.left = position.left
      }
    }

    if (this.firstTouches.length > 0) {
      this.firstTouches = []
    }

    if (this.finalTouches.length > 0) {
      this.finalTouches = []
    }

    e.preventDefault()
  }

  getLeftValue (touch: Touch, max: number) :number {
    const x = touch.pageX - this.firstTouches[0].pageX
    return Math.min(
      Math.max(this.clipOffset.left + x, 0),
      max - this.rectSize * 2
    )
  }

  getTopValue (touch: Touch, maxY: number): number {
    const y = touch.pageY - this.firstTouches[0].pageY
    return Math.min(
      Math.max(this.clipOffset.top + y, 0),
      maxY - this.rectSize * 2
    )
  }

  resizeFromLeftTop (touch: Touch) {
    const maxX = this.clipOffset.left + this.clipOffset.width
    const left = this.getLeftValue(touch, maxX)

    const maxY = this.clipOffset.height + this.clipOffset.top
    const top = this.getTopValue(touch, maxY)

    const width = maxX - left
    const height = maxY - top

    this.$clip.style.left = `${left}px`
    this.$clip.style.top = `${top}px`
    this.$clip.style.width = `${width}px`
    this.$clip.style.height = `${height}px`
  }

  resizeFromLeftBottom (touch: Touch) {
    const maxX = this.clipOffset.width + this.clipOffset.left
    const left = this.getLeftValue(touch, maxX)
    const width = maxX - left

    const y = touch.pageY - this.firstTouches[0].pageY
    const height = Math.min(
      Math.max(this.rectSize * 2, this.clipOffset.height + y),
      this.$clipParent.offsetHeight - this.clipOffset.top
    )

    this.$clip.style.left = `${left}px`
    this.$clip.style.width = `${width}px`
    this.$clip.style.height = `${height}px`
  }

  resizeFromRightTop (touch: Touch) {
    const x = touch.pageX - this.firstTouches[0].pageX
    const width = Math.min(
      Math.max(this.rectSize * 2, this.clipOffset.width + x),
      this.$clipParent.offsetWidth - this.clipOffset.left
    )

    const maxY = this.clipOffset.height + this.clipOffset.top
    const top = this.getTopValue(touch, maxY)
    const height = maxY - top

    this.$clip.style.top = `${top}px`
    this.$clip.style.width = `${width}px`
    this.$clip.style.height = `${height}px`
  }

  resizeFromRightBottom (touch: Touch) {
    const x = touch.pageX - this.firstTouches[0].pageX
    const width = Math.min(
      Math.max(this.rectSize * 2, this.clipOffset.width + x),
      this.$clipParent.offsetWidth - this.clipOffset.left
    )

    const y = touch.pageY - this.firstTouches[0].pageY
    const height = Math.min(
      Math.max(this.rectSize * 2, this.clipOffset.height + y),
      this.$clipParent.offsetHeight - this.clipOffset.top
    )

    this.$clip.style.width = `${width}px`
    this.$clip.style.height = `${height}px`
  }

  getScale (start: TouchList, end: TouchList): number {
    const xx1 = Math.pow(start[1].pageX - start[0].pageX, 2)
    const yy1 = Math.pow(start[1].pageY - start[0].pageY, 2)
    const l1 = Math.sqrt(xx1 + yy1)

    const xx2 = Math.pow(end[1].pageX - end[0].pageX, 2)
    const yy2 = Math.pow(end[1].pageY - end[0].pageY, 2)
    const l2 = Math.sqrt(xx2 + yy2)

    const scale = this.scale * l2 / l1
    return Math.max(this.minScale, scale)
  }

  getImageStyle (scale: number) {
    const dataset = this.$image.dataset

    const x = Number(dataset.width) * (scale - this.scale) / 2
    const y = Number(dataset.height) * (scale - this.scale) / 2

    return {
      width: Number(dataset.width) * scale,
      height: Number(dataset.height) * scale,
      left: Number(dataset.left) - x,
      top: Number(dataset.top) - y
    }
  }

  imageScale (touches: TouchList) {
    const scale = this.getScale(this.firstTouches, touches)
    const _style = this.getImageStyle(scale)
    this.$image.setAttribute('width', _style.width)
    this.$image.setAttribute('height', _style.height)
    this.$image.setAttribute('style', `transform: translate3d(${_style.left}px, ${_style.top}px, 0px) rotate(${this.rotate}deg);`)
  }

  getImagePosition (touches: TouchList) {
    const x = touches[0].pageX - this.firstTouches[0].pageX
    const y = touches[0].pageY - this.firstTouches[0].pageY
    const dataset = this.$image.dataset
    const left = Number(dataset.left) + x
    const top = Number(dataset.top) + y
    return {
      left,
      top
    }
  }

  updateImagePosition (touches: TouchList) {
    const position = this.getImagePosition(touches)
    this.$image.style.marginLeft = `${position.left}px`
    this.$image.style.marginTop = `${position.top}px`
    this.$image.setAttribute('style', `transform: translate3d(${position.left}px, ${position.top}px, 0px) rotate(${this.rotate}deg);`)
  }

  destroy (): any {
    if (!this.$el) return null

    this.$el.parentNode.removeChild(this.$el)
    this.$el = null
  }

  onCancel () {
    if (validator.isFunction(this.$options.cancel)) {
      this.$options.cancel(this.destroy.bind(this))
    } else {
      this.destroy()
    }
  }

  onConfirm (): any {
    const clipBounding = this.$clip.getBoundingClientRect()
    const imageBounding = this.$image.getBoundingClientRect()
    // const imageDataset = this.$image.dataset

    const canvas = document.createElement('canvas')
    canvas.width = clipBounding.width / this.scale
    canvas.height = clipBounding.height / this.scale
    canvas.setAttribute('style', `width: ${clipBounding.width}px; height: ${clipBounding.height}px;`)

    const dWidth = this.$image.offsetWidth / this.scale
    const dHeight = this.$image.offsetHeight / this.scale
    let dx = 0
    let dy = 0

    switch (this.rotate) {
      case -90:
        dx = (dHeight - dWidth) / 2 - (imageBounding.top - clipBounding.top) / this.scale
        dy = (dHeight - dWidth) / 2 - (clipBounding.left - imageBounding.left) / this.scale
        break
      case -180:
        dx = 0 - (imageBounding.left - clipBounding.left) / this.scale
        dy = 0 - (imageBounding.top - clipBounding.top) / this.scale
        break
      case -270:
        dx = (imageBounding.top - clipBounding.top) / this.scale - (dHeight - dWidth) / 2
        dy = (clipBounding.left - imageBounding.left) / this.scale - (dHeight - dWidth) / 2
        break
      default:
        dx = (imageBounding.left - clipBounding.left) / this.scale
        dy = (imageBounding.top - clipBounding.top) / this.scale
    }

    const ctx = canvas.getContext('2d')
    ctx.save()
    ctx.translate(dWidth / 2, dHeight / 2)
    ctx.rotate(this.rotate * Math.PI / 180)
    ctx.translate(-dWidth / 2, -dHeight / 2)
    ctx.drawImage(
      this.$image,
      0, 0, this.$image.dataset.width, this.$image.dataset.height,
      dx, dy, dWidth, dHeight
    )
    ctx.restore()

    if (!validator.isFunction(this.$options.confirm)) {
      this.destroy()
      return null
    }

    switch (this.$options.expect) {
      case 'blob':
        $file.canvas2Blob(canvas, 0.92, this.file.type).then((blob) => {
          this.$options.confirm(blob, this.destroy.bind(this))
        })
        break
      case 'file':
        this.$options.confirm($file.dataURL2File(
          $file.canvas2DataURL(canvas, 0.92, this.file.type),
          this.file.name
        ), this.destroy.bind(this))

        break
      case 'base64':
        this.$options.confirm(
          $file.canvas2DataURL(canvas, 0.92, this.file.type),
          this.destroy.bind(this)
        )
        break
    }
  }

  onRotate () {
    this.rotate = (this.rotate - 90) % 360
    this.$image.setAttribute('style', `transform: translate3d(${this.$image.dataset.left}px, ${this.$image.dataset.top}px, 0px) rotate(${this.rotate}deg);`)
  }
}
