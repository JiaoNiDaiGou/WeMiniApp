const utils = require('./util.js')

const SERVER = 'https://dev-dot-fluid-crane-200921.appspot.com';

/**
 * Login Wx and sync with backend.
 */
const promiseOfBackendLogin = (app) => {
  return new Promise(function (resolve, reject) {
    console.log('CALL wxLogin!');

    app.globalData.sessionTicketId = 'eb87a303-7aa6-4bb4-9bf4-3b1861bef776';
    if (!!app.globalData.sessionTicketId) {
      resolve(app);
      return;
    }

    wx.showToast({
      title: '登陆娇妮代购中',
      icon: 'loading',
      mask: true,
    });
    wx.login({
      success: res => {
        console.log('fetch client jscode ' + res.code);
        wx.request({
          method: 'POST',
          url: SERVER + '/api/wx/SongFan/login',
          data: {
            code: res.code
          },
          success: res => {
            console.log('CALL wxLogin SUCCESS!');

            wx.hideToast();
            var sessionTicketId = res.data.ticketId;
            console.log('fetch backend server session ticket ID: ' + sessionTicketId);
            app.globalData.sessionTicketId = sessionTicketId;
            resolve(app);
          },
          fail: res => {
            wx.hideToast();
          }
        })
      }
    })
  });
}

const promiseOfLoadAllCustomers = (app) => {
  console.log('CALL parseCustomer!')
  return new Promise(function (resolve, reject) {
    wx.request({
      method: 'GET',
      url: SERVER + '/api/JiaoNiDaiGou/customers/getAll?limit=1000',
      header: {
        'X-Wx-SessionTicket': app.globalData.sessionTicketId
      },
      success: res => {
        console.log('CALL loadAllCustomers SUCCESS!');
        app.globalData.customers = res.data.results;
        console.log('totally load ' + app.globalData.customers.length + ' customers.');
        resolve(app);
      }
    })
  });
}

const promiseOfUploadMedia = (app, path) => {
  var ext = path.split('.').pop();
  console.log('CALL uploadMedia!')
  return new Promise(function (resolve, reject) {
    wx.uploadFile({
      url: SERVER + '/api/media/directUpload?ext=' + ext,
      filePath: path,
      header: {
        'X-Wx-SessionTicket': app.globalData.sessionTicketId,
      },
      name: path,
      success: res => {
        console.log('CALL uploadMedia SUCCESS!');
        // wx.uploadFile response is text.
        // convert it to json.
        resolve(JSON.parse(res.data));
      }
    });
  });
}

const promiseOfParseCustomer = (app, texts, mediaIds) => {
  console.log('CALL parseCustomer!')
  return new Promise(function (resolve, reject) {
    wx.request({
      method: 'POST',
      url: SERVER + '/api/parse',
      header: {
        'X-Wx-SessionTicket': app.globalData.sessionTicketId
      },
      data: {
        domain: 'CUSTOMER',
        texts: texts,
        mediaIds: mediaIds
      },
      success: res => {
        console.log('CALL parseCustomer SUCCESS!')
        resolve(res.data);
      }
    });
  });
}

module.exports = {
  promiseOfBackendLogin: promiseOfBackendLogin,
  promiseOfLoadAllCustomers: promiseOfLoadAllCustomers,
  promiseOfUploadMedia: promiseOfUploadMedia,
  promiseOfParseCustomer: promiseOfParseCustomer
}