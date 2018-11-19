// components/paginated-list/index.js
Component({
  /**
   * Component properties
   */
  properties: {
    pageLimit: {
      type: Number,
      value: 100
    },
    items: {
      type: Array,
      value: ''
    }
  },

  /**
   * Component initial data
   */
  data: {
    pageToken: null,
  },

  /**
   * Component methods
   */
  methods: {
    onLoadMore: function() {
      
    }
  }
})
