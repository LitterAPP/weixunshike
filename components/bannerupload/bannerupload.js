// components/bannerupload.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {  
    urlInfo:{
      type:Object,
      value:{localUrl: '', remoteUrl: ''},
      observer:'_urlInfoChanged'
    },     
    admin:{
      type:Boolean,
      value:true,
    },
    mode:{
      type: String,
      value:'widthFix',
    },
    deleteImgSrc:{
      type:String,
      value:'',
    },
    height:{
      type: Number,
      value: 100,
    },
    width: {
      type: Number,
      value: 320,
    },
    uploadButtonText:{
      type:String,
      value:'点击上传图片',
    },
    memo:String
  }, 
  /**
   * 组件的初始数据
   */
  data: {
    
  },
  attached:function(){
      /**下载远程图片到本地*/
      var that = this     
      if (that.data.urlInfo && 
        that.data.urlInfo.remoteUrl && 
        that.data.urlInfo.remoteUrl.startsWith('http')){    
              
        wx.downloadFile({
          url: that.data.urlInfo.remoteUrl,
          complete:function(res){
              console.log('下载->', that.data.memo,that.data.urlInfo.remoteUrl, res)
              if(res && res.statusCode === 200){
                var urlInfoTmp = { localUrl: res.tempFilePath, remoteUrl: that.data.urlInfo.remoteUrl}
                that.setData({ urlInfo: urlInfoTmp}) 
              }else{
                var urlInfoTmp = { localUrl:'', remoteUrl: that.data.urlInfo.remoteUrl }
                that.setData({ urlInfo: urlInfoTmp }) 
              }
          }
        })
      }else{
        console.log('下载->', that.data.memo, that.data.urlInfo, '无法下载')
      }
  },

  /**
   * 组件的方法列表
   */
  methods: {      
    preview:function(e){     
      var that = this       
      wx.previewImage({
        urls: [that.data.urlInfo.localUrl || that.data.urlInfo.remoteUrl],
      })
    },
    deleteBanner:function(e){      
    //  var myEventDetail = {} 
    //  var myEventOption = {} // 触发事件的选项      
      this.setData({ urlInfo: null })      
     // this.triggerEvent('item-changed', myEventDetail, myEventOption)
    },
    uploadBanner:function(e){
      var that = this
      wx.chooseImage({
        count:1,        
        success: function(res) {
         // var myEventDetail =  { localUrl: res.tempFilePaths[0], remoteUrl:''} 
         // var myEventOption = {} // 触发事件的选项
          that.setData({ urlInfo: { localUrl: res.tempFilePaths[0], remoteUrl: '' } })  
         // that.triggerEvent('item-changed', myEventDetail, myEventOption)
        },
      })     
    },
    _urlInfoChanged:function(){
      var that = this
      var myEventDetail = that.data.urlInfo
      var myEventOption = {} // 触发事件的选项 
      that.triggerEvent('item-changed', myEventDetail, myEventOption)
    }
  }
})
