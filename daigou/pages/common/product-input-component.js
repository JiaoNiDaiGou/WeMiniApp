// pages/common/product-prompt-set.js
const utils = require('../../utils/util.js')
const app = getApp()

/**
 * properties:
 * - products: array: products
 * - quantityType: string: type of quantity input. picker (default) or text
 * 
 * events:
 * productsChange: when products added
 */
Component({
  /**
   * Component properties
   */
  properties: {
    products: {
      type: Array,
      value: []
    },

    quantityType: {
      type: String,
      value: 'picker'
    }
  },

  /**
   * Component initial data
   */
  data: {
    curProductBrand: '',
    curProductCategoryIndex: -1,
    curProductName: '',
    curProductQuantity: 1,
    curProductPrice: '30',

    canAddCurProduct: false,

    suggestedProductBrands: [],
    suggestedProductCategoryIndexes: [],

    productCategoryNames: utils.productCategories.map(t => t.name)
  },

  /**
   * Component methods
   */
  methods: {

    getProductBrandHints: function(name) {
      var hints = []

      // Get hints from product name
      if (!!name) {
        app.globalData.productNameToBrandHints.forEach(t => {
          if (t.key.toLowerCase().includes(name.toLowerCase())) {
            t.val.forEach(brandCount => {
              utils.incMapCount(hints, brandCount.key, brandCount.val)
            })
          }
        })
      }
      return hints.sort((a, b) => b.val - a.val).slice(0, 10).map(t => {
        return {
          id: t.key,
          display: t.key
        }
      })
    },

    getProductCategoryHints: function(name, brand) {
      var hints = []

      // Get hints from product name
      if (!!name) {
        app.globalData.productNameToCategoryHints.forEach(t => {
          if (t.key.toLowerCase().includes(name.toLowerCase())) {
            t.val.forEach(categoryCount => {
              utils.incMapCount(hints, categoryCount.key, categoryCount.val)
            })
          }
        })
      }

      // Get hints from product brand
      if (!!brand) {
        app.globalData.productBrandToCategoryHints.forEach(t => {
          if (t.key.toLowerCase().includes(brand.toLowerCase())) {
            t.val.forEach(categoryCount => {
              utils.incMapCount(hints, categoryCount.key, categoryCount.val)
            })
          }
        })
      }

      // Sort hints
      return hints.sort((a, b) => b.val - a.val).slice(0, 4).map(t => t.key)
    },

    onCurProductBrandInput: function(e) {
      var brand = e.detail.value
      var name = this.data.curProductName
      var categoryHintIndexes = this.getProductBrandHints(name, brand)
        .map(t => t.key)
      this.setData({
        curProductBrand: brand,
        suggestedCategoryIndexes: categoryHintIndexes
      });
    },

    onCurProductCategoryChange: function(e) {
      this.setData({
        curProductCategoryIndex: e.detail.value
      });
    },

    onSuggestedProductBrandTap: function(e) {
      this.setData({
        curProductBrand: e.detail.value.display,
        suggestedProductBrands: []
      });
    },

    onSuggestedProductCategoryTap: function(e) {
      this.setData({
        curProductCategoryIndex: e.detail.value,
        suggestedProductCategoryIndexes: []
      });
    },

    onCurProductNameInput: function(e) {
      var name = e.detail.value
      var brand = this.data.curProductBrand
      var categoryHintIndexes = []
      var brandHints = []
      if (!!brand) {
        categoryHintIndexes = this.getProductCategoryHints(name, brand)
      } else {
        categoryHintIndexes = this.getProductCategoryHints(name)
        brandHints = this.getProductBrandHints(name)
      }

      this.setData({
        curProductName: name,
        suggestedProductBrands: brandHints,
        suggestedCategoryIndexes: categoryHintIndexes
      });
    },

    onCurProductQuantityChange: function(e) {
      this.setData({
        curProductQuantity: parseInt(e.detail.value) + 1
      });
    },

    onCurProductQuantityInput: function (e) {
      var quantity = !!e.detail.value ? parseInt(e.detail.value) : 0
      this.setData({
        curProductQuantity: quantity
      })
    },

    onCurProductPriceInput: function(e) {
      this.setData({
        curProductPrice: e.detail.value
      });
    },

    onProductEntriesChange: function(e) {
      this.setData({
        products: e.detail.value
      })
    },

    onAddCurrentProductTap: function(e) {
      var price = parseFloat(this.data.curProductPrice)
      var canAdd = !!this.data.curProductBrand &&
        this.data.curProductCategoryIndex >= 0 &&
        this.data.curProductCategoryIndex < this.data.productCategoryNames.length &&
        !!this.data.curProductName &&
        this.data.curProductQuantity > 0 &&
        price > 0 &&
        price <= 1000;

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
        categoryName: category,
        name: this.data.curProductName,
        quantity: this.data.curProductQuantity,
        price: price
      };
      var products = this.data.products;
      products.push(product);

      this.setData({
        products: products,
        curProductBrand: '',
        curProductCategoryIndex: -1,
        curProductName: '',
        curProductQuantity: 1,
        curProductPrice: '30',
        suggestedProductBrands: [],
        suggestedProductCategoryIndexes: []
      })

      this.triggerEvent('productsChange', {
        value: products
      })
    }
  }
})
