// pages/shippingOrders/shippingOrders-list.js
const backend = require('../../utils/backend.js')
const utils = require('../../utils/util.js')
const app = getApp()

Page({
  /**
   * Page initial data
   */
  data: {
    statusNames: utils.shippingOrderStatus.map(t => t.name),
    statusValues: utils.shippingOrderStatus.map(t => t.value),

    curStatusIndex: 0,
    shippingOrdersByStatus: {},
    
    curActionableShippingOrderId: '',
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    var initStatusIndex = !!options.statusIndex ? options.statusIndex : 0;
    this.setData({
      curStatusIndex: initStatusIndex
    });
    this.loadShippingOrder(initStatusIndex)
  },

  loadShippingOrder: function (statusIndex) {
    var that = this;
    wx.showLoading({
      title: '加载发货单',
    })
    var status = this.data.statusValues[statusIndex];

    backend.promiseOfQueryShippingOrders(app, null, false, status, 200)
      .then(r => {
        var shippingOrders = r.res.data.results;
        
        var shippingOrdersByStatus = this.data.shippingOrdersByStatus;

        var curShippingOrders = shippingOrdersByStatus[status];
        if (!curShippingOrders) {
          curShippingOrders = [];
        }
        shippingOrders.forEach(order => {
          var exists = curShippingOrders.findIndex(t => t.id == order.id) >= 0;
          if (!exists) {
            var enhancedOrder = order;
            var status = !!order.status ? order.status : 'INIT';
            order.status = status;
            order.statusIndex = this.data.statusValues.indexOf(status)
            order.renderableProducts = utils.convertToRenderableProducts(order.productEntries);
            order.renderableCreationTime = order.creationTime == 0 ? '' : utils.formatTime(new Date(parseFloat(order.creationTime)))
            curShippingOrders.push(enhancedOrder);
          }
        })
        curShippingOrders.sort((a, b) => b.creationTime - a.creationTime)

        shippingOrdersByStatus[status] = curShippingOrders

        that.setData({
          shippingOrdersByStatus: shippingOrdersByStatus
        })

        console.log('load ' + shippingOrders.length + ' orders with status ' + status)
        console.log(that.data.shippingOrdersByStatus)
        wx.hideLoading();
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

  onItemLongTap: function (e) {
    var shippingOrderId = e.currentTarget.dataset.shippingOrder;
    this.setData({
      curActionableShippingOrderId: shippingOrderId
    })
  },

  onStatusChange: function (e) {
    var curStatusIndex = e.detail.value;
    this.setData({
      curStatusIndex: curStatusIndex
    });
    this.loadShippingOrder(curStatusIndex);
  }
})