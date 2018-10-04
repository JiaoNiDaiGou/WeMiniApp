const utils = require('./util.js')

// const SERVER = 'https://fluid-crane-200921.appspot.com';
const SERVER = 'https://dev-dot-fluid-crane-200921.appspot.com';


// TODO:
// return
// resolve (app:app, res:res) not (res:res.data)
// handle res.statusCode != 200 case

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
    app.globalData.sessionTicketId = '98e7b596-b4e7-4467-a9cc-9edff1c78554';
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

const promiseOfDeleteShippingOrder = (app, id) => {
  console.log('CALL DeleteShippingOrder');
  return new Promise(function (resolve, reject) {
    wx.request({
      method: 'DELETE',
      url: SERVER + '/api/shippingOrders/' + id + '/delete',
      header: {
        'X-Wx-SessionTicket': app.globalData.sessionTicketId
      },
      success: res => {
        console.log('CALL DeleteShippingOrder SUCCESS!')
        resolve({
          app: app,
          res: res
        })
      }
    })
  })
}

const promiseOfExternalCreateShippingOrder = (app, id, totalWeight) => {
  console.log('CALL ExternalCreateShippingOrder')
  return new Promise(function (resolve, reject) {
    wx.request({
      method: 'POST',
      url: SERVER + '/api/shippingOrders/' + id + '/externalCreate',
      header: {
        'X-Wx-SessionTicket': app.globalData.sessionTicketId
      },
      data: {
        totalWeightLb: totalWeight
      },
      success: res => {
        console.log('CALL ExternalCreateShippingOrder SUCCESS!')
        resolve({
          app: app,
          res: res
        })
      }
    })
  })
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
        total_weight_lb: !!totalWeight ? totalWeight : 0
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

const promiseOfQueryShoppingList = (app, status, onlyActive) => {
  console.log('CALL queryShoppingList!')
  var url = SERVER + '/api/shoppingLists/query?onlyActive=' + onlyActive;
  if (!!status) {
    url += 'status=' + status
  }
  return new Promise(function (resolve, reject) {
    wx.request({
      method: 'GET',
      url: url,
      header: {
        'X-Wx-SessionTicket': app.globalData.sessionTicketId
      },
      success: res => {
        console.log('CALL QueryShoppingList SUCCESS!')
        resolve({
          app: app,
          res: res
        })
      }
    })
  })
}

const promiseOfExpireShoppingList = (app, id) => {
  console.log('CALL expireShoppingList')
  return new Promise(function (resolve, reject) {
    wx.request({
      method: 'POST',
      url: SERVER + '/api/shoppingLists/' + id + '/expire',
      data: {
        expireName: app.globalData.userInfo.nickName
      },
      header: {
        'X-Wx-SessionTicket': app.globalData.sessionTicketId
      },
      success: res => {
        console.log('CALL expireShoppingList SUCCESS')
        resolve({
          app: app,
          res: res
        })
      }
    })
  })
}

const promiseOfInitShoppingList = (app, productEntries) => {
  console.log('CALL initShoppingList')
  return new Promise(function (resolve, reject) {
    wx.request({
      method: 'POST',
      url: SERVER + '/api/shoppingLists/init',
      data: {
        creatorName: app.globalData.userInfo.nickName,
        productEntries: productEntries,
        mediaIds: mediaIds
      },
      header: {
        'X-Wx-SessionTicket': app.globalData.sessionTicketId
      },
      success: res => {
        console.log('CALL initShoppingList SUCCESS')
        resolve({
          app: app,
          res: res
        })
      }
    })
  })
}

const promiseOfPurchaseShoppingList = (app, id, totalPrice, source, mediaIds) => {
  console.log('CALL purchaseShoppingList')
  return new Promise(function (resolve, reject) {
    wx.request({
      method: 'POST',
      url: SERVER + '/api/shoppingLists/' + id + '/purchase',
      data: {
        purchaserName: app.globalData.userInfo.nickName,
        totalPurchasePrice: {
          unit: 'USD',
          value: totalPrice
        },
        purchasingSource: source,
        mediaIds: mediaIds
      },
      header: {
        'X-Wx-SessionTicket': app.globalData.sessionTicketId
      },
      success: res => {
        console.log('CALL purchaseShoppingList SUCCESS')
        resolve({
          app: app,
          res: res
        })
      }
    })
  })
}

const promiseOfAssignShoppingList = (app, id) => {
  console.log('CALL assignShoppingList')
  return new Promise(function (resolve, reject) {
    wx.request({
      method: 'POST',
      url: SERVER + '/api/shoppingLists/' + id + '/assign',
      data: {
        ownerName: app.globalData.userInfo.nickName
      },
      header: {
        'X-Wx-SessionTicket': app.globalData.sessionTicketId
      },
      success: res => {
        console.log('CALL assignShoppingList SUCCESS')
        console.log(res)
        resolve({
          app: app,
          res: res
        })
      }
    })
  })
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
      success: res => successResolve('queryShippingOrders', resolve, app, res)
    })
  })
}

const promiseOfPostFeedback = (app, content, mediaIds) => {
  console.log('CALL postFeedback')
  return new Promise((resolve, reject) => {
    wx.request({
      method: 'POST',
      url: SERVER + '/api/sys/feedback/post',
      header: {
        'X-Wx-SessionTicket': app.globalData.sessionTicketId
      },
      data: {
        requesterName: !!app.globalData.userInfo ? app.globalData.userInfo.nickName : '',
        content: content,
        mediaIds: !!mediaIds ? mediaIds : [] 
      },
      success: res => successResolve('postFeedback', resolve, app, res)
    })
  })
}

const successResolve = (apiName, resolve, app, res) => {
  console.log('CALL ' + apiName + ' SUCCESS! response.statusCode=' + res.statusCode)
  // TODO:
  // Let's treat all things as success, we should check 2xx3xx/4xx/5xx
  resolve({
    app: app,
    res: res
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
  promiseOfPostFeedback: promiseOfPostFeedback
}