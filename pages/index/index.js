//index.js
//获取应用实例
const app = getApp()

var openid = ''

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    totalSignIn:"0",
  },

  //事件处理函数 
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  onLoad: function () {
    console.log("it's onLoad function");
    try {
      var time = String(wx.getStorageSync('totalSignIn'));
      if(time)
      {
        this.setData({
          totalSignIn:time,
        })

        console.log("SignIn" + time)
        console.log(time)
      }
    } catch (e) {
      console.log("getStorage Error");
      this.setData({
        totalSignIn:"0",
      })
    }
  },

  onShow: function () {
    console.log("it's onShow function");

    try {
      var time = String(wx.getStorageSync('totalSignIn'));
      if(time)
      {
        this.setData({
          totalSignIn:time,
        })

        console.log("SignIn" + time)
      }
    } catch (e) {
      console.log("getStorage Error" + time);

      this.setData({
        totalSignIn:"0",
      })
    }
  },

  getUserInfo: function (e) {
    console.log(e)
    console.log(openid)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
