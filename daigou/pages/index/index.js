const utils = require('../../utils/Utils.js');
const app = getApp()

Page({
  data: {
    // canIUse: wx.canIUse('button.open-type.getUserInfo'),
    showFeedback: false
  },
  onLoad: function () {},

  onShow: function () {
    var {
      showFeedback
    } = this.data
    var that = this
    wx.onAccelerometerChange(function (e) {
      if (e.x > 1 && e.y > 1 && !showFeedback) {
        that.setData({
          showFeedback: true
        })
      }
    })
  },

  onFeedbackDone: function () {
    this.setData({
      showFeedback: false
    })
  },

  goToFeedbackList: function () {
    wx.navigateTo({
      url: '../feedback/list/index',
    })
  },

  goToCustomersList: function () {
    wx.navigateTo({
      url: '../customers/list/index',
    })
  },

  goToShippingOrdersList: function () {
    wx.navigateTo({
      url: '../shippingOrders/list/index',
    })
  }
})
