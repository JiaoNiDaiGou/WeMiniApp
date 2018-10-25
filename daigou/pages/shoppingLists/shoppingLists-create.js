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
    images: [],
    tags: [],

    hasQuantityTag: false,
    hasColorTag: false,
    hasSizeTag: false,
    possibleTags: [],

    allColor: utils.cnColors
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
    var content = e.detail.value
    if (!content) {
      return
    }
    // Check last 10 chars
    content = content.replace(/\s/g, "")
    content = content.substring(content.length - 10, content.length)

    var possibleTags = this.parseContentTags(content)
    var hasImageTags = possibleTags.some(t => t.type == 'i')
    this.setData({
      content: e.detail.value,
      possibleTags: possibleTags
    })
  },

  onImagesChanged: function (e) {
    this.setData({
      images: e.detail.value
    })
  },

  onPossibleTagTap: function(e) {
    var tag = e.currentTarget.dataset.tag
    var tags = this.data.tags
    tags.push(tag)
    var hasColorTag = this.data.hasColorTag
    if (tag.type == 'color') {
      hasColorTag = true
    }
    var hasSizeTag = this.data.hasSizeTag
    if (tag.type == 'size') {
      hasSizeTag = true
    }
    var hasQuantityTag = this.data.hasQuantityTag
    if (tag.type == 'quantity') {
      hasQuantityTag = true
    }
    this.setData({
      tags: tags,
      hasColorTag: hasColorTag,
      hasSizeTag: hasSizeTag,
      hasQuantityTag: hasQuantityTag
    })
  },

  parseContentProducts: function (content) {

  },

  // Tag is
  // { tag: 'xxx', type: 'color', 'size', 'quantity', 'pbrand', 'pname' }
  parseContentTags: function (content) {
    var allTags = []

    // check possible color tags
    utils.colorSpecs
      .filter(t => content.includes(t.name))
      .forEach(t => allTags.push({
        tag: t.name + '色',
        bgcolor: t.bgcolor,
        color: t.color,
        type: 'color'
      }))
    
    // check possible size tags
    utils.sizeSpecs
      .filter(t => content.toLowerCase().includes(t.toLowerCase()))
      .forEach(t => allTags.push({
        tag: t,
        type: 'size'
      }))

    // check possible quantity tags
    var possibleQuantityTags = content.match(/\d+(.\d+)?/g)
    if (!!possibleQuantityTags) {
      possibleQuantityTags = possibleQuantityTags
        .map(t => t + '件')
        .forEach(t => allTags.push({
          tag: t,
          type: 'quantity'
        }))
    }

    return allTags
  }
})