/* components/circle/circle.js */
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  properties: {
    draw: {//画板元素名称id
      type: String,
      value: 'draw'
    },
    per:{ //百分比 通过此值转换成step
      type: String,
      value: '0'
    },
    r:{//半径
      type: String,
      value: '50'   
    }

  },

  data: { /*  私有数据，可用于模版渲染 */
    step: 1, //用来算圆的弧度0-2
    size:0, //画板大小
    screenWidth:750, //实际设备的宽度
    txt:0
  },
  methods: {

    /**
     * el:画圆的元素
     * r:圆的半径
     * w:圆的宽度
     * 功能:画背景
     */
    drawCircleBg: function (el, r, w) {
      const ctx = wx.createCanvasContext(el,this);
      ctx.setLineWidth(w);// 设置圆环的宽度
      ctx.setStrokeStyle('#E5E5E5'); // 设置圆环的颜色
      ctx.setLineCap('round') // 设置圆环端点的形状
      ctx.beginPath();//开始一个新的路径
      ctx.arc(r, r, r - w, 0, 2 * Math.PI, false);
      //设置一个原点(110,110)，半径为100的圆的路径到当前路径
      ctx.stroke();//对当前路径进行描边
      ctx.draw();

    },
        /**
     * el:画圆的元素
     * r:圆的半径
     * w:圆的宽度
     * step:圆的弧度 (0-2)
     * 功能:彩色圆环
     */
    drawCircle: function (el, r, w, step) {
      var context = wx.createCanvasContext(el,this);
      // 设置渐变
      var gradient = context.createLinearGradient(2 * r, r, 0);
      gradient.addColorStop("0", "#2661DD");
      gradient.addColorStop("0.5", "#40ED94");
      gradient.addColorStop("1.0", "#5956CC");
      context.setLineWidth(w);
      context.setStrokeStyle(gradient);
      context.setLineCap('round')
      context.beginPath();//开始一个新的路径
      // step 从0到2为一周
      context.arc(r, r, r - w, -Math.PI / 2, step * Math.PI - Math.PI / 2, false);
      context.stroke();//对当前路径进行描边
      context.draw()
    }

  },

  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function () { 
      const _this = this;
      //获取屏幕宽度
      wx.getSystemInfo({
        success: function(res) {
          _this.setData({
            screenWidth: res.windowWidth
          });
        },
      });

      //初始化
      const el = _this.data.draw; //画板元素
      const per = _this.data.per; //圆形进度
      const r = Number(_this.data.r); //圆形半径
      
      _this.setData({
        step: (2 * Number(_this.data.per)) / 100,
        txt: _this.data.per
      });


      //获取屏幕宽度(并把真正的半径px转成rpx)
      let rpx = (_this.data.screenWidth / 750) * r;
      //计算出画板大小
      this.setData({
        size: rpx * 2
      });
      const w = 4;//圆形的宽度

      //组件入口,调用下面即可绘制 背景圆环和彩色圆环。
      _this.drawCircleBg(el + 'bg', rpx, w);//绘制 背景圆环
      _this.drawCircle(el, rpx, w, _this.data.step);//绘制 彩色圆环

    }

  },

  observers: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    'per': function () {
      const _this = this;
      //获取屏幕宽度
      wx.getSystemInfo({
        success: function (res) {
          _this.setData({
            screenWidth: res.windowWidth
          });
        },
      });

      //初始化
      const el = _this.data.draw; //画板元素
      const per = _this.data.per; //圆形进度
      const r = Number(_this.data.r); //圆形半径

      _this.setData({
        step: (2 * Number(_this.data.per)) / 100,
        txt: _this.data.per
      });


      //获取屏幕宽度(并把真正的半径px转成rpx)
      let rpx = (_this.data.screenWidth / 750) * r;
      //计算出画板大小
      this.setData({
        size: rpx * 2
      });
      const w = 4;//圆形的宽度

      //组件入口,调用下面即可绘制 背景圆环和彩色圆环。
      _this.drawCircleBg(el + 'bg', rpx, w);//绘制 背景圆环
      _this.drawCircle(el, rpx, w, _this.data.step);//绘制 彩色圆环

    }
  }


})