// components/address-box/index.js

/**
 * Properties:
 * - region: String,
 * - city: String,
 * - zone: String,
 * - postalCode: string,
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
    postalCode: {
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
        region: e.detail.detail.value
      });
      this.triggerEvent('input', {
        value: this.buildThisAddress()
      });
    },
    onCityInput: function (e) {
      this.setData({
        city: e.detail.detail.value
      });
      this.triggerEvent('input', {
        value: this.buildThisAddress()
      });
    },
    onZoneInput: function (e) {
      this.setData({
        zone: e.detail.detail.value
      });
      this.triggerEvent('input', {
        value: this.buildThisAddress()
      });
    },
    onPostalCodeInput: function (e) {
      this.setData({
        postalCode: e.detail.detail.value
      });
      this.triggerEvent('input', {
        value: this.buildThisAddress()
      });
    },
    onAddressInput: function (e) {
      this.setData({
        address: e.detail.detail.value
      });
      this.triggerEvent('input', {
        value: this.buildThisAddress()
      });
    },

    buildThisAddress: function () {
      var {
        region,
        city,
        zone,
        postalCode,
        address
      } = this.data
      return {
        region,
        city,
        zone,
        postalCode,
        address
      }
    },
  }
})
