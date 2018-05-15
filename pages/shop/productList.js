const util = require('../../util/util.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: { 
    currentSort:5
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var that = this
      var W = wx.getSystemInfoSync().windowWidth
      var H = wx.getSystemInfoSync().screenHeight
      that.setData({ W: W, H: H })
      
      that.page=1
      that.pageSize=10
      that.pCategoryId = options.pCategoryId || ''
      that.subCategoryId = options.subCategoryId || ''
      that.isSale = options.isSale || false
      that.isHot = options.isHot || false
      that.isNew = options.isNew || false
      that.shopId = options.shopId || 'SHOP_ADMIN_TEST'
      if (that.isNew){
        that.setData({ currentSort:1})
      }
     that.list(false)
  },
  goProductDetails:function(e){
    var productId = e.currentTarget.dataset.pid
    wx.navigateTo({
      url: '/pages/shop/detail?productId='+productId,
    })
  },
  list:function(append){
    var that = this
    if(that.data.nomore){
      return
    }
    that.setData({ loading:true})
    util.GET(app.globalData.host + '/shop/listProduct', {
      pCategoryId: that.pCategoryId,
      subCategoryId: that.subCategoryId,
      isSale: that.isSale,
      isHot: that.isHot,
      status: 1,
      shopId: that.shopId,
      orderBy: that.orderBy(),
      page: that.page,
      pageSize: that.pageSize
    }, function (res) {
      that.setData({ loading: false })
      if (res && res.code == 1 && res.data) {
        if (!append){
          that.setData({ total: res.data.total, list: res.data.list })
        }else{         
          var oldList = that.data.list
          for(var i in res.data.list){
            oldList.push(res.data.list[i])
          }
          that.setData({ total: res.data.total, list: oldList })
        }   
        if(that.page*that.pageSize >= that.data.total){
          that.setData({ nomore:true })
        }
      }
    })
  },
  orderBy:function(){
    var that = this
    var sort = that.data.currentSort
      if (sort != 4){
        return sort
      }
      if (sort == 4 && that.data.currentSortPrictDesc){
        return 3
      }
      if (sort == 4 && !that.data.currentSortPrictDesc) {
        return 4
      }
  },
  sortClick:function(e){
    var that = this
    that.setData({ nomore: false })
    var sort = e.currentTarget.dataset.sort
    if (sort==4){
      that.setData({ currentSort: sort, currentSortPrictDesc: !that.data.currentSortPrictDesc})
    }else{
      that.setData({ currentSort: sort })
    }   
    that.page=1
    that.list(false)
  },
  more:function(){
    var that = this
    that.page += 1
    that.list(true)
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