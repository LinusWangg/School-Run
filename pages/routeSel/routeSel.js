var app = getApp();
var data;
Page({
  data: {
    isValid: false,
    cardCur: 0,
    idCur: "",
    swiperList: [],
  },
  onShow: function () {
    var that = this;
    var swiperList = [];
    wx.request({
      url: app.globalData.serverUrl + 'run/runTrace',
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        data = res.data.data;
        if(data != null && data.length) {
          for(var i = 0; i < data.length; i++) {
            var tmp = {
              id: swiperList.length,
              base_id: data[i].id,
              map_setting: {
                latitude: 31.938116613805835,
                longitude: 118.79199706295856,
                scale: 15,
                scroll: false,
                polyline: [{
                  points: data[i].trace,
                  colorList: ["#4eb947", "#55ba46", "#5cbb45", "#63bd44", "#6abe43", "#71bf42", "#78c141", "#7fc240", "#86c43f"],
                  width: 7,
                  start: true,
                  dottedLine: false,
                  arrowLine: true
                }],
              }
            };

            swiperList.push(tmp);
          }
          that.setData({
            swiperList: swiperList,
            isValid: true,
            idCur: swiperList[0].base_id
          })
        }
        else {
          that.setData({
            isValid: false,
          })
        }
      },
    })
  },
  onReady: function (e) {
    this.mapCtx = wx.createMapContext('myMap');
  },
  onLoad() {
    this.towerSwiper('swiperList');
    if (this.data.swiperList != null && this.data.swiperList.length) {
      this.setData({
        idCur: this.data.swiperList[0].base_id
      })
    }
    // 初始化towerSwiper 传已有的数组名即可
  },
  // cardSwiper
  cardSwiper(e) {
    this.setData({
      cardCur: e.detail.current,
      idCur: this.data.swiperList[e.detail.current].base_id
    })
  },
  // towerSwiper
  // 初始化towerSwiper
  towerSwiper(name) {
    let list = this.data[name];
    for (let i = 0; i < list.length; i++) {
      list[i].zIndex = parseInt(list.length / 2) + 1 - Math.abs(i - parseInt(list.length / 2))
      list[i].mLeft = i - parseInt(list.length / 2)
    }
    this.setData({
      swiperList: list
    })
  },
  // towerSwiper触摸开始
  towerStart(e) {
    this.setData({
      towerStart: e.touches[0].pageX
    })
  },
  // towerSwiper计算方向
  towerMove(e) {
    this.setData({
      direction: e.touches[0].pageX - this.data.towerStart > 0 ? 'right' : 'left'
    })
  },
  // towerSwiper计算滚动
  towerEnd(e) {
    let direction = this.data.direction;
    let list = this.data.swiperList;
    if (direction == 'right') {
      let mLeft = list[0].mLeft;
      let zIndex = list[0].zIndex;
      for (let i = 1; i < list.length; i++) {
        list[i - 1].mLeft = list[i].mLeft
        list[i - 1].zIndex = list[i].zIndex
      }
      list[list.length - 1].mLeft = mLeft;
      list[list.length - 1].zIndex = zIndex;
      this.setData({
        swiperList: list
      })
    } else {
      let mLeft = list[list.length - 1].mLeft;
      let zIndex = list[list.length - 1].zIndex;
      for (let i = list.length - 1; i > 0; i--) {
        list[i].mLeft = list[i - 1].mLeft
        list[i].zIndex = list[i - 1].zIndex
      }
      list[0].mLeft = mLeft;
      list[0].zIndex = zIndex;
      this.setData({
        swiperList: list
      })
    }
  },
  jump_location: function(event) {
    wx.navigateTo({
      url: '/pages/location/location?trace='+JSON.stringify(data[event.currentTarget.dataset.index].trace)+'&id='+event.currentTarget.dataset.id,
    })
  }
})