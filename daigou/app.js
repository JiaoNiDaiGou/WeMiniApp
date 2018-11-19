const utils = require('./utils/Utils.js')
const backend = require('/utils/Backend.js')
const consts = require('/utils/Constants.js')
const syncProductsHints = require('/utils/SyncProductsHints.js')
const syncCustomers = require('/utils/SyncCustomers.js')

App({
  onLaunch: function() {
    var that = this
    if (!consts.CALL_BACKEND) {
      return
    }

    wx.showLoading({
      title: '加载信息(' + consts.ENV + ')' 
    })

    Promise.all([
      syncProductsHints.sync(this),
      syncCustomers.sync(this)
    ]).then(() => {
      wx.hideLoading()
    })
  },

  globalData: {
    productNameToBrandHints: [],
    productNameToCategoryHints: [],
    productBrandToCategoryHints: [],
    customers: []
  }
})