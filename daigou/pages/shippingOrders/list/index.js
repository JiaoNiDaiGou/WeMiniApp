// pages/shippingOrders/list/index.js
const utils = require('../../../utils/Utils.js')
const backend = require('../../../utils/Backend.js')
const app = getApp()

const LIMIT = 10

Page({

  /**
   * Page initial data
   */
  data: {
    orders: [],
    pageToken: null,
    loadingMore: false,
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    this.loadShippingOrders()
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
    this.setData({
      orders: [],
      pageToken: null
    })
    this.loadShippingOrders()
  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {
    var { orders, pageToken } = this.data
    if (orders.length > 0 && pageToken) {
      this.loadShippingOrders()
    }
  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  },

  onTabChange: function (e) {
    var tabKey = e.detail.key
    this.setData({
      curTab: tabKey
    })
  },

  loadShippingOrders: function () {
    this.setData({
      loadingMore: true,
    })

    var that = this
    backend.queryShippingOrders(app, null, LIMIT, this.data.pageToken)
      .then(r => {
        var orders = that.data.orders;
        var res = r.res.data;
        res.results.forEach(t => {
          t.status = !!t.status ? t.status : 'INIT'
          t.statusName = utils.getShippingOrderStatusNameByValue(t.status)
          t.creationTs = t.creationTime ? utils.formatTimestamp(parseInt(t.creationTime)) : ''
          console.log(t)
          t.renderableProducts = utils.convertToRenderableProducts(t.productEntries)
          orders.push(t)
        })

        that.setData({
          orders: orders,
          pageToken: !!res.pageToken ? res.pageToken : null,
          loadingMore: false
        })
      })
  }
})