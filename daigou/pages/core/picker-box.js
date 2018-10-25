/**
 * properties:
 * - curIdx: current selected index: default to -1: not selected: display the placeholder
 * - iconClass: string
 * - hasBottomBorder: boolean
 * - placeholder: string
 * - suggestions: array[number]. The suggested indexes from range.
 * - suggestionsLimit: number: limit of suggestions to show
 * - range: array[string]: the range to pick
 * - valuePrefix: string
 * - valueSuffix: string
 * 
 * events:
 * suggestionTap: when suggestion tapped
 * change: when picker value changed
 */
Component({
  properties: {
    iconClass: {
      type: String,
      value: ''
    },
    range: {
      type: Array,
      value: ['a', 'b', 'c']
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
    hasBottomBorder: {
      type: Boolean,
      value: false
    },
    valuePrefix: {
      type: String,
      value: ''
    },
    valueSuffix: {
      type: String,
      value: ''
    }
  },
  data: {},
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