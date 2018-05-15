// components/dynamiciput/dynamiciput.js
import Download from '../../util/download.js'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    groups: {
      type: Array,
      value: [{ title: '', price1: '', price2: '', logo: '', remoteUrl: '' }],/**{title:'',price1:'',price2:'',logo:'',remoteUrl:''} */
    },
    uploadButtonText:{
      type:String,
      value:'上传Logo图片（600x600）'
    },
    admin:{
      type:Boolean,
      value:true
    },
    deleteImgSrc:String,
    placeHolderTitleText: String,
    placeHolderPriceFirText: String,
    placeHolderPriceSecText: String
  },

  /**
   * 组件的初始数据
   */
  data: {

  },
  attached: function () {   
    /**下载远程图片到本地*/
    var that = this   
    if (that.data.groups && that.data.groups.length > 0) {
      var downloadUrls = []
      for (let i in that.data.groups){
        downloadUrls.push(that.data.groups[i]['remoteUrl'])
      }
      let logdown = new Download(downloadUrls, 'groups')
      logdown.download(function(locals){
        var copys = that.data.groups
        for(let j in locals){ 
          if(locals[j]){           
            copys[j]['logo'] = locals[j]                 
          }
        } 
        that.setData({groups:copys})
         
        var myEventDetail = that.data.groups
        var myEventOption = {} // 触发事件的选项 
        that.triggerEvent('item-changed', myEventDetail, myEventOption)
      })
    } 
  },
  /**
   * 组件的方法列表
   */
  methods: {
    deleteInput: function (e) {
      var that = this
      wx.showModal({
        title: '删除确认',
        content: '请确认是否删除？',
        success: function (rsp) {
          if (rsp.confirm) {
            var idx = e.currentTarget.dataset.index 
            var copys = that.data.groups
            copys.splice(idx, 1)
            that.setData({ groups: copys }) 
             
            var myEventDetail = that.data.groups
            var myEventOption = {} // 触发事件的选项 
            that.triggerEvent('item-changed', myEventDetail, myEventOption)
          }
        }
      })
    },
    addInput: function () {
      var copys = this.data.groups
      copys.push({ title: '', price1: '', price2: '', logo: '' })
      this.setData({ groups: copys }) 
      var that = this
      var myEventDetail = that.data.groups
      var myEventOption = {} // 触发事件的选项 
      that.triggerEvent('item-changed', myEventDetail, myEventOption)
    },
    inputedTitle: function (e) {
      var inputVal = e.detail.value
      var idx = e.currentTarget.dataset.index
      var copys = this.data.groups
      copys[idx].title = inputVal
      this.setData({ gropus: copys }) 
      var that = this
      var myEventDetail = that.data.groups
      var myEventOption = {} // 触发事件的选项 
      that.triggerEvent('item-changed', myEventDetail, myEventOption)
    },
    inputedPrice1: function (e) {
      var inputVal = e.detail.value
      var idx = e.currentTarget.dataset.index
      var copys = this.data.groups
      copys[idx].price1 = inputVal
      this.setData({ gropus: copys }) 
      var that = this
      var myEventDetail = that.data.groups
      var myEventOption = {} // 触发事件的选项 
      that.triggerEvent('item-changed', myEventDetail, myEventOption)
    },
    inputedPrice2: function (e) {
      var inputVal = e.detail.value
      var idx = e.currentTarget.dataset.index
      var copys = this.data.groups
      copys[idx].price2 = inputVal
      this.setData({ gropus: copys }) 
      var that = this
      var myEventDetail = that.data.groups
      var myEventOption = {} // 触发事件的选项 
      that.triggerEvent('item-changed', myEventDetail, myEventOption)
    },
    cleanTitleInputText: function (e) { 
      var idx = e.currentTarget.dataset.index
      var copys = this.data.groups
      copys[idx].title = ''
      this.setData({ groups: copys }) 
      var that = this
      var myEventDetail = that.data.groups
      var myEventOption = {} // 触发事件的选项 
      that.triggerEvent('item-changed', myEventDetail, myEventOption)
    },
    uploadLogo:function(e){
      var idx = e.currentTarget.dataset.index
      var copys = this.data.groups
      var that = this
      wx.chooseImage({
        count: 1,
        success: function (res) {
          copys[idx].logo = res.tempFilePaths[0]
          that.setData({ groups: copys })  
          var myEventDetail = that.data.groups
          var myEventOption = {} // 触发事件的选项 
          that.triggerEvent('item-changed', myEventDetail, myEventOption)         
        },
      })      
    },
    preview: function (e) {
      var that = this
      var idx = e.currentTarget.dataset.index
      var copys = that.data.groups
      wx.previewImage({
        urls: [copys[idx].logo || copys[idx].remoteUrl],
      })
    },
    deleteLogo: function (e) {
      var that = this
      var idx = e.currentTarget.dataset.index
      var copys = that.data.groups
      copys[idx].logo='' 
      that.setData({ groups: copys })  
      var that = this
      var myEventDetail = that.data.groups
      var myEventOption = {} // 触发事件的选项 
      that.triggerEvent('item-changed', myEventDetail, myEventOption)
    } 
    
  }
})