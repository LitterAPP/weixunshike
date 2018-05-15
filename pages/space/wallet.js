const util = require('../../util/util.js')
const app = getApp()
var page = 1, pageSize = 10
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bar: 1
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

    }
  },
  loadmore: function () {
    var that = this
    page++
    util.GET(app.globalData.host + '/shop/listWallet',
      {
        session: wx.getStorageSync('session'),
        status: that.data.bar,
        pageSize: pageSize,
        page: page
      }, function (res) {
        if (res && res.code == 1) {
          var coupons = res.data.coupons || []
          var append = that.data.coupons || []
          if (coupons.length>0) {            
            for (var i in coupons) {
              append.push(coupons[i])
            } 
          }
          that.setData({ account: res.data, coupons: append })
        } else {
          util.showToast('服务异常')
        }
      })
  },
  barClick: function (e) {
    var that = this
    page = 1
    
    util.GET(app.globalData.host + '/shop/listWallet',
      {
        session: wx.getStorageSync('session'),
        status: e.currentTarget.dataset.bar,
        pageSize: pageSize,
        page: page
      }, function (res) {
        if (res && res.code == 1) {  
          var coupons = res.data.coupons || [] 
          that.setData({ account: res.data, coupons: coupons, bar: e.currentTarget.dataset.bar })
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
      util.GET(app.globalData.host + '/shop/listWallet',
        {
          session: wx.getStorageSync('session'),
          status: that.data.bar,
          pageSize: pageSize,
          page: page
        }, function (res) {
          if (res && res.code == 1) {
            var coupons = res.data.coupons || [] 
            that.setData({ account: res.data, pageshow: true, coupons: coupons })
          } else {
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