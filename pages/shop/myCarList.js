// pages/shop/myCarList.js
const util = require('../../util/util.js')
const app = getApp()
var page=1,pageSize=8
Page({
  /**
   * 页面的初始数据
   */
  data: {
    selectAll:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({ W: util.getSysInfo().windowWidth, H: util.getSysInfo().windowHeight })
    page=1
    that.listMyCarGoods(false)
  },
  createCarOrder:function(){
    var that = this
    var refer = wx.getStorageSync('refer')
    var referAppId = ''
    var channel = ''
    if (refer.referrerInfo && refer.referrerInfo.appId) {
      referAppId = refer.referrerInfo.appId
    }
    if (refer.query && refer.query.channel) {
      channel = refer.query.channel
    }
    //
    var carIdArray = []
    for (var j in that.data.result.list) {     
      if (that.data.result.list[j].checked) {
        carIdArray.push(that.data.result.list[j].id)
      }
    }
    if (carIdArray.length==0){
      util.showToast('未选择任何商品', 'wran')
      return;
    }
    util.GET(app.globalData.host + '/shop/createCarOrder',
      {
        session: wx.getStorageSync('session'),
        carIds: carIdArray.join(','),
        referScene: refer.scene || '',
        referAppId: referAppId,
        referChannel: channel 
      }, function (data) {
        if (data && data.code == 1 && data.data) {
          console.log('订单创建成功，跳转到支付页面')
          wx.redirectTo({
            url: '/pages/shop/carPay?orderId='+data.data,
          })
        } else {
          util.showToast('创建订单失败','error')
        }
      })
  },
  scrollToUp:function(){
    var that = this
    that.setData({scrolltoup:true})
    page=1
    that.listMyCarGoods(false,function(data){
      setTimeout(function(){
        that.setData({ scrolltoup: false })
      },500) 
    })
  },
  scrollToLower:function(){
    var that = this
    if (that.data.nomore){
      return 
    }
    page++
    that.setData({ scrolltolower: true })
    that.listMyCarGoods(true, function (data) {      
      setTimeout(function () {
        that.setData({ scrolltolower: false })
      }, 500) 
    })
   
  },
  goProductDetail:function(e){
    var productId = e.currentTarget.dataset.pid
    wx.redirectTo({
      url: '/pages/shop/detail?productId=' + productId,
    })
  },
  delMyCar:function(e){
    var that = this
    var idx = e.currentTarget.dataset.idx
    var tmp = this.data.result.list[idx]
    wx.showModal({
      title: '确认要移出购物车吗?',
      content: '【' + tmp.productName+'】',
      confirmColor:'#FF6347',
      confirmText:'立即移出',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          util.GET(app.globalData.host + '/shop/deleteProductFromMyCar',
            {
              session: wx.getStorageSync('session'),
              id: tmp.id 
            }, function (data) {
              if (data && data.code == 1) {
                 wx.showToast({
                   title: '移出成功',
                 })
                 var tmpResult = that.data.result 
                 tmpResult.list.splice(idx,1)
                 that.setData({result:tmpResult}) 
                 that.reCalAmount()
              } else {

              }
            })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  reCalAmount:function(){
    var that=this
    var tmpResult = that.data.result 
    tmpResult.sumAmount = 0.0
    for (var j in tmpResult.list) {
      //console.log(tmpResult.list[j].totalAmount, tmpResult.list[j].buyNum, tmpResult.list[j].buyNum * tmpResult.list[j].singPrice)
      if (tmpResult.list[j].checked){
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
          that.setData({coupon:data.data})
        } else {
          that.setData({ coupon: null })
        }
    })

  },
  selectByNumber:function(e){
    var that = this
    var idx = e.currentTarget.dataset.idx
    var tmpResult = that.data.result
    tmpResult.list[idx].buyNum = e.detail.value
    that.reCalAmount()
    //后台更新Num值
    util.GET(app.globalData.host + '/shop/updateBuyNumOfMyCar',
      {
        session: wx.getStorageSync('session'),
        id: tmpResult.list[idx].id,
        buyNum: e.detail.value
      }, function (data) {
        if (data && data.code == 1) {
          console.log('后台更新购买数量成功')
        } else {

        }
      })
  },
  onSelect:function(e){
    var that = this
    var tapIdx = e.currentTarget.dataset.idx
    if (tapIdx == -1 || tapIdx == -2){
      var tmpResult = that.data.result
      for (var i in tmpResult.list){ 
        if (tapIdx == -1 && !tmpResult.list[i].checked){
          tmpResult.list[i].checked = true
        } else if (tapIdx == -2 && tmpResult.list[i].checked){
          tmpResult.list[i].checked = false
        }
        that.setData({ result: tmpResult, selectAll:tapIdx==-1?true:false})
      }
      that.reCalAmount()
      return 
    } 

    var tmpResult = that.data.result
    tmpResult.list[tapIdx].checked = !tmpResult.list[tapIdx].checked 
    var sall = true
    for (var j in tmpResult.list){
      if (!tmpResult.list[j].checked){
        sall = false
        break
      }
    }
    that.setData({ result: tmpResult, selectAll: sall })
    that.reCalAmount()
  },
  listMyCarGoods:function(append,callbackFunc){
    var that = this
    
    util.checkLogin(false, function () {
      wx.showLoading({
        title: '请稍后...',
        mask: true
      })
      util.GET(app.globalData.host + '/shop/listMyCar',
        {
          session: wx.getStorageSync('session'),
          page: page,
          pageSize: pageSize, 
        }, function (data) {
          if (data && data.code == 1) {
            if (!append){
              that.setData({result:data.data,nomore:false})
            } else {
              var oldList = that.data.result.list || []
              var newResult = data.data
             //console.log('nomore condition-->', !newResult || !newResult.list || newResult.list.length <= 0)
              if (!newResult || !newResult.list || newResult.list.length <= 0) {
                that.setData({ nomore: true })
              } else {
                oldList.reverse()
                for (var i in oldList) {
                  newResult.list.unshift(oldList[i])
                }
                that.setData({ result: newResult })
              }
            }
            that.reCalAmount()
            if (callbackFunc && typeof (callbackFunc) == 'function') callbackFunc(data)
          }
          setTimeout(function(){
            wx.hideLoading()
          },300);  
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