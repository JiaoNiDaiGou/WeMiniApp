const utils = require('./util.js')

// const SERVER = 'https://fluid-crane-200921.appspot.com';
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
    if (!app.globalData.userInfo) {
      console.log('fetch userinfo')
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
        }
      })
    }

    console.log('CALL wxLogin!');
    app.globalData.sessionTicketId = 'e0816abe-275b-4aed-96e3-202b4b8af6b6';
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


const callGet = (apiName, app, api) => callBackend(apiName, app, 'GET', api)
const callPost = (apiName, app, api) => callBackend(apiName, app, 'POST', api)
const callPut = (apiName, app, api) => callBackend(apiName, app, 'PUT', api)
const callDelete = (apiName, app, api) => callBackend(apiName, app, 'DELETE', api)

const callBackend = (apiName, app, verb, api) => {
  console.log('CALL ' + apiName)
  return new Promise((resolve, reject) => {
    wx.request({
      method: verb,
      url: SERVER + api.path,
      header: {
        'X-Wx-SessionTicket': app.globalData.sessionTicketId
      },
      data: api.data,
      success: res => {
        console.log('CALL ' + apiName + ' SUCCESS! response.statusCode=' + res.statusCode)

        // TODO:
        // Let's treat all things as success, we should check 2xx3xx/4xx/5xx

        if (!!api.onSuccess) {
          api.onSuccess(res)
        }

        resolve({
          app: app,
          res: res
        })
      }
    })
  })
}

const promiseOfLoadAllCustomers = (app) => {
  return callGet('loadAllCustomers', app, {
    path: '/api/JiaoNiDaiGou/customers/all?limit=1000'
  })
}

const promiseOfGetCustomerById = (app, customerId) => {
  return callGet('getCustomerById', app, {
    path: '/api/JiaoNiDaiGou/customers/' + customerId
  })
}

const promiseOfParseCustomer = (app, texts, mediaIds) => {
  return callPost('parseCustomer', app, {
    path: '/api/parse',
    data: {
      domain: 'CUSTOMER',
      texts: texts,
      mediaIds: mediaIds,
      limit: 5
    }
  })
}

const promiseOfCreateCustomer = (app, id, name, phone, address) => {
  return callPut('createCustomer', app, {
    path: '/api/JiaoNiDaiGou/customers/create',
    data: {
      id: id,
      name: name,
      phone: {
        countryCode: '86',
        phone: phone
      },
      addresses: [address]
    }
  })
}

const promiseOfUpdateCustomer = (app, customer) => {
  return callPut('updateCustomer', app, {
    path: '/api/JiaoNiDaiGou/customers/update',
    data: customer
  })
}

const promiseOfLoadProductsHints = (app) => {
  return callGet('loadProductHints', app, {
    path: '/api/JiaoNiDaiGou/products/hints'
  })
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
          res: {
            data: JSON.parse(res.data)
          }
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

const promiseOfDeleteShippingOrder = (app, id) => {
  return callDelete('deleteShippingOrder', app, {
    path: '/api/shippingOrders/' + id + '/delete'
  })
}

const promiseOfExternalCreateShippingOrder = (app, id, totalWeight) => {
  return callPost('externalCreateShippingOrder', app, {
    path: '/api/shippingOrders/' + id + '/externalCreate',
    data: {
      totalWeightLb: totalWeight
    }
  })
}

const promiseOfInitShippingOrder = (app, receiverCustomerId, address, products, totalWeight) => {
  return callPost('initShippingOrder', app, {
    path: '/api/shippingOrders/init',
    data: {
      receiverCustomerId: receiverCustomerId,
      address: address,
      productEntries: products,
      total_weight_lb: !!totalWeight ? totalWeight : 0
    }
  })
}

const promiseOfQueryShoppingList = (app, status, onlyActive) => {
  var path = '/api/shoppingLists/query?onlyActive=' + onlyActive;
  if (!!status) {
    path += 'status=' + status
  }
  return callGet('queryShoppingList', app, {
    path: path
  })
}

const promiseOfExpireShoppingList = (app, id) => {
  return callPost('expireShoppingList', app, {
    path: '/api/shoppingLists/' + id + '/expire',
    data: {
      expireName: app.globalData.userInfo.nickName
    }
  })
}

const promiseOfInitShoppingList = (app, productEntries) => {
  return callPost('initShoppingList', app, {
    path: '/api/shoppingLists/init',
    data: {
      creatorName: app.globalData.userInfo.nickName,
      productEntries: productEntries,
      mediaIds: mediaIds
    }
  })
}

const promiseOfPurchaseShoppingList = (app, id, totalPrice, source, mediaIds) => {
  return callPost('purchaseShoppingList', app, {
    path: '/api/shoppingLists/' + id + '/purchase',
    data: {
      purchaserName: app.globalData.userInfo.nickName,
      totalPurchasePrice: {
        unit: 'USD',
        value: totalPrice
      },
      purchasingSource: source,
      mediaIds: mediaIds
    }
  })
}

const promiseOfAssignShoppingList = (app, id) => {
  return callPost('assignShoppingList', {
    path: '/api/shoppingLists/' + id + '/assign',
    data: {
      ownerName: app.globalData.userInfo.nickName
    }
  })
}

const promiseOfQueryShippingOrders = (app, customerId, includeDelivered, status, limit) => {
  var path = '/api/shippingOrders/query?limit=' + (!!limit ? limit : 0);
  if (!!customerId) {
    path += '&customerId=' + customerId
  }
  if (!!includeDelivered) {
    path += '&includeDelivered=' + includeDelivered
  }
  if (!!status) {
    path += '&status=' + status
  }
  return callGet('queryShippingOrders', app, {
    path: path
  })
}

const promiseOfPostFeedback = (app, content, mediaIds) => {
  return callPost('postFeedback', app, {
    path: '/api/sys/feedback/post',
    data: {
      requesterName: !!app.globalData.userInfo ? app.globalData.userInfo.nickName : '',
      content: content,
      mediaIds: !!mediaIds ? mediaIds : []
    }
  })
}

module.exports = {
  promiseOfAssignShoppingList: promiseOfAssignShoppingList,
  promiseOfBackendLogin: promiseOfBackendLogin,
  promiseOfCreateCustomer: promiseOfCreateCustomer,
  promiseOfDeleteShippingOrder: promiseOfDeleteShippingOrder,
  promiseOfExternalCreateShippingOrder: promiseOfExternalCreateShippingOrder,
  promiseOfExpireShoppingList: promiseOfExpireShoppingList,
  promiseOfGetCustomerById: promiseOfGetCustomerById,
  promiseOfInitShippingOrder: promiseOfInitShippingOrder,
  promiseOfInitShoppingList: promiseOfInitShoppingList,
  promiseOfLoadAllCustomers: promiseOfLoadAllCustomers,
  promiseOfLoadProductsHints: promiseOfLoadProductsHints,
  promiseOfParseCustomer: promiseOfParseCustomer,
  promiseOfPurchaseShoppingList: promiseOfPurchaseShoppingList,
  promiseOfQueryShippingOrders: promiseOfQueryShippingOrders,
  promiseOfQueryShoppingList: promiseOfQueryShoppingList,
  promiseOfUploadMedia: promiseOfUploadMedia,
  promiseOfPostFeedback: promiseOfPostFeedback,
  promiseOfUpdateCustomer: promiseOfUpdateCustomer
}