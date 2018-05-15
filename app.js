App({
  onLaunch: function (options) {
    console.log('options--->',options)
    try {
      wx.setStorageSync('refer', options)
    } catch (e) {
      console.log(e)
    }
  },
  globalData: {
    //wxecaa3ad929e8dfd1
    appid: 'wx9ecd278ad19f6328',
    //host: 'http://192.168.0.184:9020'
    host: 'https://weixunshi.com'
  }
})