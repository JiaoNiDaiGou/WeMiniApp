const backend = require('../../utils/backend.js')
const utils = require('../../utils/util.js')
const app = getApp()
Page({

  /**
   * Page initial data
   */
  data: {
    product: null,
    images: [],
    parsedMediaIds: [],
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {

  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {

  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  },

  onImagesChange: function (e) {
    var images = e.detail.value
    var unparsedMediaIds = images.filter(t => !!t.mediaId && !this.data.parsedMediaIds.includes(t.mediaId)).map(t => t.mediaId)
    this.setData({
      images: images
    })
    if (!!unparsedMediaIds && unparsedMediaIds.length > 0) {
      backend.promiseOfParseProduct(app, unparsedMediaIds)
        .then(r => {
          var suggestedProducts = r.res.data
          console.log(suggestedProducts)
          
        })
    }
  },

  onProductsChange: function (e) {
    var product = e.detail.value[0]
    var mediaIds = this.data.images.map(t => t.mediaId)
    if (!!product.id) {
      console.log('not supported')
    } else {
      wx.showLoading({
        title: '正在入库',
      })
      var inventoryItem = this.convertToProtoInventoryItem(product, mediaIds)
      backend.promiseOfCreateInventoryItem(app, inventoryItem)
        .then(r => {
          var productId = r.res.data.product.id
          wx.hideLoading()
          wx.redirectTo({
            url: './inventory-list?productId=' + productId,
          })
        })
    }
  },

  convertToProtoInventoryItem: function (product, mediaIds) {
    return {
      product: {
        name: product.name,
        brand: product.brand,
        category: product.category,
        mediaIds: mediaIds,
        suggestedUnitPrice: {
          unit: 'USD',
          value: product.price
        }
      },
      quantity: product.quantity
    }
  }
})