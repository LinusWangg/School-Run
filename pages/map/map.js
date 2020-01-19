// map.js
function getUserLocation() {
  wx.getSetting({
    success(res) {
      if (res.authSetting['scope.userLocationBackground']==false) {
        wx.authorize({
          scope: 'scope.userLocation',
          success: (res) => {
              console.log('成功：' , res)
          },
          fail: (res) => {
              console.log('失败：', res)
          },
        })
      }
      else{
        wx.startLocationUpdateBackground({
          success: (res) => {
            console.log('startLocationUpdate-res', res)
          },
          fail: (err) => {
            console.log('startLocationUpdate-err', err)
          }
        })
      } 
      // else {
        if (res.authSetting['scope.userLocation']==false) {
          wx.authorize({
            scope: 'scope.userLocation',
            success: (res) => {
                console.log('成功：' , res)
            },
            fail: (res) => {
                console.log('失败：', res)
            },
          })
        } else {
          wx.startLocationUpdateBackground({
            success: (res) => {
              console.log('startLocationUpdate-res', res)
            },
            fail: (err) => {
              console.log('startLocationUpdate-err', err)
            }
          })
        }
      // }
    }
  })
}
Page({
  data: {
    markers: [],
    longitude: 0,
    latitude: 0,
    // polyline: [{
    //   points: [{
    //     longitude: 113.3245211,
    //     latitude: 23.10229
    //   }, {
    //     longitude: 113.324520,
    //     latitude: 23.21229
    //   }],
    //   color:"#FF0000DD",
    //   width: 2,
    //   dottedLine: true
    // }],
  },
  regionchange(e) {
    // console.log(e.type)
  },
  markertap(e) {
    // console.log(e.markerId)
  },
  controltap(e) {
    // console.log(e.controlId)
  },
  onShow: function () {
    getUserLocation();
    const _locationChangeFn = res=> {
      this.latitude = res.latitude;
      this.longitude = res.longitude;
      console.log('location change', res.latitude, res.longitude)
    }
    wx.onLocationChange(_locationChangeFn);
  },
})