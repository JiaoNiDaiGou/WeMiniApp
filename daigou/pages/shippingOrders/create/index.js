const utils = require('../../../utils/util.js')
const backend = require('../../../utils/backend.js')
const app = getApp()

Page({

  /**
   * Page initial data
   */
  data: {
    curStep: 0,

    products: [],
    totalWeight: 0,
    totalSellPrice: 200,

    customerId: '',
    name: '',
    phone: '',
    address: null,

    confirmModelHidden: true,

    readyToInit: false
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    var {
      customerId,
      name,
      phone,
      region,
      city,
      zone,
      address
    } = options
    this.setData({
      customerId,
      name,
      phone,
      address: {
        region,
        city,
        zone,
        address
      }
    })
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {},

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {},

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {},

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {},

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {},

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {},

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {},

  onConfirmModalConfirm: function (e) {
    var {
      customerId,
      address,
      products,
      totalSellPrice,
      totalWeight
    } = this.data

    this.setData({
      confirmModelHidden: true
    })

    const reqProducts = products.map(t => ({
      quantity: t.quantity,
      sellPrice: {
        unit: 'USD',
        value: t.price
      },
      product: {
        category: utils.productCategories[t.categoryIndex].value,
        name: t.name,
        brand: t.brand
      }
    }))
    const reqTotalWeight = parseFloat(totalWeight)

    wx.showLoading({
      title: '正在下单'
    })
    backend.promiseOfInitShippingOrder(app,
        customerId,
        address,
        reqProducts,
        reqTotalWeight,
        totalSellPrice)
      .then(r => {
        wx.hideLoading()
        if (r.res.statusCode != 200) {
          console.log(r.res)
          return
        }
        console.log('get shippingOrder ID: ' + r.res.data.id)
        if (!!r.res.data.teddyOrderId) {
          wx.showModal({
            title: '小熊下单成功',
            content: '快递单号:' + r.res.data.teddyFormattedId,
            success: res => {
              wx.redirectTo({
                url: './shippingOrders-list?statusIndex=2'
              })
            }
          })
        } else {
          wx.showModal({
            title: '创建成功',
            content: '单号:' + r.res.data.id,
            success: res => {
              wx.redirectTo({
                url: '../shippingOrders-list?statusIndex=0'
              })
            }
          })
        }
      })
  },

  onProductCreate: function (e) {
    var {
      products
    } = this.data
    products.push(e.detail.value)
    this.setData({
      products
    })
  },

  onTotalWeightInput: function (e) {
    this.setData({
      totalWeight: e.detail.value
    })
  },

  onTotalSellPriceInput: function (e) {
    this.setData({
      totalSellPrice: e.detail.value
    })
  },

  onInitShippingOrderClick: function (e) {
    var readyToInit = this.readyToInit()
    if (readyToInit) {
      this.setData({
        confirmModelHidden: false
      })
    } else {
      wx.showToast({
        title: '发货信息不完整',
        duration: 1000,
        icon: 'none'
      })
    }
  },

  readyToInit: function (e) {
    var {
      customerId,
      name,
      phone,
      address,
      products,
      totalSellPrice
    } = this.data
    return customerId &&
      name &&
      phone &&
      products &&
      address &&
      address.region &&
      address.city &&
      address.zone &&
      address.address &&
      address && products.length > 0 &&
      !!totalSellPrice &&
      totalSellPrice > 0
  }
})
