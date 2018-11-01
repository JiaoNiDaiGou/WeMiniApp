// components/picker-box/index.js

/**
 * properties:
 * - curIdx: current selected index: default to -1: not selected: display the placeholder
 * - icon: string
 * - placeholder: string
 * - suggestions: array[number]. The suggested indexes from range.
 * - suggestionsLimit: number: limit of suggestions to show
 * - range: array[string]: the range to pick
 * - prefix: string
 * - suffix: string
 * 
 * events:
 * - suggestionTap: when suggestion tapped
 * - change: when picker value changed
 */

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    icon: {
      type: String,
      value: ''
    },
    range: {
      type: Array,
      value: []
    },
    curIdx: {
      type: Number,
      value: -1
    },
    placeholder: {
      type: String,
      value: 'placeholder'
    },
    suggestions: {
      type: Array,
      value: []
    },
    suggestionsLimit: {
      type: Number,
      value: 4
    },
    prefix: {
      type: String,
      value: ''
    },
    suffix: {
      type: String,
      value: ' '
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onSuggestionTap: function (e) {
      var idx = e.currentTarget.dataset.idx
      this.setData({
        curIdx: idx,
        suggestions: []
      })
      this.triggerEvent('suggestionTap', {
        value: idx
      })
    },

    onChange: function (e) {
      var idx = e.detail.value
      this.setData({
        curIdx: idx
      })
      this.triggerEvent('change', {
        value: idx
      })
    }
  }
})
