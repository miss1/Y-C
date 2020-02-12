// components/special/index.js
const app = getApp();
const db = wx.cloud.database();

Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    loverInfoLeft: {},
    loverInfoRight: {},
    specialDay:['fall in love 123', 'birthday 123', 'lalala 123'],
    loveInfo: '',
    animateInterval: '',
    animateClass: ''
  },

  ready: function () {
    console.log('ready');
    //获取两个用户的信息
    if (app.globalData.loverInfo) {
      this.setData({
        loverInfoLeft: app.globalData.loverInfo[0],
        loverInfoRight: app.globalData.loverInfo[1]
      })
    }else {
      this.onGetLoverInfo();
    }

    //设置纪念日期的切换及动画效果
    let animateStyle = ['fadeInDown', 'flipInX', 'fadeInUp', 'zoomIn'];
    let index = 0;
    this.setData({
      animateInterval: setInterval(() => {
        if (index >= animateStyle.length) {
          index = 0;
        } 
        let i = parseInt(Math.random() * this.data.specialDay.length)
        this.setData({
          loveInfo: this.data.specialDay[i],
          animateClass: animateStyle[index++]
        })
      }, 3000)
    })
  },

  detached: function () {
    clearInterval(this.data.animateInterval);
    console.log('delete');
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onGetLoverInfo: function () {
      db.collection('user').where({ key: "lovecici" }).get({
        success: res => {
          app.globalData.loverInfo = res.data;
          this.setData({
            loverInfoLeft: res.data[0],
            loverInfoRight: res.data[1]
          })
        },
        fail: err => {

        }
      })
    }
  }
})
