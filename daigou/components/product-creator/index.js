// components/products-creator/index.js

const utils = require("../../utils/util.js");
const app = getApp();

/**
 * Properties:
 * 
 * Events:
 * - productCreate: when product create.
 */

Component({
  /**
   * Component properties
   */
  properties: {},

  /**
   * Component initial data
   */
  data: {
    // consts
    CATEGORY_NAMES: utils.productCategories.map(t => t.name),

    curCategoryIndex: -1,
    curBrand: "",
    curName: "",
    curQuantity: 1,
    curPrice: "30",

    hintBrands: [],
    hintCategoryIndexes: []
  },

  /**
   * Component methods
   */
  methods: {
    getBrandHints: function (name) {
      var hints = [];
      // Get hints from product name
      if (!!name) {
        app.globalData.productNameToBrandHints.forEach(t => {
          if (t.key.toLowerCase().includes(name.toLowerCase())) {
            t.val.forEach(brandCount => {
              utils.incMapCount(hints, brandCount.key, brandCount.val);
            });
          }
        });
      }
      return hints
        .sort((a, b) => b.val - a.val)
        .slice(0, 10)
        .map(t => {
          return {
            id: t.key,
            display: t.key
          };
        });
    },

    getCategoryHints: function (name, brand) {
      var hints = [];

      // Get hints from product name
      if (!!name) {
        app.globalData.productNameToCategoryHints.forEach(t => {
          if (t.key.toLowerCase().includes(name.toLowerCase())) {
            t.val.forEach(categoryCount => {
              utils.incMapCount(hints, categoryCount.key, categoryCount.val);
            });
          }
        });
      }

      // Get hints from product brand
      if (!!brand) {
        app.globalData.productBrandToCategoryHints.forEach(t => {
          if (t.key.toLowerCase().includes(brand.toLowerCase())) {
            t.val.forEach(categoryCount => {
              utils.incMapCount(hints, categoryCount.key, categoryCount.val);
            });
          }
        });
      }

      // Sort hints
      return hints
        .sort((a, b) => b.val - a.val)
        .slice(0, 4)
        .map(t => t.key);
    },

    onCurNameInput: function (e) {
      var curName = e.detail.value;
      var {
        curBrand
      } = this.data;
      var hintCategoryIndexes = [];
      var hintBrands = [];
      if (curBrand) {
        hintCategoryIndexes = this.getCategoryHints(curName, curBrand);
      } else {
        hintCategoryIndexes = this.getCategoryHints(curName);
        hintBrands = this.getBrandHints(curName);
      }
      this.setData({
        curName,
        hintBrands,
        hintCategoryIndexes
      });
    },

    onCurBrandInput: function (e) {
      var curBrand = e.detail.value;
      var {
        curName
      } = this.data;
      var hintCategoryIndexes = this.getCategoryHints(curName, curBrand).map(
        t => t.key
      );
      this.setData({
        curBrand,
        hintCategoryIndexes
      });
    },

    onCurCategoryChange: function (e) {
      this.setData({
        curCategoryIndex: e.detail.value
      });
    },

    onHintBrandTap: function (e) {
      this.setData({
        curBrand: e.detail.value.display,
        hintBrands: []
      });
    },

    onHintCategoryTap: function (e) {
      this.setData({
        curCategoryIndex: e.detail.value,
        hintCategoryIndexes: []
      });
    },

    onCurPriceInput: function (e) {
      this.setData({
        curPrice: e.detail.value
      });
    },

    onCurQuantityChange: function (e) {
      this.setData({
        curQuantity: e.detail.value
      });
    },

    onAddClick: function (e) {
      var {
        curName,
        curBrand,
        curCategoryIndex,
        curQuantity,
        curPrice,
        CATEGORY_NAMES
      } = this.data;
      const price = parseFloat(curPrice);
      const canAdd =
        curName &&
        curBrand &&
        curCategoryIndex >= 0 &&
        curCategoryIndex < CATEGORY_NAMES.length &&
        curQuantity > 0 &&
        price > 0 &&
        price <= 1000;
      if (!canAdd) {
        wx.showToast({
          icon: 'none',
          title: '货物输入错误',
        })
        return;
      }

      const product = {
        name: curName,
        brand: curBrand,
        categoryIndex: curCategoryIndex,
        quantity: curQuantity,
        price: price
      };

      this.setData({
        curCategoryIndex: -1,
        curBrand: "",
        curName: "",
        curQuantity: 1,
        curPrice: "",
        hintBrands: [],
        hintCategoryIndexes: []
      })

      this.triggerEvent("productCreate", {
        value: product
      });
    }
  }
});
