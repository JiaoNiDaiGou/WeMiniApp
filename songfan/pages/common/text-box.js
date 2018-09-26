// pages/common/text-box.js
Component({
  /**
   * Component properties
   */
  properties: {

    /**
     * CSS icon class name. E.g. 'icon-profile-grey-36'.
     * See /lib/icon.wxss.
     */
    iconClass: {
      type: String,
      value: ''
    },

    /**
     * Input box placeholder
     */
    placeholder: {
      type: String,
      value: ''
    },

    editable: {
      type: Boolean,
      value: false
    },

    value: {
      type: String,
      value: ''
    }
  },

  /**
   * Component initial data
   */
  data: {
    inputVal: '',
  },

  /**
   * Component methods
   */
  methods: {

  }
})
