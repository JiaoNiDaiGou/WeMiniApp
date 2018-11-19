const consts = require('./Constants.js')
const utils = require('./Utils.js')

/**
 * Calling Backend Service.
 * We always return Object like:
 * {
 *  app: app,
 *  res: res.data
 * }
 */

/**
 * Login Wx and sync with backend.
 */
// const promiseOfBackendLogin = (app) => {
//   return new Promise(function (resolve, reject) {
//     if (!app.globalData.userInfo) {
//       console.log('fetch userinfo')
//       wx.getUserInfo({
//         success: res => {
//           console.log('fetch user info success. nickname: ' + res.userInfo.nickName)
//           app.globalData.userInfo = res.userInfo
//         }
//       })
//     }

//     // Load sessionTicketId from local
//     var nowMillis = new Date().getTime()
//     var expireMillis = nowMillis - 3 * 60 * 1000 // -3m
//     var ticketJson = wx.getStorageSync(LOCAL_SESSION_TICKET_ID_KEY)
//     if (!!ticketJson) {
//       var ticket = JSON.parse(ticketJson)
//       if (!!ticket && ticket.ts > expireMillis) {
//         console.log('fetch session ticket ID from local cache ' + ticket.ticket)
//         app.globalData.sessionTicketId = ticket.ticket;
//         resolve({
//           app: app
//         })
//         return
//       }
//     }

//     console.log('CALL backend wxLogin')
//     wx.login({
//       success: res => {
//         console.log('fetch client jscode ' + res.code);
//         wx.request({
//           method: 'POST',
//           url: SERVER + '/api/wx/login',
//           data: {
//             code: res.code
//           },
//           success: res => {
//             console.log('CALL wxLogin SUCCESS!');
//             var sessionTicketId = res.data.ticketId;
//             console.log('fetch backend server session ticket ID: ' + sessionTicketId);
//             app.globalData.sessionTicketId = sessionTicketId;
//             wx.setStorageSync(LOCAL_SESSION_TICKET_ID_KEY, JSON.stringify({
//               ts: nowMillis,
//               ticket: sessionTicketId
//             }))
//             resolve({
//               app: app
//             });
//           }
//         })
//       }
//     })
//   });
// }


const callGet = (apiName, app, api) => callBackend(apiName, app, 'GET', api)
const callPost = (apiName, app, api) => callBackend(apiName, app, 'POST', api)
const callPut = (apiName, app, api) => callBackend(apiName, app, 'PUT', api)
const callDelete = (apiName, app, api) => callBackend(apiName, app, 'DELETE', api)

const callBackend = (apiName, app, verb, api) => {
  console.log('CALL ' + apiName)
  return new Promise((resolve, reject) => {
    wx.request({
      method: verb,
      url: consts.SERVER + api.path,
      header: {
        'X-JNDG-SEC': 'xrQGzfpqvJScuXYHDS5q1w=='
      },
      data: api.data,
      success: res => {
        if (res.statusCode >= 400) { // ERROR
          console.error('CALL ' + apiName + 'ERROR. response.statusCode=' + res.statusCode)
          console.error(res)
          return
        }

        console.log('CALL ' + apiName + ' SUCCESS!')
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

//
// Customers
//

const loadAllCustomers = (app) => {
  return callGet('loadAllCustomers', app, {
    path: '/api/customers/all'
  })
}
const getCustomerById = (app, customerId) => {
  return callGet('getCustomerById', app, {
    path: '/api/customers/' + customerId
  })
}

const parseCustomer = (app, texts, mediaIds) => {
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

const createCustomer = (app, customerId, name, phone, address) => {
  return callPost('createCustomer', app, {
    path: '/api/customers/create',
    data: {
      id: customerId,
      name: name,
      phone: {
        countryCode: '86',
        phone: phone
      },
      addresses: [address]
    }
  })
}

const updateCustomer = (app, customer) => {
  return callPost('updateCustomer', app, {
    path: '/api/customers/update',
    data: customer
  })
}

//
// Products
//
const loadProductHints = (app) => {
  return callGet('loadProductHints', app, {
    path: '/api/products/hints'
  })
}

//
// Media
//
const uploadMedia = (app, path, progressHandle) => {
  var ext = path.split('.').pop();
  console.log('CALL uploadMedia!')
  return new Promise(function (resolve, reject) {
    var uploadTask = wx.uploadFile({
      url: consts.SERVER + '/api/media/formDirectUpload?ext=' + ext,
      filePath: path,
      header: {
        'X-JNDG-SEC': 'xrQGzfpqvJScuXYHDS5q1w=='
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

const buildMediaDownloadUrl = (mediaId) => {
  return consts.SERVER + '/api/media/directDownload?mediaId=' + mediaId
}

//
// Shipping Orders
//
const externalCreateShippingOrder = (app, shippingOrderId, totalWeight) => {
  return callPost('externalCreateShippingOrder', app, {
    path: '/api/shippingOrders/' + id + '/externalCreate',
    data: {
      totalWeightLb: totalWeight
    }
  })
}

const initShippingOrder = (app, receiverCustomerId, address, products, totalWeight, totalSellPrice) => {
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

const queryShippingOrders = (app, customerId, limit, pageToken) => {
  var path = '/api/shippingOrders/query?limit=' + (!!limit ? limit : 0);
  if (!!customerId) {
    path += '&customerId=' + customerId
  }
  if (pageToken) {
    path += '&pageToken=' + pageToken
  }
  return callGet('queryShippingOrders', app, {
    path: path
  })
}

//
// Feedbacks
//
const postFeedback = (app, content, mediaIds) => {
  return callPost('postFeedback', app, {
    path: '/api/sys/feedback/post',
    data: {
      requesterName: !!app.globalData.userInfo ? app.globalData.userInfo.nickName : '',
      content: content,
      mediaIds: !!mediaIds ? mediaIds : []
    }
  })
}

const getAllFeedbacks = (app) => {
  return callGet('getAllFeedbacks', app, {
    path: '/api/sys/feedback/get/allOpen'
  })
}

const closeFeedback = (app, feedbackid) => {
  return callPost('closeFeedback', app, {
    path: '/api/sys/feedback/' + feedbackid + '/close'
  })
}

module.exports = {
  loadAllCustomers,
  getCustomerById,
  parseCustomer,
  createCustomer,
  updateCustomer,

  loadProductHints,

  uploadMedia,
  buildMediaDownloadUrl,

  externalCreateShippingOrder,
  initShippingOrder,
  queryShippingOrders,

  postFeedback,
  getAllFeedbacks,
  closeFeedback
}
