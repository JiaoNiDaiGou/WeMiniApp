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

    curActionItem: null,
    curActionItemTotalWeight: '',

    modalHidden: true,
    shippingOrderModalHidden: true,
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    var initStatusIndex = !!options.statusIndex ? options.statusIndex : 0;
    this.setData({
      curStatusIndex: initStatusIndex
    });
    wx.showLoading({
      title: '加载发货单',
    })
    this.loadShippingOrder(initStatusIndex, () => wx.hideLoading())
  },

  loadShippingOrder: function (statusIndex, callback) {
    var that = this;
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
          // Enhance
          var exists = curShippingOrders.findIndex(t => t.id == order.id) >= 0;
          if (!exists) {
            var enhancedOrder = order;
            var status = !!order.status ? order.status : 'INIT';
            order.status = status;
            order.statusIndex = this.data.statusValues.indexOf(status)
            order.renderableProducts = utils.convertToRenderableProducts(order.productEntries);
            order.renderableCreationTime = order.creationTime == 0 ? '' : utils.formatTime(new Date(parseFloat(order.creationTime)))
            order.canDelete = status == 'INIT' || status == 'PACKED'
            order.canExternalShip = status == 'INIT' || status == 'PACKED'

            curShippingOrders.push(enhancedOrder);
          }
        })
        curShippingOrders.sort((a, b) => b.creationTime - a.creationTime)
        shippingOrdersByStatus[status] = curShippingOrders
        that.setData({
          shippingOrdersByStatus: shippingOrdersByStatus
        })

        if (!!callback) {
          callback()
        }
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
    var index = this.data.curStatusIndex;
    this.loadShippingOrder(index);
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

  onStatusChange: function (e) {
    var curStatusIndex = e.detail.value;
    this.setData({
      curStatusIndex: curStatusIndex
    });
    this.loadShippingOrder(curStatusIndex);
  },

  actionShippingOrder: function (e) {
    console.log(e)
    var shippOrderId = e.currentTarget.dataset.shipporderid;
    var curAcitonItem = this.data.shippingOrdersByStatus[this.data.statusValues[this.data.curStatusIndex]].find(t => t.id == shippOrderId);
    console.log('select cur action item id:' + shippOrderId)
    this.setData({
      curAcitonItem: curAcitonItem,
      modalHidden: false
    })
  },

  curActionItemExternalShip: function (e) {
    var that = this;
    this.setData({
      modalHidden: true,
      shippingOrderModalHidden: false
    })
  },

  curActionItemDelete: function (e) {
    var that = this;
    var id = this.data.curAcitonItem.id;
    backend.promiseOfDeleteShippingOrder(app, id)
      .then(r => {
        var item = r.res.data;
        this.setData({
          modalHidden: true
        })
        var shippingOrdersByStatus = that.data.shippingOrdersByStatus
        var status = that.data.statusValues[that.data.curStatusIndex]
        var shippingOrders = shippingOrdersByStatus[status]
        console.log(shippingOrders)
        shippingOrders = utils.removeItemsById(shippingOrders, id, t => t.id)
        console.log(shippingOrders)
        shippingOrdersByStatus[status] = shippingOrders
        that.setData({
          shippingOrdersByStatus: shippingOrdersByStatus
        })
        wx.showToast({
          title: '已删除',
          duration: 800
        })
        wx.pageScrollTo({
          scrollTop: 0
        })
      })
  },

  onModalDone: function (e) {
    this.setData({
      modalHidden: true
    })
  },

  onShippingOrderModalCancel: function (e) {
    this.setData({
      shippingOrderModalHidden: true
    })
  },

  onShippingOrderModalConfirm: function (e) {
    if (!!this.data.curActionItemTotalWeight) {
      wx.showToast({
        title: '❌  重量不完整 ❌ ',
        duration: 800,
        icon: 'none'
      })
      return
    }

    this.setData({
      shippingOrderModalHidden: true
    })
    wx.showLoading({
      title: '正在下单',
    })
    var totalWeight = parseFloat(this.data.curActionItemTotalWeight)
    backend.promiseOfExternalCreateShippingOrder(app, this.data.curAcitonItem.id, totalWeight)
      .then(r => {
        wx.hideLoading()
        if (r.res.statusCode != 200) {
          console.log(r.res);
          return
        }
        console.log('get shippingOrder ID: ' + r.res.data.id)
        wx.showModal({
          title: '小熊下单成功',
          content: '快递单号:' + r.res.data.teddyFormattedId,
          success: res => {
            wx.redirectTo({
              url: './shippingOrders-list?statusIndex=2',
            })
          }
        })
      })
  },

  onCurActionItemTotalWeightInput: function (e) {
    this.setData({
      curActionItemTotalWeight: e.detail.value
    });
  }
})