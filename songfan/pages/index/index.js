//index.js
const utils = require('../../utils/util.js');
// const braintree = require('../../..//lib/dropin.min.js')
const app = getApp()

Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),


    showFeedback: false,

    items: [
      {id: 'a', name: 'namema'},
      {id: 'b', name: 'nameb'}
    ],

    images: [
      {
        path: 'http://tmp/wxcc28fb16929d986e.o6zAJs1Rqqj87F33jg5-orUbX6N0.kZsYlgUmqJV9094fabbd78fbb2f9f7ea947f8352e5a1.gif'
      },
      {
        path: 'http://tmp/wxcc28fb16929d986e.o6zAJs1Rqqj87F33jg5-orUbX6N0.kZsYlgUmqJV9094fabbd78fbb2f9f7ea947f8352e5a1.gif'
      },
      {
        path: 'http://tmp/wxcc28fb16929d986e.o6zAJs1Rqqj87F33jg5-orUbX6N0.kZsYlgUmqJV9094fabbd78fbb2f9f7ea947f8352e5a1.gif'
      },
      {
        path: 'http://tmp/wxcc28fb16929d986e.o6zAJs1Rqqj87F33jg5-orUbX6N0.kZsYlgUmqJV9094fabbd78fbb2f9f7ea947f8352e5a1.gif'
      },
      {
        path: 'http://tmp/wxcc28fb16929d986e.o6zAJs1Rqqj87F33jg5-orUbX6N0.kZsYlgUmqJV9094fabbd78fbb2f9f7ea947f8352e5a1.gif'
      },
      {
        path: 'http://tmp/wxcc28fb16929d986e.o6zAJs1Rqqj87F33jg5-orUbX6N0.kZsYlgUmqJV9094fabbd78fbb2f9f7ea947f8352e5a1.gif'
      },
      {
        path: 'http://tmp/wxcc28fb16929d986e.o6zAJs1Rqqj87F33jg5-orUbX6N0.kZsYlgUmqJV9094fabbd78fbb2f9f7ea947f8352e5a1.gif'
      },
      {
        path: 'http://tmp/wxcc28fb16929d986e.o6zAJs1Rqqj87F33jg5-orUbX6N0.kZsYlgUmqJV9094fabbd78fbb2f9f7ea947f8352e5a1.gif'
      },
      {
        path: 'http://tmp/wxcc28fb16929d986e.o6zAJs1Rqqj87F33jg5-orUbX6N0.kZsYlgUmqJV9094fabbd78fbb2f9f7ea947f8352e5a1.gif'
      },
      {
        path: 'http://tmp/wxcc28fb16929d986e.o6zAJs1Rqqj87F33jg5-orUbX6N0.kZsYlgUmqJV9094fabbd78fbb2f9f7ea947f8352e5a1.gif'
      }
    ]
  },
  onLoad: function () {},

  onShow: function () {
    utils.enableFeedbackShake(this)
  },

  onFeedbackDone: e => {
    utils.onFeedbackDone(this)
  },

  goToCustomersList: () => {
    console.log('go to customers-list');
    wx.navigateTo({
      url: '../customers/customers-list',
    })
  },
  goToShippingOrdersList: () => {
    console.log('go to shippingOrders-list');
    wx.navigateTo({
      url: '../shippingOrders/shippingOrders-list',
    })
  },
  goToShoppingListsList: () => {
    console.log('go to shoppingLists-list')
    wx.navigateTo({
      url: '../shoppingLists/shoppingLists-list',
    })
  },
  goToInventoryList: () => {
    console.log('go to inventory-list')
    wx.navigateTo({
      url: '../inventory/inventory-create'
    })
  },
  showmodal: e => {
    this.setData({
      showModal: true
    })
  }
})