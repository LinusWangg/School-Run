//index.js
//获取应用实例
const app = getApp()
const CookieUtil=require('../../utils/cookie.js')
Page({
  data: {
    warn:'',
    isOn:false,
    motto: 'Hello User',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    hiddenmodalput:true,
    hiddeinfo:true,
    stdid:'',
    time:0,
    openid:'',
    code:'',
    imgUrls: [
      {
        url: '/images/1.jpg'
      }, {
        url: '/images/2.jpg'
      }, {
        url: '/images/3.jpg'
      }
    ],
    indicatorDots: true,  //小点
    autoplay: true,  //是否自动轮播
    interval: 3000,  //间隔时间
    duration: 3000,  //滑动时间
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
  },
  
  cancelM: function (e) {
    this.setData({
      hiddenmodalput: true,
    })
  },
  iStudent: function (e) {
    app.globalData.stdid=e.detail.value
  },
  cancelS:function(e){
    this.setData({
      hiddeinfo:true,
    })
  },
  confirmM:function(e){
    var that=this
    wx.login({
      success: function (res)
      {
        var code = res.code
        var appid = app.globalData.appid
        var student_id = app.globalData.stdid
        var is_submit = app.globalData.submit
        wx.request({
          url: app.globalData.serverUrl + app.globalData.apiVersion + '/authorize',
          method: 'POST',
          data: {
            code: code,
            appid: appid,
            student_id: student_id,
            is_submit: is_submit,
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
            console.log(cookie)
          }
        })
        that.setData({
          hiddenmodalput: true,
        })
      }
    })
  },
  GetSql:function(){
    var that=this;
    wx.login({
      success:function(res)
      {
        var code=res.code
        var appid=app.globalData.appid
        wx.request({
          url: app.globalData.serverUrl + app.globalData.apiVersion + '/getinfo',
          method:'POST',
          data:{
            code:code,
            appid:appid,
          },
          header: {
            'content-type': 'application/json'
          },
          success:function(res){
            if(res.data.data.is_register==false)
            {
              that.setData({
                hiddenmodalput:false,
              })
              app.globalData.submit=true
            }
            else if(res.data.data.is_register==true)
            {
              app.globalData.openid=res.data.data.open_id
              app.globalData.stdid=res.data.data.student_id
              app.globalData.is_register=res.data.data.is_register
              app.globalData.Totaltime=res.data.data.time
              that.setData({
                hiddeinfo:false,
                stdid: res.data.data.student_id,
                openid: res.data.data.open_id,
                time: res.data.data.time,
                isOn: res.data.data.is_register,
              })
            }
          }
        })
      }
    })
  }
})
