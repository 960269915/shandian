// miniprogram/pages/me/signupInfo/signupInfo.js
const db = wx.cloud.database();
const users = db.collection("users")
const user = wx.getStorageSync('user')

Page({
  /**
   * 页面的初始数据
   */
  data: {
    job:"",
    age:"",
    haveHome:"",
    sex:"",
    otherText:"",
    contact:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    users.where({
        "_openid":user.openid
    }).get()
    .then(res=>{
      if(res.data.length && res.data[0].signupInfo){
        this.setData({
          job:res.data[0].signupInfo.job,
          age:res.data[0].signupInfo.age,
          haveHome:res.data[0].signupInfo.haveHome,
          sex:res.data[0].signupInfo.sex,
          otherText:res.data[0].signupInfo.otherText,
          contact:res.data[0].signupInfo.contact
        })
      }
    })
  },
  postForm(){
    if(!this.data.job || !this.data.age || this.data.haveHome == '' || this.data.sex=='' || !this.data.otherText || !this.data.contact){
      wx.showToast({
        title: '请完善信息',
        icon:"error"
      })
      return
    }
    users.where({
        "_openid":user.openid
    }).update({
      data:{
        signupInfo:{
          job:this.data.job,
          age:this.data.age,
          haveHome:this.data.haveHome,
          sex:this.data.sex,
          otherText:this.data.otherText,
          contact:this.data.contact
        }
      }
    }).then(res=>{
      wx.showToast({
        title: '保存成功',
        success(){
          wx.navigateBack({
            delta: 1,
          })
        }
      })
    })
  }
})