const utils = require('./Utils.js')
const backend = require('/Backend.js')

//
// Utils for ProductHints.
//
// ProductsHints are in format of
//
// hints: [
//   { product_category, product_brand, product_name, product_suggested_price }
// ]
//
// In local storage. we use key @PRODUCTS_HINTS to storage.
// the data structure is
// {
//   hints: hints
//   ts: timestamp when set
// }
const LOCAL_CACHE_KEY = '@PRODUCTS_HINTS'

const setProductsHints = (app, hints) => {
  var brandToCategory = []
  var nameToCategory = []
  var nameToBrand = []

  // Fulfill
  console.log('ready to set up ' + hints.hints.length + ' hints')
  hints.hints.forEach(hint => {
    var category = hint.category
    var brand = hint.brand
    var name = hint.name
    utils.incTableCount(brandToCategory, brand, category)
    utils.incTableCount(nameToCategory, name, category)
    utils.incTableCount(nameToBrand, name, brand)
  })

  // Sort
  brandToCategory.forEach(t => t.val.sort((a, b) => b.val - a.val))
  nameToCategory.forEach(t => t.val.sort((a, b) => b.val - a.val))
  nameToBrand.forEach(t => t.val.sort((a, b) => b.val - a.val))

  app.globalData.productBrandToCategoryHints = brandToCategory
  app.globalData.productNameToBrandHints = nameToBrand
  app.globalData.productNameToCategoryHints = nameToCategory

  console.log('set up hints success!')
}

const sync = (app) => {
  const nowTs = new Date().getTime()
  const expireTs = nowTs - 1 * 24 * 60 * 60 * 1000
  console.log('load products hints from local storage with key ' + LOCAL_CACHE_KEY)
  const hintsWithTsStr = wx.getStorageSync(LOCAL_CACHE_KEY)
  if (hintsWithTsStr) {
    const hintsWithTs = JSON.parse(hintsWithTsStr)
    if (hintsWithTs && hintsWithTs.ts > expireTs) {
      console.log('use products hints from local storage')
      setProductsHints(app, hintsWithTs.hints)
      return
    }
  }

  console.log('load products hints from cloud')
  backend.loadProductHints(app)
    .then(r => {
      var hints = r.res.data
      setProductsHints(app, hints)
      const hintsWithTs = {
        hints: hints,
        ts: new Date().getTime()
      }
      console.log('save products hints into local storage')
      wx.setStorage({
        key: LOCAL_CACHE_KEY,
        data: JSON.stringify(hintsWithTs)
      })
    })  
}

module.exports = {
  sync: sync
}