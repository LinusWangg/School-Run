// pages/routeDraw/routeDraw.js
import Toast from '../../miniprogram_npm/vant-weapp/toast/toast';
var app = getApp();
var time= require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:0,  //本次展示的路线在数据库中的id
    points:[],
    polyline: [{
      points: [],
      color:"#00FF00",
      width: 8,
      start: true,
      dottedLine: false
    }],
    latitude:0,
    longitude:0,
    min:0,
    sec:0,
    post_time:0,
    distance:0,
  },
  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      app.globalData.tempid = options.id
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
    var that = this
    wx.request({
      url: app.globalData.serverUrl+'run/Draw',
      method: 'POST',
      data:{
        dataid : app.globalData.tempid
      },
      header: {
        'content-type': 'application/json'
      },
      success:function(res){
        console.log(res.data.data)
        that.setData({
          ["polyline["+ 0 +"].points"]:res.data.data['trace'],
          latitude:res.data.data['trace'][parseInt(res.data.data['trace'].length/2)].latitude,
          longitude:res.data.data['trace'][parseInt(res.data.data['trace'].length/2)].longitude,
          time_cost:res.data.data['time_cost'],
          min:parseInt(res.data.data['time_cost']/60000)%60,
          sec:parseInt(res.data.data['time_cost']/1000)%60,
          post_time:time.formatTimeTwo(res.data.data['post_time'],'Y-M-D h:m:s'),
          distance:res.data.data['distance'].toFixed(2),
        })
      },
    })
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

  }
})