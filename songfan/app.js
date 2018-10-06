//app.js
const utils = require('./utils/util.js')
const backend = require('/utils/backend.js')

App({
  onLaunch: function () {
    var that = this

    wx.showLoading({ title: '登陆娇妮代购' })
    backend.promiseOfBackendLogin(this)
      .then(r => {
        wx.showLoading({ title: '正在加载信息' })
        Promise.all([
          that.syncCustomers(),
          that.syncProductHints()
        ]).then(() => {
          wx.hideLoading()
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
  },

  syncCustomers: function () {
    var that = this
    return backend.promiseOfLoadAllCustomers(that)
      .then(r => {
        var customers = r.res.data.results
        console.log('load ' + customers.length + ' customers')
        that.globalData.customers = customers
      })
  },

  syncProductHints: function () {
    var key = 'productHints'
    var nowMillis = new Date().getTime()
    var expireMillis = nowMillis - 1 * 24 * 60 * 60 * 1000
    var that = this

    var promiseOfLoadFromLocal = new Promise(function (resolve, reject) {
      wx.getStorage({
        key: key,
        success: res => {
          if (!!res.data) {
            var hintsWithTs = JSON.parse(res.data)
            if (!!hintsWithTs.ts && hintsWithTs.ts > expireMillis) {
              resolve(hintsWithTs.hints)
            }
          }
          resolve(null)
        },
        fail: () => {
          resolve(null)
        }
      })
    })

    return promiseOfLoadFromLocal
      .then(hints => {
        if (!!hints) {
          that.setProductsHints(hints)
          return
        }

        backend.promiseOfLoadProductsHints(that)
          .then(r => {
            var hints = r.res.data
            that.setProductsHints(hints)
            var hintsWithTs = {
              ts: new Date().getTime(),
              hints: hints
            }
            wx.setStorage({
              key: key,
              data: JSON.stringify(hintsWithTs),
            })
          })
      })
  },

  setProductsHints: function (hints) {
    // fulfill
    hints.forEach(hint => {
      var category = hint.left;
      var categoryIndex = utils.findProductCategoryIndexByValue(category);
      var brand = hint.middle;
      utils.incTableCount(this.globalData.productBrandToCategoryHints, brand, categoryIndex);
      var names = hint.right;
      names.forEach(name => {
        utils.incTableCount(this.globalData.productNameToBrandHints, name, brand);
        utils.incTableCount(this.globalData.productNameToCategoryHints, name, categoryIndex);
      })
    })

    // sort
    this.globalData.productBrandToCategoryHints.forEach(t => t.val.sort((a, b) => b.val - a.val))
    this.globalData.productNameToBrandHints.forEach(t => t.val.sort((a, b) => b.val - a.val))
    this.globalData.productNameToCategoryHints.forEach(t => t.val.sort((a, b) => b.val - a.val))
  }
})