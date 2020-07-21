// pages/location/location.js

var countTooGetLocation = 0;
var total_micro_second = 0;
var startRun = 0;
var totalSecond = 0;
var oriMeters = 0.0;

var oriPoints = [];
var smoothPoints = [];

var accuracyList = [];



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

//试运行的去毛刺办法--线性平滑
function LinearSmooth(smoothPoints,newPoint) {
  smoothPoints.push(newPoint);
  var len = smoothPoints.length;

  if(len < 7) {
      ;
  }
  else if (len == 7) {
    smoothPoints[0].latitude = (13 * smoothPoints[0].latitude + 10 * smoothPoints[1].latitude + 7 * smoothPoints[2].latitude + 4 * smoothPoints[3].latitude + smoothPoints[4].latitude - 2 * smoothPoints[5].latitude - 5 * smoothPoints[6].latitude) / 28;
    smoothPoints[0].longitude = (13 * smoothPoints[0].longitude + 10 * smoothPoints[1].longitude + 7 * smoothPoints[2].longitude + 4 * smoothPoints[3].longitude + smoothPoints[4].longitude - 2 * smoothPoints[5].longitude - 5 * smoothPoints[6].longitude) / 28;
    
    smoothPoints[1].latitude = (5 * smoothPoints[0].latitude + 4 * smoothPoints[1].latitude + 3 * smoothPoints[2].latitude + 2 * smoothPoints[3].latitude + smoothPoints[4].latitude - smoothPoints[6].latitude) / 14;
    smoothPoints[1].longitude = (5 * smoothPoints[0].longitude + 4 * smoothPoints[1].longitude + 3 * smoothPoints[2].longitude + 2 * smoothPoints[3].longitude + smoothPoints[4].longitude - smoothPoints[6].longitude) / 14;
    
    smoothPoints[2].latitude = (7 * smoothPoints[0].latitude + 6 * smoothPoints[1].latitude + 5 * smoothPoints[2].latitude + 4 * smoothPoints[3].latitude + 3 * smoothPoints[4].latitude + 2 * smoothPoints[5].latitude + smoothPoints[6].latitude) / 28;
    smoothPoints[2].longitude = (7 * smoothPoints[0].longitude + 6 * smoothPoints[1].longitude + 5 * smoothPoints[2].longitude + 4 * smoothPoints[3].longitude + 3 * smoothPoints[4].longitude + 2 * smoothPoints[5].longitude + smoothPoints[6].longitude) / 28;
  }
  else
  {
    smoothPoints[len - 4].latitude = (smoothPoints[len - 7].latitude + smoothPoints[len - 6].latitude + smoothPoints[len - 5].latitude + smoothPoints[len - 4].latitude + smoothPoints[len - 3].latitude + smoothPoints[len - 2].latitude + smoothPoints[len - 1].latitude) / 7;
    smoothPoints[len - 4].longitude = (smoothPoints[len - 7].longitude + smoothPoints[len - 6].longitude + smoothPoints[len - 5].longitude + smoothPoints[len - 4].longitude + smoothPoints[len - 3].longitude + smoothPoints[len - 2].longitude + smoothPoints[len - 1].longitude) / 7;
    
    smoothPoints[len - 3].latitude = (7 * smoothPoints[len - 1].latitude + 6 * smoothPoints[len - 2].latitude + 5 * smoothPoints[len - 3].latitude + 4 * smoothPoints[len - 4].latitude + 3 * smoothPoints[len - 5].latitude + 2 * smoothPoints[len - 6].latitude + smoothPoints[len - 7].latitude) / 28;
    smoothPoints[len - 3].longitude = (7 * smoothPoints[len - 1].longitude + 6 * smoothPoints[len - 2].longitude + 5 * smoothPoints[len - 3].longitude + 4 * smoothPoints[len - 4].longitude + 3 * smoothPoints[len - 5].longitude + 2 * smoothPoints[len - 6].longitude + smoothPoints[len - 7].longitude) / 28;
    
    smoothPoints[len - 2].latitude = (5 * smoothPoints[len - 1].latitude + 4 * smoothPoints[len - 2].latitude + 3 * smoothPoints[len - 3].latitude + 2 * smoothPoints[len - 4].latitude + smoothPoints[len - 5].latitude - smoothPoints[len - 7].latitude) / 14;
    smoothPoints[len - 2].longitude = (5 * smoothPoints[len - 1].longitude + 4 * smoothPoints[len - 2].longitude + 3 * smoothPoints[len - 3].longitude + 2 * smoothPoints[len - 4].longitude + smoothPoints[len - 5].longitude - smoothPoints[len - 7].longitude) / 14;
    
    smoothPoints[len - 1].latitude = (13 * smoothPoints[len - 1].latitude + 10 * smoothPoints[len - 2].latitude + 7 * smoothPoints[len - 3].latitude + 4 * smoothPoints[len - 4].latitude + smoothPoints[len - 5].latitude - 2 * smoothPoints[len - 6].latitude - 5 * smoothPoints[len - 7].latitude) / 28;
    smoothPoints[len - 1].longitude = (13 * smoothPoints[len - 1].longitude + 10 * smoothPoints[len - 2].longitude + 7 * smoothPoints[len - 3].longitude + 4 * smoothPoints[len - 4].longitude + smoothPoints[len - 5].longitude - 2 * smoothPoints[len - 6].longitude - 5 * smoothPoints[len - 7].longitude) / 28;
  }
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
  onLoad: function() {
    // 页面初始化 options为页面跳转所带来的参数
    this.getLocation()
    // console.log("onLoad")
    // console.log(startRun)
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

    wx.showModal({
      title: '提示',
      content: '是否结束并提交？',
      confirmText: '确定',
      cancelText: '取消',

      success(res) {
        if (res.confirm) {
          console.log('用户点击确定');
          console.log("精度列表",accuracyList);
          count_down(this);
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
            accuracy:0,
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
    var that = this;
    wx.getLocation({

      type: 'gcj02', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
      success: function (res) {
        console.log("res----------")
        console.log(res.accuracy)
        accuracyList.push(res.accuracy);
        
        var newMarker = {
          latitude: res.latitude,
          longitude: res.longitude,
          iconPath: '../../iconPicture/tab001.jpg',
          width: 10,
          height: 10
        }

        var newPoint = {
          latitude: res.latitude,
          longitude: res.longitude
        }

        var oriMarkers = that.data.markers;
        var point_len = oriPoints.length;

        var lastPoint;
        var lastMarker;

        if (point_len == 0) {
          oriPoints.push(newPoint);
          smoothPoints.push(newPoint);
          oriMarkers.push(newMarker);
          console.log("==0");
        }
        else {
          console.log(">0");
          point_len = oriPoints.length;

          var lastPoint = oriPoints[point_len - 1];
          var lastMarker = oriMarkers[point_len - 1];
          oriMarkers[point_len - 1].iconPath = '../../iconPicture/dot.png';

          var newMeters = getDistance(lastMarker.latitude, lastMarker.longitude, res.latitude, res.longitude) / 1000;

          if (newMeters < 0.0015) {
            newMeters = 0.0;
          }

          if(newMeters < 48.0) {
            oriPoints.push(newPoint);
            //LinearSmooth(smoothPoints, newPoint);
            smoothPoints.push(newPoint);
            oriMarkers.push(newMarker);
            oriMeters = oriMeters + newMeters;
          }
        }

        var meters = new Number(oriMeters);
        var showMeters = meters.toFixed(2);

        that.setData({
          latitude: res.latitude,
          longitude: res.longitude,
          markers: oriMarkers,
          meters: showMeters,
          accuracy:res.accuracy,
          polyline: [{
            points: oriPoints,
            color:"#00FF00",
            width: 5,
            dottedLine: false
        }],
        polygon:[{
          points:smoothPoints,
          strokeColor:"#0000FF",
          strokeWidth:10,
        }],
        settings: {
            showLocation:false,
        },

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