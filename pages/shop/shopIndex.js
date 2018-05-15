const util = require('../../util/util.js')
const app = getApp() 
Page({

  /**
   * 页面的初始数据
   */
  data: {  
    openCoupon:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var W = wx.getSystemInfoSync().windowWidth
    var H = wx.getSystemInfoSync().screenHeight
    that.shopId = ''
    that.forceShowActivity = options.forceShow||0
    var scene = decodeURIComponent(options.scene)
    if (scene){
      var scens = scene.split('&')
      if (scens.length>0){
        for(var i in scens){
          var tmp = scens[i].split('=')
          if (tmp.length!=2)continue
          if(tmp[0]==='shopId'){
            that.shopId = tmp[1]
          }
        }
      }
    }
    console.log('the shop id is',that.shopId)
    
    that.setData({W:W,H:H})
    that.getShopConfig()
  },
  getShopConfig:function(){
    var that = this
    util.GET(app.globalData.host + '/shop/getShopIndexConfig', 
    { 
      shopId: that.shopId 
    }, function (res) {
      if (res && res.code == 1 && res.data && res.data.config) {
        that.setData({ config: res.data.config, shopAvatar: res.data.shopAvatar, shopName: res.data.shopName, follow: res.data.follow, coupons: res.data.coupons || [] })
        if (that.data.coupons.length > 0) {
          var now = Date.parse(new Date()) / 1000;
          var time1 = wx.getStorageSync('showCouponTime') ? parseInt(wx.getStorageSync('showCouponTime')) : 0
          var diff = now - time1;
          if (diff > 24 * 60 * 60 || that.forceShowActivity==1) {
            that.setData({ openCoupon: true })
            wx.setStorage({
              key: 'showCouponTime',
              data: '' + now,
            })
          }
        }
      } else {
        util.showToast(''+res.msg,'error')
      }
    })
  },
  toupper:function(){
    var that  = this
    that.setData({showTop:false,showBottom:true})
  },
  tolower: function () {
    var that = this
    that.setData({ showTop: true, showBottom: false })
  },

  navLinkClick:function(e){
    var that = this

    if(e.detail.formId){
      util.GET(app.globalData.host + '/FormId/collect',
        {
          session: wx.getStorageSync('session'),
          appId: app.globalData.appid,
          formId: e.detail.formId
        }, function () { }) 
    }
    
    if (!e.currentTarget.dataset.type || !e.currentTarget.dataset.url){
      return
    }
    var tp = e.currentTarget.dataset.type
    var url = e.currentTarget.dataset.url

    let pages = getCurrentPages();
    console.log('navLinkClick,type=', tp, 'url=', url, 'pages', pages.length )
   
    
    if (tp==1){
      wx.navigateTo({
        url: url,
      })
    }else{
      wx.navigateTo({
        url: '/pages/shop/webview?url=' + encodeURIComponent(url),
      })
    }
  },
  follow:function(e){
    var that = this
    util.GET(app.globalData.host + '/FormId/collect',
      {
        session: wx.getStorageSync('session'),
        appId: app.globalData.appid,
        formId: e.detail.formId
      }, function () { }) 
    that.setData({ followed: !that.data.followed})
  },
  goBack: function (e) {
    var that = this
    util.GET(app.globalData.host + '/FormId/collect',
      {
        session: wx.getStorageSync('session'),
        appId: app.globalData.appid,
        formId: e.detail.formId
      }, function () { })

    let pages = getCurrentPages();
    console.log('getCurrentPages', pages)
    if(pages.length>=9){
      var url = pages[pages.length-1].route
      wx.reLaunch({
        url: url,
      })
    }else if (pages.length > 1) {
      wx.navigateBack({
        delta: 1
      })
    } else {
       wx.reLaunch({
         url: '/pages/shop/shopIndex',
       })
    }
  },
  openCoupon:function(){
    this.setData({ openCoupon: true })
  },
  closeCoupon:function(){
    this.setData({openCoupon:false})
  },
  getCoupon: function (e) {
    var that = this
    wx.showLoading({
      title: '领取中...',
      mask: true
    })
    util.checkLogin(false, function () {
      util.GET(app.globalData.host + '/shop/getCoupon',
        {
          session: wx.getStorageSync('session'),           
          couponId: e.currentTarget.dataset.id
        }, function (data) {
          if (data && data.code == 1) {
            if (data.data.get) {
              util.showToast('领取成功')
            } else {
              util.showToast('领取过了')
            }
            that.setData({ coupons: data.data.coupons || [] })
            setTimeout(function () { wx.hideLoading() }, 2000)
          } else {
            util.showToast('服务器异常')
          }
        })
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
    that.getShopConfig()
    setTimeout(function(){
      wx.stopPullDownRefresh()
    },500)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})