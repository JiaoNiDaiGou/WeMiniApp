// pages/customers/customer-details.js
const utils = require('../../utils/util.js')
const app = getApp()

Page({

  /**
   * Page initial data
   */
  data: {
    customer: null,
    openShippingOrders: [],
    openShippingOrdersNextToken: null,
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    var id = options.id;
    console.log('load customer details for ' + id);
    var customer = app.globalData.customers
      .filter(t => t.id === options.id)[0];
    this.setData({
      customer: customer
    })

    // Load open shipping orders:
    console.log('Load undelivered orders for ' + customer.name);
    wx.request({
      method: 'GET',
      url: utils.BE_SERVER + '/api/shippingOrders/query?customerPhone=' + customer.phone.phone,
      header: {
        'X-Wx-SessionTicket': app.globalData.sessionTicketId
      },
      success: res => {
        this.setData({
          openShippingOrders: res.data.results,
          openShippingOrdersNextToken: !!res.data.pageToken ? res.data.pageToken : null
        });
      }
    })
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

  /**
   * Go to create shipping order page.
   */
  goToCreateShippingOrder: function(e) {
    wx.redirectTo({
      url: '../shippingOrders/shippingOrders-create',
    })
  }
})