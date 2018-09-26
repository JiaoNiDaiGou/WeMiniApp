// pages/customers/customer-create.js
const backend = require('../../utils/backend.js');
const utils = require('../../utils/util.js');
const app = getApp();

Page({

  /**
   * Page initial data
   */
  data: {
    id: '',
    name: '',
    phone: '',
    region: '',
    city: '',
    zone: '',
    address: '',

    rawText: '',
    rawImagePath: null,

    parsingCandidates: [],

    readyToCreate: false,
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
      rawText: e.detail.value
    });
  },

  onNameTyping: function (e) {
    this.setData({
      name: e.detail.value
    });
    this.checkReadyToCreate();
  },

  onPhoneTyping: function (e) {
    this.setData({
      phone: e.detail.value
    });
    this.checkReadyToCreate();
  },

  onAddressTyping: function (e) {
    this.setData({
      address: e.detail.value
    });
    this.checkReadyToCreate();
  },

  /**
   * When user select one parsing candidate.
   */
  onParsingCandidatesSelected: function (e) {
    console.log('select');
    console.log(e);
    var customer = this.data.parsingCandidates
      .filter(t => t.tmpindex === e.currentTarget.dataset.tmpindex)[0];
    if (!!customer) {
      var id = !!customer.id ? customer.id : this.data.id;
      var name = !!customer.name ? customer.name : this.data.name;
      var phone = !!customer.phone ? customer.phone : this.data.phone;
      var address = !!customer.address ? customer.address : this.data.address;
      this.setData({
        id: id,
        name: name,
        phone: phone,
        address: address,
        parsingCandidates: []
      });
      this.checkReadyToCreate();
    }
  },

  /**
   * Parse raw receiver info
   */
  parseRawTextOrImage: function () {
    console.log('parse raw customer. text=' + this.data.rawText + ', mediaId=' + this.data.rawImageMediaId);
    wx.showLoading({
      title: '智能解析中',
    });

    var texts = !!this.data.rawText ? [this.data.rawText] : [];
    var imagePath = this.data.rawImagePath;
    if (!!imagePath) {
      console.log('upload image: ' + imagePath);
      backend.promiseOfUploadMedia(app, imagePath)
        .then(r => {
          var mediaId = r.res.mediaObj.id;
          console.log('upload media success. get mediaId:' + mediaId)
          this.parseRawCustomer(texts, [mediaId]);
        })
    } else if (texts.length > 0) {
      this.parseRawCustomer(texts, []);
    } else {
      wx.hideLoading();
      console.log('nothing to parse.')
    }
  },

  parseRawCustomer: function (texts, mediaIds) {
    backend.promiseOfParseCustomer(app, texts, mediaIds)
      .then(r => {
        var res = r.res;
        wx.hideLoading();

        if (!res.results || res.results.length == 0) {
          console.log('doesnt parse to any customer');
          wx.showModal({
            title: '没发现客户信息',
            content: '请换张图片或内容',
          });
          this.setData({
            rawText: '',
            rawImagePath: null
          });
          return;
        }


        var parsingCandidates = [];
        for (var i = 0; i < res.results.length; i++) {
          var parsedCustomer = res.results[i].customer;
          var name = parsedCustomer.name;
          var phone = (!!parsedCustomer.phone ? parsedCustomer.phone.phone : null);
          if (!!parsedCustomer.addresses) {
            for (var j = 0; j < parsedCustomer.addresses.length; j++) {
              var tmpindex = 'parse_' + i + '_' + j;
              var address = parsedCustomer.addresses[j];
              var id = parsedCustomer.id;
              parsingCandidates.push({
                tmpindex: tmpindex,
                id: id,
                name: name,
                phone: phone,
                address: address
              });
            }
          } else {
            var tmpindex = 'parse_' + i + '_x';
            parsingCandidates.push({
              tmpindex: tmpindex,
              id: id,
              name: name,
              phone: phone
            });
          }
        }

        this.setData({
          parsingCandidates: parsingCandidates,
          rawText: '',
          rawImagePath: null
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
  },

  checkReadyToCreate: function (e) {
    var ready = !!this.data.name
      && !!this.data.phone
      && !!this.data.address
      && !!this.data.address.region
      && !!this.data.address.city
      && !!this.data.address.zone
      && !!this.data.address.address;
    this.setData({
      readyToCreate: ready
    });
  },

  createCustomer: function (e) {
    if (!!this.data.id) {
      console.log('update customer ' + this.data.id + ':' + this.data.name);
    } else {
      console.log('create customer ' + this.data.name);
    }

    var that = this;

    backend.promiseOfCreateCustomer(
      app,
      this.data.id,
      this.data.name,
      this.data.phone,
      this.data.address
    ).then(r => {
      that.setData({
        id: r.res.id
      });
      backend.promiseOfLoadAllCustomers(r.app)
        .then(r => {
          console.log('go to customer details for ' + that.data.id);
          wx.redirectTo({
            url: './customer-details?id=' + that.data.id,
          })
        });
    })
  }
})