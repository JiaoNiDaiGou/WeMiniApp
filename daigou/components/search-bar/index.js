// components/search-bar/index.js

/**
 * Properties:
 * - options: array: searching candidates.
 *    Must be in format { id: xx, text: yy }
 * - placeholder: string
 * - value: string: value of searching bar input
 * 
 * Events:
 * - optionSelect: when some option selected
 * - input: when input typing
 */

Component({
  /**
   * Component properties
   */
  properties: {
    options: {
      type: Array,
      value: []
    },
    placeholder: {
      type: String,
      value: '搜索'
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
    inputShow: false,
  },

  /**
   * Component methods
   */
  methods: {
    onInputFocus: function () {
      this.setData({
        inputShow: true
      })
    },

    onInputHide: function () {
      this.setData({
        inputShow: false,
        value: ''
      })
    },

    onInput: function (e) {
      var value = e.detail.value
      this.setData({
        value: value
      })
      this.triggerEvent('input', {
        value: value
      })
    },

    onOptionSelect: function (e) {
      var selectedId = e.currentTarget.id
      this.triggerEvent('optionSelect', {
        value: selectedId
      })
    }
  }
})
