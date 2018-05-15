const util = require('../../util/util.js')
const app = getApp()
var minId = 0, num = 5, lastId, commentMenuId
var sendMonentLongTap = 0
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  previewPhoto: function (e) {
    var pics = e.currentTarget.dataset.pics
    var index = e.currentTarget.dataset.index
    wx.previewImage({
      current: pics[index],
      urls: pics
    })
  },
  sendMonentLongTap: function () {
    sendMonentLongTap = 1
    wx.navigateTo({
      url: '/pages/moment/index',
    })
  },
  sendMonent: function () {
    if (sendMonentLongTap == 1) return;
    wx.chooseImage({
      count: 9,
      success: function (res) {
        var pics = { pics: res.tempFilePaths }
        console.log(JSON.stringify(pics))
        console.log(encodeURIComponent(JSON.stringify(pics)))
        wx.navigateTo({
          url: '/pages/moment/index?pics=' + encodeURIComponent(JSON.stringify(pics)),
        })
      },
    })
  },
  goMenuDetail: function (e) {
    var menuId = e.currentTarget.dataset.menuid
    wx.navigateTo({
      url: '/pages/menu/detail?menuId=' + menuId,
    })
  },
  showInputBox: function (e) {
    var that = this
    util.checkLogin(true, function () {
      commentMenuId = e.currentTarget.dataset.menuid
      var changed = that.data.list
      var favors = []
      for (var i in changed) {
        if (changed[i].id == commentMenuId) {
          favors = changed[i].favors
          break
        }
      }
      var userinfo = wx.getStorageSync('userinfo')
      var userId = userinfo.id
      var favored = false
      for (var j in favors) {
        if (userId == favors[j].userId) {
          favored = true
          break
        }
      }
      that.setData({ showInputBox: true, inputfocus: true, favored: favored })
    })
  },
  favorSend: function () {
    var that = this
    util.checkLogin(true, function () {
      var session = wx.getStorageSync('session')
      util.GET(app.globalData.host + '/CookBook/favorMenu', { session: session, menuId: commentMenuId, favored: that.data.favored }, function (res) {
        if (res && res.code == 1) {
          var userinfo = wx.getStorageSync('userinfo')
          var changed = that.data.list
          if (that.data.favored) {
            var userId = userinfo.id
            for (var i in changed) {
              if (changed[i].id == commentMenuId) {
                for (var j in changed[i].favors) {
                  if (changed[i].favors[j].userId = userId) {
                    changed[i].favors.splice(j, 1)
                  }
                }
              }
            }
            util.showToast('取消成功', 'success')
          } else {
            for (var i in changed) {
              if (changed[i].id == commentMenuId) {
                var addFavor = { userId: userinfo.id, userName: userinfo.nickName }
                changed[i].favors.unshift(addFavor)
              }
            }
            util.showToast('点赞成功', 'success')
          }


          that.setData({ list: changed, showInputBox: false, inputfocus: false })

        } else {
          util.showToast('点赞失败', 'error')
        }
      });
    })
  },
  commentSend: function (e) {
    var that = this
    if (!e.detail.value || e.detail.value === '') {
      util.showToast('随便说点吧~', 'warn')
      return;
    }
    var comment = e.detail.value
    util.checkLogin(true, function () {
      var session = wx.getStorageSync('session')
      util.GET(app.globalData.host + '/CookBook/commentMenu', { session: session, menuId: commentMenuId, comment: comment }, function (res) {
        if (res && res.code == 1) {
          util.showToast('评论成功', 'success')
          var changed = that.data.list
          for (var i in changed) {
            if (changed[i].id == commentMenuId) {
              var userinfo = wx.getStorageSync('userinfo')
              var addComments = { userName: userinfo.nickName, userAvatar: userinfo.avatarUrl, comment: comment, timeDesc: '刚刚' }
              changed[i].comments.unshift(addComments)
            }
          }
          that.setData({ list: changed, showInputBox: false, inputfocus: false })

        } else {
          util.showToast('评论失败', 'error')
        }
      });
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
  onShow: function (options) {
    sendMonentLongTap = 0
    var that = this
    minId = 0;
    that.setData({ W: util.getSysInfo().windowWidth })
    util.GET(app.globalData.host + '/CookBook/listShareMenu', { minId: 0, lastId: 0, num: num }, function (res) {
      if (res && res.code == 1 && res.data.length > 0) {
        that.setData({ list: res.data })
      }
      if (!that.data.list || that.data.list.length == 0) {
        return
      }
      var len = that.data.list.length
      minId = that.data.list[len - 1].id
      lastId = that.data.list[0].id
    })
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

    util.GET(app.globalData.host + '/CookBook/listShareMenu', { minId: 0, num: num, lastId: lastId }, function (res) {
      if (res && res.code == 1 && res.data.length > 0) {
        var append = that.data.list
        for (var i = res.data.length; i > 0; i--) {
          append.unshift(res.data[i - 1])
        }
        that.setData({ list: append })
      } else {

      }
      if (!that.data.list || that.data.list.length == 0) {
        return
      }
      var len = that.data.list.length

      minId = that.data.list[len - 1].id
      lastId = that.data.list[0].id
      setTimeout(function () { wx.stopPullDownRefresh() }, 300)
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this

    that.setData({ onloading: true, nomore: false })

    util.GET(app.globalData.host + '/CookBook/listShareMenu', { minId: minId, lastId: 0, num: num }, function (res) {
      if (res && res.code == 1 && res.data.length > 0) {
        var append = that.data.list
        for (var i in res.data) {
          append.push(res.data[i])
        }
        that.setData({ list: append })

      } else {
        that.setData({ nomore: true })
      }
      that.setData({ onloading: false })
      if (!that.data.list || that.data.list.length == 0) {
        return
      }
      var len = that.data.list.length
      minId = that.data.list[len - 1].id
      lastId = that.data.list[0].id
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})