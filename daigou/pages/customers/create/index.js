const backend = require('../../../utils/Backend.js')
const app = getApp()

Page({

  /**
   * Page initial data
   */
  data: {
    id: '',
    name: '',
    phone: '',
    address: null,

    rawText: '',
    rawImagePath: '',

    parsingCandidates: []
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function(options) {},

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function() {},

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function() {},

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function() {},

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function() {},

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function() {},

  /**
   * Called when page reach bottom
   */
  onReachBottom: function() {},

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function() {},

  onRawTextInput: function(e) {
    this.setData({
      rawText: e.detail.value
    });
  },

  onNameInput: function(e) {
    this.setData({
      name: e.detail.value
    });
  },

  onPhoneInput: function(e) {
    this.setData({
      phone: e.detail.value
    });
  },

  onAddressInput: function(e) {
    this.setData({
      address: e.detail.value
    });
  },

  onSelectImageClick: function() {
    var that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'commpressed'],
      sourceType: ['album', 'camera'],
      success: res => {
        that.setData({
          rawImagePath: res.tempFilePaths[0]
        })
      }
    })
  },

  onImageChange: function(e) {
    this.setData({
      rawImagePath: e.detail.value
    })
  },

  onCreateCustomerClick: function(e) {
    if (!this.readyToCreate()) {
      wx.showToast({
        title: '客户信息不完整',
        icon: 'none',
        duration: 1000
      })
      return
    }

    var {
      id,
      name,
      phone,
      address
    } = this.data
    wx.showLoading({
      title: '创建新客户'
    })
    backend.createCustomer(
      app,
      id,
      name,
      phone,
      address
    ).then(r => {
      var customer = r.res.data
      var customers = app.globalData.customers
      var idx = customers.findIndex(t => t.id === customer.id)
      if (idx != -1) {
        customers.splice(idx, 1)
      }
      customers.push(customer)
      app.globalData.customers = customers
      wx.redirectTo({
        url: '../details/index?id=' + customer.id
      })
      backend.loadAllCustomers(r.app)
        .then(r => console.log('sync all customers'))
    })
  },

  onParseClick: function() {
    var that = this
    var {
      rawText,
      rawImagePath
    } = this.data
    var readyToParse = !!rawText || !!rawImagePath
    if (!readyToParse) {
      wx.showToast({
        icon: 'none',
        title: '没发现文本或图片'
      })
      return
    }

    var progressHandle = (res) => {
      wx.showLoading({
        title: '已上传' + res.progress + '%'
      })
    }

    var texts = !!rawText ? [rawText] : []
    if (!!rawImagePath) {
      backend.uploadMedia(app, rawImagePath, progressHandle)
        .then(r => {
          var mediaId = r.res.data.id
          console.log('upload media success. get mediaId:' + mediaId)
          wx.showLoading({
            title: '智能解析中'
          })
          that.parseRawCustomer(texts, [mediaId])
        })
    } else {
      this.parseRawCustomer(texts, [])
    }
  },

  onParsingCandidateSelect: function(e) {
    var {
      parsingCandidates
    } = this.data
    var customer = parsingCandidates.find(t => t.tmpindex === e.currentTarget.dataset.tmpindex)
    if (customer) {
      var id = !!customer.id ? customer.id : this.data.id;
      var name = !!customer.name ? customer.name : this.data.name;
      var phone = !!customer.phone ? customer.phone : this.data.phone;
      var address = !!customer.address ? customer.address : this.data.address;
      this.setData({
        id,
        name,
        phone,
        address,
        parsingCandidates: []
      });
    }
  },

  parseRawCustomer: function(texts, mediaIds) {
    backend.parseCustomer(app, texts, mediaIds)
      .then(r => {
        var results = r.res.data.results
        wx.hideLoading()

        if (!results || results.length == 0) {
          wx.showToast({
            icon: 'none',
            title: '未发现客户信息',
            duration: 1000
          })
          return
        }

        var parsingCandidates = []
        for (var i = 0; i < results.length; i++) {
          var parsedCustomer = results[i].customer
          var name = parsedCustomer.name
          var phone = (!!parsedCustomer.phone ? parsedCustomer.phone.phone : null)
          if (!!parsedCustomer.addresses) {
            for (var j = 0; j < parsedCustomer.addresses.length; j++) {
              var tmpindex = 'parse_' + i + '_' + j
              var address = parsedCustomer.addresses[j]
              var id = parsedCustomer.id
              parsingCandidates.push({
                tmpindex: tmpindex,
                id: id,
                name: name,
                phone: phone,
                address: address,
              })
            }
          } else {
            var tmpindex = 'parse_' + i + '_x'
            parsingCandidates.push({
              tmpindex: tmpindex,
              id: id,
              name: name,
              phone: phone
            })
          }
        }

        this.setData({
          parsingCandidates
        })
      })
  },

  readyToCreate: function() {
    var {
      name,
      phone,
      address
    } = this.data
    return name && phone && address && address.region && address.city && address.zone && address.address;
  }
})