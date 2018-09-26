// pages/customers/customer-create.js
const backend = require('../../utils/backend.js');
const utils = require('../../utils/util.js');
const app = getApp();

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

    rawText: '',
    rawImagePath: null,

    parsingCandidates: [],
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
   * When user typing in rawText textarea.
   */
  onRawTextInputTyping: function (e) {
    this.setData({
      rawText: e.detail.inputVal
    });
  },

  /**
   * When user select one parsing candidate.
   */
  onParsingCandidatesSelected: function (e) {
    var customer = this.data.parsingCandidates
      .filter(t => t.id === e.detail.id)[0];
    if (!!customer.name) {
      this.setData({ name: customer.name })
    }
    if (!!customer.phone) {
      this.setData({ phone: customer.phone })
    }
    if (!!customer.address) {
      this.setData({ address: customer.address });
    }
  },

  /**
  * Parse raw receiver info
  */
  parseRawTextOrImage: function () {
    console.log('parse raw customer. text=' + this.data.rawText + ', mediaId=' + this.data.rawImageMediaId);
    var texts = !!this.data.rawText ? [this.data.rawText] : [];
    var imagePath = this.data.rawImagePath;
    if (!!imagePath) {
      console.log('upload image: ' + imagePath);
      backend.promiseOfUploadMedia(app, imagePath)
        .then(mediaObj => {
          console.log('upload media success. get mediaId:' + mediaObj.id)
          this.parseRawCustomer(texts, [mediaObj.id]);
        })
    } else if (texts.length > 0) {
      this.parseRawCustomer(texts, []);
    } else {
      console.log('nothing to parse.')
    }
  },

  parseRawCustomer: function (texts, mediaIds) {
    backend.promiseOfParseCustomer(app, texts, mediaIds)
      .then(res => {
        if (!res.results) {
          return;
        }
        var parsingCandidates = [];

        for (var i = 0; i < res.results.length; i++) {
          var parsedCustomer = res.results[i].customer;
          var name = parsedCustomer.name;
          var phone = (!!parsedCustomer.phone ? parsedCustomer.phone.phone : null);
          if (!!parsedCustomer.addresses) {
            for (var j = 0; j < parsedCustomer.addresses.length; j++) {
              var id = 'parse_' + i + '_' + j;
              var address = parsedCustomer.addresses[j];
              parsingCandidates.push({
                id: id,
                name: name,
                phone: phone,
                address: address,
                display: utils.formatCustomerContactToString(name, phone, address)
              });
            }
          } else {
            var id = 'parse_' + i + '_x';
            parsingCandidates.push({
              id: id,
              name: name,
              phone: phone,
              display: utils.formatCustomerContactToString(name, phone)
            });
          }
        }

        this.setData({
          parsingCandidates: parsingCandidates
        });
      });
  },

  /**
   * When user press uploadImage.
   */
  chooseRawImage: function (e) {
    //把this对象复制到临时变量that.因为在函数返回response以后，this的值会被改变。
    var that = this;
    //选择图片
    wx.chooseImage({
      count: 1, // 默认1张图片
      sizeType: 'original', // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: res => {
        var tempFilePath = res.tempFilePaths[0];
        console.log('Selected image path: ' + tempFilePath);
        that.setData({
          rawImagePath: tempFilePath
        });
      }
    })
  }
})