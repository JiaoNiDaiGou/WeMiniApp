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
    // TODO:
    // change to iconName, iconSize, and iconColor
    iconClass: {
      type: String,
      value: ''
    },

    inputStyle: {
      type: 'String',
      value: 'text'
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
    },

    /**
     * The suggestions.
     * Must be { id: xx, display: yy }
     */
    suggestions: {
      type: Array,
      value: []
    },

    /**
     * The limit of number to display suggestions.
     */
    suggestionsLimit: {
      type: Number,
      value: 4
    },

    hasBottomBorder: {
      type: Boolean,
      value: false
    }
  },

  /**
   * Component initial data
   */
  data: {
    inputValue: '',
    inputFocus: false,
  },

  /**
   * Component methods
   */
  methods: {
    inputTyping: function (e) {
      this.setData({
        inputValue: e.detail.value
      })
      this.triggerEvent('typingEvent', e.detail, {})
    },

    tapSuggestion: function (e) {
      var suggestionId = e.currentTarget.dataset.id;
      var selectedSuggestion = this.data.suggestions
        .filter(t => t.id === suggestionId)[0];
      this.setData({
        value: selectedSuggestion.display,
        suggestions: [],
      });
      this.triggerEvent('suggestionTapEvent', { suggestion: selectedSuggestion }, {})
    },

    inputFocus: function (e) {
      this.setData({
        inputFocus: true
      });
    },

    inputBlur: function (e) {
      this.setData({
        inputFocus: false
      });
    }
  }
})
