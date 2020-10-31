// pages/logup/logup.js
//获取应用实例
const app = getApp()
const CookieUtil=require('../../utils/cookie.js')

var time= require("../../utils/util.js");
Page({
  /**
   * 页面的初始数据
   */
  data:{
    Trace_List : [],
  },
  onShow:function(){
    var that = this
    //获取当前时间戳  
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
        var i=0;
        for(i=0;i<res.data.data.length;i++)
        {
          res.data.data[i][3] = time.formatTimeTwo(res.data.data[i][3],'Y-M-D h:m:s');
          res.data.data[i][4] = [parseInt(res.data.data[i][4]/60000)%60,parseInt(res.data.data[i][4]/1000)%60];
        }
        that.setData({
          Trace_List : res.data.data,
        })
      },
    })
  }
})