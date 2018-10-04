// pages/common/image-uploader.js
const backend = require('../../utils/backend.js');
const utils = require('../../utils/util.js');
const app = getApp();

Component({
  /**
   * Component properties
   */
  properties: {
    /**
     * If upload image immediately once image selected.
     */
    eagerUpload: {
      type: Boolean,
      value: false
    },

    columnSize: {
      type: Number,
      value: 3,
    }
  },

  /**
   * Component initial data
   */
  data: {
    // A list of image items.
    // imageItem: {
    //   path: local path
    //   mediaId: cloud mediaId
    //   uploading: boolean
    //   uploadingProgress
    // }
    images: [
      {
        path: "",
        mediaId: null,
        uploading: false,
        uploadingProgress: 0
      }
    ],
  },

  /**
   * Component methods
   */
  methods: {
    /**
     * When user press the image.
     */
    onImageTap: function (e) {
      var idx = e.currentTarget.dataset.imageidx
      var path = this.data.images[idx].path
      var urls = this.data.images.map(t => t.path)
      console.log(idx)
      wx.previewImage({
        current: path,
        urls: urls,
      })
    },

    /**
     * When user press uploadImage.
     */
    onLastImageTap: function (e) {
      console.log(this.data.eagerUpload)
      
      var that = this;
      wx.chooseImage({
        count: 9,
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: res => {
          if (res.tempFilePaths && res.tempFilePaths.length > 0) {
            var selectedImages = res.tempFilePaths.map(t => {
              return {
                path: t,
                mediaId: null,
                uploading: false,
                uploadingProgress: 0
              }
            })
            var images = that.data.images;
            var newUploadStartIdx = images.length - 1
            var last = images[images.length - 1]
            images = images.slice(0, images.length - 1)
            images.push(...selectedImages)
            var newUploadEndIdx = images.length - 1
            images.push(last)
            that.setData({
              images: images
            });

            if (!!that.data.eagerUpload) {
              for (var idx = newUploadStartIdx; idx <= newUploadEndIdx; idx++) {
                that.uploadImage(idx)
              }
            }
          }
        }
      })
    },

    uploadImage: function (idx) {
      var that = this;
      var image = this.data.images[idx]
      if (!!image.mediaId || image.uploading) {
        return
      }
      console.log(image)
      image.uploding = true
      image.uploadingProgress = 0;
      var images = this.data.images;
      images[idx] = image
      this.setData({
        images: images
      })

      var progressHandle = (res) => {
        console.log(res.progress)
        var thatImages = that.data.images
        thatImages[idx].uploadingProgress = res.progress
        that.setData({
          images: thatImages
        })
      }

      backend.promiseOfUploadMedia(app, image.path, progressHandle)
        .then(r => {
          var mediaId = r.res.data.id;
          var thatImages = that.data.images
          thatImages[idx].mediaId = mediaId
          // Sync all images
          thatImages.forEach(x => {
            if (!!x.mediaId) {
              x.uploading = false
              x.uploadingProgress = 100
            }
          })
          that.setData({
            images: thatImages
          })
        })
    },
  }
})
