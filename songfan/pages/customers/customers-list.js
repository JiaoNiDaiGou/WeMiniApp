// pages/customers/customers-list.js
const utils = require('../../utils/util.js')
const backend = require('../../utils/backend.js')
const app = getApp()

Page({

  /**
   * Page initial data
   */
  data: {
    customerSearchResultCandidates: [],
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
    // Force to load search candidates again
    this.setData({
      customerSearchResultCandidates: this.data.customerSearchResultCandidates
    })
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
    console.log('refresh customers');
    wx.showNavigationBarLoading();
    backend.promiseOfLoadAllCustomers(app)
      .then(app => {
        console.log('finish refreshing customers');
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
        wx.showToast({
          title: '客户列表已刷新',
          duration: 1000,
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
  filterCustomersSearchResultCandidates: function (e) {
    var inputVal = e.detail.inputVal;
    if (inputVal == '') {
      this.setData({
        customerSearchResultCandidates: []
      });
    } else {
      var customerSearchResultCandidates = app.globalData.customers
        .filter(t => t.name.includes(inputVal) || t.phone.phone.includes(inputVal))
        .slice(0, 20)
        .map(t => {
          return {
            id: t.id,
            display: t.name + ' ' + t.phone.phone + ' [' + t.addresses[0].region + ' ' + t.addresses[0].city + ']'
          }
        });
      this.setData({
        customerSearchResultCandidates: customerSearchResultCandidates
      });
    }
  },

  /**
   * Natigate to customer detail page.
   */
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