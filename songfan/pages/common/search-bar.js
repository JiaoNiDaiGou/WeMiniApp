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
    searchResultCandidates: {
      type: Array,
      value: []
    },

    inputPlaceholder: {
      type: String,
      value: '搜索'
    },

    /**
     * input style can be:
     * bar
     * textarea
     */
    inputStyle: {
      type: String,
      value: 'bar'
    }
  },

  /**
   * Component initial data
   */
  data: {
    inputShowed: false,
    inputVal: "",
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
        inputVal: "",
        inputShowed: false
      });
    },

    clearInput: function () {
      this.setData({
        inputVal: ""
      });
    },

    inputTyping: function (e) {
      var inputVal = e.detail.value;
      this.setData({
        inputVal: inputVal
      });
      this.triggerEvent('inputTypingEvent', { inputVal: inputVal }, {})
    },

    selectSearchCandidate: function (e) {
      var selectedId = e.currentTarget.id;
      console.log('select id: ' + selectedId);
      this.triggerEvent('selectSearchCandidate', { id: selectedId }, {});
      this.setData({
        searchResultCandidates: []
      });
    }
  },
})
