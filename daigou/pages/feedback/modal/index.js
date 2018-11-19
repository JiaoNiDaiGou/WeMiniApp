// components/feedback-modal/index.js
const backend = require('../../../utils/Backend.js');
const app = getApp();

Component({
  /**
   * Component properties
   */
  properties: {
    show: {
      type: Boolean,
      value: false,
    }
  },

  /**
   * Component initial data
   */
  data: {
    content: '',
    images: [],
  },

  /**
   * Component methods
   */
  methods: {
    onInput: function (e) {
      this.setData({
        content: e.detail.detail.value
      })
    },

    onCancel: function (e) {
      this.setData({
        show: false,
        content: '',
            images: []
      })
      this.triggerEvent('cancel')
    },

    onConfirm: function (e) {
      var that = this
      var {
        content,
        images
      } = this.data

      // TODO: figure out block call
      var mediaIds = images.map(t => t.mediaId)
      if (!content || content.length < 5) {
        wx.showToast({
          title: '反馈不能小于5个字',
          icon: 'none',
          duration: 1000
        })
        return
      }

      backend.postFeedback(app, content, mediaIds)
        .then(res => {
          wx.showToast({
            title: '感谢提交反馈',
            duration: 1000
          })
          that.setData({
            show: false,
            content: '',
            images: []
          })
          that.triggerEvent('confirm')
        })
    }
  }
})
