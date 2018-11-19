const backend = require('../../../utils/Backend.js')
const util = require('../../../utils/Utils.js')
const app = getApp()

Page({

  /**
   * Page initial data
   */
  data: {
    ACTIONS: [{
      name : '撤销',
      color : '#fff',
      fontsize : '14px',
      width : 100,
      icon : 'delete',
      background : '#ed3f14'
  },
  {
      name : '返回',
      width : 100,
      color : '#80848f',
      fontsize : '14px',
      icon : 'undo'
  }],
  toggle: false,
    feedbacks: []
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    var that = this
    wx.showLoading({
      title: '加载所有反馈'
    })
    backend.getAllFeedbacks(app)
      .then(r => {
        wx.hideLoading()
        var feedbacks = r.res.data.map(t => {
          t.avatar = t.requesterName === 'anonymous' ? 'X' : t.requesterName.substring(0, 1)
          t.ts = util.formatTimestamp(parseInt(t.timestamp))
          return t
        })
        that.setData({
          feedbacks
        })
      })
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {},

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {},

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {},

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {},

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {},

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {},

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {},

  onActionClick: function (e) {
    var idx = e.detail.index
    var { feedbacks, toggle } = this.data
    var feedbackid = e.currentTarget.dataset.feedbackid
    var feedbackidx = feedbacks.findIndex(t => t.id === feedbackid)
    switch (e.detail.index) {
      case 0: { // delete
        feedbacks.splice(feedbackidx, 1)
        this.setData({
          feedbacks,
          toggle: !toggle
        })
        backend.closeFeedback(app, feedbackid)
        .then(r => {
          wx.showToast({
            title: '反馈已关闭',
            duration: 1000,
            icon: 'none'
          })
        })
        break
      }
      case 1: {
        this.setData({
          toggle: !toggle
        })
        break
      }
    }
  },
})
