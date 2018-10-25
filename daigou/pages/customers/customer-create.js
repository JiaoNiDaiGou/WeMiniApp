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
    showProgressBar: false,
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
  onRawTextInput: function (e) {
    this.setData({
      rawText: e.detail.value
    });
  },

  onNameInput: function (e) {
    this.setData({
      name: e.detail.value
    });
    this.checkReadyToCreate();
  },

  onPhoneInput: function (e) {
    this.setData({
      phone: e.detail.value
    });
    this.checkReadyToCreate();
  },

  onAddressInput: function (e) {
    this.setData({
      address: e.detail.value
    });
    this.checkReadyToCreate();
  },

  /**
   * When user select one parsing candidate.
   */
  onParsingCandidateSelect: function (e) {
    var customer = this.data.parsingCandidates
      .find(t => t.tmpindex === e.currentTarget.dataset.tmpindex);
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
  onParseRawTextOrImageTap: function () {
    var that = this;
    console.log('parse raw customer. text=' + this.data.rawText + ', mediaId=' + this.data.rawImageMediaId);
    wx.showLoading({
      title: '开始上传图片',
    });

    var progressHandle = (res) => {
      wx.showLoading({
        title: '已经上传 ' + res.progress + '%'
      })
    }

    var texts = !!this.data.rawText ? [this.data.rawText] : [];
    var imagePath = this.data.rawImagePath;
    if (!!imagePath) {
      console.log('upload image: ' + imagePath);
      backend.promiseOfUploadMedia(app, imagePath, progressHandle)
        .then(r => {
          var mediaId = r.res.data.id;
          console.log('upload media success. get mediaId:' + mediaId)
          wx.showLoading({
            title: '智能解析中',
          })
          that.parseRawCustomer(texts, [mediaId]);
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
        var results = r.res.data.results
        wx.hideLoading();
        if (!results || results.length == 0) {
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
        for (var i = 0; i < results.length; i++) {
          var parsedCustomer = results[i].customer;
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
          parsingCandidates: parsingCandidates
        });
      });
  },

  /**
   * When user press uploadImage.
   */
  onChooseRawImageTap: function (e) {
    var that = this;
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

  onCreateCustomerTap: function (e) {
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
      var customerId = r.res.data.id
      console.log('created customer id ' + customerId)
      that.setData({
        id: customerId
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