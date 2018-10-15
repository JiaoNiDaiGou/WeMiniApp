/**
 * properties:
 * - candidates: array: searching candidates. Must be { id: xx, display: yy}
 * - placeholder: string
 * - value: string: value of searching bar input
 * 
 * events:
 * candidateSelect: when candidate selected. 
 * input: when input typing
 */
Component({
  properties: {
    candidates: {
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
  data: {
    inputShow: false
  },
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
    onInputClear: function () {
      this.setData({
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
    onCandidateSelect: function (e) {
      var selectedId = e.currentTarget.id
      this.triggerEvent('candidateSelect', {
        value: selectedId
      })
    }
  },
})