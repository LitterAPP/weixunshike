// pages/shop/detail.js
const util = require('../../util/util.js')
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var W = wx.getSystemInfoSync().windowWidth
    var H = wx.getSystemInfoSync().screenHeight
    that.setData({ W: W, H: H })
    wx.showLoading({
      title: '请稍后...',
    })
    util.GET(app.globalData.host + '/shop/categoryALL',
      {
        shopId: options.shopId||''
      }, function (res) {
        if(res && res.code == 1){
          that.setData({list : res.data})
        }else{
          //util.showToast('网络异常','error')
        }
        wx.hideLoading()
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

    }
  },
  listALL:function(){
    wx.navigateTo({
      url: '/pages/shop/productList',
    })
  },
  listByPID:function(e){
    var pid = e.currentTarget.dataset.categoryid
    wx.navigateTo({
      url: '/pages/shop/productList?pCategoryId='+pid,
    })
  },
  listByPIDAndSUBID:function(e){
    var pid = e.currentTarget.dataset.pcategoryid
    var subid = e.currentTarget.dataset.subcategoryid
    console.log(pid, subid);
    wx.navigateTo({
      url: '/pages/shop/productList?pCategoryId=' + pid + '&subCategoryId=' + subid,
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