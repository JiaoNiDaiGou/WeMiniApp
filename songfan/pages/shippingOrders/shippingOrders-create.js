// pages/shippingOrders/shippingOrders-create.js
const utils = require('../../utils/util.js')
const backend = require('../../utils/backend.js')
const app = getApp()

Page({

  /**
   * Page initial data
   */
  data: {
    customerId: '',
    name: '',
    phone: '',
    region: '',
    city: '',
    zone: '',
    address: '',

    products: [],

    curTotalWeight: '',

    canInitializeShippingOrder: false,

    modalHidden: true,
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    this.setData({
      customerId: !!options.customerId ? options.customerId : '',
      name: !!options.name ? options.name : '',
      phone: !!options.phone ? options.phone : '',
      region: !!options.region ? options.region : '',
      city: !!options.city ? options.city : '',
      zone: !!options.zone ? options.zone : '',
      address: !!options.address ? options.address : '',
    });
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

  onProductsChange: function(e) {
    console.log(e.detail.value)
    
    this.setData({
      products: e.detail.value
    })
  },

  onCurTotalWeightInput: function (e) {
    this.setData({
      curTotalWeight: e.detail.value
    });
  },

  onModalCancel: function (e) {
    this.setData({
      modalHidden: true
    });
  },

  onModalConfirm: function (e) {
    this.setData({
      modalHidden: true
    });
    var products = this.data.products
      .map(t => {
        return {
          quantity: t.quantity,
          sellPrice: { unit: 'USD', value: t.price },
          product: {
            category: utils.productCategories[t.categoryIndex].value,
            name: t.name,
            brand: t.brand,
          }
        }
      });

    wx.showLoading({
      title: '正在下单',
    })
    var totalWeight = parseFloat(this.data.curTotalWeight)
    backend.promiseOfInitShippingOrder(
      app,
      this.data.customerId,
      {
        region: this.data.region,
        city: this.data.city,
        zone: this.data.zone,
        address: this.data.address
      },
      products,
      totalWeight
    ).then(r => {
      wx.hideLoading()
      if (r.res.statusCode != 200) {
        console.log(r.res);
        return
      }
      console.log('get shippingOrder ID: ' + r.res.data.id)
      if (!!r.res.data.teddyOrderId) {
        wx.showModal({
          title: '小熊下单成功',
          content: '快递单号:' + r.res.data.teddyFormattedId,
          success: res => {
            wx.redirectTo({
              url: './shippingOrders-list?statusIndex=2',
            })
          }
        })
      } else {
        wx.showModal({
          title: '创建成功',
          content: '单号:' + r.res.data.id,
          success: res => {
            wx.redirectTo({
              url: './shippingOrders-list?statusIndex=0',
            })
          }
        })
      }
    })
  },

  onInitializeShippingOrderTap: function (e) {
    if (this.canInitializeShippingOrder()) {
      this.setData({
        modalHidden: false
      });
    } else {
      wx.showToast({
        title: '❌  发货信息不完整 ❌ ',
        duration: 800,
        icon: 'none'
      })
    }
  },

  canInitializeShippingOrder: function (e) {
    return !!this.data.customerId
      && !!this.data.name
      && !!this.data.phone
      && !!this.data.region
      && !!this.data.city
      && !!this.data.zone
      && !!this.data.address
      && !!this.data.products
      && this.data.products.length > 0;
  }
})
