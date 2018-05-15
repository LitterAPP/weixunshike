// pages/shop/payresult.js
const util = require('../../util/util.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

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
  copyOrderNo:function(e){
    util.copyData(e.currentTarget.dataset.orderno)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({ payResult: options.payResult, orderNo: options.orderNo })
    wx.showLoading({
      title: '获取支付结果...',
      mask:true
    })
    
    setTimeout(function(){
      util.checkLogin(false, function () {
        util.GET(app.globalData.host + '/shop/getOrder', {
          session: wx.getStorageSync('session'),
          orderNo: options.orderNo
        }, function (res) {
          if (res && res.code == 1) {
            var joners = []
            var togethers = res.data.togethers
            for (var i = 0; i < res.data.togetherNumber; i++) {
              if (togethers[i])
                joners.push(togethers[i])
              else
                joners.push(null)
            }
            that.setData({ orderInfo: res.data, joners: joners })
          }
        })
      })
      wx.hideLoading()
    },5000)
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
    var that = this
    return {
      title: '【原价￥' + that.data.orderInfo.originPrice + '，现在只需￥' + that.data.orderInfo.togetherPrice+'】'+ that.data.orderInfo.order.productName,
      imageUrl: that.data.orderInfo.shareImage,
      path: '/pages/shop/detail?productId=' + that.data.orderInfo.order.productId + '&together=2&togetherid=' + that.data.orderInfo.order.togetherId + '&togetherMaster=' + that.data.orderInfo.together.masterName,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})