// pages/shop/test.js
const util = require('../../util/util.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },
  createOrder:function(e){
    wx.showLoading({
      title: '下单中...',
    })
    console.log(e.detail.value)
    var productId = e.detail.value.productId
    var buyNum = e.detail.value.buyNum
    var groupId = e.detail.value.groupId
    var userAccountId = e.detail.value.userAccountId
    var couponAccountId = e.detail.value.couponAccountId 
    var together = e.detail.value.together
    var togetherId = e.detail.value.togetherId
    var session = wx.getStorageSync('session')
    util.checkLogin('1', function () {
      util.GET(app.globalData.host + '/shop/createOrder', 
      { 
        session: session,
        productId: productId,
        groupId: groupId,
        userAccountId: userAccountId,
        couponAccountId:couponAccountId,
        appid: app.globalData.appid,
        buyNum: buyNum,
        together: together,
        togetherId: togetherId
      }, 
      function (res) {
        if (res && res.code == 1 ) {
          if (!res.data.order){
            util.showToast('下单失败，请稍后再试', 'error')
            return 
          }
          if (res.data.needPay){
            console.log({
              appId: app.globalData.appid,
              timeStamp: res.data.litterPayParams.timeStamp,
              nonceStr: res.data.litterPayParams.nonceStr,
              package: res.data.litterPayParams.package,
              signType: res.data.litterPayParams.signType,
              paySign: res.data.litterPayParams.paySign})
               
              wx.requestPayment({
                appId: app.globalData.appid,
                timeStamp: res.data.litterPayParams.timeStamp,
                nonceStr: res.data.litterPayParams.nonceStr,
                package: res.data.litterPayParams.package,
                signType: res.data.litterPayParams.signType,
                paySign: res.data.litterPayParams.paySign,
                success:function(){
                  util.showToast('支付成功！', 'success')
                },
                fail:function(){
                  util.GET(app.globalData.host + '/shop/cancelPay', { session: session, orderId: res.data.orderId},function(rsp){})
                },
                complete:function(rsp){
                  console.log(rsp)
                }
              })
          }else{
            util.showToast('支付完成！', 'success')
          }
        } else {
          util.showToast(res.msg, 'error')
        }
        setTimeout(function () { wx.hideLoading() }, 300)
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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