// pages/logup/logup.js
//获取应用实例
const app = getApp()
const CookieUtil=require('../../utils/cookie.js')

Page({
  /**
   * 页面的初始数据
   */
  data: {
    success:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  //获取学校名称
  getSchoolName: function (e) {
    app.globalData.school = e.detail.value
  },

  //获取学生学号
  getStudentID:function(e){
    app.globalData.stdid = e.detail.value
  },

  //获取学生姓名
  getStudentName:function(e){
    app.globalData.name = e.detail.value
  },

  //提交函数
  submit:function(e) {
    var that=this
    wx.login({
      success: function (res)
      {
        var code = res.code
        var appid = app.globalData.appid
        var student_id = app.globalData.stdid
        var school = app.globalData.school
        var name = app.globalData.name
        var is_submit = app.globalData.submit
        wx.request({
          url: app.globalData.serverUrl + app.globalData.apiVersion + '/authorize',
          method: 'POST',
          data: {
            code: code,
            appid: appid,
            student_id: student_id,
            school:school,
            name:name,
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
            console.log("cookie:" + cookie)
            console.log("res:" + res)
            that.setData({
              success: true,
            })
            that.onLoad()
          }
        })
      }
    })
  },

  return_home: function (e) {
    wx.navigateBack({
      delta:2
    })
 
  },

})