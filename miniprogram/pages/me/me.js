// miniprogram/pages/me/me.js
const db = wx.cloud.database();
const users = db.collection("users");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    user: {},
    petInfo: {
      name: "",
      age: "",
      sex: "",
      describe: ""
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    wx.getStorage({
      key: "user",
      success: (res) => {
        this.setData({
          user: res.data
        })
        wx.getStorage({
          key: "petInfo",
          success: (res) => {
            this.setData({
              petInfo: res.data
            })
          },
          fail: (err) => {
            users.where({
                openid: this.data.user.openid
              }).get()
              .then((res) => {
                // console.log(res);
                if(!res.data[0].petInfo){
                  return;
                }
                wx.setStorage({
                  key: "petInfo",
                  data: res.data[0].petInfo
                })
                this.setData({
                  petInfo: res.data[0].petInfo
                })
              })
          }
        })
      },
      fail() {
        wx.redirectTo({
          url: '/pages/auth/auth',
        })
      }
    })
  },
  addPets() {
    wx.navigateTo({
      url: '/pages/me/addPet/addPet?type=add',
    })
  },
  loginOut(){
    wx.clearStorage({
      success: (res) => {
        wx.redirectTo({
          url: '/pages/auth/auth',
        })
      },
    })
  }
})