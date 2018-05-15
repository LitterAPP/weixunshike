// components/dynamiciput/dynamiciput.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    inputs:{
      type:Array,
      value:[{value:''}]
    },
    maxLength:{
      type:Number,
      value:-1
    },  
    inputType:{
      type:String,
      value:'text'
    },
    placeHolderText:String
  },

  /**
   * 组件的初始数据
   */
  data: {

  },
  attached: function(){
    var copys = this.data.inputs
    if (!copys || copys.length==0){
        this.setData({inputs:[{value:''}]})
    }
    
  },
  /**
   * 组件的方法列表
   */
  methods: {
    deleteInput:function(e){
      var that = this
      wx.showModal({
        title: '删除确认',
        content: '请确认是否删除？',  
        success:function(rsp){
          if (rsp.confirm){
            var idx = e.currentTarget.dataset.index
            console.log('delete', e.currentTarget.dataset, idx)
            var copys = that.data.inputs
            copys.splice(idx, 1)
            that.setData({ inputs: copys })
            var myEventDetail = that.data.inputs
            var myEventOption = {}
            that.triggerEvent('item-changed', myEventDetail, myEventOption)
          }
        }
      })     
    },
    addInput:function(){
      var copys = this.data.inputs
      copys.push({value:''})
      this.setData({ inputs: copys })
      var myEventDetail = this.data.inputs
      var myEventOption = {}
      this.triggerEvent('item-changed', myEventDetail, myEventOption)
    },
    inputed: function (e) {
      var inputVal = e.detail.value
      var idx = e.currentTarget.dataset.index
      var copys = this.data.inputs 
      copys[idx].value = inputVal
      this.setData({ inputs: copys })
      var myEventDetail = this.data.inputs
      var myEventOption = {} 
      this.triggerEvent('item-changed', myEventDetail, myEventOption)
     },
    cleanInputText:function(e){
      console.log('cleanInputText')
      var idx = e.currentTarget.dataset.index
      var copys = this.data.inputs 
      copys[idx].value = ''
      this.setData({ inputs: copys })
      var myEventDetail = this.data.inputs
      var myEventOption = {}
      this.triggerEvent('item-changed', myEventDetail, myEventOption)
    }
  }
})
