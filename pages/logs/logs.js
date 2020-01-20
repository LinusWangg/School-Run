//logs.js
var app = getApp()
Page({
  data: {
    show: "",
    longitude: 113.324520,
    latitude: 23.099994,
    markers:[{
      id: 0,
      iconPath: "../../iconPicture/tab001.jpg",
      latitude: 23.099994,
      longitude: 113.324520,
      width: 50,
      height: 50
    }]
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
    wx.scanCode({
      success: (res) => {
        this.show = "结果:" + res.result +"\n当前分钟:" + m;
        that.setData({
          show: this.show
        })
        wx.showToast({
          title: '成功',
          icon: 'success',
          duration: 2000
        })
      },
      fail: (res) => {
        wx.showToast({
          title: '失败',
          icon: 'success',
          duration: 2000
        })
      },
      complete: (res) => {
      }
    })
  },
  onLoad: function(){
    var that = this;
    wx.getLocation({
      type: "wgs84",
      success: function(res){
        var latitude = res.latitude;
        var longitude = res.longitude;
       //console.log(res.latitude);
        that.setData({
         latitude: res.latitude,
         longitude: res.longitude,
         markers:[{
           latitude: res.latitude,
           longitude: res.longitude
         }]
        })
      }
    })
  },
  onReady: function(){

  }
})