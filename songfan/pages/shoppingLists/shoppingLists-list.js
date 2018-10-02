// pages/shoppingLists/shoppingLists-list.js
const backend = require('../../utils/backend.js')
const utils = require('../../utils/util.js')
const app = getApp()

Page({

  /**
   * Page initial data
   */
  data: {
    pageNames: ["待采购", "已入库", "已撤销"],

    statusBadgeColor: {
      INIT: 'red',
      OWNERSHIP_ASSIGNED: 'blue',
      PURCHASED: 'green',
      IN_HOUSE: 'green',
      EXPIRED: 'red',
      UNKONWN: 'grey'
    },

    curPageIndex: 0,
    curSearchText: '',

    shoppingList: {},
    displayedShoppingList: [],

    modalHidden: true,

    curAcitonItem: null,
  },

  /**
   * Lifecycle function--Called when page load
   * pageIndex:
   * 0: active: init, ownerAssigned, purcahsed
   * 1: in house
   * 2: expired
   */
  onLoad: function (options) {
    var pageIndex = options.pageIndex;
    if (!pageIndex) {
      pageIndex = 0;
    }
    wx.showLoading({
      title: '加载购物单',
    })
    this.loadShoppingList(pageIndex, () => wx.hideLoading())
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {

  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading('加载购物单')
    this.loadShoppingList(this.data.curPageIndex, () => {
      wx.hideNavigationBarLoading()
    })
  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  },

  loadShoppingList: function (pageIndex, callback) {
    var that = this;

    var status = null;
    var onlyActive = false;
    if (pageIndex == 0) {
      onlyActive = true;
    } else if (pageIndex = 1) {
      status = 'IN_HOUSE'
    } else {
      status = 'EXPIRED'
    }

    console.log('load shoppingList by onlyActive ' + onlyActive + ', staus=' + status)

    backend.promiseOfQueryShoppingList(app, status, onlyActive)
      .then(r => {
        var shoppingList = r.res.data;
        that.refreshShoppingList(pageIndex, shoppingList)
        if (!!callback) {
          callback()
        }
      })
  },

  filterShoppingList: function (e) {
    var searchText = e.detail.value;
    var status = this.data.statusValues[this.data.curStatusIndex];
    var shoppingList = this.data.shoppingList[status];
    var displayedShoppingList = this.buildDisplayedShoppingList(searchText, shoppingList);
    this.setData({
      curSearchText: searchText,
      displayedShoppingList: displayedShoppingList
    })
  },

  buildDisplayedShoppingList: function (searchText, shoppingList) {
    if (!!searchText) {
      return shoppingList;
    }

    return shoppingList
      .filter(shoppingListItem => {
        return shoppingListItem.productEntries.some(productEntry => {
          var product = productEntry.product;
          return (!!product.name && product.name.includes(searchText))
            || (!!product.brand && product.brand.includes(searchText))
        });
      })
  },

  onPageIndexChange: function (e) {
    var pageIndex = e.detail.value;
    wx.showLoading({
      title: '加载购物单',
    })
    this.loadShoppingList(pageIndex, () => wx.hideLoading())
  },

  actionShoppingList: function (e) {
    var shoppingListItemId = e.currentTarget.dataset.shoppinglistitemid;
    var curAcitonItem = this.data.displayedShoppingList.find(t => t.id == shoppingListItemId);
    console.log('select cur action item id:' + shoppingListItemId)
    var canAction = curAcitonItem.canAssign || curActionItem.canPurchase || curActionItem.canInHouse || curActionItem.canExpire
    this.setData({
      curAcitonItem: curAcitonItem,
      modalHidden: !canAction
    })
  },

  onModalConfirm: function (e) {
    this.setData({
      modalHidden: true
    })
  },

  onModalCancel: function (e) {
    this.setData({
      modalHidden: true
    })
  },

  curActionItemAssign: function (e) {
    var that = this;
    var id = this.data.curAcitonItem.id;
    backend.promiseOfAssignShoppingList(app, id)
      .then(r => {
        var item = r.res.data;
        that.refreshShoppingList(that.data.curPageIndex, [item])
        this.setData({
          modalHidden: true
        })
        wx.showToast({
          title: '负责人: ' + item.ownerName,
          duration: 800
        })
        wx.pageScrollTo({
          scrollTop: 0
        })
      })
  },

  curActionItemPurchase: function (e) {
    console.log('purcahse');
    this.setData({
      modalHidden: true
    })
    wx.pageScrollTo({
      scrollTop: 0
    })
  },

  curActionItemInHouse: function (e) {
    var that = this;
    var id = this.data.curAcitonItem.id;
    backend.promiseOfAssignShoppingList(app, id)
      .then(r => {
        var item = r.res.data;
        that.refreshShoppingList(that.data.curPageIndex, [item])
        this.setData({
          modalHidden: true
        })
        wx.showToast({
          title: '已入库',
          duration: 800
        })
        wx.pageScrollTo({
          scrollTop: 0
        })
      })
  },

  curActionItemExpire: function (e) {
    var that = this;
    var id = this.data.curAcitonItem.id;
    backend.promiseOfExpireShoppingList(app, id)
      .then(r => {
        var item = r.res.data;
        that.refreshShoppingList(that.data.curPageIndex, null, [id])
        this.setData({
          modalHidden: true
        })
        wx.showToast({
          title: '已撤销',
          duration: 800
        })
        wx.pageScrollTo({
          scrollTop: 0
        })
      })
  },

  refreshShoppingList: function (pageIndex, toRefresh, toDeleteIds) {
    var that = this;
    var allShoppingList = that.data.shoppingList;
    var mergedShoppingList = allShoppingList[pageIndex];

    if (!!toRefresh) {
      var shoppingList = toRefresh
        .map(t => {
          // enhance
          if (!t.status) {
            t.status = 'UNKONWN'
          }
          t.canAssign = t.status == 'INIT' || t.status == 'OWNERSHIP_ASSIGNED'
          t.canPurchase = t.status == 'INIT' || t.status == 'OWNERSHIP_ASSIGNED'
          t.canInHouse = t.status == 'PURCHASED'
          t.canExpire = t.status == 'INIT' || t.status == 'OWNERSHIP_ASSIGNED'
          t.isCreatorYou = !!app.globalData.userInfo && app.globalData.userInfo.nickName == t.creatorName
          t.isOwnerYou = !!app.globalData.userInfo && app.globalData.userInfo.nickName == t.ownerName
          t.isPurchaserYour = !!app.globalData.userInfo && app.globalData.userInfo.nickName == t.purchaserName
          t.statusName = utils.shoppingListItemStatus.find(s => s.value == t.status).name
          t.renderableCreationTime = utils.formatTimestamp(parseFloat(t.creationTime))
          if (!!t.purchasingTime) {
            t.renderablePurchasingTime = utils.formatTimestamp(parseFloat(t.purchasingTime))
          }
          if (!!t.inHouseTime) {
            t.renderableInHouseTime = utils.formatTimestamp(parseFloat(t.inHouseTime))
          }
          t.renderableProducts = (!!t.productEntries && t.productEntries.length > 0) ? utils.convertToRenderableProducts(t.productEntries) : []
          return t;
        });
      mergedShoppingList = utils.mergeItemsByIdOverride(mergedShoppingList, shoppingList, t => t.id)
        .sort((a, b) => b.lastUpdateTime - a.lastUpdateTime);
    }

    if (!!toDeleteIds) {
      mergedShoppingList = utils.removeItemsById(mergedShoppingList, toDeleteIds, t => t.id)
    }

    allShoppingList[pageIndex] = mergedShoppingList;
    var displayedShoppingList = that.buildDisplayedShoppingList(that.data.curSearchText, mergedShoppingList)

    console.log('refresh displayedShoppingList');
    console.log(displayedShoppingList);

    this.setData({
      shoppingList: allShoppingList,
      displayedShoppingList: displayedShoppingList
    });
  }
})