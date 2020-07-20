// pages/location/location.js
var app = getApp();
var countTooGetLocation = 0;
var total_micro_second = 0;
var startRun = 0;
var totalSecond = 0;
var oriMeters = 0.0;
var oriPoints = [];
var id = 0;


/**
 *毫秒级倒计时
 */
function count_down(that) {

  if (startRun == 0) {
    return;
  }

  if (countTooGetLocation >= 100) {
    var time = date_format(total_micro_second);
    that.updateTime(time);
  }

  if (countTooGetLocation >= 3000) { //1000为1s
    that.getLocation();
    countTooGetLocation = 0;
  }


  setTimeout
  setTimeout(function () {
    countTooGetLocation += 10;
    total_micro_second += 10;
    count_down(that);
  }
    , 10
  )
}

/*
*时间格式化输出，如03:25:19 86。每10ms都会调用一次
*/
function date_format(micro_second) {
  // 秒数
  var second = Math.floor(micro_second / 1000);
  // 小时位
  var hr = Math.floor(second / 3600);
  // 分钟位
  var min = fill_zero_prefix(Math.floor((second - hr * 3600) / 60));
  // 秒位
  var sec = fill_zero_prefix((second - hr * 3600 - min * 60));// equal to => var sec = second % 60;


  return hr + ":" + min + ":" + sec + " ";
}


function getDistance(lat1, lng1, lat2, lng2) {
  var dis = 0;
  var radLat1 = toRadians(lat1);
  var radLat2 = toRadians(lat2);
  var deltaLat = radLat1 - radLat2;
  var deltaLng = toRadians(lng1) - toRadians(lng2);
  var dis = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(deltaLat / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(deltaLng / 2), 2)));
  return dis * 6378137;

  function toRadians(d) { return d * Math.PI / 180; }
}

function fill_zero_prefix(num) {
  return num < 10 ? "0" + num : num
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    clock: '',
    isLocation: false,
    latitude: 0,
    longitude: 0,
    markers: [],
    meters: 0.00,
    time: "0:00:00",
    polyline: [{
      points: oriPoints,
      color:"#00FF00",
      width: 8,
      start: true,
      dottedLine: false
    }],
  },
  onLoad: function(options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.getLocation()
    id = options.id;
    console.log("onLoad")
    console.log(startRun)
    count_down(this);
    this.setData({
      start: false,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  //****************************
  startRun: function () {
    if (startRun == 1) {
      return;
    }
    startRun = 1;
    this.setData({
      start: true
    })
    
    count_down(this);
    this.getLocation();
  },


  //****************************
  stopRun: function () {
    startRun = 0;
    count_down(this);

    this.setData({
      start: false
    })
  },


  //****************************
  clearRun: function () {
    startRun = 0;
    var that = this;
    var timestamp = Date.parse(new Date());

    //获取当前时间  
    var date = new Date(timestamp);
    //月  
    var month = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    //日  
    var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    wx.showModal({
      title: '提示',
      content: '是否结束并提交？',
      confirmText: '确定',
      cancelText: '取消',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定');
          count_down(this);
          wx.request({
            url: app.globalData.serverUrl + 'run' + '/Trace',
            method: 'POST',
            data: {
              id: id,
              open_id: app.globalData.openid,
              student_id: app.globalData.stdid,
              points: oriPoints,
              length: oriMeters,
              time_cost: total_micro_second,
              month: month,
              day: day,
            },
            header: {
              'content-type': 'application/json'
            },
            success: function (res) {
              console.log(that.time)
            }
          })
          countTooGetLocation = 0;
          total_micro_second = 0;
          startRun = 0;
          totalSecond = 0;
          oriMeters = 0.0;
          oriPoints = [];
          that.setData({
            start: false,
            clock: '',
            isLocation: false,
            latitude: 0,
            longitude: 0,
            markers: [],
            meters: 0.00,
            time: "0:00:00",
            polyline: [{
              points: oriPoints,
              color: "#00FF00",
              width: 8,
              arrowLine: true,
              dottedLine: false
            }],
          })

          wx.showToast({
            title: '成功',
            icon: 'success',
            duration: 2000
          });

        } //end if
        else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },


  //****************************
  updateTime: function (time) {
    var data = this.data;
    data.time = time;
    this.data = data;
    this.setData({
      time: time,
    })

  },


  //****************************
  getLocation: function () {
    var that = this
    wx.getLocation({

      type: 'gcj02', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
      success: function (res) {
        console.log("res----------")
        console.log(res)
        
        var newMarker = {
          latitude: res.latitude,
          longitude: res.longitude,
          iconPath: '../../iconPicture/dot.png',
          width: 10,
          height: 10
        }

        var newPoint = {
          latitude: res.latitude,
          longitude: res.longitude
        }

        var oriMarkers = that.data.markers;

        console.log("oriMeters----------")
        console.log(oriMeters);

        var point_len = oriPoints.length;
        var markers_len = oriMarkers.length;

        var lastPoint;
        var lastMarker;

        if (point_len == 0) {
          oriPoints.push(newPoint);
        }

        if (markers_len == 0) {
          oriMarkers.push(newMarker);
        }
        
        markers_len = oriMarkers.length;
        point_len = markers_len;

        var lastPoint = oriPoints[point_len - 1];
        var lastMarker = oriMarkers[markers_len - 1];

        console.log("oriMarkers----------")
        console.log(oriMarkers, markers_len);

        var newMeters = getDistance(lastMarker.latitude, lastMarker.longitude, res.latitude, res.longitude) / 1000;

        if (newMeters < 0.0015) {
          newMeters = 0.0;
        }

        oriMeters = oriMeters + newMeters;
        console.log("newMeters----------")
        console.log(newMeters);


        var meters = new Number(oriMeters);
        var showMeters = meters.toFixed(2);

        oriPoints.push(newPoint);
        oriMarkers.push(newMarker);

        that.setData({
          latitude: res.latitude,
          longitude: res.longitude,
          markers: oriMarkers,
          meters: showMeters,
          polyline: [{
            points: oriPoints,
            color:"#00FF00",
            width: 8,
            dottedLine: false
        }],
        });
      },
      
      fail: function () {
        wx.getSetting({
          success: function (res) {
            var statu = res.authSetting;
            if (!statu['scope.userLocation']) {
                wx.showModal({
                    title: '是否授权当前位置',
                    content: '需要获取您的地理位置，请确认授权，否则地图功能将无法使用',
                    success: function (tip) {
                        if (tip.confirm) {
                            wx.openSetting({
                                success: function (data) {
                                    if (data.authSetting["scope.userLocation"] === true) {
                                        wx.showToast({
                                            title: '授权成功',
                                            icon: 'success',
                                            duration: 1000
                                        })
                                        //授权成功之后，再调用chooseLocation选择地方
                                        wx.chooseLocation({
                                            success: function(res) {
                                                obj.setData({
                                                    addr: res.address
                                                })
                                            },
                                        })
                                    } else {
                                        wx.showToast({
                                            title: '授权失败',
                                            icon: 'success',
                                            duration: 1000
                                        })
                                    }
                                }
                            })
                        }
                    }
                })
            }
        },
        fail: function (res) {
            wx.showToast({
                title: '调用授权窗口失败',
                icon: 'success',
                duration: 1000
            })
        }
        })
      }
    })
  }
})