// pages/common/text-box.js

/**
 * properties:
 * - editable: boolean
 * - iconClass: icon class: string
 * - hasBottomBorder: boolean
 * - suggestions: array. element must be { id:xx, display: yy}
 * - suggestionsLimit: number: the limit of number to display suggestions
 * - type: type of input: text(default), number, digit, etc
 * - value: string
 * - valuePrefix: string
 * - valueSuffix: string
 * 
 * events:
 * input: when input typing
 * suggestionTap: when some suggestion is tapped.
 * 
 */
Component({
  /**
   * Component properties
   */
  properties: {
    iconClass: {
      type: String,
      value: ''
    },
    inputStyle: {
      type: 'String',
      value: 'text'
    },
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
      value: '',
    },
    valueSuffix: {
      type: String,
      value: '',
    }
  },
  data: {
    inputFocus: false,
  },
  methods: {
    onInput: function (e) {
      var value = e.detail.value
      this.setData({
        value: value
      })
      this.triggerEvent('input', {
        value: value
      })
    },

    onSuggestionTap: function (e) {
      var suggestionId = e.currentTarget.dataset.id
      var suggestion = this.data.suggestions.find(t => t.id == suggestionId)
      if (!!suggestion) {
        this.setData({
          value: suggestion.display,
          suggestions: []
        })
        this.triggerEvent('suggestionTap', {
          value: suggestion
        })
      }
    },

    onInputTap: function (e) {
      this.setData({
        inputFocus: true
      })
    },

    onInputBlur: function (e) {
      this.setData({
        inputFocus: false
      });
    }
  }
})