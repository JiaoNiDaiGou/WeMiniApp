//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
  },
  onLoad: function () {
  },
  goToCustomersList: function () {
    console.log('go to customers-list');
    wx.navigateTo({
      url: '../customers/customers-list',
    })
  },
  goToShippingOrdersList: function () {
    console.log('go to shippingOrders-list');
    wx.navigateTo({
      url: '../shippingOrders/shippingOrders-list',
    })
  },
  goToShoppingListsList: function () {
    console.log('go to shoppingLists-list')
    wx.navigateTo({
      url: '../shoppingLists/shoppingLists-list',
    })
  }
})
