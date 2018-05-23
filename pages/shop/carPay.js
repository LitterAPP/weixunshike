// pages/shop/myCarList.js
const util = require('../../util/util.js')
const app = getApp()
var page = 1, pageSize = 8
Page({
  /**
   * 页面的初始数据
   */
  data: {
    selectAll: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({ W: util.getSysInfo().windowWidth, H: util.getSysInfo().windowHeight,address: wx.getStorageSync('address') })
    that.orderId = options.orderId||''
    that.listMyCarGoods()
  }, 
  memoInput:function(e){
    var that = this
    that.memo = e.detail.value
  },
  useCouponSwitch: function (e) {
    var that = this
    if (e.detail.value){
      var tmpCouon = { couponAmount:0}
      that.setData({ coupon: tmpCouon})
    }else{
      that.setData({ coupon: that.coupon })
    }
  },
  payCarOrder:function(){
    var that = this
    if (!that.data.address || !that.data.address.userName || !that.data.address.telNumber) {
      util.showToast('请选择地址', 'warn')
      return;
    }
    if (!that.data.address.telNumber) {
      util.showToast('必须填写联系电话', 'warn')
      return;
    }

    wx.showLoading({
      title: '请稍后...',
      mask: true
    })

    util.GET(app.globalData.host + '/shop/payCarOrder', {
      session: wx.getStorageSync('session'),
      couponAccountId: that.data.coupon.couponId||'',
      userAccountId: that.data.result.account.accountId||'',
      appid: app.globalData.appid,     
      orderId:that.orderId,
      address: that.data.address,
      memo:that.memo||''
    }, function (res) {
      if (res && res.code == 1) {
        if (!res.data.order) {
          util.showToast('下单失败，请稍后再试', 'error')
          return
        }
        if (res.data.needPay) {
          console.log({
            appId: app.globalData.appid,
            timeStamp: res.data.litterPayParams.timeStamp,
            nonceStr: res.data.litterPayParams.nonceStr,
            package: res.data.litterPayParams.package,
            signType: res.data.litterPayParams.signType,
            paySign: res.data.litterPayParams.paySign
          })
          wx.requestPayment({
            appId: app.globalData.appid,
            timeStamp: res.data.litterPayParams.timeStamp,
            nonceStr: res.data.litterPayParams.nonceStr,
            package: res.data.litterPayParams.package,
            signType: res.data.litterPayParams.signType,
            paySign: res.data.litterPayParams.paySign,
            success: function () {
              util.showToast('支付成功！', 'success')
              wx.redirectTo({
                url: '/pages/shop/orderdetail?orderId=' + res.data.orderId,
              })
            },
            fail: function () {
              util.GET(app.globalData.host + '/shop/cancelPay', { session: wx.getStorageSync('session'), orderId: res.data.orderId },
                function (rsp) {
                  if (rsp && rsp.code == 1) {
                    util.showToast('订单成功取消！', 'success')
                    console.log('res.data.orderId-->', res.data.orderId)
                    wx.redirectTo({
                      url: '/pages/shop/orderdetail?orderId=' + res.data.orderId,
                    })
                  }
                })
            },
            complete: function (rsp) {
              console.log(rsp)
            }
          })
        } else {
          util.showToast('支付完成！', 'success')
          wx.redirectTo({
            url: '/pages/shop/orderdetail?orderId=' + res.data.orderId,
          })
        }
      } else {
        util.showToast('支付失败', 'error')
      }
      setTimeout(function () { wx.hideLoading() }, 3000)
    })

  },
  goProductDetail: function (e) {
    var productId = e.currentTarget.dataset.pid
    wx.navigateTo({
      url: '/pages/shop/detail?productId=' + productId,
    })
  }, 
  reCalAmount: function () {
    var that = this
    var tmpResult = that.data.result
    tmpResult.sumAmount = 0.0
    for (var j in tmpResult.list) {
      //console.log(tmpResult.list[j].totalAmount, tmpResult.list[j].buyNum, tmpResult.list[j].buyNum * tmpResult.list[j].singPrice)
      if (tmpResult.list[j].checked) {
        tmpResult.sumAmount += tmpResult.list[j].singPrice * tmpResult.list[j].buyNum
      }
    }
    that.setData({ result: tmpResult }) 
    util.GET(app.globalData.host + '/shop/calCoupon',
      {
        session: wx.getStorageSync('session'),
        amount: tmpResult.sumAmount
      }, function (data) {
        if (data && data.code == 1 && data.data) {
          that.coupon = data.data
          that.setData({ coupon: data.data, hasCoupon:true })
        } else {
          that.setData({ coupon: null })
        }
      })
  }, 
  changeAddress: function () {
    var that = this
    wx.chooseAddress({
      success: function (e) {
        console.log(e)
        var address = {
          telNumber: e.telNumber,
          userName: e.userName,
          provinceName: e.provinceName,
          cityName: e.cityName,
          countyName: e.countyName,
          detailInfo: e.detailInfo
        }
        wx.setStorageSync('address', address)
        that.setData({ address: address })
      },
      fail: function () {

      }
    })
  },
  listMyCarGoods: function () {
    var that = this
    wx.showLoading({
      title: '请稍后...',
      mask: true
    })
    util.checkLogin(false, function () {
      util.GET(app.globalData.host + '/shop/carPayPage',
        {
          session: wx.getStorageSync('session'),
          orderId: that.orderId
        }, function (data) {
          if (data && data.code == 1) {
            that.setData({ result: data.data })
            that.reCalAmount() 
          }else{
            util.showToast('请尝试重新下单','warn')
          }
          setTimeout(function(){wx.hideLoading()},300)
        })
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