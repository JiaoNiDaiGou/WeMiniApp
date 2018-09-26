//app.js
const util = require('./utils/util.js')

App({
  //onLaunch 程序初始化时调用
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        var code = res.code;
        console.log('Get client code ' + code);
        if (code) {
          wx.request({
            url: util.BE_ENDPOINT + '/api/wx/jiaonidaigou/login',
            data: {
              code: code
            },
            success: res => {
              var ticketId = res.ticketId;
              console.log('Successfully fetch session ticket ' + ticketId)
              this.globalData.sessionTicketId = ticketId;
            },
            fail: e => {
              console.log(e);
            }
          })
        } else {
          console.log('Cannot get code. login failed.');
        }
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    sessionTicketId: null
  }
})