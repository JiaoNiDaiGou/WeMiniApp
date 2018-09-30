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
  },

  /**
   * Component methods
   */
  methods: {
  }
})
