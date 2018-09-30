const utils = require('./util.js')

const SERVER = 'https://dev-dot-fluid-crane-200921.appspot.com';

/**
 * We always return object like:
 * {
 *  app: app,
 *  res: res.data
 * }
 */

/**
 * Login Wx and sync with backend.
 */
const promiseOfBackendLogin = (app) => {
  return new Promise(function (resolve, reject) {
    console.log('CALL wxLogin!');

    // app.globalData.sessionTicketId = '16e15fa5-e354-4a95-a2c5-48e8afbdf938';
    if (!!app.globalData.sessionTicketId) {
      resolve({
        app: app
      });
      return;
    }
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
            var sessionTicketId = res.data.ticketId;
            console.log('fetch backend server session ticket ID: ' + sessionTicketId);
            app.globalData.sessionTicketId = sessionTicketId;
            resolve({
              app: app
            });
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
        resolve({
          app: app
        });
      }
    })
  });
}

const promiseOfLoadProductsHints = (app) => {
  console.log('CALL loadProductsHints!')
  return new Promise(function (resolve, reject) {
    wx.request({
      method: 'GET',
      url: SERVER + '/api/JiaoNiDaiGou/products/hints',
      header: {
        'X-Wx-SessionTicket': app.globalData.sessionTicketId
      },
      success: res => {
        console.log('CALL loadProductsHints SUCCESS!');

        var hints = res.data;

        // fulfill
        hints.forEach(hint => {
          var category = hint.left;
          var categoryIndex = utils.findProductCategoryIndexByValue(category);
          var brand = hint.middle;
          utils.incTableCount(app.globalData.productBrandToCategoryHints, brand, categoryIndex);
          var names = hint.right;
          names.forEach(name => {
            utils.incTableCount(app.globalData.productNameToBrandHints, name, brand);
            utils.incTableCount(app.globalData.productNameToCategoryHints, name, categoryIndex);
          })
        })

        // sort
        app.globalData.productBrandToCategoryHints.forEach(t => t.val.sort((a, b) => b.val - a.val))
        app.globalData.productNameToBrandHints.forEach(t => t.val.sort((a, b) => b.val - a.val))
        app.globalData.productNameToCategoryHints.forEach(t => t.val.sort((a, b) => b.val - a.val))

        resolve({
          app: app
        })
      }
    })
  })
}

const promiseOfGetCustomerById = (app, customerId) => {
  console.log('CALL getCustomerById!');
  return new Promise(function (resolve, reject) {
    wx.request({
      method: 'GET',
      url: SERVER + '/api/JiaoNiDaiGou/customers/get/' + customerId,
      header: {
        'X-Wx-SessionTicket': app.globalData.sessionTicketId
      },
      success: res => {
        console.log('CALL wxLogin SUCCESS!');
        resolve({
          app: app,
          res: res.data
        });
      }
    });
  });
}

const promiseOfUploadMedia = (app, path, progressHandle) => {
  var ext = path.split('.').pop();
  console.log('CALL uploadMedia!')
  return new Promise(function (resolve, reject) {
    var uploadTask = wx.uploadFile({
      url: SERVER + '/api/media/formDirectUpload?ext=' + ext,
      filePath: path,
      header: {
        'X-Wx-SessionTicket': app.globalData.sessionTicketId,
      },
      name: 'file',
      success: res => {
        console.log('CALL uploadMedia SUCCESS!');
        console.log(res);
        // wx.uploadFile response is text.
        // convert it to json.
        resolve({
          app: app,
          res: JSON.parse(res.data)
        });
      },
      fail: res => {
        reject({
          app: app,
          res: res
        });
      }
    });

    if (!!progressHandle) {
      uploadTask.onProgressUpdate(res => {
        progressHandle(res);
      });
    }

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
        mediaIds: mediaIds,
        limit: 5
      },
      success: res => {
        console.log('CALL parseCustomer SUCCESS!')
        resolve({
          app: app,
          res: res.data
        });
      }
    });
  });
}

const promiseOfCreateCustomer = (app, id, name, phone, address) => {
  console.log('CALL createCustomer!')
  return new Promise(function (resolve, reject) {
    wx.request({
      method: 'PUT',
      url: SERVER + '/api/JiaoNiDaiGou/customers/put',
      header: {
        'X-Wx-SessionTicket': app.globalData.sessionTicketId
      },
      data: {
        id: id,
        name: name,
        phone: {
          countryCode: '86',
          phone: phone
        },
        addresses: [address]
      },
      success: res => {
        console.log('CALL createCustomer SUCCESS!')
        resolve({
          app: app,
          res: res.data
        });
      }
    });
  });
}

const promiseOfInitShippingOrder = (app, receiverCustomerId, address, products, totalWeight) => {
  console.log('CALL InitShippingOrder!');
  return new Promise(function (resolve, reject) {
    wx.request({
      method: 'POST',
      url: SERVER + '/api/shippingOrders/init',
      header: {
        'X-Wx-SessionTicket': app.globalData.sessionTicketId
      },
      data: {
        receiverCustomerId: receiverCustomerId,
        address: address,
        productEntries: products,
        total_weight_lb : !!totalWeight ? totalWeight : 0
      },
      success: res => {
        console.log('CALL InitShippingOrder SUCCESS!')
        resolve({
          app: app,
          res: res
        })
      }
    })
  });
}

const promiseOfQueryShippingOrders = (app, customerId, includeDelivered, status, limit) => {
  console.log('CALL queryShippingOrders!')
  var url = SERVER + '/api/shippingOrders/query?limit=' + (!!limit ? limit : 0);
  if (!!customerId) {
    url += '&customerId=' + customerId
  }
  if (!!includeDelivered) {
    url += '&includeDelivered=' + includeDelivered
  }
  if (!!status) {
    url += '&status=' + status
  }
  return new Promise(function (resolve, reject) {
    wx.request({
      method: 'GET',
      url: url,
      header: {
        'X-Wx-SessionTicket': app.globalData.sessionTicketId
      },
      success: res => {
        console.log('CALL queryShippingOrders SUCCESS!')
        resolve({
          app: app,
          res: res
        })
      }
    })
  })
}

module.exports = {
  promiseOfBackendLogin: promiseOfBackendLogin,
  promiseOfCreateCustomer: promiseOfCreateCustomer,
  promiseOfGetCustomerById: promiseOfGetCustomerById,
  promiseOfInitShippingOrder: promiseOfInitShippingOrder,
  promiseOfLoadAllCustomers: promiseOfLoadAllCustomers,
  promiseOfLoadProductsHints: promiseOfLoadProductsHints,
  promiseOfParseCustomer: promiseOfParseCustomer,
  promiseOfQueryShippingOrders: promiseOfQueryShippingOrders,
  promiseOfUploadMedia: promiseOfUploadMedia,
}