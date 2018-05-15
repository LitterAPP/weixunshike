const util = require('../../util/util.js')
const app = getApp()
var page=1
Page({
  /**
   * 页面的初始数据
   */
  data: {
  
  },
  hiddenGroup: function () {
    this.setData({ showGroup: 0 })
  },
  communityDesc: function (e) {
    var idx = e.currentTarget.dataset.idx
    var communities = this.data.list[idx].communities
    this.setData({ showGroup: 1, showTipsTitle: '什么是小区合作', showTipsDesc:'小区合作是指该商品参与了平台合作，平台下单后可以在1小时内送达小区住户，该商品合作的小区如下：', showTipsList: communities})
  },
  pingtaiyanxuanDesc:function(e){
    this.setData({
      showGroup: 1, showTipsTitle: '什么是平台严选',showTipsDesc:'平台严选是指该商品经过平台亲自下单购买，试用，校验后符合商家描述的商品', showTipsList: [] })
  },
  goProductDetail:function(e){
    var productId = e.currentTarget.dataset.productid
    wx.navigateTo({
      url: '/pages/shop/detail?productId=' + productId,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({ W: util.getSysInfo().windowWidth, H: util.getSysInfo().windowHeight})
    
    wx.showLoading({
      title: '加载中...',
    })
    util.GET(app.globalData.host + '/shop/index',{page:page,pageSize:10},function(data){
      if (data && data.code == 1){
          that.setData({list:data.data,nomore:false})
      }else{
        util.showToast('服务异常') 
      }
      setTimeout(function () { wx.hideLoading() }, 300)
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
    page = 1   
    util.GET(app.globalData.host + '/shop/index', { page: page, pageSize: 10 }, function (data) {
      if (data && data.code == 1) {  
        that.setData({ list: data.data, nomore: false })              
      } 
    })

    setTimeout(function () { wx.stopPullDownRefresh() }, 1000)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that =this
    page++
    that.setData({ onloading: true, nomore: false })
    util.GET(app.globalData.host + '/shop/index', { page: page, pageSize: 10 }, function (res) {
      if (res && res.code == 1) {
        if (res.data.length > 0){
          var append = that.data.list
          for (var i in res.data) {
            append.push(res.data[i])
          }
          that.setData({list:append})
        }else{
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