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

    productCategoryNames: [],

    curProductBrand: '',
    curProductCategoryIndex: 0,
    curProductName: '',
    curProductQuantity: 1,
    curProductPrice: 30,

    curTotalWeight: 0,

    canAddCurProduct: false,
    canInitializeShippingOrder: false,

    suggestedProductBrands: [],
    suggestedProductCategoryIndexes: [],

    modalHidden: true,
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    var productCategoryNames = utils.productCategories.map(t => t.name);

    this.setData({
      customerId: !!options.customerId ? options.customerId : '',
      name: !!options.name ? options.name : '',
      phone: !!options.phone ? options.phone : '',
      region: !!options.region ? options.region : '',
      city: !!options.city ? options.city : '',
      zone: !!options.zone ? options.zone : '',
      address: !!options.address ? options.address : '',
      productCategoryNames: productCategoryNames,
      curProductQuantity: 1,
      curProductPrice: 30
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

  onCurTotalWeightTyping: function (e) {
    this.setData({
      curTotalWeight: parseFloat(e.detail.value)
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
      this.data.curTotalWeight
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
              url: './shippingOrders-list?statusIndex=3',
            })
          }
        })
      } else {
        wx.showModal({
          title: '创建成功',
          content: '单号:' + r.res.data.id,
          success: res => {
            wx.redirectTo({
              url: './shippingOrders-list?statusIndex=1',
            })
          }
        })
      }
    })
  },

  initializeShippingOrder: function (e) {
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
    return !!this.data.customerId // TODO: maybe not needed
      && !!this.data.name
      && !!this.data.phone
      && !!this.data.region
      && !!this.data.city
      && !!this.data.zone
      && !!this.data.address
      && !!this.data.products
      && this.data.products.length > 0;
  },

  onCurProductBrandTyping: function (e) {
    var brand = e.detail.value
    var hintCategoryIndexes = []
    if (!!brand) {
      app.globalData.productBrandToCategoryHints.forEach(t => {
        if (t.key.toLowerCase().includes(brand.toLowerCase())) {
          t.val.forEach(categoryCount => {
            utils.incMapCount(hintCategoryIndexes, categoryCount.key, categoryCount.val)
          })
        }
      })
      hintCategoryIndexes = hintCategoryIndexes.sort((a, b) => b.val - a.val).slice(0, 3).map(t => t.key)
    }

    this.setData({
      curProductBrand: brand,
      suggestedCategoryIndexes: hintCategoryIndexes
    });
  },

  onCurProductCategoryChanged: function (e) {
    this.setData({
      curProductCategoryIndex: e.detail.value
    });
  },

  onSuggestedProductBrandSelected: function (e) {
    this.setData({
      curProductBrand: e.detail.suggestion.display,
      suggestedProductBrands: []
    });
  },

  onSuggestedProductCategorySelected: function (e) {
    this.setData({
      curProductCategoryIndex: e.detail.suggestion,
      suggestedProductCategoryIndexes: []
    });
  },

  onCurProductNameTyping: function (e) {
    var name = e.detail.value
    var hintBrands = [];
    var hintCategoryIndexes = [];
    if (!!name) {
      app.globalData.productNameToBrandHints.forEach(t => {
        if (t.key.toLowerCase().includes(name.toLowerCase())) {
          t.val.forEach(brandCount => {
            utils.incMapCount(hintBrands, brandCount.key, brandCount.val)
          })
        }
      })
      hintBrands = hintBrands.sort((a, b) => b.val - a.val).slice(0, 5).map(t => {
        return {
          id: t.key,
          display: t.key
        }
      })

      app.globalData.productNameToCategoryHints.forEach(t => {
        if (t.key.toLowerCase().includes(name.toLowerCase())) {
          t.val.forEach(categoryCount => {
            utils.incMapCount(hintCategoryIndexes, categoryCount.key, categoryCount.val)
          })
        }
      })
      hintCategoryIndexes = hintCategoryIndexes.sort((a, b) => b.val - a.val).slice(0, 3).map(t => t.key)
    }

    this.setData({
      curProductName: name,
      suggestedProductBrands: hintBrands,
      suggestedCategoryIndexes: hintCategoryIndexes
    });
  },

  onCurProductQuantityChanged: function (e) {
    this.setData({
      curProductQuantity: parseInt(e.detail.value) + 1
    });
  },

  onCurProductPriceTyping: function (e) {
    var price = parseInt(e.detail.value.substring(1));
    this.setData({
      curProductPrice: price
    });
  },

  addCurrentProduct: function (e) {
    var canAdd =
      !!this.data.curProductBrand
      && this.data.curProductCategoryIndex >= 0
      && this.data.curProductCategoryIndex < this.data.productCategoryNames.length
      && !!this.data.curProductName
      && this.data.curProductQuantity > 0
      && this.data.curProductPrice > 0
      && this.data.curProductPrice <= 1000;

    if (!canAdd) {
      wx.showToast({
        title: '❌ 货物输入错误 ❌ ',
        duration: 800,
        icon: 'none'
      })
      return;
    }

    var category = this.data.productCategoryNames[this.data.curProductCategoryIndex];
    console.log('add current product [' + category + ']: ' + this.data.curProductName);

    var product = {
      brand: this.data.curProductBrand,
      categoryIndex: this.data.curProductCategoryIndex,
      category: category,
      name: this.data.curProductName,
      quantity: this.data.curProductQuantity,
      price: this.data.curProductPrice
    };
    var products = this.data.products;
    products.push(product);

    this.setData({
      products: products,
      curProductBrand: '',
      curProductCategoryIndex: 0,
      curProductName: '',
      curProductQuantity: 1,
      curProductProce: 30,
      suggestedProductBrands: [],
      suggestedProductCategoryIndexes: []
    })
  }
})
