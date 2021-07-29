// miniprogram/pages/addPet/addPet.js
const app = getApp();
const db = wx.cloud.database();
const users = db.collection("users");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    type: "",
    name: "",
    sex: "",
    openLove:"",
    age: "",
    describe: "",
    src: "",
    filename: "",
    ischange:false,
    oldImg:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      type: options.type
    })
    console.log(this.data.type);
    if (options.type == 'details') {
      wx.getStorage({
        key: "petInfo",
        success: (res) => {
          this.setData({
            name: res.data.name,
            sex: res.data.sex,
            openLove:res.data.openLove,
            age: res.data.age,
            describe: res.data.describe,
            src: res.data.file.fileid,
            oldImg:res.data.file.fileid
          })
        }
      })
    }
  },
  async chooseImg() {
    let res = await new app.globalData.file().chooseImage();
    this.setData({
      src: res.file[0],
      filename: res.name,
      ischange:true
    })
  },
  delImg() {
    this.setData({
      src: ""
    })
  },
  async postForm() {
    if (!this.data.name || this.data.sex == '' || !this.data.age || !this.data.describe || !this.data.src) {
      wx.showToast({
        title: '请正确输入值',
        icon: "error"
      })
    } else {
      const user = wx.getStorageSync("user")
      if (!user.openid) {
        wx.showToast({
          title: '获取人员信息失败，请退出重新授权',
          icon: "none"
        })
        return;
      }
      let imgInfo
      if (this.data.type == 'add' || this.data.ischange) {
        imgInfo = await new app.globalData.file().uploadFile(this.data.filename, this.data.src);
      } else {
        imgInfo = this.data.src;
      }
      users.where({
          openid: user.openid
        })
        .update({
          data: new app.globalData.model.User({
            ...user,
            petInfo: {
              name: this.data.name,
              sex: this.data.sex,
              age: this.data.age,
              openLove:this.data.openLove,
              describe: this.data.describe,
              file: {
                fileid: imgInfo
              }
            }
          })
        }).then((res) => {
          if(this.data.type == 'details' && this.data.ischange){
            new app.globalData.file().deleteFile(this.data.oldImg)
          }
          wx.setStorage({
            key: "petInfo",
            data: {
              name: this.data.name,
              sex: this.data.sex,
              openLove:this.data.openLove,
              age: this.data.age,
              describe: this.data.describe,
              file: {
                fileid: imgInfo
              }
            }
          })
          wx.showToast({
            title: '操作成功',
            icon: "none",
            duration:2000,
            success(){
              wx.switchTab({
                url: '/pages/me/me',
              })
            }
          })
        })
    }
  }
})