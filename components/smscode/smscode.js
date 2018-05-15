// components/smscode/smscode.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    sendUrl: {
      type: String,
      value: ''
    },
    mobile:String
  },

  /**
   * 组件的初始数据
   */
  data: {
    sendBtnText: '发送短信',
    sent: false
  },
  /**
   * 组件的方法列表
   */
  methods: {
    inputMobile: function (e) {
      this.setData({ mobile: e.detail.value })
    },
    inputSmsCode: function (e) {
      this.setData({ smsCode: e.detail.value })
      var myEventDetail = {mobile:this.data.mobile,code:this.data.smsCode}
      var myEventOption = {}     
      this.triggerEvent('smscode-blur', myEventDetail, myEventOption) 
    },
    sendSmsCode: function () {
      var that = this
     // console.log(this.data.mobile, this.data.smsCode)
      if (!this.data.mobile || this.data.mobile.length !=11){
        wx.showToast({
          title: '手机号码有误',
          image:'/images/no_0.png'
        })
        return
      }
      wx.request({
        url: that.data.sendUrl,
        data: { mobile: that.data.mobile },
        complete: function (res) {
          if (res && res.statusCode == 200) {
            wx.showToast({
              title: '发送成功',
            })
            that.setData({ sent: true, count: 60, sendBtnText: '60s后可重发' })
            var t = setInterval(function () {
              var current = that.data.count - 1;
             // console.log(current)
              if (current <= 0) {
                that.setData({ sent: false, count: 60, sendBtnText: '发送短信' })
                clearInterval(t)
              } else {
                that.setData({ sent: true, count: current, sendBtnText: that.data.count + 's后可重发' })
              }
            }, 1000)
          }else{
            wx.showToast({
              title: '发送失败',
              image: '/images/no_0.png'
            })
          }
        }
      })
    }
  }
})
