// pages/common/custom-modal.js
Component({
  /**
   * Component properties
   */
  properties: {
    // If to show the modal
    show: {
      type: Boolean,
      value: false
    },
    title: {
      type: String,
      value: ''
    },
    // Height of the modal
    height: {
      type: String,
      value: "80%"
    },
    // Display 'Cancel' button
    showCancelButton: {
      type: Boolean,
      value: true
    },
    // Display 'Confirm' button
    showConfirmButton: {
      type: Boolean,
      value: true
    }
  },

  /**
   * Component initial data
   */
  data: {
  },

  /**
   * Component methods
   */
  methods: {
    onCancel: function (e) {
      this.triggerEvent('cancel')
    },
    onConfirm: function (e) {
      this.triggerEvent('confirm')
    }
  }
})
