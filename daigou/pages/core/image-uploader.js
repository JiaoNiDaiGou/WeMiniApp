const backend = require('../../utils/backend.js');
const utils = require('../../utils/util.js');
const app = getApp();

const LAST_KEY = '@last';

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
    }
  },
  data: {
    // imageKeys are an array of image keys, which has order.
    // images is a map[imageKey, image object]
    // A image object contains: 
    // {
    //   path: local path
    //   mediaId: cloud mediaId
    //   uploading: boolean
    //   uploadingProgress
    // }
    imageKeys: [LAST_KEY],
    images: {
      LAST_KEY: {
        path: '',
        mediaId: null,
        uploading: false,
        uplodingProgress: 0
      },
      lastImgActive: false
    },

    modalHidden: true,

    curActionImageIdx: -1
  },
  methods: {
    onCurImageDelete: function (e) {
      var curActionImageIdx = this.data.curActionImageIdx
      var imageKeys = this.data.imageKeys
      var images = this.data.images
      if (curActionImageIdx < 0 || curActionImageIdx >= imageKeys.length - 1) {
        return
      }
      var imageKey = imageKeys[curActionImageIdx]
      imageKeys.splice(curActionImageIdx, 1)
      delete images[imageKey]
      this.setData({
        modalHidden: true,
        imageKeys: imageKeys,
        images: images
      })
    },

    onModalDone: function (e) {
      this.setData({
        modalHidden: true
      })
    },

    onImageLongPress: function (e) {
      var idx = e.currentTarget.dataset.imageidx
      var imageKeys = this.data.imageKeys
      var isLastImage = idx == imageKeys.length - 1
      if (isLastImage) {
        return
      }
      this.setData({
        curActionImageIdx: idx,
        modalHidden: false
      })
    },

    onLastImgTouchStart: function (e) {
      this.setData({
        lastImgActive: true
      })
    },

    onLastImgTouchEnd: function (e) {
      this.setData({
        lastImgActive: false
      })
    },

    onImageTap: function (e) {
      this.refreshAllUploadingProgress()

      var idx = e.currentTarget.dataset.imageidx
      if (idx >= this.data.imageKeys.length) {
        return
      }

      var imageKeys = this.data.imageKeys
      var isLastImage = idx == imageKeys.length - 1

      // Tap non-last image
      if (!isLastImage) {
        var images = this.data.images
        var image = images[imageKeys[idx]]
        var path = image.path
        var urls = []
        for (var i = 0; i < imageKeys.length - 1; i++) {
          var image = images[imageKeys[i]]
          urls.push(image.path)
        }
        wx.previewImage({
          current: path,
          urls: urls,
        })
        return
      }

      // Tap last image
      var that = this;
      wx.chooseImage({
        count: 9,
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: res => {
          if (res.tempFilePaths && res.tempFilePaths.length > 0) {

            var imageKeys = that.data.imageKeys
            var newUploadStartIdx = imageKeys.length - 1
            imageKeys = imageKeys.slice(0, imageKeys.length - 1)

            var selectedImageKeys = []
            var thatImages = that.data.images
            res.tempFilePaths.forEach(t => {
              var key = utils.uuid()
              var imageObj = {
                path: t,
                mediaId: null,
                uploading: false,
                uploadingProgress: 0
              }
              thatImages[key] = imageObj
              imageKeys.push(key)
            })

            var newUploadEndIdx = imageKeys.length - 1
            imageKeys.push(LAST_KEY)

            that.setData({
              imageKeys: imageKeys,
              images: thatImages
            });

            if (!that.data.lazy) {
              for (var idx = newUploadStartIdx; idx <= newUploadEndIdx; idx++) {
                that.uploadImage(idx)
              }
            }

            that.triggerImagesChangedEvent()
          }
        }
      })
    },

    uploadImage: function (idx) {
      var that = this;
      var imageKeys = this.data.imageKeys
      var images = this.data.images
      var imageKey = imageKeys[idx]
      var image = images[imageKey]

      if (!!image.mediaId || image.uploading) {
        return
      }

      image.uploding = true
      image.uploadingProgress = 0;
      images[imageKey] = image
      this.setData({
        images: images
      })

      var progressHandle = (res) => {
        var thatImages = that.data.images
        thatImages[imageKey].uploadingProgress = res.progress
        that.setData({
          images: thatImages
        })
      }

      backend.promiseOfUploadMedia(app, image.path, progressHandle)
        .then(r => {
          var mediaId = r.res.data.id;
          var thatImages = that.data.images
          var thatImageKeys = that.data.imageKeys
          thatImages[imageKey].mediaId = mediaId

          // Sync all images
          that.data.imageKeys.map(x => thatImages[x]).forEach(x => {
            if (!!x && !!x.mediaId) {
              x.uploading = false
              x.uploadingProgress = 100
            }
          })
          that.setData({
            images: thatImages
          })

          that.triggerImagesChangedEvent()
        })
    },

    refreshAllUploadingProgress: function () {
      var changed = false;
      var images = this.data.images
      this.data.imageKeys.forEach(key => {
        var image = images[key]
        if (!!image && !!image.mediaId) {
          if (image.uploading == true || image.uploadingProgress != 100) {
            changed = true
            image.uploading = false
            image.uploadingProgress = 100
            images[key] = image
          }
        }
      })
      if (changed) {
        this.setData({
          images: images
        })
      }
    },

    triggerImagesChangedEvent: function () {
      var imageKeys = this.data.imageKeys
      if (imageKeys.length <= 1) {
        return
      }

      var images = this.data.images
      var event = imageKeys.slice(0, imageKeys.length - 1).map(key => {
        var image = images[key]
        return {
          path: image.path,
          mediaId: image.mediaId
        }
      })
      this.triggerEvent('imagesChange', {
        value: event
      })
    }
  },
})
