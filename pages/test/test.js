Page({
  data: {
    latitude: 31.938116613805835,
    longitude: 118.79199706295856,
    polygon: [{
      points: [{
        latitude: 31.939602862664927,
        longitude: 118.78792736411503
      }, {
        latitude: 31.94043986767247,
        longitude: 118.79167972107587
      }],
      strokeColor: "#00FF00",
      strokeWidth: 5
    },
    {
      points: [{
        latitude: 31.940712802693543,
        longitude: 118.79258028662696
      }, {
        latitude: 31.940985736487306,
        longitude: 118.79646129536502
      }],
      strokeColor: "#00FF00",
      strokeWidth: 5
    },
    {
      points: [{
        latitude: 31.940712802693543,
        longitude: 118.79258028662696
      }, {
        latitude: 31.940985736487306,
        longitude: 118.79646129536502
      }],
      strokeColor: "#00FF00",
      strokeWidth: 5
    },],
    scroll: true
  },
  onReady: function (e) {
    this.mapCtx = wx.createMapContext('myMap')
  },
  onLoad() {},
})

// points: [{
//   latitude: 31.939602862664927,
//   longitude: 118.78792736411503
// }, {
//   latitude: 31.94043986767247,
//   longitude: 118.79167972107587
// }, {
//   latitude: 31.940712802693543,
//   longitude: 118.79258028662696
// }, {
//   latitude: 31.940985736487306,
//   longitude: 118.79646129536502
// }, {
//   latitude: 31.940858367595563,
//   longitude: 118.79708311470984
// }, {
//   latitude: 31.94053084582504,
//   longitude: 118.79751195514052
// }, {
//   latitude: 31.94018512778267,
//   longitude: 118.797855027747
// }, {
//   latitude: 31.939147965296982,
//   longitude: 118.79791935427
// }, {
//   latitude: 31.938893221826383,
//   longitude: 118.797855027747
// }, {
//   latitude: 31.938074398754605,
//   longitude: 118.79806944796235
// }, {
//   latitude: 31.936127390127474,
//   longitude: 118.798412519914
// }, {
//   latitude: 31.93567247583651,
//   longitude: 118.7979622381821
// }, {
//   latitude: 31.935581492458084,
//   longitude: 118.79761916557561
// }, {
//   latitude: 31.935272149075836,
//   longitude: 118.7950246784161
// }, {
//   latitude: 31.93496280465255,
//   longitude: 118.79330931595666
// }, {
//   latitude: 31.93496280465255,
//   longitude: 118.79330931595666
// }, {
//   latitude: 31.935272149075836,
//   longitude: 118.7950246784161
// }, {
//   latitude: 31.935581492458084,
//   longitude: 118.79761916557561
// }, {
//   latitude: 31.93567247583651,
//   longitude: 118.7979622381821
// }, {
//   latitude: 31.936127390127474,
//   longitude: 118.798412519914
// }, {
//   latitude: 31.938074398754605,
//   longitude: 118.79806944796235
// }, {
//   latitude: 31.938893221826383,
//   longitude: 118.797855027747
// }, {
//   latitude: 31.939147965296982,
//   longitude: 118.79791935427
// }, {
//   latitude: 31.94018512778267,
//   longitude: 118.797855027747
// }, {
//   latitude: 31.94053084582504,
//   longitude: 118.79751195514052
// }, {
//   latitude: 31.940858367595563,
//   longitude: 118.79708311470984
// }, {
//   latitude: 31.940985736487306,
//   longitude: 118.79646129536502
// }, {
//   latitude: 31.940712802693543,
//   longitude: 118.79258028662696
// }, {
//   latitude: 31.94043986767247,
//   longitude: 118.79167972107587
// }, {
//   latitude: 31.939602862664927,
//   longitude: 118.78792736411503
// }],