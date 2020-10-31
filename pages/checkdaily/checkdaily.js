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
    Daily_List : [],
  },
  onShow:function(){
    var that = this
    //获取当前时间戳  
    wx.request({
      url: app.globalData.serverUrl+'daily/getmine',
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
        console.log(res.data.data);
        if(res.data.data)
        {
          for(i=0;i<res.data.data.length;i++)
          {
            res.data.data[i][2] = time.formatTimeTwo(res.data.data[i][2],'Y-M-D h:m:s');
          }
          that.setData({
            Daily_List : res.data.data,
          })
        }
        else
        {
          that.setData({
            Daily_List : null,
          })
        }
      },
    })
  }
})