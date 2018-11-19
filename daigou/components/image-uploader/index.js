const backend = require('../../utils/Backend.js');
const utils = require('../../utils/Utils.js');
const app = getApp();

/**
 * properties:
 * - lazy: boolean: If upload image lazy. Default to false. 
 * Otherwise, will upload image immediately once image selected.
 * 
 * events:
 * - imagesChange: imageChange.
 */
Component({
  properties: {
    lazy: {
      type: Boolean,
      value: false
    },

    // single image contains
    // - key: uuid (external don't care)
    // - path: local path
    // - mediaId: cloud mediaId
    // - uploading: boolean
    // - uploadingProgress
    images: {
      type: Array,
      value: []
    },
    col: {
      type: Number,
      value: 3
    }
  },
  data: {
    // const
    IMAGE_ACTIONS: [
      {
        name: '删除',
        color: 'red'
      }
    ],
    imgActionSheetVisible: false,
    actionImgIndex: -1
  },
  methods: {
    onImgActionClick: function (e) {
      switch (e.detail.index) {
        case 0: {
          this.onImgDelete()
          break
        }
        default: {
          this.setData({
            imgActionSheetVisible: false
          })
          break
        }
      }
    },

    onImgActionCancel: function (e) {
      this.setData({
        imgActionSheetVisible: false
      })
    },

    deleteImg: function (imgKey) {
      var { images } = this.data
      var idx = images.findIndex(t => t.key === imgKey)
      images.splice(idx, 1)
      this.setData({
        actionImgIndex: -1,
        imgActionSheetVisible: false,
        images: images
      })
    },

    onImageLongPress: function (e) {
      var idx = e.currentTarget.dataset.imageidx
      this.setData({
        actionImgIndex: idx,
        imgActionSheetVisible: true
      })
    },

    onImageTap: function (e) {
      this.refreshAllUploadingProgress()
      var {
        images,
      } = this.data
      var imgkey = e.currentTarget.dataset.imgkey
      var image = images.find(t => t.key === imgkey)
      wx.previewImage({
        current: image.path,
        urls: images.map(t => t.path)
      })
    },

    onLastImageTap: function (e) {
      this.refreshAllUploadingProgress()
      var that = this;
      wx.chooseImage({
        count: 9,
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: res => {
          if (res.tempFilePaths && res.tempFilePaths.length > 0) {
            var { images, lazy } = that.data
            var newUploadStartIdx = images.length
            res.tempFilePaths.forEach(t => {
              var key = utils.uuid()
              var imageObj = {
                key: key,
                path: t,
                mediaId: null,
                uploading: false,
                uploadingProgress: 0
              }
              images.push(imageObj)
            })
            var newUploadEndIdx = images.length - 1
            that.setData({
              images
            });
            if (!that.data.lazy) {
              for (var idx = newUploadStartIdx; idx <= newUploadEndIdx; idx++) {
                that.uploadImage(images[idx].key)
              }
            }
            that.triggerImagesChangedEvent()
          }
        }
      })
    },

    uploadImage: function (key) {
      var { images } = this.data
      var image = images.find(t => t.key === key)
      if (!image || image.mediaId || image.uploading) {
        return
      }
      image.uploding = true
      image.uploadingProgress = 0;
      this.setData({
        images
      })

      var that = this
      var progressHandle = (res) => {
        var thatImages = that.data.images
        var thatImage = thatImages.find(t => t.key === key)
        if (thatImage) {
          thatImage.uploadingProgress = res.progress
          that.setData({
            images: thatImages
          })
        }
      }

      backend.uploadMedia(app, image.path, progressHandle)
        .then(r => {
          var mediaId = r.res.data.id
          var thatImages = that.data.images
          var thatImage = thatImages.find(t => t.key === key)
          if (thatImage) {
            thatImage.mediaId = mediaId
            that.setData({
              images: thatImages
            })
          }

          that.refreshAllUploadingProgress()
          that.triggerImagesChangedEvent()
        })
    },

    refreshAllUploadingProgress: function () {
      var { images } = this.data
      images.forEach(image => {
        if (image.mediaId) {
          image.uploading = true
          image.uploadingProgress = 100
        }
      })
      this.setData({
        images
      })
    },

    triggerImagesChangedEvent: function () {
      var { images } = this.data
      this.triggerEvent('imagesChange', { value: images })
    }
  },
})
