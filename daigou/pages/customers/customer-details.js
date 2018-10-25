// pages/customers/customer-details.js
const utils = require('../../utils/util.js')
const backend = require('../../utils/backend.js')
const app = getApp()

Page({

  /**
   * Page initial data
   */
  data: {
    customer: null,
    shippingOrders: [],
    defaultShippingAddressIdx: 0,

    canUpdate: false,

    curActionAddressIdx: -1,
    modalHidden: true,
    updateAddressModalHidden: true,
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    var id = options.id
    wx.showLoading({
      title: '加载客户信息',
    })
    this.refreshCustomer(id, () => {
      wx.hideLoading()
    })
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
    var customerId = this.data.customer.id
    wx.showNavigationBarLoading();
    this.refreshCustomer(customerId, () => {
      wx.hideNavigationBarLoading()
      wx.showToast({
        title: '客户信息已刷新',
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

  onAddressTap: function (e) {
    var curActionAddressIdx = e.currentTarget.dataset.addressidx
    this.setData({
      defaultShippingAddressIdx: curActionAddressIdx,
      modalHidden: true
    })
  },

  onAddressLongPress: function (e) {
    var curActionAddressIdx = e.currentTarget.dataset.addressidx
    this.setData({
      curActionAddressIdx: curActionAddressIdx,
      modalHidden: false
    })
  },

  onModalDone: function (e) {
    this.setData({
      modalHidden: true,
    })
  },

  onUpdateAddressModalCancel: function (e) {
    this.setData({
      modalHidden: true,
      updateAddressModalHidden: true
    })
  },

  onUpdateAddressModalConfirm: function (e) {
    this.updateCustomer()
    this.setData({
      modalHidden: true,
      updateAddressModalHidden: true
    })
  },

  refreshCustomer: function (id, callback) {
    var that = this
    var promiseOfGetCustomerById = backend.promiseOfGetCustomerById(app, id)
      .then(r => {
        var customer = r.res.data
        that.setData({
          customer: customer
        })
      })
    var promiseOfQueryShippingOrders = backend.promiseOfQueryShippingOrders(app, id, true, null, 10)
      .then(r => {
        var shippingOrders = r.res.data.results
        if (!!shippingOrders && shippingOrders.length > 0) {
          console.log('load ' + shippingOrders.length + ' orders for ' + this.data.customer.name);
          this.setData({
            shippingOrders: shippingOrders
          })
        }
      })

    if (!!callback) {
      Promise.all([promiseOfGetCustomerById, promiseOfQueryShippingOrders]).then(() => callback())
    }
  },

  onCurActionAddressUpdateTap: function (e) {
    this.setData({
      modelHidden: true,
      updateAddressModalHidden: false
    })
  },

  onCurActionAddressDeleteTap: function (e) {
    var customer = this.data.customer
    var addresses = customer.addresses
    if (addresses.length <= 1) {
      return
    }
    var idx = this.data.curActionAddressIdx
    var defaultShippingAddressIdx = this.data.defaultShippingAddressIdx
    if (defaultShippingAddressIdx == idx) {
      defaultShippingAddressIdx = 0
    }
    customer.addresses.splice(idx, 1)    
    this.setData({
      customer: customer,
      modalHidden: true,
      defaultShippingAddressIdx: defaultShippingAddressIdx
    })
    this.updateCustomer()
  },

  updateCustomer: function () {
    var that = this
    backend.promiseOfUpdateCustomer(app, this.data.customer)
      .then(r => {
        that.setData({
          customer: r.res.data
        })
        wx.showToast({
          title: '客户信息已更新',
        })
      })
  },

  goToShippingOrderCreate: function (e) {
    console.log('go to ShippingOrderCreate');
    var address = this.data.customer.addresses[this.data.defaultShippingAddressIdx]
    wx.redirectTo({
      url: '../shippingOrders/shippingOrders-create?customerId=' + this.data.customer.id
        + '&name=' + this.data.customer.name
        + '&phone=' + this.data.customer.phone.phone
        + '&region=' + address.region
        + '&city=' + address.city
        + '&zone=' + address.zone
        + '&address=' + address.address
    })
  }
})