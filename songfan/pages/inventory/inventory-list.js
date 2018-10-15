const backend = require('../../utils/backend.js')
const utils = require('../../utils/util.js')
const app = getApp()

Page({

  /**
   * Page initial data
   */
  data: {
    inventoryItems: [],

    curActionItem: null,
    actionModalShow: false,
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

  onInventoryItemLongPress: function (e) {
    var itemid = e.currentTarget.dataset.itemid
    var item = this.data.inventoryItems.find(t => t.id == itemid)
    if (item.actionable) {
      this.setData({
        curActionItem: item,
        actionModalShow: true
      })
    }
  },

  onActionModalConfirm: function (e) {
    this.setData({
      actionModalShow: false,
    })
  },

  onActionModalCancel: function (e) {
    this.setData({
      actionModalShow: false
    })
  },

  loadInventory: function () {
    var that = this
    backend.promiseOfLoadAllInventory(app)
      .then(r => {
        
      })
  }
})