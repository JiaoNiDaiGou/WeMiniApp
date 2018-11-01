// components/text-box/index.js

/**
 * properties:
 * - disabled: boolean
 * - icon: icon class: string
 * - fuiIcon: customized icon class: string,
 * - suggestions: array. element must be { id:xx, display: yy}
 * - suggestionsLimit: number: the limit of number to display suggestions
 * - type: type of input: text(default), number, digit, etc
 * - value: string
 * - prefix: string
 * - suffix: string
 * 
 * events:
 * input: when input typing
 * suggestionTap: when some suggestion is tapped.
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
    type: {
      type: String,
      value: 'text',
    },
    value: {
      type: String,
      value: ''
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
      value: ''
    },
    suggestions: {
      type: Array,
      value: [],
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
    onInput: function (e) {
      var value = e.detail.detail.value
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
      console.log(suggestion)
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
  }
})
