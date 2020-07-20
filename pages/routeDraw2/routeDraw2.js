var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    start_point:0,  //本次展示的路线在数据库中的id
    end_point:0,
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
  },
  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
        app.globalData.start_point = options.start_point,
        app.globalData.end_point = options.end_point
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
      url: app.globalData.serverUrl+'run/Draw2',
      method: 'POST',
      data:{
        start_point : app.globalData.start_point,
        end_point : app.globalData.end_point,
      },
      header: {
        'content-type': 'application/json'
      },
      success:function(res){
        console.log(res.data.data)
        that.setData({
          ["polyline["+ 0 +"].points"]:res.data.data,
          latitude:res.data.data[parseInt(res.data.data.length/2)].latitude,
          longitude:res.data.data[parseInt(res.data.data.length/2)].longitude,
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