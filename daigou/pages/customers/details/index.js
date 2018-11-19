const backend = require("../../../utils/Backend.js");
const app = getApp();
const {
  $Message
} = require('../../../components/iview/base/index');

Page({
  /**
   * Page initial data
   */
  data: {
    customer: null,
    defaultShippingAddressIdx: 0,
    actionAddressIdx: -1,
    addressActionSheetVisible: false,
    addressActions: [{
      name: "删除",
      color: "#ed3f14"
    }]
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    var id = options.id;
    console.log('customerId: ' + id)
    var customerFromApp = app.globalData.customers.find(t => t.id === id);
    if (customerFromApp) {
      this.setData({
        customer: customerFromApp
      });
    }
    this.refreshCustomer(id, () => $Message({
      content: '客户信息已加载',
      type: 'success',
      duration: 1.5
    }))
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

  onCreateShippingOrderClick: function (e) {
    var {
      customer,
      defaultShippingAddressIdx
    } = this.data
    var address = customer.addresses[defaultShippingAddressIdx]
    wx.redirectTo({
      url: '../../shippingOrders/create/index?customerId=' + customer.id +
        '&name=' + customer.name +
        '&phone=' + customer.phone.phone +
        '&region=' + address.region +
        '&city=' + address.city +
        '&zone=' + address.zone +
        '&postalCode=' + address.postalCode +
        '&address=' + address.address
    })
  },

  onAddressTap: function (e) {
    var addressIdx = e.currentTarget.dataset.addressidx;
    this.setData({
      defaultShippingAddressIdx: addressIdx,
      actionSheetShow: false
    });
  },

  onAddressLongPress: function (e) {
    var addressIdx = e.currentTarget.dataset.addressidx;
    this.setData({
      addressActionSheetVisible: true,
      actionAddressIdx: addressIdx
    });
  },

  onAddressActionSheetCancel: function (e) {
    this.setData({
      addressActionSheetVisible: false
    });
  },

  onAddressActionSheetClick: function (e) {
    var {
      actionAddressIdx
    } = this.data;
    if (actionAddressIdx < 0) {
      this.setData({
        addressActionSheetVisible: false
      });
    }
    switch (e.detail.index) {
      case 0:
        this.onDeleteAddressClick();
        break;
      default:
        this.setData({
          addressActionSheetVisible: false
        });
        break;
    }
  },

  onDeleteAddressClick() {
    var {
      customer,
      actionAddressIdx,
      defaultShippingAddressIdx
    } = this.data;
    if (customer.addresses.length <= 1) {
      wx.showToast({
        title: '不能删除唯一的地址',
        icon: 'none',
        duration: 1000
      })
      this.setData({
        addressActionSheetVisible: false
      });
      return;
    }

    if (defaultShippingAddressIdx == actionAddressIdx) {
      defaultShippingAddressIdx = 0;
    }

    customer.addresses.splice(actionAddressIdx, 1);

    const actions = [...this.data.addressActions];
    actions[0].loading = true;
    this.setData({
      addressActions: actions,
      customer: customer,
      defaultShippingAddressIdx: defaultShippingAddressIdx
    });

    var callback = () => {
      actions[0].loading = false;
      this.setData({
        addressActionSheetVisible: false,
        addressActions: actions
      });
    };
    this.updateCustomer(callback);
  },

  updateCustomer: function (callback) {
    var that = this;
    backend.updateCustomer(app, this.data.customer).then(r => {
      that.setData({
        customer: r.res.data
      });
      if (callback) {
        callback();
      }
    });
  },

  refreshCustomer: function (id, callback) {
    var that = this;
    backend.getCustomerById(app, id).then(r => {
      var customer = r.res.data;
      that.setData({
        customer: customer
      });
      if (callback) {
        callback();
      }
    });
  }
});
