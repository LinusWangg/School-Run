//index.js
//获取应用实例
import Canvas from '../../utils/canvas.js'

const app = getApp()

var openid = ''

var student = {};

var timestamp = Date.parse(new Date());
var date = new Date(timestamp);
var total = date.getMonth()+1 <= 6 ? 30:20;

var perSign = 0;

Page({
  ...Canvas.options,
  data: {
    ...Canvas.data,
    userInfo: {},
    hasUserInfo: false,
    student: {},
    isLogIn: false,
    perSign:0,
  },

  //事件处理函数 
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  onLoad: function (options) {
    let that = this;
    console.log("it's onLoad function");
    console.log(typeof student.time);

    
    console.log(total);
    that.setData({
      total:total,
    });

    try {
      student = wx.getStorageSync('student-info');
      if(student) {
        perSign = parseInt(100*student.time/total);
        app.globalData.openid = student.open_id;
        app.globalData.stdid = student.student_id;
        that.setData({
          student:student,
          isLogIn:true,
          perSign:perSign,
        });
      } else {
        student = {
          is_register: false,
          name: "未知用户",
          open_id: "未知open_id",
          school: "未知学校",
          student_id: "未知ID",
          time: 0,
        };
        that.setData({
          student:student,
          isLogIn:false,
        })
      }
    } catch (e) {
      student.time = 0,
      that.setData({
        student:student,
        isLogIn:false,
      })
    }

  },

  onShow: function (options) {
    let that = this;

    that.setData({
      total:total,
    });
    try {
      student = wx.getStorageSync('student-info');
      if(student) {
        perSign = parseInt(100*student.time/total);
        that.setData({
          student:student,
          isLogIn:true,
          perSign:perSign,
        })
      } else {
        student = {
          is_register: false,
          name: "未知用户",
          open_id: "未知open_id",
          school: "未知学校",
          student_id: "未知ID",
          time: 0,
        };
        that.setData({
          student:student,
          isLogIn:false,
        })
      }
    } catch (e) {
      student.time = 0;
      that.setData({
        student:student,
        isLogIn:false,
      })
    }

  },

  getUserInfo: function (e) {
    let that = this;
    console.log(e)
    console.log(openid)
    app.globalData.userInfo = e.detail.userInfo
    that.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
