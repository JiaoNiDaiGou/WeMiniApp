//app.js
const utils = require('./utils/util.js')
const backend = require('/utils/backend.js')

App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // Login
    wx.showLoading({ title: '登陆娇妮代购' })
    backend.promiseOfBackendLogin(this)
      .then(r => {
        wx.showLoading({ title: '加载客户信息' })
        backend.promiseOfLoadAllCustomers(r.app)
          .then(r => {
            wx.showLoading({ title: '加载商品信息' })
            backend.promiseOfLoadProductsHints(r.app)
              .then(r => {
                wx.hideLoading()
              })
          })
      })
  },

  globalData: {
    userInfo: null,
    sessionTicketId: null,
    productNameToBrandHints: [],
    productNameToCategoryHints: [],
    productBrandToCategoryHints: [],
    customers: []
  }
})