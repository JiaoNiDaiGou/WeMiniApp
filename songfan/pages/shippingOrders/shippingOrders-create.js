// pages/shippingOrders/shippingOrders-create.js
const utils = require('../../utils/util.js')
const backend = require('../../utils/backend.js')
const app = getApp()

Page({

  /**
   * Page initial data
   */
  data: {
    name: '',
    phone: '',
    region: '',
    city: '',
    zone: '',
    address: '',
    products: [],
    totalWeight: 0.0,
    rawReceiverImageFilePath: null,
    rawReceiverText: '',
    parsedReceiverResultCandidates: [],
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {

  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  },

  /**
   * Parse raw receiver info
   */
  parseRawReceiverTextsOrImages: function () {
    const text = this.data.rawReceiverText;    
    const imagePath = this.data.rawReceiverImageFilePath;
    if (!!imagePath) {
      console.log('upload image: ' + imagePath);
      backend.promiseOfUploadMedia(imagePath)
        .then(mediaObj => {
          console.log('upload media success. get mediaId:' + mediaId.id)
          this.parseRawReceiver(text, mediaObj.id)
        })
    } else if (!!text) {
      this.parseRawReceiver(text);
    }
  },

  parseRawReceiver: function (text, mediaId) {

  },

  inputRawReceiverText: function (e) {
    this.setData({
      rawReceiverText: e.detail.inputVal
    });
  },

  selectParsedReceiverInfo: function (e) {
    var selectedReceiver = this.data.parsedReceiverResultCandidates
      .filter(t => t.id === e.detail.id)[0];
    if (!!selectedReceiver.name) {
      this.setData({ name: selectedReceiver.name })
    }
    if (!!selectedReceiver.phone) {
      this.setData({ phone: selectedReceiver.phone })
    }
    if (!!selectedReceiver.address) {
      if (!!selectedReceiver.address.region) {
        this.setData({ region: selectedReceiver.address.region })
      }
      if (!!selectedReceiver.address.city) {
        this.setData({ city: selectedReceiver.address.city })
      }
      if (!!selectedReceiver.address.zone) {
        this.setData({ zone: selectedReceiver.address.zone })
      }
      if (!!selectedReceiver.address.address) {
        this.setData({ address: selectedReceiver.address.address })
      }
    }
  },

  chooseRawReceiverImage: function (e) {
    //把this对象复制到临时变量that.因为在函数返回response以后，this的值会被改变。
    var that = this;
    //选择图片
    wx.chooseImage({
      count: 1, // 默认1张图片
      sizeType: 'original', // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: res => {
        var tempFilePaths = res.tempFilePaths;
        var tempFiles = res.tempFiles;
        that.setData({
          rawReceiverImageFilePath: res.tempFilePaths[0]
        });
        console.log('Selected image paths: ' + tempFilePaths);
      }
    })
  }
})

// 李好雨