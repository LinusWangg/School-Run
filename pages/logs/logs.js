//logs.js
var app = getApp();
//使用MD5进行加密
var utilMd5 = require('../../utils/md5.js');

Page({
  data: {
    show: "",
    code: "",//测试用
  },

  onLoad: function () {
    console.log('onLoad')
  },
  click: function () {
    var that = this;
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
    //加密规则
    var password = "nuaa-001-"+year.toString()+month.toString()+day.toString()+hour.toString()+(Math.trunc(min/10)).toString();
  
    var password = utilMd5.hexMD5(password);
    //调试用
    console.log(password);
    //扫描二维码
    wx.scanCode({
      success: (res) => {
        this.show = "二维码编码:\n" + res.result + "\n二维码类型:\n" + res.scanType + "\n字符集:\n" + res.charSet + "\n路径:\n" + res.path + "\n";
        that.setData({
          show: this.show,
          code:"\n客户端编码:\n"+password
        })
      
        if(res.result == password)    //扫码且比对成功
        {
          wx.showToast({
            title: '成功',
            icon: 'success',
            duration: 2000
          })
        }
        else                          //比对失败
        {
          wx.showModal({
            title: '扫码结果',
            content: '扫码失败，请在正确的时间地点扫描！',
          })
        }
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
  }
})