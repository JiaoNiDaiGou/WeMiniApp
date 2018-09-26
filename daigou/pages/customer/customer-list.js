// pages/customer/customer-list.js
const util = require('../../utils/util.js')
const app = getApp();

Page({

  /**
   * Page initial data
   */
  data: {
    customers: [],
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    if (this.data.customers.length == 0) {
      wx.request({
        url: util.BE_ENDPOINT + '/api/customers/jiaonidaigou/getAll',
        header: {
          'X-Wx-SessionTicket': app.globalData.sessionTicketId
        },
        success: res => {
          this.data.customers = res;
        }
      })
    }
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
  loadAllCustomers: function () {
    
  }
})