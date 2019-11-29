//index.js
const app = getApp()

Page({
  data: {
    inputValue: ''
  },
  onLoad: function () {
    //
    app.plog('1', SKEY);
    wx.getStorage({
      key: 'key',
      success(res) {
        console.log(res.data)
      }
    })

    //获取openid
    wx.cloud.callFunction({
      name: 'login',
      complete: res => {
        app.globalData.openid = res.result.openid;
        app.plog('info', app.globalData.openid);
      }
    })
  },

  //获取用户信息
  onGetUserInfo: function (e) {
    app.plog('info', e.detail.userInfo.avatarUrl);
    if (e.detail.userInfo) {
      app.globalData.avatarUrl = e.detail.userInfo.avatarUrl;
      app.globalData.userInfo = e.detail.userInfo;

      wx.setStorage({ key: "key", data: this.data.inputValue == '' ? 'visitor' : this.data.inputValue});
      if(this.data.inputValue === 'lovecici'){   //验证登陆的key值
        app.globalData.isOwner = true;
      }else{
        app.globalData.isOwner = false;
      }
      //跳转到下一页

    }
  },

  //key输入框的值
  bindKeyInput: function (e) {
    this.setData({
      inputValue: e.detail.value
    })
  },
})
