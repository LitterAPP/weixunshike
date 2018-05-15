// comp/formbutton/fbutton.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

      formType:{
        type:String,
        value:'submit'
      },
      openType:{
        type:String,
        value:''
      },
      buttonText:{
        type:String,
        value:'确定'
      },
      textStyle:{
        type: String,
        value: '  font-size: 12px;color: #40d37a; text-align: left;'
      },
      extImgStyle:{
        type: String,
        value: 'height:30px;width:30px;'
      },
      extStyle:{
        type:String,
        value:'color:#fff'
      },
      buttonImage:{
        type:String
      },
      adv:Boolean
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    submit:function(e){     
      //wx.vibrateShort()
      var that = this
      var myEventDetail = { formId: e.detail.formId}
      var myEventOption = {} // 触发事件的选项 
      that.triggerEvent('fbutton-tap', myEventDetail, myEventOption)
    }
  }
})
