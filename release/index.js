(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.YuumiClip = factory());
}(this, (function () { 'use strict';

  var validator = {
      /**
       * The type of the unevaluated opearand.
       * @param {any}[required] data
       * @param {string} type The type of expected
       * @returns {(string|boolean)}
       */
      typeof: function (data) {
          var _type = Object.prototype.toString.call(data).slice(8, -1).toLowerCase();
          return _type;
      },
      isFunction: function (data) {
          return this.typeof(data) === 'function';
      },
      isObject: function (data) {
          return this.typeof(data) === 'object';
      },
      isArray: function (data) {
          return this.typeof(data) === 'array';
      },
      isString: function (data) {
          return this.typeof(data) === 'string';
      },
      isAndroid: function () {
          return /Android/i.test(navigator.userAgent);
      },
      isiPhone: function () {
          return /iPhone/i.test(navigator.userAgent);
      },
      isiPad: function () {
          return /iPad/i.test(navigator.userAgent);
      },
      isiPod: function () {
          return /iPod/i.test(navigator.userAgent);
      },
      isBlackBerry: function () {
          return /BlackBerry/i.test(navigator.userAgent);
      },
      isWindowsPhone: function () {
          return /Windows Phone/i.test(navigator.userAgent);
      },
      isMobileDevice: function () {
          return this.isAndroid() ||
              this.isiPhone() ||
              this.isiPod() ||
              this.isBlackBerry() ||
              this.isWindowsPhone();
      }
  };

  function object2className(data) {
      var _classes = [];
      Object.entries(data).forEach(function (_a) {
          var _key = _a[0], _value = _a[1];
          if (_value) {
              _classes.push(_key);
          }
      });
      return _classes.join(' ');
  }
  function object2style(data) {
      var _styles = [];
      Object.entries(data).forEach(function (_a) {
          var _key = _a[0], _value = _a[1];
          _styles.push(_key + ": " + _value + ";");
      });
      return _styles.join(' ');
  }
  function createElement(tagName, options, children) {
      if (options === void 0) { options = {}; }
      var element = document.createElement(tagName);
      if (validator.isString(options.class)) {
          element.className = options.class;
      }
      else if (validator.isObject(options.class)) {
          element.className = object2className(options.class);
      }
      else if (validator.isArray(options.class)) {
          element.className = options.class.map(function (item) {
              if (validator.isString(item)) {
                  return item;
              }
              if (validator.isObject(item)) {
                  return object2className(item);
              }
          }).join(' ');
      }
      if (options.on) {
          Object.entries(options.on).forEach(function (_a) {
              var _key = _a[0], _value = _a[1];
              element.addEventListener(_key, _value);
          });
      }
      if (options.attrs) {
          Object.entries(options.attrs).forEach(function (_a) {
              var _key = _a[0], _value = _a[1];
              _key !== 'style' && element.setAttribute(_key, _value);
          });
      }
      if (options.style) {
          element.setAttribute('style', object2style(options.style));
      }
      if (children) {
          children.forEach(function (item) {
              if (!item)
                  return null;
              var _child = item;
              if (validator.isString(item)) {
                  _child = document.createTextNode(item);
              }
              element.appendChild(_child);
          });
      }
      return element;
  }

  var renderHeader = function (file) {
      return createElement('header', {
          class: 'yuumi-clip-header'
      }, [
          file ? file.name : ''
      ]);
  };
  var renderFooter = function () {
      return createElement('footer', {
          class: 'yuumi-clip-footer'
      }, [
          createElement('span', {
              class: 'footer-cancel'
          }, ['取消']),
          createElement('span', {
              class: 'footer-rotate'
          }, ['旋转']),
          createElement('span', {
              class: 'footer-confirm'
          }, ['确认'])
      ]);
  };
  var renderBody = function () {
      return createElement('div', {
          class: 'yuumi-clip-body'
      }, [
          createElement('div', {
              class: 'clip-body-content'
          }, [
              createElement('div', {
                  class: 'clip-wrapper'
              })
          ])
      ]);
  };
  var renderMain = function (file) {
      return createElement('section', {
          class: ['yuumi-clip']
      }, [
          renderHeader(file),
          renderBody(),
          renderFooter()
      ]);
  };
  var renderClip = function (offset) {
      var el = createElement('section', {
          class: 'clip-grid',
          style: {
              left: offset.left + "px",
              top: offset.top + "px",
              width: offset.width + "px",
              height: offset.height + "px"
          }
      }, [
          createElement('div', {
              class: 'clip-grid-body'
          }, [
              createElement('div', {
                  class: 'rect left-top'
              }),
              createElement('div', {
                  class: 'rect right-top'
              }),
              createElement('div', {
                  class: 'rect right-bottom'
              }),
              createElement('div', {
                  class: 'rect left-bottom'
              })
          ])
      ]);
      return el;
  };

  var $file = {
      /**
       * 文件转化成 dataURL字符串
       */
      file2DataURL: function (file, progress) {
          return new Promise(function (resolve, reject) {
              var reader = new FileReader();
              reader.onloadend = function (e) {
                  resolve(e);
              };
              reader.onloadstart = function (e) {
                  progress && progress(e);
              };
              reader.onprogress = function (e) {
                  progress && progress(e);
              };
              reader.onerror = function (e) {
                  reject(e);
              };
              reader.readAsDataURL(file);
          });
      },
      /**
       * dataURL转换成Image类型文件
       * @param  {String}   dataURL dataURL字符串
       * @param  {Function} fn      回调方法，包含一个Image类型参数
       */
      dataURL2Image: function (dataURL) {
          return new Promise(function (resolve, reject) {
              var img = new Image();
              img.onload = function () {
                  resolve(img);
              };
              img.onerror = reject;
              img.src = dataURL;
          });
      },
      /**
       * dataURL转换成File类型文件
       */
      dataURL2File: function (dataURL, name) {
          var arr = dataURL.split(',');
          var matches = arr[0].match(/:(.*?);/);
          var mimeType = (matches && matches[1]) || '';
          var bstr = atob(arr[1]);
          var n = bstr.length;
          var u8arr = new Uint8Array(n);
          while (n--) {
              u8arr[n] = bstr.charCodeAt(n);
          }
          return new File([u8arr], name, { type: mimeType });
      },
      /**
       * 将canvas转换成Blob类型的数据
       * @param  {HTML CANVAS DOM}   canvas  html canvas DOM
       * @param  {Number}   quality  0到1的图片质量数值
       */
      canvas2Blob: function (canvas, quality, miniType) {
          if (quality === void 0) { quality = 1; }
          return new Promise(function (resolve, reject) {
              try {
                  canvas.toBlob(function (blob) {
                      resolve(blob);
                  }, miniType, quality);
              }
              catch (error) {
                  reject(error);
              }
          });
      },
      /**
       * 将canvas转换成dataURL字符串
       * @param  {HTML CANVAS DOM}   canvas  html canvas DOM
       * @param  {Number}   quality  0到1的图片质量数值
       * @param  {String}   miniType  0到1的图片质量数值
       * @return {String}
       */
      canvas2DataURL: function (canvas, quality, miniType) {
          if (quality === void 0) { quality = 1; }
          return canvas.toDataURL(miniType, quality);
      }
  };

  var YuumiClip = /** @class */ (function () {
      function YuumiClip(file, options) {
          this.rectSize = 30;
          this.file = null;
          this.scale = 0;
          this.minScale = 0;
          this.firstTouches = [];
          this.finalTouches = [];
          this.clipOffset = null;
          this.$options = {};
          this.rotate = 0;
          if (file instanceof File) {
              this.file = file;
              this.$options = Object.assign({
                  expect: 'file',
                  ratio: 0
              }, options);
              this.mounte();
          }
          else {
              console.warn('the file must be File, please check it.');
          }
      }
      YuumiClip.prototype.mounte = function () {
          var _this = this;
          this.$el = renderMain(this.file);
          this.$clipParent = this.$el.querySelector('.clip-wrapper');
          document.body.appendChild(this.$el);
          $file.file2DataURL(this.file).then(function (res) {
              var dataURL = res.target.result;
              $file.dataURL2Image(dataURL).then(function (image) {
                  _this.$image = image;
                  _this.minScale = _this.initScale();
                  _this.scale = _this.minScale;
                  _this.renderImage();
                  _this.renderClip();
                  _this.bindEvents();
              });
          });
      };
      YuumiClip.prototype.initScale = function () {
          var ratio = this.$clipParent.clientWidth / this.$clipParent.clientHeight;
          var imageRatio = this.$image.width / this.$image.height;
          return ratio > imageRatio ? this.$clipParent.clientHeight / this.$image.height : this.$clipParent.clientWidth / this.$image.width;
      };
      YuumiClip.prototype.getDesgin = function (scale) {
          var width = this.$image.width * scale;
          var height = this.$image.height * scale;
          var x = (this.$clipParent.clientWidth - width) / 2;
          var y = (this.$clipParent.clientHeight - height) / 2;
          return { x: x, y: y, width: width, height: height };
      };
      YuumiClip.prototype.renderImage = function () {
          var data = this.getDesgin(this.scale);
          this.$image.dataset.width = this.$image.width;
          this.$image.dataset.height = this.$image.height;
          this.$image.dataset.left = 0;
          this.$image.dataset.top = 0;
          this.$image.setAttribute('width', data.width);
          this.$image.setAttribute('height', data.height);
          var imageParent = createElement('div', {
              class: 'source-wrapper',
              style: {
                  left: data.x + "px",
                  top: data.y + "px",
                  height: data.height + "px",
                  width: data.width + "px"
              }
          }, [this.$image]);
          this.$clipParent.appendChild(imageParent);
      };
      YuumiClip.prototype.renderClip = function () {
          var ratio = this.$options.ratio;
          if (ratio) {
              var offset = this.getElementOffset(this.$clipParent);
              var _ratio = offset.width / offset.height;
              var _width = ratio > _ratio ? offset.width : offset.height * ratio;
              var _height = ratio > _ratio ? offset.width / ratio : offset.height;
              var _left = (offset.width - _width) / 2;
              var _top = (offset.height - _height) / 2;
              this.$clip = renderClip({
                  left: _left,
                  top: _top,
                  width: _width,
                  height: _height
              });
          }
          else {
              this.$clip = renderClip(this.getElementOffset(this.$image.parentNode));
          }
          this.$clipParent.appendChild(this.$clip);
      };
      YuumiClip.prototype.getElementOffset = function (element) {
          return {
              left: element.offsetLeft,
              top: element.offsetTop,
              width: element.offsetWidth,
              height: element.offsetHeight
          };
      };
      YuumiClip.prototype.bindEvents = function () {
          var _this = this;
          var element = this.$clipParent;
          element.addEventListener('touchstart', this.touchstart.bind(this));
          element.addEventListener('touchend', this.touchend.bind(this));
          element.addEventListener('touchcancel', this.touchend.bind(this));
          element.addEventListener('touchmove', function (e) {
              e.preventDefault();
              if (_this.firstTouches.length === 1 && e.touches.length === 1) {
                  var _target = _this.firstTouches[0].target;
                  if (_target.classList.contains('left-top')) {
                      !_this.$options.ratio && _this.resizeFromLeftTop(e.touches[0]);
                  }
                  else if (_target.classList.contains('left-bottom')) {
                      !_this.$options.ratio && _this.resizeFromLeftBottom(e.touches[0]);
                  }
                  else if (_target.classList.contains('right-top')) {
                      !_this.$options.ratio && _this.resizeFromRightTop(e.touches[0]);
                  }
                  else if (_target.classList.contains('right-bottom')) {
                      !_this.$options.ratio && _this.resizeFromRightBottom(e.touches[0]);
                  }
                  else {
                      _this.updateImagePosition(e.touches);
                  }
              }
              if (_this.firstTouches.length === 2 && e.touches.length === 2) {
                  _this.imageScale(e.touches);
              }
              _this.finalTouches = e.touches;
          });
          this.$el.querySelector('.footer-cancel').addEventListener('click', this.onCancel.bind(this));
          this.$el.querySelector('.footer-confirm').addEventListener('click', this.onConfirm.bind(this));
          this.$el.querySelector('.footer-rotate').addEventListener('click', this.onRotate.bind(this));
      };
      YuumiClip.prototype.touchstart = function (e) {
          this.firstTouches = e.touches;
          if (e.touches.length === 1) {
              var _target = e.touches[0].target;
              if (_target.classList.contains('rect')) {
                  this.clipOffset = this.getElementOffset(this.$clip);
              }
          }
          e.preventDefault();
      };
      YuumiClip.prototype.touchend = function (e) {
          if (this.clipOffset) {
              this.clipOffset = null;
          }
          if (this.firstTouches.length === 2 && this.finalTouches.length === 2) {
              var _scale = this.getScale(this.firstTouches, this.finalTouches);
              var _style = this.getImageStyle(_scale);
              // save the [top, left, scale] for next scale action.
              this.$image.dataset.top = _style.top;
              this.$image.dataset.left = _style.left;
              this.scale = _scale;
          }
          if (this.firstTouches.length === 1 && this.finalTouches.length === 1) {
              if (!this.finalTouches[0].target.classList.contains('rect')) {
                  // save the [top, left] from next move.
                  var position = this.getImagePosition(this.finalTouches);
                  this.$image.dataset.top = position.top;
                  this.$image.dataset.left = position.left;
              }
          }
          if (this.firstTouches.length > 0) {
              this.firstTouches = [];
          }
          if (this.finalTouches.length > 0) {
              this.finalTouches = [];
          }
          e.preventDefault();
      };
      YuumiClip.prototype.getLeftValue = function (touch, max) {
          var x = touch.pageX - this.firstTouches[0].pageX;
          return Math.min(Math.max(this.clipOffset.left + x, 0), max - this.rectSize * 2);
      };
      YuumiClip.prototype.getTopValue = function (touch, maxY) {
          var y = touch.pageY - this.firstTouches[0].pageY;
          return Math.min(Math.max(this.clipOffset.top + y, 0), maxY - this.rectSize * 2);
      };
      YuumiClip.prototype.resizeFromLeftTop = function (touch) {
          var maxX = this.clipOffset.left + this.clipOffset.width;
          var left = this.getLeftValue(touch, maxX);
          var maxY = this.clipOffset.height + this.clipOffset.top;
          var top = this.getTopValue(touch, maxY);
          var width = maxX - left;
          var height = maxY - top;
          this.$clip.style.left = left + "px";
          this.$clip.style.top = top + "px";
          this.$clip.style.width = width + "px";
          this.$clip.style.height = height + "px";
      };
      YuumiClip.prototype.resizeFromLeftBottom = function (touch) {
          var maxX = this.clipOffset.width + this.clipOffset.left;
          var left = this.getLeftValue(touch, maxX);
          var width = maxX - left;
          var y = touch.pageY - this.firstTouches[0].pageY;
          var height = Math.min(Math.max(this.rectSize * 2, this.clipOffset.height + y), this.$clipParent.offsetHeight - this.clipOffset.top);
          this.$clip.style.left = left + "px";
          this.$clip.style.width = width + "px";
          this.$clip.style.height = height + "px";
      };
      YuumiClip.prototype.resizeFromRightTop = function (touch) {
          var x = touch.pageX - this.firstTouches[0].pageX;
          var width = Math.min(Math.max(this.rectSize * 2, this.clipOffset.width + x), this.$clipParent.offsetWidth - this.clipOffset.left);
          var maxY = this.clipOffset.height + this.clipOffset.top;
          var top = this.getTopValue(touch, maxY);
          var height = maxY - top;
          this.$clip.style.top = top + "px";
          this.$clip.style.width = width + "px";
          this.$clip.style.height = height + "px";
      };
      YuumiClip.prototype.resizeFromRightBottom = function (touch) {
          var x = touch.pageX - this.firstTouches[0].pageX;
          var width = Math.min(Math.max(this.rectSize * 2, this.clipOffset.width + x), this.$clipParent.offsetWidth - this.clipOffset.left);
          var y = touch.pageY - this.firstTouches[0].pageY;
          var height = Math.min(Math.max(this.rectSize * 2, this.clipOffset.height + y), this.$clipParent.offsetHeight - this.clipOffset.top);
          this.$clip.style.width = width + "px";
          this.$clip.style.height = height + "px";
      };
      YuumiClip.prototype.getScale = function (start, end) {
          var xx1 = Math.pow(start[1].pageX - start[0].pageX, 2);
          var yy1 = Math.pow(start[1].pageY - start[0].pageY, 2);
          var l1 = Math.sqrt(xx1 + yy1);
          var xx2 = Math.pow(end[1].pageX - end[0].pageX, 2);
          var yy2 = Math.pow(end[1].pageY - end[0].pageY, 2);
          var l2 = Math.sqrt(xx2 + yy2);
          var scale = this.scale * l2 / l1;
          return Math.max(this.minScale, scale);
      };
      YuumiClip.prototype.getImageStyle = function (scale) {
          var dataset = this.$image.dataset;
          var x = Number(dataset.width) * (scale - this.scale) / 2;
          var y = Number(dataset.height) * (scale - this.scale) / 2;
          return {
              width: Number(dataset.width) * scale,
              height: Number(dataset.height) * scale,
              left: Number(dataset.left) - x,
              top: Number(dataset.top) - y
          };
      };
      YuumiClip.prototype.imageScale = function (touches) {
          var scale = this.getScale(this.firstTouches, touches);
          var _style = this.getImageStyle(scale);
          this.$image.setAttribute('width', _style.width);
          this.$image.setAttribute('height', _style.height);
          this.$image.setAttribute('style', "transform: translate3d(" + _style.left + "px, " + _style.top + "px, 0px) rotate(" + this.rotate + "deg);");
      };
      YuumiClip.prototype.getImagePosition = function (touches) {
          var x = touches[0].pageX - this.firstTouches[0].pageX;
          var y = touches[0].pageY - this.firstTouches[0].pageY;
          var dataset = this.$image.dataset;
          var left = Number(dataset.left) + x;
          var top = Number(dataset.top) + y;
          return {
              left: left,
              top: top
          };
      };
      YuumiClip.prototype.updateImagePosition = function (touches) {
          var position = this.getImagePosition(touches);
          this.$image.style.marginLeft = position.left + "px";
          this.$image.style.marginTop = position.top + "px";
          this.$image.setAttribute('style', "transform: translate3d(" + position.left + "px, " + position.top + "px, 0px) rotate(" + this.rotate + "deg);");
      };
      YuumiClip.prototype.destroy = function () {
          if (!this.$el)
              return null;
          this.$el.parentNode.removeChild(this.$el);
          this.$el = null;
      };
      YuumiClip.prototype.onCancel = function () {
          if (validator.isFunction(this.$options.cancel)) {
              this.$options.cancel(this.destroy.bind(this));
          }
          else {
              this.destroy();
          }
      };
      YuumiClip.prototype.onConfirm = function () {
          var _this = this;
          var clipBounding = this.$clip.getBoundingClientRect();
          var imageBounding = this.$image.getBoundingClientRect();
          // const imageDataset = this.$image.dataset
          var canvas = document.createElement('canvas');
          canvas.width = clipBounding.width / this.scale;
          canvas.height = clipBounding.height / this.scale;
          canvas.setAttribute('style', "width: " + clipBounding.width + "px; height: " + clipBounding.height + "px;");
          var dWidth = this.$image.offsetWidth / this.scale;
          var dHeight = this.$image.offsetHeight / this.scale;
          var dx = 0;
          var dy = 0;
          switch (this.rotate) {
              case -90:
                  dx = (dHeight - dWidth) / 2 - (imageBounding.top - clipBounding.top) / this.scale;
                  dy = (dHeight - dWidth) / 2 - (clipBounding.left - imageBounding.left) / this.scale;
                  break;
              case -180:
                  dx = 0 - (imageBounding.left - clipBounding.left) / this.scale;
                  dy = 0 - (imageBounding.top - clipBounding.top) / this.scale;
                  break;
              case -270:
                  dx = (imageBounding.top - clipBounding.top) / this.scale - (dHeight - dWidth) / 2;
                  dy = (clipBounding.left - imageBounding.left) / this.scale - (dHeight - dWidth) / 2;
                  break;
              default:
                  dx = (imageBounding.left - clipBounding.left) / this.scale;
                  dy = (imageBounding.top - clipBounding.top) / this.scale;
          }
          var ctx = canvas.getContext('2d');
          ctx.save();
          ctx.translate(dWidth / 2, dHeight / 2);
          ctx.rotate(this.rotate * Math.PI / 180);
          ctx.translate(-dWidth / 2, -dHeight / 2);
          ctx.drawImage(this.$image, 0, 0, this.$image.dataset.width, this.$image.dataset.height, dx, dy, dWidth, dHeight);
          ctx.restore();
          if (!validator.isFunction(this.$options.confirm)) {
              this.destroy();
              return null;
          }
          switch (this.$options.expect) {
              case 'blob':
                  $file.canvas2Blob(canvas, 0.92, this.file.type).then(function (blob) {
                      _this.$options.confirm(blob, _this.destroy.bind(_this));
                  });
                  break;
              case 'file':
                  this.$options.confirm($file.dataURL2File($file.canvas2DataURL(canvas, 0.92, this.file.type), this.file.name), this.destroy.bind(this));
                  break;
              case 'base64':
                  this.$options.confirm($file.canvas2DataURL(canvas, 0.92, this.file.type), this.destroy.bind(this));
                  break;
          }
      };
      YuumiClip.prototype.onRotate = function () {
          this.rotate = (this.rotate - 90) % 360;
          this.$image.setAttribute('style', "transform: translate3d(" + this.$image.dataset.left + "px, " + this.$image.dataset.top + "px, 0px) rotate(" + this.rotate + "deg);");
      };
      return YuumiClip;
  }());

  return YuumiClip;

})));
