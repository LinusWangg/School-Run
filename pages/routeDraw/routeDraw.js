// pages/routeDraw/routeDraw.js
var app = getApp();
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
        that.setData({
          'polyline.points':res.data.data,
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