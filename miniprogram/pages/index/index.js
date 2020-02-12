//index.js
const app = getApp();
const db = wx.cloud.database();

Page({
  data: {
    inputValue: '',
    isLogin: false,
    msg: '还没有记录?\n快去添加你的另一半吧'
  },
  onLoad: function () {
    //获取key值
    wx.getStorage({
      key: 'loginInfo',
      success: res => {
        app.globalData.key = res.data.key;
        app.globalData.avatarUrl = res.data.avatarUrl;
        app.globalData.nickName = res.data.nickName;
        this.setData({
          isLogin: true
        });
        this.loadMsg();
      },
      fail: err => {
        this.setData({
          isLogin: false
        })
      }
    })

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
      if(this.data.inputValue === 'lovecici'){   //验证登陆的key值
        app.globalData.avatarUrl = e.detail.userInfo.avatarUrl;
        app.globalData.nickName = e.detail.userInfo.nickName;
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
        let loinfo = {
          key: app.globalData.key,
          avatarUrl: app.globalData.avatarUrl,
          nickName: app.globalData.nickName
        };
        wx.setStorage({ key: "loginInfo", data: loinfo });
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

  //获取记录的天数
  loadMsg: function(){
    // this.setData({
    //   msg: ''
    // })

    //两秒后跳转到下一页
    setTimeout(function(){
      wx.navigateTo({ url: '../home/index' });
    },2000);
  }
})
