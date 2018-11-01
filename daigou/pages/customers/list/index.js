// pages/customers/list/list.js

const backend = require('../../../utils/backend.js')
const app = getApp()

Page({

  /**
   * Page initial data
   */
  data: {
    customerCandidates: [],
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

  onCustomerSearchInput: function (e) {
    var value = e.detail.value;
    var customerCandidates = []
    if (!!value) {
      customerCandidates = app.globalData.customers
        .filter(t => t.name.includes(value) || t.phone.phone.includes(value))
        .slice(0, 20)
        .map(t => this.toCustomerSearchOption(t))
    }
    this.setData({
      customerCandidates: customerCandidates
    });
  },

  onCustomerCandidateSelect: function (e) {
    var customerId = e.detail.value
    var customer = app.globalData.customers.find(t => t.id === customerId)
    if (customer) {
      console.log('go to CustomerDetails for ' + customerId)
      wx.navigateTo({
        url: '../details/index?id=' + customerId,
      })
    }
  },

  onCreateCustomerClick: function () {
    wx.navigateTo({
      url: '../create/index',
    })
  },

  toCustomerSearchOption: function (customer) {
    return {
      id: customer.id,
      text: customer.name + ' ' +
        (!!customer.phone && !!customer.phone.phone ? customer.phone.phone : '') +
        (!!customer.addresses && customer.addresses.length > 0 ? ' [' + customer.addresses[0].region + ' ' + customer.addresses[0].city + ']' : '')
    }
  }
})
