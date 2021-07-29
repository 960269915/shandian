const app = getApp();
const db = wx.cloud.database();
const users = db.collection("users")
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo:"",
    showBtn:false
  },
  onLoad(){
    wx.getStorage({
      key:"user",
      success(res){
        wx.switchTab({
          url: '/pages/index/index',
        })
      },
      fail(err){
        this.showBtn = true;
      }
    })
  },
  onGetUserInfo(e) {
    app.globalData.user = {
      ...e.detail.userInfo
    }
    if(!e.detail.userInfo){
      wx.showToast({
        title: '请同意授权',
        icon:"error",
        duration: 2000 //持续的时间
      })
      return;
    }
    wx.cloud.callFunction({
      name: "login",
      data: {
        cloudID: e.detail.cloudID
      },
      success: res => {
        app.globalData.user.openid = res.result.openid;
        users.where({
            _openid: app.globalData.user.openid
          })
          .get()
          .then((res) => {
            let userData = new app.globalData.model.User(app.globalData.user)
            if (!res.data.length) {
              users.add({
                data: userData
              }).then(() => {
                wx.showToast({
                  title: '授权成功',
                  icon: 'success',
                  duration: 2000 //持续的时间
                })
                wx.setStorage({
                  key:"user",
                  data:userData,
                  success(){
                    wx.switchTab({
                      url: '/pages/index/index',
                    })
                  }
                })
              })
            } else {
              wx.switchTab({
                url: '/pages/index/index',
              })
            }
          })
      },
      fail: err => {
        wx.showToast({
          title: '授权失败，请重试',
          icon: 'fail',
          duration: 2000 //持续的时间
        })
      }
    })
  }
})