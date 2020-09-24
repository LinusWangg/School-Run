// pages/logup/logup.js
import Toast from '../../miniprogram_npm/vant-weapp/toast/toast';

//获取应用实例
const app = getApp();
const CookieUtil = require('../../utils/cookie.js');
var student = {};

Page({
  /**
   * 页面的初始数据
   */
  data: {
    success: false,
    showPopup: false,
    multiArray: [
      ['南京航空航天大学', '王烨文牛逼大学'],
      ['将军路校区', '明故宫校区', '溧阳校区', '江北校区']
    ],
    multiIndex: [0, 0],
    id_empty: false,
    name_empty: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},

  MultiChange(e) {
    this.setData({
      multiIndex: e.detail.value
    })
  },
  MultiColumnChange(e) {
    let data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    console.log(e.detail.column);
    switch (e.detail.column) {
      case 0:
        console.log(data.multiIndex);
        switch (data.multiIndex[0]) {
          case 0:
            data.multiArray[1] = ['将军路校区', '明故宫校区', '溧阳校区', '江北校区'];
            break;
          case 1:
            data.multiArray[1] = ['月球校区', '火星校区'];
            break;
        }
        case 1:
          console.log(data.multiIndex);

          switch (data.multiIndex[0]) {
            case 0:
              data.multiArray[1] = ['将军路校区', '明故宫校区', '溧阳校区', '江北校区'];
              break;
            case 1:
              data.multiArray[1] = ['月球校区', '火星校区'];
              break;
          }
    }
    this.setData(data);
  },
  formSubmit: function (e) {

    var that = this;
    if (e.detail.value["id"] == null || e.detail.value["id"] == "") {
      Toast('学号为空！');
    } else if (e.detail.value["name"] == null || e.detail.value["name"] == "") {
      Toast('姓名为空！');
    } else {
      //code类似微信密钥，来向app.weixin.com请求openid，一个code只能使用一次
      //onelogin, one request push code
      wx.login({
        success: function (res) {
          var code = res.code
          var appid = app.globalData.appid
          var student_id = app.globalData.stdid
          var school = app.globalData.school
          var name = app.globalData.name
          var is_submit = app.globalData.submit
          wx.request({
            url: app.globalData.serverUrl + app.globalData.apiVersion + '/authorize',
            method: 'POST',
            data: {
              code: code,
              appid: appid,
              student_id: e.detail.value["id"],
              school: that.data.multiArray[0][that.data.multiIndex[0]] + that.data.multiArray[1][that.data.multiIndex[1]],
              name: e.detail.value["name"],
              is_submit: true,
            },
            header: {
              'content-type': 'application/json'
            },
            success: function (res) {
              var cookie = CookieUtil.getSessionIDFromResponse(res);
              CookieUtil.setCookieToStorage(cookie);
              console.log("cookie: ", cookie);
              console.log("res: ", res);
              that.setData({
                hiddenmodalput: true,
              })
              Toast.success({
                message: '注册成功',
                duration: 1000,
                forbidClick: true
              });
              setTimeout(function() {
                wx.switchTab({
                  url: '/pages/index/index',
                })
              }, 1000)
            },
            error: function () {
              Toast.fail({
                message: '注册失败',
                duration: 1000
              })
            }
          })
        }
      })
    }
  }
})