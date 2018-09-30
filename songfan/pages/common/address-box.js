// pages/common/address-box.js
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
    editable: {
      type: Boolean,
      value: false
    }
  },

  /**
   * Component initial data
   */
  data: {
    addressLineHeight: 0,
    inputFocus: 0,
  },

  /**
   * Component methods
   */
  methods: {
    onRegionTypingEvent: function (e) {
      this.setData({
        region: e.detail.value
      });
      var detail = {
        value: this.buildThisAddress()
      }
      this.triggerEvent('typingEvent', detail, {});
    },
    onCityTypingEvent: function (e) {
      this.setData({
        city: e.detail.value
      });
      var detail = {
        value: this.buildThisAddress()
      }
      this.triggerEvent('typingEvent', detail, {});
    },
    onZoneTypingEvent: function (e) {
      this.setData({
        zone: e.detail.value
      });
      var detail = {
        value: this.buildThisAddress()
      }
      this.triggerEvent('typingEvent', detail, {});
    },
    onAddressTypingEvent: function (e) {
      this.setData({
        address: e.detail.value
      });
      var detail = {
        value: this.buildThisAddress()
      }
      this.triggerEvent('typingEvent', detail, {});
    },

    buildThisAddress: function () {
      return {
        region: this.data.region,
        city: this.data.city,
        zone: this.data.zone,
        address: this.data.address
      }
    },

    onAddressLineChanged: function (e) {
      var height = e.detail.lineCount * e.detail.lineHeight + 0.5;
      this.setData({ addressLineHeight: height })
    },

    inputFocus1: function (e) {
      this.setData({
        inputFocus: this.data.inputFocus | 1 //0001
      });
    },

    inputBlur1: function (e) {
      this.setData({
        inputFocus: this.data.inputFocus & 14 //1110
      });
    },

    inputFocus2: function (e) {
      this.setData({
        inputFocus: this.data.inputFocus | 2 //0010
      });
    },

    inputBlur2: function (e) {
      this.setData({
        inputFocus: this.data.inputFocus & 13 //1101
      });
    },

    inputFocus3: function (e) {
      this.setData({
        inputFocus: this.data.inputFocus | 4 //0100
      });
    },

    inputBlur3: function (e) {
      this.setData({
        inputFocus: this.data.inputFocus & 11 //1011
      });
    },

    inputFocus4: function (e) {
      this.setData({
        inputFocus: this.data.inputFocus | 8 //1000
      });
    },

    inputBlur4: function (e) {
      this.setData({
        inputFocus: this.data.inputFocus & 7 //0111
      });
    }
  }
})
