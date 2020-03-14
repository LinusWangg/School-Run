//index.js
//获取应用实例
const app = getApp()
const CookieUtil=require('../../utils/cookie.js')
Page({
  data: {
    warn:'',
    isSubmit:false,
    motto: 'Hello User',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true,
        isSubmit:app.globalData.submit,
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            isSubmit:app.globalData.submit,
            userInfo: res.userInfo,
            hasUserInfo: true,
          })
        }
      })
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            isSubmit: app.globalData.submit,
            userInfo: res.userInfo,
            hasUserInfo: true,
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
    wx.login({
      success: function (res) {
        var code = res.code
        var appid = app.globalData.appid
        wx.request({
          url: app.globalData.serverUrl + app.globalData.apiVersion + '/flash',
          method: 'POST',
          data: {
            code: code,
            appid: appid,
          },
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            wx.showToast({
              title: '授权成功',
            })
            var cookie = CookieUtil.getSessionIDFromResponse(res)
            CookieUtil.setCookieToStorage(cookie)
            console.log(res)
            app.globalData.stdid = res.data.data.student_id
            app.globalData.submit = res.data.data.is_register
            app.globalData.openid = res.data.data.open_id
            console.log(app.globalData.stdid)
            console.log(app.globalData.submit)
            console.log(app.globalData.openid)
          }
        })
      }
    })
  },
  formsubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value);
    let { student_id } = e.detail.value;
    if (!student_id) {
      this.setData({
        warn: "手机号或密码为空！",
        isSubmit: true
      })
      return;
    }
    this.setData({
      warn: "",
      isSubmit: true,
      student_id,
    })
    app.globalData.stdid=e.detail.value
    app.globalData.submit=true
  },
  authorize: function(){
    wx.login({
      success:function(res)
      {
        var code=res.code
        var appid=app.globalData.appid
        var student_id=app.globalData.stdid
        var is_submit=app.globalData.submit
        wx.request({
          url: app.globalData.serverUrl+app.globalData.apiVersion+'/authorize',
          method:'POST',
          data:{
            code:code,
            appid:appid,
            student_id:student_id,
            is_submit:is_submit,
          },
          header:{
            'content-type':'application/json'
          },
          success:function(res){
            wx.showToast({
              title: '授权成功',
            })
            var cookie=CookieUtil.getSessionIDFromResponse(res)
            CookieUtil.setCookieToStorage(cookie)
            console.log(cookie)
          }
        })
        wx.request({
          url: app.globalData.serverUrl + app.globalData.apiVersion + '/user',
          method:'GET',
          header: {
            'content-type': 'application/json'
          },
          success(res){
            console.log(res.data)
          }
        })
      }
    })
  },
})
