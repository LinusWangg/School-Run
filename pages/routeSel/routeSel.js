var app = getApp();
Page({
  data: {
    runTrace: [],
    cardCur: 0,
    swiperList: [{
      id: 0,
      base_id: "0001",
      map_setting:{
        latitude: 23.099994,
        longitude: 113.324520,
        markers: [{
          id: 1,
          latitude: 23.099994,
          longitude: 113.324520,
          name: 'T.I.T 创意园'
        }],
        covers: [{
          latitude: 23.099994,
          longitude: 113.344520,
          iconPath: '/image/location.png'
          }, {
          latitude: 23.099994,
          longitude: 113.304520,
          iconPath: '/image/location.png'
        }],
        scroll: false
      }
    }, {
      id: 1,
      base_id: "0002",
      map_setting:{
        latitude: 23.099994,
        longitude: 113.324520,
        markers: [{
          id: 1,
          latitude: 23.099994,
          longitude: 113.324520,
          name: 'T.I.T 创意园'
        }],
        covers: [{
          latitude: 23.099994,
          longitude: 113.344520,
          iconPath: '/image/location.png'
          }, {
          latitude: 23.099994,
          longitude: 113.304520,
          iconPath: '/image/location.png'
        }],
        scroll: false
      }
    }, {
      id: 2,
      base_id: "0003",
      map_setting:{
        latitude: 23.099994,
        longitude: 113.324520,
        markers: [{
          id: 1,
          latitude: 23.099994,
          longitude: 113.324520,
          name: 'T.I.T 创意园'
        }],
        covers: [{
          latitude: 23.099994,
          longitude: 113.344520,
          iconPath: '/image/location.png'
          }, {
          latitude: 23.099994,
          longitude: 113.304520,
          iconPath: '/image/location.png'
        }],
        scroll: false
      }
    }],
    
  },
  onShow: function () {
    var that = this
    wx.request({
      url: app.globalData.serverUrl+'run/runTrace',
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success:function(res){
        that.setData({
          runTrace:res.data.data,
        })
      },
    })
  },
  onReady: function (e) {
    this.mapCtx = wx.createMapContext('myMap')
  },
  onLoad() {
    console.log(this.data.swiperList)
    this.towerSwiper('swiperList');
    // 初始化towerSwiper 传已有的数组名即可
  },
  // cardSwiper
  cardSwiper(e) {
    this.setData({
      cardCur: e.detail.current
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
  }
})