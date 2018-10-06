// pages/customers/customers-list.js
const utils = require('../../utils/util.js')
const backend = require('../../utils/backend.js')
const app = getApp()

Page({

  /**
   * Page initial data
   */
  data: {
    customerSearchCandidates: [],
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
    wx.showNavigationBarLoading();
    backend.promiseOfLoadAllCustomers(app)
      .then(r => {
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
        wx.showToast({
          title: '客户列表已刷新',
          duration: 800,
        })
      })
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
   * Filter customers search results.
   */
  filterCustomersSearchCandidates: function (e) {
    var inputValue = e.detail.inputValue
    if (!inputValue) {
      this.setData({
        customerSearchCandidates: []
      })
    } else {
      var customerSearchCandidates = app.globalData.customers
        .filter(t => t.name.includes(inputValue) || t.phone.phone.includes(inputValue))
        .slice(0, 20)
        .map(t => {
          return {
            id: t.id,
            display: t.name + ' '
              + (!!t.phone ? '' : t.phone.phone)
              + (!!t.addresses && t.addresses.length > 0 ? ' [' + t.addresses[0].region + ' ' + t.addresses[0].city + ']' : '')
          }
        });
      this.setData({
        customerSearchCandidates: customerSearchCandidates
      });
    }
  },

  goToCustomerDetails: function (e) {
    var customerId = e.detail.id;
    console.log('go to CustomerDetails for ' + customerId)
    wx.navigateTo({
      url: './customer-details?id=' + customerId,
    })
  },

  /**
   * Nagigate to customer create page.
   */
  goToCustomerCreate: function (e) {
    console.log('go to customerCreate.');
    wx.navigateTo({
      url: './customer-create',
    })
  }
})