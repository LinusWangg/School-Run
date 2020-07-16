// pages/logup/logup.js
//获取应用实例
const app = getApp()
const CookieUtil=require('../../utils/cookie.js')

Page({
  /**
   * 页面的初始数据
   */
  data:{
    Trace_List : [],
  },
  onShow:function(){
    var that = this
    wx.request({
      url: app.globalData.serverUrl+'run/getmine',
      method: 'POST',
      data:{
        student_id : app.globalData.stdid,
        open_id : app.globalData.openid,
      },
      header: {
        'content-type': 'application/json'
      },
      success:function(res){
        that.setData({
          Trace_List : res.data.data,
        })
      },
    })
  }
})