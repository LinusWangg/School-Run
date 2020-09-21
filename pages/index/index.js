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
var runperSign = 0;

Page({
  ...Canvas.options,
  data: {
    ...Canvas.data,
    userInfo: {},
    hasUserInfo: false,
    student: {},
    isLogIn: false,
    perSign:0,
    runperSign:0,
    iconList: [{
      icon: 'notificationfill',
      color: 'green',
      badge: 0,
      name: '通知',
      bindtap: 'jump_notice'
    },{
      icon: 'play_forward_fill',
      color: 'green',
      badge: 0,
      name: '查询线路',
      bindtap: 'jump_checkroute'
    },{
      icon: 'squarecheckfill',
      color: 'green',
      badge: 0,
      name: '打卡',
      bindtap: 'jump_logs'
    },{
      icon: 'activityfill',
      color: 'green',
      badge: 0,
      name: '体能',
      bindtap: 'jump_location'
    },{
      icon: 'infofill',
      color: 'green',
      badge: 0,
      name: '信息',
      bindtap: 'jump_info'
    }],
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
        runperSign = parseInt(100*student.runtime/total);
        perSign = parseInt(100*student.time/total);
        app.globalData.openid = student.open_id;
        app.globalData.stdid = student.student_id;
        that.setData({
          student:student,
          isLogIn:true,
          perSign:perSign,
          runperSign:runperSign,
        });
      } else {
        student = {
          is_register: false,
          name: "未知用户",
          open_id: "未知open_id",
          school: "未知学校",
          student_id: "未知ID",
          time: 0,
          runtime: 0,
        };
        that.setData({
          student:student,
          isLogIn:false,
        })
      }
    } catch (e) {
      student.time = 0,
      student.runtime = 0,
      that.setData({
        student:student,
        isLogIn:false,
      })
    }

  },

  onShow: function (options) {
    let that = this;
    console.log('onshow');
    that.setData({
      total:total,
    });
    try {
      console.log(app.globalData.signToday);
      console.log(app.globalData.signPlusToday);
      if(app.globalData.signToday==true&&app.globalData.signPlusToday==false)
      {
        student = wx.getStorageSync('student-info');
        student.time = student.time+1;
        app.globalData.signPlusToday=true;
        app.globalData.signToday=false;
        wx.setStorageSync('student-info', student);
        console.log("setStorage Success");
      }
      if(app.globalData.runsignToday==true&&app.globalData.runsignPlusToday==false)
      {
        student = wx.getStorageSync('student-info');
        student.runtime = student.runtime+1;
        app.globalData.runsignPlusToday=true;
        app.globalData.runsignToday=false;
        wx.setStorageSync('student-info', student);
        console.log("setStorage Success");
      }
      student = wx.getStorageSync('student-info');
      if(student) {
        perSign = parseInt(100*student.time/total);
        runperSign = parseInt(100*student.runtime/total);
        that.setData({
          student:student,
          isLogIn:true,
          perSign:perSign,
          runperSign:runperSign,
        })
      } else {
        student = {
          is_register: false,
          name: "未知用户",
          open_id: "未知open_id",
          school: "未知学校",
          student_id: "未知ID",
          time: 0,
          runtime: 0,
        };
        that.setData({
          student:student,
          isLogIn:false,
        })
      }
    } catch (e) {
      student.time = 0;
      student.runtime = 0;
      that.setData({
        student:student,
        isLogIn:false,
      })
    }

  },

  /** 下拉刷新 **/
  onPullDownRefresh () {
    wx.stopPullDownRefresh();
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
  },

  jump_notice: function() {
    wx.switchTab({
      url: '/pages/Notice/Notice',
    })
  },

  jump_checkroute: function() {
    wx.navigateTo({
      url: '/pages/checkroute/checkroute',
    })
  },

  jump_logs: function() {
    wx.switchTab({
      url: '/pages/logs/logs',
    })
  },

  jump_location: function() {
    wx.switchTab({
      url: '/pages/routeSel/routeSel',
    })
  },

  jump_info: function() {
    wx.navigateTo({
      url: '/pages/preIndex/preIndex',
    })
  }
})
