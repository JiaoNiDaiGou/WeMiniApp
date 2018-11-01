// components/address-box/index.js

/**
 * Properties:
 * - region: String,
 * - city: String,
 * - zone: String,
 * - address: String,
 * - disabled: boolean: default to false
 */
Component({
  /**
   * Component properties
   */
  properties: {
    region: {
      type: String,
      value: ''
    },
    city: {
      type: String,
      value: ''
    },
    zone: {
      type: String,
      value: ''
    },
    address: {
      type: String,
      value: ''
    },
    disabled: {
      type: Boolean,
      value: false
    }
  },

  /**
   * Component initial data
   */
  data: {

  },

  /**
   * Component methods
   */
  methods: {
    onRegionInput: function (e) {
      this.setData({
        region: e.detail.value
      });
      this.triggerEvent('regionInput', {
        value: this.buildThisAddress()
      });
    },
    onCityInput: function (e) {
      this.setData({
        city: e.detail.value
      });
      this.triggerEvent('cityInput', {
        value: this.buildThisAddress()
      });
    },
    onZoneInput: function (e) {
      this.setData({
        zone: e.detail.value
      });
      this.triggerEvent('zoneInput', {
        value: this.buildThisAddress()
      });
    },
    onAddressInput: function (e) {
      this.setData({
        address: e.detail.value
      });
      this.triggerEvent('addressInput', {
        value: this.buildThisAddress()
      });
    },

    buildThisAddress: function () {
      var {
        region,
        city,
        zone,
        address
      } = this.data
      return {
        region,
        city,
        zone,
        address
      }
    },
  }
})
