// pages/Notice/Notice.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content_list: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.request({
      url: app.globalData.serverUrl + 'forum/content_list',
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var data = res.data.data;
        if (data) {
          for (var i = 0; i < data.length; i++) {
            data[i][3] = data[i][3].slice(0, 10);
          }
          console.log(data);
        } else {
          data = null;
        }
        that.setData({
          content_list: data,
        })
      },
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

  /** 下拉刷新 **/
  onPullDownRefresh() {
    wx.stopPullDownRefresh();
  },

  showModal(e) {
    console.log(e);
    this.setData({
      modalName: e.currentTarget.dataset.target,
      title: e.currentTarget.dataset.title,
      content: e.currentTarget.dataset.content,
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
})