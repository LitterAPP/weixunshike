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
    that.setData({ W: util.getSysInfo().windowWidth, H: util.getSysInfo().screenHeight })
  },

  userInfoHandler:function(e){   
    console.log(e) 
    if (e.detail && e.detail.encryptedData){
      var session = wx.getStorageSync('session')
      session = session || ''
      wx.login({
        success: function (loginRes) {
          if (loginRes.code) {
            util.GET(app.globalData.host + '/login/loginByWeixin', {
              session: session,
              code: loginRes.code,
              rawData: e.detail.rawData,
              encryptedData: e.detail.encryptedData,
              signature: e.detail.signature,
              iv: e.detail.iv,
              appid: app.globalData.appid
            }, function (res) {
              if (res && res.code == 1) {
                wx.setStorageSync('logined', 1)
                wx.setStorageSync('userinfo', res.data)
                wx.setStorageSync('session', res.data.session)
              } else {
                console.log('getWXUserInfo fail:res=', res)
              }
              util.showToast('登录成功','success')
              setTimeout(function(){
                wx.navigateBack({
                  delta: 1
                })
              },2000)
            })
          } else {
            console.log('wx.login0 fail')
          }
        },
        fail: function () {
          console.log('wx.login fail')
        }
      })  
    }else{
      wx.navigateBack({
        delta: 1
      })
    }
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