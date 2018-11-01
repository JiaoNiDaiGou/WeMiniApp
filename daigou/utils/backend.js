const utils = require('./util.js')

// const SERVER = 'https://prod-dot-daigou-dot-fluid-crane-200921.appspot.com';
const SERVER = 'https://dev-dot-daigou-dot-fluid-crane-200921.appspot.com';

const LOCAL_SESSION_TICKET_ID_KEY = "sys.sessionTicketId";

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
          console.log('fetch user info success. nickname: ' + res.userInfo.nickName)
          app.globalData.userInfo = res.userInfo
        }
      })
    }

    // Load sessionTicketId from local
    var nowMillis = new Date().getTime()
    var expireMillis = nowMillis - 3 * 60 * 1000 // -3m
    var ticketJson = wx.getStorageSync(LOCAL_SESSION_TICKET_ID_KEY)
    if (!!ticketJson) {
      var ticket = JSON.parse(ticketJson)
      if (!!ticket && ticket.ts > expireMillis) {
        console.log('fetch session ticket ID from local cache ' + ticket.ticket)
        app.globalData.sessionTicketId = ticket.ticket;
        resolve({
          app: app
        })
        return
      }
    }

    console.log('CALL backend wxLogin')
    wx.login({
      success: res => {
        console.log('fetch client jscode ' + res.code);
        wx.request({
          method: 'POST',
          url: SERVER + '/api/wx/login',
          data: {
            code: res.code
          },
          success: res => {
            console.log('CALL wxLogin SUCCESS!');
            var sessionTicketId = res.data.ticketId;
            console.log('fetch backend server session ticket ID: ' + sessionTicketId);
            app.globalData.sessionTicketId = sessionTicketId;
            wx.setStorageSync(LOCAL_SESSION_TICKET_ID_KEY, JSON.stringify({
              ts: nowMillis,
              ticket: sessionTicketId
            }))
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
    path: '/api/customers/all?limit=1000'
  })
}

const promiseOfGetCustomerById = (app, customerId) => {
  return callGet('getCustomerById', app, {
    path: '/api/customers/' + customerId
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

const promiseOfParseProduct = (app, mediaIds) => {
  return callPost('parseProduct', app, {
    path: '/api/parse',
    data: {
      domain: 'PRODUCT',
      mediaIds: mediaIds,
      limit: 5
    }
  })
}

const promiseOfCreateCustomer = (app, id, name, phone, address) => {
  return callPost('createCustomer', app, {
    path: '/api/customers/create',
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
  return callPost('updateCustomer', app, {
    path: '/api/customers/update',
    data: customer
  })
}

const promiseOfLoadProductsHints = (app) => {
  return callGet('loadProductHints', app, {
    path: '/api/products/hints'
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
        // wx.uploadFile response is text.
        // convert it to json.
        console.log(res)
        console.log(res.data)
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

const promiseOfInitShippingOrder = (app, receiverCustomerId, address, products, totalWeight, totalSellPrice) => {
  console.log('totalSellPrice: ' + totalSellPrice)
  return callPost('initShippingOrder', app, {
    path: '/api/shippingOrders/init',
    data: {
      receiverCustomerId: receiverCustomerId,
      address: address,
      productEntries: products,
      totalWeightLb: !!totalWeight ? totalWeight : 0,
      totalSellPrice: {
        unit: 'RMB',
        value: totalSellPrice
      } 
    }
  })
}

const promiseOfQueryShoppingList = (app, status, onlyActive) => {
  var path = '/api/shoppingLists/query?onlyActive=' + onlyActive;
  if (!!status) {
    path += '&status=' + status
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

const promiseOfInitShoppingList = (app, message, mediaIds, productEntries) => {
  return callPost('initShoppingList', app, {
    path: '/api/shoppingLists/init',
    data: {
      creatorName: app.globalData.userInfo.nickName,
      productEntries: productEntries,
      mediaIds: mediaIds,
      message: message
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

const promiseOfLoadAllInventoryItems = (app) => {
  return callGet('loadAllInventoryItems', app, {
    path: '/api/inventory/all'
  })
}

const promiseOfCreateInventoryItem = (app, item) => {
  return callPost('createInventoryItem', app, {
    path: '/api/inventory/create',
    data: item
  })
}

const buildMediaDownloadUrl = (mediaId) => {
  return SERVER + '/api/media/directDownload?mediaId=' + mediaId
}

module.exports = {
  buildMediaDownloadUrl: buildMediaDownloadUrl,
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
  promiseOfUpdateCustomer: promiseOfUpdateCustomer,
  promiseOfLoadAllInventoryItems: promiseOfLoadAllInventoryItems,
  promiseOfCreateInventoryItem: promiseOfCreateInventoryItem,
  promiseOfParseProduct: promiseOfParseProduct
}
