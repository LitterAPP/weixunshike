// pages/shop/pay.js
const util = require('../../util/util.js')
const app = getApp() 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    validAccountIndex: -1
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
  
  pay: function () {
    var that = this
    if (!that.data.address || !that.data.address.userName || !that.data.address.telNumber){
      util.showToast('请选择地址','warn')
      return ;
    }
    if ( !that.data.address.telNumber) {
      util.showToast('必须填写联系电话', 'warn')
      return;
    }
    
    wx.showLoading({
      title: '请稍后...',
      mask: true
    })
    var refer = wx.getStorageSync('refer')
    var referAppId=''
    var channel=''
    if (refer.referrerInfo && refer.referrerInfo.appId){
      referAppId = refer.referrerInfo.appId
    }
    if (refer.query && refer.query.channel) {
      channel = refer.query.channel
    }
    util.GET(app.globalData.host + '/shop/createOrder', {
      session: wx.getStorageSync('session'),
      productId: that.data.payparams.productId,
      groupId: that.data.payparams.groups.groupId,
      appid: app.globalData.appid,
      buyNum: that.data.payparams.buyNumber,
      userAccountId: that.data.basicAccount ? that.data.basicAccount.accountId : '',
      couponAccountId: that.data.currentSelectAccountId ? that.data.currentSelectAccountId:'',
      together: (that.data.payparams.together == 1 || that.data.payparams.together == 2),
      togetherId: that.data.payparams.together == 2 ? that.data.payparams.togetherid : '',
      address:that.data.address,
      referScene: refer.scene||'',
      referAppId: referAppId,
      referChannel: channel 
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
                  if(rsp && rsp.code == 1){
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
  dontUseValidAccount: function () {
    var that = this
    that.setData({ userAccount: false, showValidAccount: false, validAccountChecked: false, validAccountIndex: -1, currentSelectAccountId:'' })

    var totalPrice = that.data.siglePrice * that.data.payparams.buyNumber
    var showPrice = that.data.siglePrice * that.data.payparams.buyNumber
    var showBalanceUsed = 0
    var showCouponUsed = 0
    var notneedusebalance = false
    //先扣代金券

    if (that.data.validAccountIndex >= 0) {
      var couponBalance = parseFloat(that.data.validAccounts[that.data.validAccountIndex].accountAmount)
      showPrice -= couponBalance
      if (showPrice >= 0) {
        showCouponUsed = couponBalance
      } else {
        showCouponUsed = totalPrice
      }
    }

    if (showPrice > 0 && that.data.basicAccount) {
      var balance = parseFloat(that.data.basicAccount.accountAmount)
      showPrice -= balance
      if (showPrice >= 0) {
        showBalanceUsed = balance
      } else {
        showBalanceUsed = totalPrice - showCouponUsed
      }
    }
    that.setData({ showPrice: showPrice.toFixed(2), showBalanceUsed: showBalanceUsed.toFixed(2), showCouponUsed: showCouponUsed.toFixed(2)})

  },

  validAccountSelect: function (e) {
    var that = this
    that.setData({ userAccount: true, currentSelectAccountId: e.currentTarget.dataset.accountid, validAccountIndex: e.currentTarget.dataset.validaccountindex})
    
    var totalPrice = that.data.siglePrice * that.data.payparams.buyNumber
    var showPrice = that.data.siglePrice * that.data.payparams.buyNumber
    var showBalanceUsed = 0
    var showCouponUsed = 0
    var notneedusebalance = false
    //先扣代金券
    if (that.data.validAccountIndex >= 0) {
      var couponBalance = parseFloat(that.data.validAccounts[that.data.validAccountIndex].accountAmount)
      showPrice -= couponBalance
      if (showPrice >= 0) {
        showCouponUsed = couponBalance
      } else {
        showCouponUsed = totalPrice
      }
    }

    if (showPrice > 0 && that.data.basicAccount) {
      var balance = parseFloat(that.data.basicAccount.accountAmount)
      showPrice -= balance
      if (showPrice >= 0) {
        showBalanceUsed = balance
      } else {
        showBalanceUsed = totalPrice - showCouponUsed
      }
    }
    that.setData({ showPrice: showPrice.toFixed(2), showBalanceUsed: showBalanceUsed.toFixed(2), showCouponUsed: showCouponUsed.toFixed(2) })

  },

  showValidAccount: function (e) {
    if (e.detail.value) {
      this.setData({ showValidAccount: true, validAccountChecked: true })
    } else {
      this.setData({ showValidAccount: false, validAccountChecked: false })
    }
  },

  showInValidAccount: function (e) {
    if (e.detail.value) {
      this.setData({ showInValidAccount: true })
    } else {
      this.setData({ showInValidAccount: false })
    }
  },
  selectByNumber: function (e) {
    var that = this
    var buyNumber = e.detail.value 
    var payparams = that.data.payparams
    payparams['buyNumber'] = buyNumber

    that.setData({ payparams: payparams })

    var siglePrice = that.data.siglePrice
    var totalPrice = siglePrice * buyNumber

    util.GET(app.globalData.host + '/shop/listAccounts', {
      session: wx.getStorageSync('session'),
      productId: payparams.productId,
      price: totalPrice
    }, function (res) {
      if (res && res.code == 1) {
        that.setData({ basicAccount: res.data.basicAccount, validAccounts: res.data.validAccounts, invalidAccounts: res.data.invalidAccounts })  

        var showPrice = totalPrice
        var showBalanceUsed = 0
        var showCouponUsed = 0
        var notneedusebalance = false
        //先扣代金券 
        if (that.data.validAccountIndex >= 0) {
          var couponBalance = parseFloat(that.data.validAccounts[that.data.validAccountIndex].accountAmount)
          showPrice -= couponBalance
          if (showPrice >= 0) {
            showCouponUsed = couponBalance
          } else {
            showCouponUsed = totalPrice
          }
        } 
        if (showPrice > 0 && that.data.basicAccount ) {
          var balance = parseFloat(that.data.basicAccount.accountAmount)
          showPrice -= balance
          if (showPrice >= 0) {
            showBalanceUsed = parseFloat(balance)
          } else {
            showBalanceUsed = totalPrice - showCouponUsed
          }
        } 
        that.setData({ showPrice: showPrice.toFixed(2), showBalanceUsed: showBalanceUsed.toFixed(2), showCouponUsed: showCouponUsed.toFixed(2) })
      } else {
        util.showToast('系统繁忙', 'error')
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var payparams = JSON.parse(decodeURIComponent(options.payparams))
    that.setData({
      W: util.getSysInfo().windowWidth, H: util.getSysInfo().screenHeight, address: wx.getStorageSync('address'), payparams: payparams
    })

    util.checkLogin(false, function () {
      util.GET(app.globalData.host + '/shop/listAccounts', { session: wx.getStorageSync('session'), productId: payparams.productId, price: parseFloat(payparams.showPrice) }, function (res) {
        if (res && res.code == 1) {
          that.setData({ basicAccount: res.data.basicAccount, validAccounts: res.data.validAccounts, invalidAccounts: res.data.invalidAccounts })
          var buyNumber = that.data.payparams.buyNumber
          if (that.data.payparams.together == 1 || that.data.payparams.together == 2) {
            that.setData({ siglePrice: that.data.payparams.groups.groupTogetherPrice })
          } else {
            that.setData({ siglePrice: that.data.payparams.groups.groupPrice })
          }

          if (that.data.validAccounts && that.data.validAccounts.length>0){
            that.setData({ validAccountIndex: 0, userAccount:true,currentSelectAccountId: that.data.validAccounts[0].accountId})
          }
          var showPrice = that.data.siglePrice * buyNumber
          var totalPrice = that.data.siglePrice * buyNumber           
          var showBalanceUsed = 0
          var showCouponUsed = 0
          var notneedusebalance = false
          //先扣代金券 
          if (that.data.validAccountIndex >= 0) {
            var couponBalance = parseFloat(that.data.validAccounts[that.data.validAccountIndex].accountAmount)
            showPrice -= couponBalance
            if (showPrice >= 0) {
              showCouponUsed = couponBalance
            } else {
              showCouponUsed = totalPrice
            }
          }

          if (showPrice > 0 && that.data.basicAccount) {
            var balance = parseFloat(that.data.basicAccount.accountAmount )
            showPrice -= balance
            if (showPrice >= 0) {
              showBalanceUsed = balance
            } else {
              showBalanceUsed = totalPrice - showCouponUsed
            }
          }
          that.setData({ showPrice: showPrice.toFixed(2), showBalanceUsed: showBalanceUsed.toFixed(2), showCouponUsed: showCouponUsed.toFixed(2) })
           
        } else {
          util.showToast('系统繁忙', 'error')
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