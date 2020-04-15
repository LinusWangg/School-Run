//logs.js
var app = getApp();
//使用MD5进行加密
var utilMd5 = require('../../utils/md5.js');

Page({
  data: {
    show: "",
    code: "",//测试用
    flag: false,
    latitude: 0,
    longitude: 0,
  },

  onLoad: function () {
    console.log('onLoad')
  },
  click: function () {
    var that = this;
    var timestamp=Date.parse(new Date());
    var n=timestamp;
    var date=new Date(n);
    var m=date.getMinutes();
    var show;
    //获取当前时间戳  
    var timestamp = Date.parse(new Date());

    //获取当前时间  
    var date = new Date(timestamp);
    //年  
    var year = date.getFullYear();
    //月  
    var month = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    //日  
    var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    //时  
    var hour = date.getHours();
    //分  
    var min = date.getMinutes();
    var latitude;
    var longitude;
    //加密规则
    //扫描二维码
    wx.getLocation({
      type: "wgs84",
      success: function (res) {
        latitude = res.latitude
        longitude = res.longitude
        that.setData({
          latitude: latitude,
          longitude: longitude,
        })
      }
    }),
    wx.scanCode({
      success: (res) => {
        wx.request({
          url: app.globalData.serverUrl+'daily'+'/check',
          method:'POST',
          data: {
            open_id: app.globalData.openid,
            student_id: app.globalData.stdid,
            hour:hour,
            minute:min,
            code:res.result,
            latitude: latitude,
            longitude: longitude,
          },
          header: {
            'content-type': 'application/json'
          },
          success: function (res){
            if(res.data.data.is_post==false&&res.data.data.result==true)
            {
              wx.showToast({
                title: '成功',
                icon: 'success',
                duration: 2000
              })
            }
            else if (res.data.data.is_post == false && res.data.data.result == false)
            {
              wx.showToast({
                title: '失败',
                icon: 'failure',
                duration: 2000
              })
            }
            else if (res.data.data.is_post==true)
            {
              wx.showToast({
                title: '不需要重复打卡',
                icon: 'success',
                duration: 2000
              })
            }
          }
        })
        this.setData({
          flag:true,
        })
    },
      //调取扫码接口失败
    fail: (res) => {
      wx.showToast({
        title: '失败',
        icon: 'success',
        duration: 2000
      })
    },
    //调取扫码接口后操作（无论成功失败）
    complete: (res) => {
    }
  })
  },
})