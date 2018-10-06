//index.js
const utils = require('../../utils/util.js');
const app = getApp()

Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),


    showFeedback: false
  },
  onLoad: function () { },
  
  onShow: function () {
    utils.enableFeedbackShake(this)
  },
  
  onFeedbackDone: function (e) {
    utils.onFeedbackDone(this)
  },

  goToCustomersList: function () {
    console.log('go to customers-list');
    wx.navigateTo({
      url: '../customers/customers-list',
    })
  },
  goToShippingOrdersList: function () {
    console.log('go to shippingOrders-list');
    wx.navigateTo({
      url: '../shippingOrders/shippingOrders-list',
    })
  },
  goToShoppingListsList: function () {
    console.log('go to shoppingLists-list')
    wx.navigateTo({
      url: '../shoppingLists/shoppingLists-list',
    })
  },
  showmodal: function (e) {
    this.setData({
      showModal: true
    })
  },

  onImgUploaded: function (e) {
    console.log('image uploaded:')
    console.log(e)
    console.log('\n')
  },

  onImgListChanged: function (e) {
    console.log('image list changed7:')
    console.log(e)
    console.log('\n')
  }
})