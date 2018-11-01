// components/products-list/index.js

const utils = require("../../utils/util.js");

Component({
  /**
   * Component properties
   */
  properties: {
    products: {
      type: Array,
      value: []
    },
    actionable: {
      type: Boolean,
      value: false
    }
  },

  /**
   * Component initial data
   */
  data: {
    // consts
    CATEGORY_NAMES: utils.productCategories.map(t => t.name),
    ACTIONS: [{
      name: '删除',
      color: 'red'
    }],
    curActionIndex: -1,
    actionSheetVisible: false
  },

  /**
   * Component methods
   */
  methods: {
    onLongPress: function (e) {
      var { actionable } = this.data
      if (!actionable) return
      var idx = e.currentTarget.dataset.idx
      this.setData({
        curActionIndex: idx,
        actionSheetVisible: true
      })
    },

    onActionCancel: function (e) {
      this.setData({
        curActionIndex: -1,
        actionSheetVisible: true
      })
    },

    onActionClick: function (e) {
      var { curActionIndex, products } = this.data
      if (curActionIndex < 0) return
      switch (e.detail.index) {
        case 0: {
          this.deleteProduct(curActionIndex)
          break;
        }
        default:
        break
      }
    },

    deleteProduct: function (idx) {
      var { products } = this.data
      products.splice(idx, 1)
      this.setData({
        products: products,
        curActionIndex: -1,
        actionSheetVisible: false
      })
      this.triggerEvent('productsChange', {
        value: products
      })
    }
  }
})
