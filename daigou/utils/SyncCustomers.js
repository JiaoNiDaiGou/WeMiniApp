const utils = require('./Utils.js')
const backend = require('/Backend.js')

const sync = (app) => {
  return backend.loadAllCustomers(app)
    .then(r => {
      var customers = r.res.data
      console.log('load ' + customers.length + ' customers')
      app.globalData.customers = customers
    })
}

module.exports = {
  sync: sync
}