// pages/common/feedback-modal.js
const backend = require('../../utils/backend.js');
const utils = require('../../utils/util.js');
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
        content: e.detail.value
      })
      console.log(this.data.content)
    },

    onCancel: function (e) {
      this.setData({
        show: false
      })
      this.triggerEvent('done')
    },

    onConfirm: function (e) {
      var that = this
      var content = this.data.content
      var mediaIds = !!this.data.images ? this.data.images.map(t => t.mediaId) : [] // TODO: figure out block call.
      if (!content || content.length < 5) {
        wx.showToast({
          title: '❌  反馈不能小于5个字 对 说的就是你娇娇 ❌ ',
          duration: 800,
          icon: 'none'
        })
        return
      }

      backend.promiseOfPostFeedback(app, content, mediaIds)
        .then(res => {
          // post a feedback to backend
          wx.showToast({
            title: '感谢提交反馈',
            duration: 800
          })
          that.setData({
            show: false,
            content: '',
            imageIds: []
          })
          that.triggerEvent('done')
        })
    }
  }
})
