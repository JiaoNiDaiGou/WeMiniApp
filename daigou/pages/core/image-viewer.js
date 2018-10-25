// pages/core/image-viewer.js
Component({
  /**
   * Component properties
   */
  properties: {
    images: {
      type: Array,
      value: []
    }
  },
  data: {
  },
  methods: {
    onImageTap: function (e) {
      var images = this.data.images
      var image = images.find(t => t.id == e.currentTarget.dataset.imageid)
      var path = image.path
      var allPaths = images.map(t => t.path)
      wx.previewImage({
        current: path,
        urls: allPaths
      })
    }
  }
})
