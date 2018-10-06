// pages/shoppingLists/shoppingLists-create.js
const backend = require('../../utils/backend.js')
const utils = require('../../utils/util.js')
const app = getApp()

Page({

  /**
   * Page initial data
   */
  data: {
    content: '',
    images: []
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

  onConfimTap: function (e) {
    // Wait for all images uploaded
    var allImagesUploaded = this.data.images.every(t => !!t && !!t.mediaId)
    if (!allImagesUploaded) {
      wx.showModal({
        content: '等待所有图片上传完成',
      })
    } else {
      var mediaIds = this.data.images.map(t => t.mediaId)
      backend.promiseOfInitShoppingList(app, this.data.content, mediaIds) 
        .then(r => {
          wx.showToast({
            title: '添加成功',
            duration: 800
          })
          wx.redirectTo({
            url: './shoppingLists-list',
          })
        })
    }
  },

  onContentInput: function (e) {
    this.setData({
      content: e.detail.value
    })
  },

  onImagesChanged: function (e) {
    this.setData({
      images: e.detail.images
    })
  },
})