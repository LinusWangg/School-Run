//app.js
App({
  /**
   * 当小程序初始化时候，触发onLaunch()
   */
  onLaunch: function (options) {
    // 初次打开时的操作
    console.log(options);
    console.log("王烨文辣是真的牛皮！！！");
    
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },

  /**
   * 当小程序从后台到前台时候，才触发
   */
  onShow: function(options) {
    console.log("王烨文带我们走向辉煌！！！");
    console.log("wywnb");
    console.log(options);
  },

  /**
   * 页面找不到出错处理
   */
  onPageNotFound: function(res) {
    //小程序打开的页面不存在时需要执行的代码
    wx.redirectTo({
      url: 'pages/test/test'
    })
  },

  /**
   * onLoad()函数
   */
  onLoad: function(options) {
    //使用this关键字获取全局变量
    consoel.log(this.globalData.userInfo)
  },

  globalData: {
    userInfo: null
  }
})