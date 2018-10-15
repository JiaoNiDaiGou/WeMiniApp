// pages/common/product-list-box.js
const utils = require('../../utils/util.js');

Component({
  /**
   * Component properties
   */
  properties: {
    products: {
      type: Array,
      value: []
    }
  },

  /**
   * Component initial data
   */
  data: {
    totalPrice: 0,
    totalWeight: 0,
    productEntryActionable: false,
    productEntryModalHidden: true,
    curActoinIdx: -1
  },

  /**
   * Component methods
   */
  methods: {
    onProductEntryLongPress: function (e) {
      if (!productEntryActionable) {
        return
      }
      var idx = e.currentTarget.dataset.idx
      this.setData({
        productEntryModalHidden: false,
        curActoinIdx: idx
      })
    },

    onProductEntryModalDone: function (e) {
      this.setData({
        productEntryModalHidden: true,
        curActoinIdx: -1
      })
    },

    onCurActionProductEntryDeleteTap: function (e) {
      var curActionIdx = this.data.curActionIdx
      if (curActionIdx < 0) {
        return
      }
      var products = this.data.products
      products.splice(curActionIdx, 1)
      this.setData({
        products: products,
        curActoinIdx: -1,
        productEntryModalHidden: true
      })
      this.triggerEvent('productEntriesChange', { value: products })
    },

  }
})
