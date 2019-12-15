//index.js
const app = getApp();
const db = wx.cloud.database();

Page({
  data: {
    inputValue: ''
  },
  onLoad: function () {
    //获取key值
    // wx.getStorage({
    //   key: 'key',
    //   success(res) {
    //     console.log(res.data);
    //     app.globalData.key = res.data;
    //   }
    // })

    //获取openid
    wx.cloud.callFunction({
      name: 'login',
      complete: res => {
        app.globalData.openid = res.result.openid;
      }
    })
  },

  //获取用户信息
  onGetUserInfo: function (e) {
    if (e.detail.userInfo) {
      app.globalData.avatarUrl = e.detail.userInfo.avatarUrl;
      app.globalData.nickName = e.detail.userInfo.nickName;

      console.log(e.detail.userInfo);

      if(this.data.inputValue === 'lovecici'){   //验证登陆的key值
        wx.setStorage({ key: "key", data: this.data.inputValue });
        app.globalData.key = this.data.inputValue;
        this.register();
      }else{
        wx.showToast({
          title: '请输入正确的key值',
          icon: 'none'
        })
      }
    }
  },

  //注册用户信息
  register: function(){
    db.collection('user').doc(app.globalData.openid).set({
      data: {
        nickName: app.globalData.nickName,
        avatar: app.globalData.avatarUrl,
        key: app.globalData.key
      },
      success: res => {
        //跳转到下一页
        wx.navigateTo({ url: '../home/index' });
      },
      fail: err => {
        console.log(err);
        wx.showToast({
          title: '登录账号失败',
          icon: 'none'
        })
      }
    });
  },

  //key输入框的值
  bindKeyInput: function (e) {
    this.setData({
      inputValue: e.detail.value
    })
  },
})
