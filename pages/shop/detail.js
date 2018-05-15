// pages/shop/detail.js
const util = require('../../util/util.js')
const app = getApp()
var currentPreview = 0
var together = 0
var togetherid
Page({
  /**
   * 页面的初始数据
   */
  data: {
    buyNumber: 1
  },
  edit:function(e){
    var productId = e.currentTarget.dataset.productid
    wx.reLaunch({
      url: '/pages/shopmng/product?productId=' + productId,
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
  upProduct:function(e){
    util.showToast('上架中...')
    var productId = e.currentTarget.dataset.productid
    util.GET(app.globalData.host + '/ShopMng/upProductOnSell',
      {
        session: wx.getStorageSync('session'),
        productId: productId
      }, function (data) {
        if (data && data.code == 1) {
          util.showToast('上架成功')
          setTimeout(function () { 
            wx.hideLoading() 
            wx.reLaunch({
              url: '/pages/shop/detail?productId='+productId,
            })
          }, 2000)
        } else {
          util.showToast('服务器异常')
          wx.hideLoading()
        }
      })
  },
  getCoupon:function(e){
    var that = this
    wx.showLoading({
      title: '领取中...',
      mask:true
    })
    util.checkLogin(false,function(){
      util.GET(app.globalData.host + '/shop/getCoupon', 
      { 
        session:wx.getStorageSync('session'),
        productId: that.data.product.productId,
        couponId:e.currentTarget.dataset.id  
       }, function (data) {
        if (data && data.code == 1) {
           if(data.data.get){
             util.showToast('领取成功')
           } else{
             util.showToast('领取过了')
           }
           that.setData({ coupons: data.data.coupons||[]})
           setTimeout(function () { wx.hideLoading()},2000) 
        } else {
          util.showToast('服务器异常')
        }
      })
    })
  },
  hiddenTips: function () {
    this.setData({ showTips: 0 })
  },
  communityDesc: function () { 
    var communities = this.data.product.communities
    this.setData({ showTips: 1, showTipsTitle: '什么是小区合作', showTipsDesc: '小区合作是指该商品参与了平台合作，平台下单后可以在1小时内送达小区住户,该商品合作的小区如下：', showTipsList: communities })
  },
  pingtaiyanxuanDesc: function (e) {
    this.setData({
      showTips: 1, showTipsTitle: '什么是平台严选', showTipsDesc: '平台严选是指该商品经过平台亲自下单购买，试用，校验后符合商家描述的商品', showTipsList: []
    })
  },
  goProductDetail: function (e) {
    var productId = e.currentTarget.dataset.productid
    wx.navigateTo({
      url: '/pages/shop/detail?productId=' + productId,
    })
  },

  goPay: function () {
    var that = this
    var params = {
      productId: that.data.product.productId,
      productName:that.data.product.productName,
      together: together,
      togetherid: togetherid,
      showPrice: that.data.showPrice,
      buyNumber: that.data.buyNumber,
      groups: that.data.chosedGroup
    }
    var encodeParams = encodeURIComponent(JSON.stringify(params))    
    console.log(encodeParams)
    wx.navigateTo({
      url: '/pages/shop/pay?payparams=' + encodeParams,
    })
  },
  selectGroup: function (e) {
    var groupIndex = e.currentTarget.dataset.groupindex;
    var that = this
    var buyNumber = that.data.buyNumber 

    that.setData({ chosedGroup: that.data.product.groups[groupIndex] })

    var showPrice
    if (together == 0) {
      showPrice = (parseFloat(that.data.chosedGroup.groupPrice) * buyNumber).toFixed(2)
    } else {
      showPrice = (parseFloat(that.data.chosedGroup.groupTogetherPrice) * buyNumber).toFixed(2)
    }

    that.setData({showPrice: showPrice })
  },
  selectByNumber: function (e) {
    var that = this
    var buyNumber = e.detail.value    
    var showPrice
    if (together == 0) {
      showPrice = (parseFloat(that.data.chosedGroup.groupPrice) * buyNumber).toFixed(2)
    } else {
      showPrice = (parseFloat(that.data.chosedGroup.groupTogetherPrice) * buyNumber).toFixed(2)
    }

    that.setData({ buyNumber: buyNumber, showPrice: showPrice })
  },
  hiddenGroup: function () {
    this.setData({ showGroup: 0 })
  },
  buy: function (e) {
    //0直接购物  1开团 2参团
    var that = this
    var buyNumber = that.data.buyNumber
    together = e.currentTarget.dataset.together
    var showPrice
    if (together == 0) {
      showPrice = (parseFloat(that.data.chosedGroup.groupPrice) * buyNumber).toFixed(2)
    } else {
      showPrice = (parseFloat(that.data.chosedGroup.groupTogetherPrice) * buyNumber).toFixed(2)
    }
    if (together == 2) {
      togetherid = e.currentTarget.dataset.togetherid
      //判断团状态是否拼团中，不是拼团中的都提示已经完成拼团了
      util.GET(app.globalData.host + '/shop/isTogethering',{
        togetherid: togetherid
      },function(res){
          if(res && res.code == 1 && res.data){
            that.setData({ showGroup: 1, showPrice: showPrice })            
          }else{
            util.showToast('团已结束！', 'warn')
            that.setData({ together:0})
          }
      })
    }else{
      that.setData({ showGroup: 1, showPrice: showPrice })
    }    
  },
  goToShopIndex: function () {
    wx.navigateTo({
      url: '/pages/shop/shopIndex',
    })
  },
  collect: function () {
    if (this.data.collect == 1) {
      this.setData({ collect: 0 })
    } else {
      this.setData({ collect: 1 })
    }
  },
  goTop: function () {
    wx.pageScrollTo({
      scrollTop: 0,
    })
  },
  swiperChanged: function (e) {
    currentPreview = e.detail.current
  },

  previewScreenshots: function () {
    var that = this
    wx.previewImage({
      current: that.data.product.screenshots[currentPreview],
      urls: that.data.product.screenshots,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var productId = options.productId
    console.log(options)
    if (options.togetherid && options.together==2){
      together = 2
      togetherid = options.togetherid 

      //增加接口，判断团是否已经结束
      that.setData({ together: 2, togetherMaster: options.togetherMaster, togetherid: togetherid})
    }
    that.setData({ W: util.getSysInfo().windowWidth, H: util.getSysInfo().windowHeight, isPreview: options.isPreview || 0
     })
     /**设置商品预览样式 */
    if (that.data.isPreview==1){
      wx.setNavigationBarTitle({
        title: '【预览】商品详情',
      })
      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: '#4A708B',
      })
    }
    util.GET(app.globalData.host + '/shop/productDetail', { productId: productId }, function (data) {
      if (data && data.code == 1) {
        var showPrice = parseFloat(data.data.groups[0].groupPrice).toFixed(2)
        that.setData({ product: data.data, chosedGroup: data.data.groups[0], showPrice: showPrice, pageshow: true, coupons: data.data.coupons||[] })
      }else{
        util.showToast('服务器异常')
      }
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
  onPageScroll: function (e) {
    if (e.scrollTop > 100) {
      this.setData({ showTop: 1 })
    } else {
      this.setData({ showTop: 0 })
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that = this
    return {
      title:  that.data.product.productName ,
      path: '/pages/shop/detail?productId=' + that.data.product.productId,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})