const utils = require('../../utils/util.js');
const app = getApp()

Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    images: [],
    showFeedback: false,
    products: [],
  },
  onLoad: function () {},

  onShow: function () {
    utils.enableFeedbackShake(this)
  },

  onFeedbackDone: e => {
    utils.onFeedbackDone(this)
  },

  goToCustomersList: () => {
    wx.navigateTo({
      url: '../customers/list/index',
    })
  }
})
