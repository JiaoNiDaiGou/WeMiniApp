Component({
    externalClasses: ['i-class'],

    properties: {
        type: {
            type: String,
            value: ''
        },
        custom: {
            type: String,
            value: ''
        },
        size: {
            type: Number,
            value: 14
        },
        color: {
            type: String,
            value: ''
        }
    },
    data: {
        isFuiIcon: false,
    },
    attached: function () {
        this.setData({
            isFuiIcon: this.data.type.startsWith('fui-')
        })
    }
});
