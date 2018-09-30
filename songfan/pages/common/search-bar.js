// pages/common/search-bar.js
Component({
  /**
   * Component properties
   */
  properties: {
    /**
     * searchResultCandidates must have:
     * - id: id of the item
     * - display: the string to display in selection.
     */
    searchCandidates: {
      type: Array,
      value: []
    },

    /**
     * The style how to display the searching candidates.
     * Possible values are:
     * dropDown (default)
     * badgeRight
     */
    searchCandidatesDisplayStyle: {
      type: String,
      value: 'dropDown'
    },

    /**
     * The number of searching candidates to display.
     * If using dropDown styple, you can set a large limit.
     * If using badgeRight styple, suggest limit to 3.
     */
    searchCandidatesDisplayLimit: {
      type: Number,
      value: 30
    },

    /**
     * Input text box placeholder.
     */
    placeholder: {
      type: String,
      value: '搜索'
    },

    inputValue: {
      type: String,
      value: ''
    }
  },

  /**
   * Component initial data
   */
  data: {
    inputShowed: false
  },

  /**
   * Component methods
   */
  methods: {
    showInput: function () {
      this.setData({
        inputShowed: true
      });
    },

    hideInput: function () {
      this.setData({
        inputValue: "",
        inputShowed: false
      });
    },

    clearInput: function () {
      this.setData({
        inputValue: ""
      });
    },

    inputTyping: function (e) {
      var inputValue = e.detail.value;
      this.setData({
        inputValue: inputValue
      });
      this.triggerEvent('inputTypingEvent', { inputValue: inputValue }, {})
    },

    searchCandidateSelected: function (e) {
      var selectedId = e.currentTarget.id;
      console.log('select id: ' + selectedId);
      this.triggerEvent('candidateSelectedEvent', { id: selectedId }, {});
    }
  },
})
