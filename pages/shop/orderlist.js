const util = require('../../util/util.js')
const app = getApp()
var status = -1
var page = 1
var pageSize = 10
Page({

  /**
   * 页面的初始数据
   */
  data: {
    status:-1
  },
  sellerSwitch:function(e){    
    var that = this
    page = 1
    status=-1
    that.setData({ imSeller: e.detail.value,status:-1 })
    util.GET(app.globalData.host + '/shop/listOrder',
      {
        session: wx.getStorageSync('session'),
        status: status,
        imSeller: that.data.imSeller || false,
        page: page,
        pageSize: pageSize
      }, function (res) {
        if (res && res.code == 1) {
          that.setData({ list: res.data.orders, isSeller: res.data.isSeller, pageshow: true })
        } else {
          util.showToast('服务异常')
        }
      })
  },
  goOrderDetail:function(e){
    wx.navigateTo({
      url: '/pages/shop/orderdetail?orderId='+e.currentTarget.dataset.orderid,
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

    let pages = getCurrentPages();
    console.log('getCurrentPages', pages)
    if (pages.length > 1) {
      wx.navigateBack({
        delta: 1
      })
    } else {
      wx.navigateTo({
        url: '/pages/shop/shopIndex',
      })
    }
  },

  barSelected:function(e){
    var that = this
    page=1
    status = e.currentTarget.dataset.status
    that.setData({status:status})
    util.GET(app.globalData.host + '/shop/listOrder',
      {
        session: wx.getStorageSync('session'),
        status: status,
        imSeller: that.data.imSeller || false,
        page: page,
        pageSize: pageSize
      }, function (res) {
        if (res && res.code == 1) {
          that.setData({ list: res.data.orders, isSeller: res.data.isSeller, pageshow: true })
        } else {
          util.showToast('服务异常')
        }
      })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({ W: util.getSysInfo().windowWidth, H: util.getSysInfo().screenHeight })
    util.checkLogin(false, function () {
      util.GET(app.globalData.host + '/shop/listOrder',
      {
        session: wx.getStorageSync('session'),
        status:status,
        imSeller: that.data.imSeller || false,
        page:page,
        pageSize:pageSize
      },function(res){
        if (res && res.code == 1){
          that.setData({list:res.data.orders,isSeller:res.data.isSeller,pageshow:true})
        }else{
          util.showToast('服务异常')
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
    page=1
    util.GET(app.globalData.host + '/shop/listOrder',
      {
        session: wx.getStorageSync('session'),
        status: status,
        imSeller: that.data.imSeller || false,
        page: page,
        pageSize: pageSize
      }, function (res) {
        if (res && res.code == 1) {
         
          that.setData({ list: res.data.orders, isSeller: res.data.isSeller, nomore: false })        
        }
      })

    setTimeout(function () { wx.stopPullDownRefresh() }, 1000)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this
    page++
    that.setData({ onloading: true, nomore: false })

    util.GET(app.globalData.host + '/shop/listOrder',
      {
        session: wx.getStorageSync('session'),
        status: status,
        page: page,
        imSeller: that.data.imSeller || false,
        pageSize: pageSize
      }, function (res) {
        if (res && res.code == 1) { 
          if (res.data.length > 0) {
            var append = that.data.list
            for (var i in res.data.orders) {
              append.push(res.data[i])
            }
            that.setData({ list: append })
          } else {
            that.setData({ nomore: true })
          }
        }
        that.setData({ onloading: false })       
      }) 
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})