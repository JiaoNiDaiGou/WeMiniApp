/**
 * A list component.
 * It is intend to display a list of object.
 * 
 * properties:
 *  items: A list of items. An item must have an id.
 */
Component({
  options: {
    multipleSlots: true,
  },
  properties: {
    items: {
      type: Array,
      value: []
    }
  },
  data: {
    curActionItem: null,

    actionModalShow: false,
  },
  methods: {
    onActionItemLongPress: e => {
      var itemid = e.detail.value
      var actionItem = items.find(t => t.id == itemid)
      this.setData({
        curActionItem: actionItem,
        actionModalShow: true,
      })
      this.triggerEvent('itemAction', { value: curActionItem })
    },

    onActionModalCancel: e => {
      this.setData({
        actionModalShow: false,
      })
    },

    onActionModalConfirm: e => {
      this.setData({
        actionModalShow: false,
      })
    }
  }
})