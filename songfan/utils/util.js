const BE_SERVER = 'https://dev-dot-fluid-crane-200921.appspot.com';

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatTimestamp = timestamp => {
  return formatTime(new Date(timestamp))
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const formatCustomerContactToString = (name, phone, address) => {
  var n = '';
  if (!!name) {
    n += '(姓名)' + name + '  ';
  }
  if (!!phone) {
    n += '(电话)' + phone + '  ';
  }
  if (!!address) {
    if (!!address.region) {
      n += '(省)' + address.region + '  ';
    }
    if (!!address.city) {
      n += '(市)' + address.city + '  ';
    }
    if (!!address.zone) {
      n += '(区)' + address.zone + '  ';
    }
    if (!!address.address) {
      n += '(地址)' + address.address
    }
  }
  return n.trim();
}

const shoppingListItemStatus = [
  { name: '新建', value: 'INIT' },
  { name: '待采购', value: 'OWNERSHIP_ASSIGNED' },
  { name: '已采购', value: 'PURCHASED' },
  { name: '已入库', value: 'IN_HOUSE' },
  { name: '过期废弃', value: 'EXPIRED' },
  { name: '未知', value: 'UNKONWN' }
]

const shippingOrderStatus = [
  { name: '新建', value: 'INIT' },
  { name: '装箱', value: 'PACKED' },
  { name: '小熊发货', value: 'EXTERNAL_SHIPPING_CREATED' },
  { name: '小熊处理', value: 'EXTERNAL_SHPPING_PENDING' },
  { name: '到达国内', value: 'CN_TRACKING_NUMBER_ASSIGNED' },
  { name: '最后递送', value: 'CN_POSTMAN_ASSIGNED' },
  { name: '已送达', value: 'DELIVERED' },
  { name: '未知', value: 'UNKONWN' }
]

const productCategories = [
  { name: '饰品', value: 'ACCESSORIES' },
  { name: '母婴用品', value: 'BABY_PRODUCTS' },
  { name: '包包', value: 'BAGS' },
  { name: '衣服', value: 'CLOTHES' },
  { name: '日用品', value: 'DAILY_NECESSITIES' },
  { name: '食品', value: 'FOOD' },
  { name: '保健品', value: 'HEALTH_SUPPLEMENTS' },
  { name: '大型商货', value: 'LARGE_COMMERCIAL_GOODS' },
  { name: '大型物品', value: 'LARGE_ITEMS' },
  { name: '化妆品', value: 'MAKE_UP' },
  { name: '奶粉', value: 'MILK_POWDER' },
  { name: '鞋', value: 'SHOES' },
  { name: '小电器', value: 'SMALL_APPLIANCES' },
  { name: '玩具', value: 'TOYS' },
  { name: '手表', value: 'WATCHES' },
  { name: '未知类别', value: 'UNKONWN' }
]

const findProductCategoryIndexByValue = (val) => {
  return productCategories.findIndex(t => t.value === val);
}

const findProductCategoryIndexByName = (name) => {
  return productCategories.findIndex(t => t.name === val);
}

const incMapCount = (map, keyName, count) => {
  count = !!count ? count : 1;
  var entry = map.find(t => t.key == keyName);
  if (!entry) {
    entry = {
      key: keyName,
      val: 1
    }
    map.push(entry)
  } else {
    entry.val = entry.val + count
  }
}

const incTableCount = (table, rowName, colName, count) => {
  count = !!count ? count : 1;
  var row = table.find(t => t.key == rowName);
  if (!row) {
    row = {
      key: rowName,
      val: []
    }
    table.push(row)
  }
  var cell = row.val.find(t => t.key == colName);
  if (!cell) {
    cell = {
      key: colName,
      val: 1
    }
    row.val.push(cell)
  } else {
    cell.val = cell.val + count
  }
}

const convertToRenderableProducts = (entries) => {
  if (!entries) {
    return [];
  }
  return entries.map(entry => {
    var categoryValue = entry.product.category;
    var categoryIndex = 0;
    if (!categoryValue) {
      categoryValue = 'UNKONWN'
    } else {
      categoryIndex = findProductCategoryIndexByValue(categoryValue);
    }
    var categoryName = productCategories[categoryIndex].name;
    var brand = entry.product.brand;
    var name = entry.product.name;
    var quantity = entry.quantity;
    var price = !!entry.sellPrice ? entry.sellPrice.value : 0;
    return {
      categoryValue: categoryValue,
      categoryName: categoryName,
      categoryIndex: categoryIndex,
      brand: brand,
      name: name,
      quantity: quantity,
      price: price
    }
  })
}

const mergeItemsByIdOverride = (alist, blist, extractId) => {
  var toReturn = [];
  if (!!blist) {
    toReturn.push(...blist)
  }
  if (!!alist) {
    alist.forEach(t => {
      var tId = extractId(t)
      var exists = toReturn.some(m => extractId(m) == tId)
      if (!exists) {
        toReturn.push(t)
      }
    })
  }
  return toReturn;
}

const removeItemsById = (list, idToDelete, extractId) => {
  var toReturn = [];
  if (!list) {
    return toReturn;
  }
  list.forEach(t => {
    var tId = extractId(t)
    if (tId != idToDelete) {
      toReturn.push(t)
    }
  })
  return toReturn
}

module.exports = {
  productCategories: productCategories,
  formatTime: formatTime,
  formatTimestamp: formatTimestamp,
  incMapCount: incMapCount,
  incTableCount: incTableCount,
  formatCustomerContactToString: formatCustomerContactToString,
  findProductCategoryIndexByValue: findProductCategoryIndexByValue,
  findProductCategoryIndexByName: findProductCategoryIndexByName,
  convertToRenderableProducts: convertToRenderableProducts,
  shippingOrderStatus: shippingOrderStatus,
  shoppingListItemStatus: shoppingListItemStatus,
  mergeItemsByIdOverride: mergeItemsByIdOverride,
  removeItemsById: removeItemsById
}
