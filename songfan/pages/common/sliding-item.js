// pages/common/sliding-item.js
Component({
  /**
   * Component properties
   */
  properties: {
    buttons: {
      type: Array,
      value: []
    }
  },

  /**
   * Component initial data
   */
  data: {
    // offset on x axis.
    x: 0,
    // current X.
    currentX: 0,
  },

  /**
   * Component methods
   */
  methods: {
    onChange: function (e) {
      console.log(e);
    },
  }
})
