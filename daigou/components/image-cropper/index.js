// components/image-cropper/index.js

const SCREEN_WIDTH = 750
const DRAG_MOVE_RATIO = 750 / wx.getSystemInfoSync().windowWidth //移动时候的比例

let
  IMG_RATIO, // 图片比例
  IMG_REAL_W, // 图片实际的宽度
  IMG_REAL_H // 图片实际的高度

const safeDiff = (base, diff, min, max) => {
  base += diff
  if (base < min) return min
  if (base > max) return max
  return base
}

Component({
  /**
   * Component properties
   */
  properties: {
    imgPath: {
      type: String,
      value: ''
    }
  },

  /**
   * Component initial data
   */
  data: {

    // 是否显示图片(在图片加载完成之后设置为true)
    isShowImg: false,

    // the outer box W and H
    outerBoxW: -1,
    outerBoxH: -1,

    // 动态的宽高
    cropperW: -1,
    cropperH: -1,
    cropperL: -1,
    cropperT: -1,

    // 裁剪框 宽高
    cutL: -1,
    cutT: -1,
    cutB: -1,
    cutR: -1,
    qualityWidth: -1,
    innerAspectRadio: -1,

    // img
    imgW: -1,
    imgH: -1,

    //
    // Tracking drag
    startX: -1,
    startY: -1,
    beforeDragL: -1,
    beforeDragR: -1,
    beforeDragT: -1,
    beforeDragB: -1,
  },

  lifetimes: {
    ready: function () {
      if (this.data.imgPath) {
        this.loadImage()
      }
    }
  },

  /**
   * Component methods
   */
  methods: {
    donothing: function () {},
    /**
     * 初始化图片信息
     * 获取图片内容，并初始化裁剪框
     */
    loadImage: function () {
      var that = this
      wx.showLoading({
        title: '加载图片',
      })
      var {
        imgPath
      } = this.data

      wx.getImageInfo({
        src: imgPath,
        success: function success(res) {
          IMG_REAL_W = res.width
          IMG_REAL_H = res.height
          IMG_RATIO = IMG_REAL_W / IMG_REAL_H
          // 根据图片的宽高显示不同的效果   保证图片可以正常显示
          if (IMG_RATIO >= 1) { // w > h
            that.setData({
              outerBoxW: SCREEN_WIDTH,
              outerBoxH: SCREEN_WIDTH,
              cropperW: SCREEN_WIDTH,
              cropperH: SCREEN_WIDTH / IMG_RATIO,
              cropperL: 0,
              cropperT: Math.ceil((SCREEN_WIDTH - SCREEN_WIDTH / IMG_RATIO) / 2),
              cutL: 30,
              cutT: 30,
              cutB: 30,
              cutR: 30,
              qualityWidth: IMG_REAL_W,
              innerAspectRadio: IMG_RATIO,
              isShowImg: true
            })
          } else { // h > w
            that.setData({
              outerBoxW: SCREEN_WIDTH,
              outerBoxH: SCREEN_WIDTH / IMG_RATIO,
              cropperW: SCREEN_WIDTH,
              cropperH: SCREEN_WIDTH / IMG_RATIO,
              cropperL: 0,
              cropperT: 0,
              cutL: 30,
              cutT: 30,
              cutB: 30,
              cutR: 30,
              qualityWidth: IMG_REAL_W,
              innerAspectRadio: IMG_RATIO,
              isShowImg: true
            })
          }
          wx.hideLoading()
        }
      })
    },

    /**
     * 获取图片
     */
    onCropClick() {
      var that = this
      wx.showLoading({
        title: '剪裁图片',
      })
      var {
        imgPath,
        cropperW,
        cropperH,
        cutL,
        cutR,
        cutB,
        cutT
      } = this.data
      const ctx = wx.createCanvasContext('image-cropper-canvas', this)
      ctx.drawImage(imgPath, 0, 0, IMG_REAL_W, IMG_REAL_H);
      ctx.draw(true, () => {
        // 获取画布要裁剪的位置和宽度   均为百分比 * 画布中图片的宽度    保证了在微信小程序中裁剪的图片模糊  位置不对的问题
        var canvasW = ((cropperW - cutL - cutR) / cropperW) * IMG_REAL_W
        var canvasH = ((cropperH - cutT - cutB) / cropperH) * IMG_REAL_H
        var canvasL = (cutL / cropperW) * IMG_REAL_W
        var canvasT = (cutT / cropperH) * IMG_REAL_H
        // 生成图片
        wx.canvasToTempFilePath({
          x: canvasL,
          y: canvasT,
          width: canvasW,
          height: canvasH,
          destWidth: canvasW,
          destHeight: canvasH,
          quality: 0.5,
          canvasId: 'image-cropper-canvas',
          success: function (res) {
            wx.hideLoading()
            that.setData({
              imgPath: res.tempFilePath
            })
            that.triggerEvent('imageChange', {
              value: res.tempFilePath
            })
            that.loadImage()
          },
          fail: r => console.log(r)
        }, that)
      })
    },

    onDragStart(e) {
      var startX = e.touches[0].pageX
      var startY = e.touches[0].pageY
      var {
        cutL,
        cutR,
        cutB,
        cutT
      } = this.data
      this.setData({
        startX,
        startY,
        beforeDragL: cutL,
        beforeDragR: cutR,
        beforeDragT: cutT,
        beforeDragB: cutB
      })
    },

    onDragMove(e) {
      var dragType = e.currentTarget.dataset.drag
      var endX = e.touches[0].pageX
      var endY = e.touches[0].pageY
      var {
        cropperW,
        cropperH,
        cutL,
        cutR,
        cutT,
        cutB,
        startX,
        startY,
        beforeDragL,
        beforeDragR,
        beforeDragT,
        beforeDragB
      } = this.data
      var diffX = (startX - endX) * DRAG_MOVE_RATIO
      var diffY = (startY - endY) * DRAG_MOVE_RATIO
      switch (dragType) {
        case 'tl':
          {
            cutL = safeDiff(beforeDragL, -diffX, 0, cropperW - cutR)
            cutT = safeDiff(beforeDragT, -diffY, 0, cropperH - cutB)
            break
          }
        case 'br':
          {
            cutR = safeDiff(beforeDragR, diffX, 0, 999)
            cutB = safeDiff(beforeDragB, diffY, 0, 999)
            break
          }
        case 'tr':
          {
            cutR = safeDiff(beforeDragR, diffX, 0, 999)
            cutT = safeDiff(beforeDragT, -diffY, 0, cropperH - cutB)
            break
          }
        case 'bl':
          {
            cutL = safeDiff(beforeDragL, -diffX, 0, cropperW - cutR)
            cutB = safeDiff(beforeDragB, diffY, 0, 999)
            break
          }
        case 'all':
          {
            cutL = safeDiff(beforeDragL, -diffX, 0, cropperW - cutR)
            cutB = safeDiff(beforeDragB, diffY, 0, 999)
            cutR = safeDiff(beforeDragR, diffX, 0, 999)
            cutT = safeDiff(beforeDragT, -diffY, 0, cropperH - cutB)
            break
          }
        default:
          break
      }
      this.setData({
        cutL,
        cutR,
        cutT,
        cutB
      })
    }
  }
})
