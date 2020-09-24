//index.js
//获取应用实例
import Canvas from '../../utils/canvas.js';
import Toast from '../../miniprogram_npm/vant-weapp/toast/toast';

const app = getApp()

var openid = ''

var student = {};

var timestamp = Date.parse(new Date());
var date = new Date(timestamp);
var total = date.getMonth() + 1 <= 6 ? 30 : 20;

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
    perSign: 0,
    runperSign: 0,
    code: '',
    iconList: [{
      icon: 'notificationfill',
      color: 'green',
      badge: 0,
      name: '通知',
      bindtap: 'jump_notice'
    }, {
      icon: 'play_forward_fill',
      color: 'green',
      badge: 0,
      name: '查询线路',
      bindtap: 'jump_checkroute'
    }, {
      icon: 'squarecheckfill',
      color: 'green',
      badge: 0,
      name: '打卡',
      bindtap: 'jump_logs'
    }, {
      icon: 'activityfill',
      color: 'green',
      badge: 0,
      name: '体能',
      bindtap: 'jump_location'
    }, {
      icon: 'infofill',
      color: 'green',
      badge: 0,
      name: '信息',
      bindtap: 'jump_info'
    }, {
      icon: 'warnfill',
      color: 'green',
      badge: 0,
      name: '测试',
      bindtap: 'jump_test'
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
      total: total,
    });

    try {
      student = wx.getStorageSync('student-info');
      if (student) {
        runperSign = parseInt(100 * student.runtime / total);
        perSign = parseInt(100 * student.time / total);
        app.globalData.openid = student.open_id;
        app.globalData.stdid = student.student_id;
        that.setData({
          student: student,
          isLogIn: true,
          perSign: perSign,
          runperSign: runperSign,
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
          student: student,
          isLogIn: false,
        })
      }
    } catch (e) {
      student.time = 0,
        student.runtime = 0,
        that.setData({
          student: student,
          isLogIn: false,
        })
    }

  },

  onShow: function (options) {
    let that = this;
    console.log('onshow');
    that.setData({
      total: total,
    });
    try {
      console.log(app.globalData.signToday);
      console.log(app.globalData.signPlusToday);
      if (app.globalData.signToday == true && app.globalData.signPlusToday == false) {
        student = wx.getStorageSync('student-info');
        student.time = student.time + 1;
        app.globalData.signPlusToday = true;
        app.globalData.signToday = false;
        wx.setStorageSync('student-info', student);
        console.log("setStorage Success");
      }
      if (app.globalData.runsignToday == true && app.globalData.runsignPlusToday == false) {
        student = wx.getStorageSync('student-info');
        student.runtime = student.runtime + 1;
        app.globalData.runsignPlusToday = true;
        app.globalData.runsignToday = false;
        wx.setStorageSync('student-info', student);
        console.log("setStorage Success");
      }
      student = wx.getStorageSync('student-info');
      console.log("student:", student);
      if (student) {
        perSign = parseInt(100 * student.time / total);
        runperSign = parseInt(100 * student.runtime / total);
        that.setData({
          student: student,
          isLogIn: true,
          perSign: perSign,
          runperSign: runperSign,
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
          student: student,
          isLogIn: false,
        })
      }
    } catch (e) {
      student.time = 0;
      student.runtime = 0;
      that.setData({
        student: student,
        isLogIn: false,
      })
    }

  },

  /** 下拉刷新 **/
  onPullDownRefresh() {
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

  jump_notice: function () {
    wx.switchTab({
      url: '/pages/Notice/Notice',
    })
  },

  jump_checkroute: function () {
    // wx.navigateTo({
    //   url: '/pages/checkroute/checkroute',
    // })
    Toast.fail("未开通功能！");
  },

  jump_logs: function () {
    wx.switchTab({
      url: '/pages/logs/logs',
    })
  },

  jump_location: function () {
    wx.switchTab({
      url: '/pages/routeSel/routeSel',
    })
  },

  jump_info: function () {
    // wx.navigateTo({
    //   url: '/pages/preIndex/preIndex',
    // })
    Toast.fail("未开通功能！");
  },

  jump_test: function () {
    // wx.navigateTo({
    //   url: '/pages/test/test',
    // })
    Toast.fail("未开通功能！");
  },

  login: function () {
    var that = this;
    var stud = wx.getStorageSync('student-info');
    if (!stud) {
      console.log(1);
      wx.login({
        success: function (res) {
          var code = res.code
          var appid = app.globalData.appid
          that.setData({
            code: res.code,
          })
          wx.request({
            url: app.globalData.serverUrl + app.globalData.apiVersion + '/getinfo',
            method: 'POST',
            data: {
              code: code,
              appid: appid,
            },
            header: {
              'content-type': 'application/json'
            },
            success: function (res) {
              if (res.data.data.is_register == false) {
                app.globalData.submit = true;
                Toast.fail({
                  message: '您尚未注册',
                  duration: 2000,
                  forbidClick: true
                });
                setTimeout(function () {
                  wx.navigateTo({
                    url: '../logup/logup',
                  })
                }, 2000);

              } else if (res.data.data.is_register == true) {
                app.globalData.openid = res.data.data.open_id
                app.globalData.stdid = res.data.data.student_id
                app.globalData.is_register = res.data.data.is_register
                app.globalData.Totaltime = res.data.data.time
                app.globalData.runTotaltime = res.data.data.runtime

                var student = res.data.data
                //本地存储
                try {
                  wx.setStorageSync('student-info', student);
                  console.log("setStorage Success");
                } catch (e) {
                  console.log("setStorage Error");
                }
                Toast.success({
                  message: '登录成功',
                  duration: 2000
                });
                setTimeout(function () {
                  that.onLoad();
                }, 2000);
              }
            }
          })
        }
      })
    } else {
      console.log(2);
      app.globalData.openid = stud.open_id
      app.globalData.stdid = stud.student_id
      app.globalData.is_register = stud.is_register
      app.globalData.Totaltime = stud.time
      app.globalData.runTotaltime = stud.runtime
    }
  },

  logup: function () {
    var that = this;
    wx.login({
      success: function (res) {
        var code = res.code
        var appid = app.globalData.appid
        that.setData({
          code: res.code,
        })
        wx.request({
          url: app.globalData.serverUrl + app.globalData.apiVersion + '/getinfo',
          method: 'POST',
          data: {
            code: code,
            appid: appid,
          },
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            if (res.data.data.is_register == false) {
              app.globalData.submit = true
              wx.navigateTo({
                url: '../logup/logup',
              })
            } else if (res.data.data.is_register == true) {
              app.globalData.openid = res.data.data.open_id
              app.globalData.stdid = res.data.data.student_id
              app.globalData.is_register = res.data.data.is_register
              app.globalData.Totaltime = res.data.data.time
              app.globalData.runTotaltime = res.data.data.runtime

              var student = res.data.data
              //本地存储
              try {
                wx.setStorageSync('student-info', student);
                console.log("setStorage Success");
              } catch (e) {
                console.log("setStorage Error");
              }
              that.onLoad();
            }
          }
        })
      }
    })
  }
})