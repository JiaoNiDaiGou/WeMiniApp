// pages/index/index.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
    uploadFilePaths: {},
    array: ['10%', '20%', '30%', '40%', '50%', '60%', '70%', '80%', '90%', '100%'],
    array_weight: [1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2.0],
    taxRate: 0.10,
    exchangeRate: 7,
    imageWidth: 414,
    imageHeight: 311,
    imageLength: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  chooseimg: function () {
    //把this对象复制到临时变量that.因为在函数返回response以后，this的值会被改变。
    var that = this;
    //选择图片
    wx.chooseImage({
      count: 9, // 默认9张图片
      sizeType: 'original', // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        var tempFiles = res.tempFiles
        that.setData({
          uploadFilePaths: res.tempFilePaths
        })
        console.log("所选图片的路径:" + tempFilePaths)
        console.log("所选图片的info:" + res)
        that.mergeImage()
      }
    })
  },
  bindconfirm: function (e) {
    this.setData({
      inputValue: e.detail.value
    })

  },
  bindnameconfirm: function (e) {
    this.setData({
      inputName: e.detail.value
    })

  },
  bindweightconfirm: function (e) {
    this.setData({
      inputWeight: e.detail.value
    })

  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '自定义转发标题',
      imageUrl: this.data.outputPicture
    }
  },
  mergeImage: function (e) {
    //创建Canvas画布
    var ctx = wx.createCanvasContext('main', this)
    //把this对象复制到临时变量that.因为在函数返回response以后，this的值会被改变。
    var that = this;
    //i为y坐标的值，此处表示起始高度
    var i = 120
    //imageWidth是单张图片的宽度
    var iw = this.data.imageWidth
    //imageHeight是单张图片的高度
    var ih = this.data.imageHeight
    var chooseImgwidth = 0
    var chooseImgheight = 0
    var targetHeight
    //循环拼接图片 此处用of不不能用in
    for (var path of that.data.uploadFilePaths) {
      console.log(path)

      wx.getImageInfo({
        src: path,
        success: function (res) {
          that.setData({
            chooseImgwidth: res.width,
            chooseImgheight: res.height
          })
        }
      })
      chooseImgheight = that.data.chooseImgheight
      chooseImgwidth = that.data.chooseImgwidth
      console.log(chooseImgheight)
      console.log(iw)
      console.log(chooseImgwidth)
      targetHeight = (chooseImgheight * iw) / chooseImgwidth
      console.log("适配后的图片高度：" + targetHeight)
      ctx.drawImage(path, 0, i, iw, targetHeight)
      i = i + targetHeight
    }

    ctx.setFontSize(25)
    var mydate = new Date();
    var date = mydate.getFullYear() + '-' + (mydate.getMonth() + 1) + '-' + mydate.getDate();
    //ctx.setTextAlign('center')    // 文字居中
    ctx.setFillStyle('#2C7BB5')  // 文字颜色：蓝色
    ctx.fillText('娇妮美国代购', 20, 35)
    ctx.fillText('发布日期：' + date, 20, 60)
    ctx.fillText('产品名称：' + that.data.inputName, 20, 85)

    //计算价格
    var result = that.data.inputValue
    that.setData({
      resultValue: (result * 1.1 * 7 * that.data.array_weight[that.data.index] + that.data.inputWeight * 28).toFixed(2),
      //所有图片的总长度
      imageLength: i
    })
    //
    console.log("所选产品的权重：" + that.data.array_weight[that.data.index])
    console.log("计算后的价格：" + result * 1.1 * 7 * that.data.array_weight[that.data.index])
    console.log("重量：" + that.data.inputWeight)
    console.log("运费：" + that.data.inputWeight * 28)
    ctx.fillText('价格：' + that.data.resultValue + '/件', 20, 110)
    ctx.draw()
  },
  previewImage: function (e) {
    var that = this
    var i = this.data.imageLength;
    //imageWidth是单张图片的宽度
    var iw = this.data.imageWidth
    //imageHeight是单张图片的高度
    var ih = this.data.imageHeight
    wx.canvasToTempFilePath({
      canvasId: 'main',
      quality: 1,
      width: iw,
      height: i,
      destWidth: iw * 750 / wx.getSystemInfoSync().windowWidth,
      destHeight: i * 750 / wx.getSystemInfoSync().windowWidth,
      success(res) {
        //保存临时图片地址
        that.setData({
          outputPicture: res.tempFilePath
        })
        console.log("预览的图片地址(res):" + res.tempFilePath)
        console.log("预览的图片地址(data):" + that.data.outputPicture)
        console.log("预览的图片地址:" + that.data.outputPicture)
        wx.previewImage({
          current: '', // 当前显示图片的http链接
          urls: [that.data.outputPicture] // 需要预览的图片http链接列表
        })
      }
    })

  },
  saveImage: function (e) {
    var that = this;
    var i = this.data.imageLength;
    //imageWidth是单张图片的宽度
    var iw = this.data.imageWidth
    //imageHeight是单张图片的高度
    var ih = this.data.imageHeight
    wx.canvasToTempFilePath({
      canvasId: 'main',
      quality: 1,
      width: iw,
      height: i,
      destWidth: iw * 750 / wx.getSystemInfoSync().windowWidth,
      destHeight: i * 750 / wx.getSystemInfoSync().windowWidth,
      success(res) {
        //保存临时图片地址
        that.setData({
          outputPicture: res.tempFilePath
        })
        console.log("Canvas临时图片路径" + res.tempFilePath)
        wx.getImageInfo({
          src: res.tempFilePath,
          success: function (res) {
            console.log(res);
            var path = res.path;
            wx.saveImageToPhotosAlbum({
              filePath: path,
              success: function (res) {
                console.log('图片已保存');
                wx.showToast({
                  title: '保存成功',
                  icon: 'success',
                  duration: 500
                })
              },
              fail: function (res) {
                console.log('保存失败');
                wx.showToast({
                  title: '保存失败',
                  icon: 'fail',
                  duration: 500
                })
              }
            })
          }
        });
      }
    })
  }
})