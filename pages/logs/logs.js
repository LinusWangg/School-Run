//logs.js
var app = getApp();
//使用MD5进行加密
var utilMd5 = require('../../utils/md5.js');
var timestamp;

Page({
  data: {
    show: "",
    code: "",//测试用
    flag: false,
    latitude: 0,
    longitude: 0,
    time: 24 * 60 * 60 * 1000,
    timeData: {},
    tips: 0,

  },

  onLoad: function () {
    var that = this;
    var tips = "";
    console.log('onLoad');
    var now = new Date();
    timestamp = Date.parse(now);
    now.setHours(6, 0, 0, 0);
    var start_time = Date.parse(now);
    now.setHours(24, 0, 0, 0);
    var end_time = Date.parse(now);
    if(timestamp >= start_time && timestamp <= end_time) {
      tips = 0;
      timestamp = end_time - timestamp;
    }
    else if(timestamp < start_time) {
      tips = -1;
      timestamp = start_time - timestamp;
    }
    else {
      tips = 1;
      timestamp = start_time + 24 * 3600 * 1000 - timestamp;
    }
    that.setData({
      time: timestamp,
      tips: tips
    })
  },

  click: function () {
    var that = this;
    timestamp=Date.parse(new Date());
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
            month:month,
            day:day,
            time:timestamp,
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
              app.globalData.flag=1
              app.globalData.signToday=true
              app.globalData.signPlusToday=false
            }
            else if (res.data.data.is_post == false && res.data.data.result == false)
            {
              wx.showToast({
                title: '失败',
                icon: 'failure',
                duration: 2000
              })
              app.globalData.signToday = false
            }
            else if (res.data.data.is_post==true)
            {
              wx.showToast({
                title: '不需要重复打卡',
                icon: 'success',
                duration: 2000
              })
              app.globalData.signToday = true
              app.globalData.signPlusToday=true
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

  onChange(e) {
    var hours = e.detail.hours < 10 ? '0' + e.detail.hours : '' + e.detail.hours;
    var minutes = e.detail.minutes < 10 ? '0' + e.detail.minutes : '' + e.detail.minutes;
    var seconds = e.detail.seconds < 10 ? '0' + e.detail.seconds : '' + e.detail.seconds;
    this.setData({
      timeData: {hours, minutes, seconds}
    });
  }
})
