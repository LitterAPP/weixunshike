const util = require('../../util/util.js')
const app = getApp()
var page=1,pageSize=10
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showTop:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var W = wx.getSystemInfoSync().windowWidth
    var H = wx.getSystemInfoSync().screenHeight
    that.setData({ W: W, H: H })
    that.wetaoid = options.wetaoid || 0
    that.listComments(false)     
  },
  deleteComment:function(e){
    var that = this
    var id = e.currentTarget.dataset.id
    util.checkLogin(false, function () {
      wx.showLoading({
        title: '评论删除中...',
      })
      util.GET(app.globalData.host + '/shop/delWeTaoComment', {
        session: wx.getStorageSync('session'),
        weTaoId: that.wetaoid,
        commentId: id,
        page: page,
        pageSize: pageSize
      }, function (res) {
        if (res && res.code == 1) {
          that.setData({ result: res.data, comment: '' })
          util.showToast('评论删除成功', 'success')
        } else {
          util.showToast('评论删除失败', 'error')
        }
        setTimeout(function () {
          wx.hideLoading()
        }, 2000)
      })
    }); 
  },
  sendComment:function(e){
    var that = this

    util.checkLogin(false, function () {
      wx.showLoading({
        title: '评论发送中...',
      })
      util.GET(app.globalData.host + '/shop/addWeTaoComment', { 
        session: wx.getStorageSync('session'),  
        weTaoId: that.wetaoid,
        comment: e.detail.value,
        page : page,
        pageSize: pageSize
      }, function (res) {
        if(res && res.code==1){
          that.setData({ result: res.data, comment:''})
          util.showToast('评论成功','success')
        }else{
          util.showToast('评论失败', 'error')
        }
        setTimeout(function(){
          wx.hideLoading()
        },2000)        
      })
    }); 
  },
  listComments:function(append){   
    var that = this
    that.setData({ nomore: false })
    if(!append){
      page=1     
    } else {
      page+=1
      if (page <= that.data.result.pageTotal) {         
        that.setData({ loadingmore: true, nomore: false })
      } else {
        page = that.data.result.pageTotal
        that.setData({ nomore: true, loadingmore: false })
        return
      }
    }
    util.GET(app.globalData.host + '/shop/listWeTaoComment', {
      session: wx.getStorageSync('session'),
      weTaoId: that.wetaoid,      
      page: page,
      pageSize: pageSize
    }, function (res) {
      that.setData({ loadingmore: false, pulldown:false})
      if (res && res.code == 1) {
        if (!append){
          that.setData({ result: res.data })
        }else{
          var old = that.data.result
          for(var i in res.data.list){
            old.list.push(res.data.list[i])
          }
          that.setData({ result:old})
        }       
         
      } else {
        util.showToast('加载评论失败', 'success')
      }
       
    })
  },
  goBack: function (e) {
    var that = this
    util.GET(app.globalData.host + '/FormId/collect',
      {
        session: wx.getStorageSync('session'),
        appId: app.globalData.appid,
        formId: e.detail.formId
      }, function () { }) 
      var url = encodeURIComponent(app.globalData.host + '/shop/weTaoDetail?id=' + that.wetaoid)
      wx.redirectTo({
        url: '/pages/shop/webview?url=' + url,
      })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
      var that = this      
      that.listComments(false)
      setTimeout(function(){wx.stopPullDownRefresh()},800)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this
    that.listComments(true) 
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  onPageScroll: function (e) {
    

  }
})