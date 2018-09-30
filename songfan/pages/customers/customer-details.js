// pages/customers/customer-details.js
const utils = require('../../utils/util.js')
const backend = require('../../utils/backend.js')
const app = getApp()

Page({

  /**
   * Page initial data
   */
  data: {
    oriCustomer: null,
    customer: null,
    shippingOrders: [],
    canUpdate: false
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    var id = options.id;
    console.log('load customer details for ' + id);
    var customer = app.globalData.customers
      .filter(t => t.id === options.id)[0];
    this.setData({
      customer: customer,
      oriCustomer: customer
    })
    this.loadShippingOrders()
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
    var customerId = this.data.customer.id;
    var that = this;

    console.log('refresh customer ' + customerId);

    wx.showNavigationBarLoading();
    backend.promiseOfGetCustomerById(app, customerId)
      .then(r => {
        that.loadShippingOrders()

        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
        that.setData({
          customer: r.res.data
        });
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

  loadShippingOrders: function () {
    backend.promiseOfQueryShippingOrders(
        app, 
        this.data.customer.id,
        true,
        null,
        10)
      .then(r => {
        if (r.res.statusCode != 200) {
          console.log(r);
          return
        }
        var shippingOrders = r.res.data.results;
        if (!!shippingOrders && shippingOrders.length > 0) {
          console.log('load ' + shippingOrders.length + ' orders for ' + this.data.customer.name);
          this.setData({
            shippingOrders: shippingOrders
          })
        }
      })
  },

  /**
   * Go to create shipping order page.
   */
  goToShippingOrderCreate: function (e) {
    console.log('go to ShippingOrderCreate');
    wx.redirectTo({
      url: '../shippingOrders/shippingOrders-create?customerId=' + this.data.customer.id + '&name=' + this.data.customer.name + '&phone=' + this.data.customer.phone.phone + '&region=' + this.data.customer.addresses[0].region + '&city=' + this.data.customer.addresses[0].city + '&zone=' + this.data.customer.addresses[0].zone + '&address=' + this.data.customer.addresses[0].address
    })
  }
})