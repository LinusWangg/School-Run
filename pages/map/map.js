
var amapFile = require('../../libs/amap-wx.js');    //高德地图配置文件 
Page({
  data: {
    src: ''
  },
  onLoad: function() {
    var that = this;
    var myAmapFun = new amapFile.AMapWX({key:"dd382e60f63f03ec6da64156b7051e88"});
    wx.getSystemInfo({
      success: function(data){
        var height = data.windowHeight;
        var width = data.windowWidth;
        var size = width + "*" + height;
        myAmapFun.getStaticmap({
          zoom: 8,
          size: size,
          scale: 2,
          markers: "mid,0xFF0000,A:116.37359,39.92437;116.47359,39.92437",
          success: function(data){
            that.setData({
              src: data.url
            })
          },
          fail: function(info){
            wx.showModal({title:info.errMsg})
          }
        })

      }
    })
    
  }
})