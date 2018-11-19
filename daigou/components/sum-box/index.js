// components/sum-box/index.js

/**
 * Properties:
 * - disabled: boolean
 * - icon:
 * - value: final value
 */
Component({
  /**
   * Component properties
   */
  properties: {
    disabled: {
      type: Boolean,
      value: false
    },
    icon: {
      type: String,
      value: '',
    },
    value: {
      type: Number,
      value: 0,
    },
    prefix: {
      type: String,
      value: ''
    },
    suffix: {
      type: String,
      value: ''
    },
    placeholder: {
      type: String,
      value: '合计 0'
    }
  },

  /**
   * Component initial data
   */
  data: {
    nums: [],
    curNum: '',
  },

  /**
   * Component methods
   */
  methods: {
    onInput: function (e) {
      this.setData({
        curNum: e.detail.detail.value
      })
    },

    onBlur: function (e) {
      var { curNum, nums, value } = this.data
      var curVal = parseFloat(curNum)
      if (!curNum || curVal === 0) {
        return
      }
      
      nums.unshift(curNum)
      value += curVal
      this.setData({
        curNum: '',
        nums: nums,
        value: value,
        placeholder: '合计 ' + value
      })
      this.triggerEvent('change', { value: value })
    }
  }
})
