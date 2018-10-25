// pages/common/textarea-box.js

/**
 * properties:
 * - editable: boolean: whether the textarea is editable
 * - hasBottomBorder: boolean: if display the bottom border
 * - iconClass: class of left icon
 * - placeholder: string,
 * - value: string
 * 
 * events:
 * - blur: when textarea blur
 * - input: when textarea input
 * - tap: when textarea tap
 */

Component({
  properties: {
    editable: {
      type: Boolean,
      value: true
    },
    placeholder: {
      type: String,
      value: ''
    },
    value: {
      type: String,
      value: ''
    },
    iconClass: {
      type: String,
      value: ''
    },
    hasBottomBorder: {
      type: Boolean,
      value: false,
    }
  },
  data: {
    lineHeight: 0,
  },
  methods: {
    onLineChange: function (e) {
      var height = (e.detail.lineCount + 1) * e.detail.lineHeight + 0.5;
      this.setData({
        lineHeight: height
      })
    },
    onBlur: function (e) {
      this.triggerEvent('blur')
    },
    onTap: function (e) {
      this.triggerEvent('tap')
    },
    onInput: function (e) {
      var value = e.detail.value
      this.setData({
        value: value
      })
      this.triggerEvent('input', {
        value: value
      })
    }
  }
})