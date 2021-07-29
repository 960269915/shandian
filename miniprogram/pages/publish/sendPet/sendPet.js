
const app = getApp();
const db = wx.cloud.database();
const sendPet = db.collection("sendPet")
const users = db.collection("users")
const user = wx.getStorageSync('user')
const $ = db.command.aggregate
const _ = db.command
Page({
  /**
   * 页面的初始数据
   */
  data: {
    id: "",
    goodstype: "",
    describe: "",
    // contact: "",
    age: "",
    sex: "",
    sterilization: "",
    vaccines: "",
    requirement: "",
    src: "",
    filename: "",
    ischange: false,
    oldImg: "",
    type: "", // 新增add 编辑 edit 详情info
    activeNum: "",
    data: "",
    signupText: "报名",
    signupList: '', //领养人报名列表
    showsignupList:[],
    userInfoMsg:{},
    openid:"",
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id ? options.id : "",
      type: options.type ? options.type : 'add'
    })
    wx.hideShareMenu({
      menus: ['shareAppMessage', 'shareTimeline']
    })
    if (this.data.id) {
      this.getInfo()
      wx.showShareMenu({
        withShareTicket: true,
        menus: ['shareAppMessage', 'shareTimeline']
      })
    }
  },
  async getInfo() {
    let info
    try {
      info = await sendPet.doc(this.data.id).get();
    } catch (error) {
      wx.showToast({
        title: '获取信息失败',
        icon: "error"
      })
      return
    }

    let activeNum = info.data.activeNum + 1;
    this.setData({
      id: info.data._id,
      goodstype: info.data.goodstype,
      describe: info.data.describe,
      // contact: info.data.contact,
      src: info.data.file.fileid,
      oldImg: info.data.file.fileid,
      age: info.data.age,
      sex: info.data.sex,
      sterilization: info.data.sterilization,
      vaccines: info.data.vaccines,
      requirement: info.data.requirement,
      activeNum: activeNum,
      saveDate: info.data.date,
      date: info.data.date.getFullYear() + '-' + info.data.date.getMonth() + '-' + info.data.date.getDate(),
      signupList: info.data.signupList ? info.data.signupList : "",
      openid:info.data._openid
    })
    if (this.data.type == "info") {
      sendPet.where({
        _id: info.data._id
      }).update({
        data: {
          activeNum: _.inc(1)
        }
      })
      if(!info.data.signupList){
        return;
      }
      let arr = info.data.signupList.split(",");
      if(arr.indexOf(user.openid) > -1){
        this.setData({
          signupText:"已报名"
        })
      }
      // 字符串转arr 然后In查询 arr可以不在数据库
      users.aggregate()
      .project({
        included: $.in(['$_openid', arr]),//当前openid是否在指定的数组里面
        avatarUrl:'$avatarUrl',
      })
      .end()
      .then(res=>{
        if(res.list.length){
          this.setData({
            showsignupList:(()=>{
              return res.list.filter((item)=>{
                return item.included == true
              })
            })()
          })
        }
      })
      // 模糊查询
      // users.where({
      //   _openid:{
      //     $regex:'.*'+info.data.signupList,
      //     $options: 'i' //不区分大小写
      //   }
      // })
      // .get()
      // .then((res)=>{
      //   console.log(res);
      // })
    }
  },
 

  async postForm() {
    if (!this.data.goodstype || !this.data.describe || !this.data.src || !this.data.age || !this.data.sex || !this.data.sterilization || !this.data.vaccines || !this.data.requirement) {
      wx.showToast({
        title: '请正确输入值',
        icon: "error"
      })
    } else {
      let imgInfo
      if (this.data.type == 'add' || this.data.ischange) {
        imgInfo = await new app.globalData.file().uploadFile(this.data.filename, this.data.src);
      } else {
        imgInfo = this.data.src;
      }
      if (this.data.type == 'add') {
        sendPet.add({
          data: new app.globalData.model.SendPet({
            goodstype: this.data.goodstype,
            describe: this.data.describe,
            // contact: this.data.contact,
            age: this.data.age,
            sex: this.data.sex,
            sterilization: this.data.sterilization,
            vaccines: this.data.vaccines,
            requirement: this.data.requirement,
            file: {
              fileid: imgInfo
            }
          })
        }).then(() => {
          wx.showToast({
            title: '操作成功',
            icon: "none",
            duration: 2000,
            success() {
              wx.navigateBack({
                delta: 1,
              })
            }
          })
        })
      } else {
        sendPet.where({
            _id: this.data.id
          })
          .update({
            data: new app.globalData.model.SendPet({
              goodstype: this.data.goodstype,
              describe: this.data.describe,
              // contact: this.data.contact,
              // activeNum: this.data.activeNum,
              file: {
                fileid: imgInfo
              },
              age: this.data.age,
              sex: this.data.sex,
              sterilization: this.data.sterilization,
              vaccines: this.data.vaccines,
              requirement: this.data.requirement,
            })
          }).then(() => {
            if (this.data.type == 'edit' && this.data.ischange) {
              new app.globalData.file().deleteFile(this.data.oldImg)
            }
            wx.showToast({
              title: '操作成功',
              icon: "none",
              duration: 2000,
              success() {
                wx.navigateBack({
                  delta: 1,
                })
              }
            })
          })
      }
    }
  },

  onShareAppMessage: function () {
    return {
      title: this.data.goodstype,
      path: "/pages/publish/sendPet/sendPet?type=info&id" + this.data.id,
      imageUrl: this.data.src
    }
  },
  signup() {
    if (this.data.signupText == '已报名') {
      wx.showToast({
        title: '请勿重复报名',
        icon: "error"
      })
      return;
    }
    users.where({
        "_openid": user.openid,
      }).get()
      .then(res => {
        let info = res.data[0];
        if (!info.signupInfo) {
          wx.showModal({
            title: '提示',
            content: '需要完善领养信息，是否去完善',
            success(res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: '/pages/me/signupInfo/signupInfo',
                })
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        }
      })
    sendPet.where({
        _id: this.data.id,
        date: this.data.saveDate
      }).get()
      .then((res) => {
        if (res.data.length) {
          let signupList = res.data[0].signupList ? res.data[0].signupList : '';
          if (signupList == "") {
            signupList += user.openid
          } else {
            signupList = signupList + ',' + user.openid
          }
          sendPet.where({
              _id: this.data.id,
            })
            .update({
              data: {
                signupList: signupList
              }
            }).then(() => {
              wx.showToast({
                title: '报名成功',
                icon: "none",
                duration: 2000,
              })
              this.setData({
                signupText: "已报名"
              })
            })
        } else {
          sendPet.where({
              _id: this.data.id,
            }).get()
            .then((res) => {
              if (res.data.length) {
                let signupList = res.data[0].signupList ? res.data[0].signupList : '';
                if (signupList == "") {
                  signupList += user.openid
                } else {
                  signupList = signupList + ',' + user.openid
                }
                sendPet.where({
                    _id: this.data.id,
                  })
                  .update({
                    data: {
                      signupList: signupList
                    }
                  }).then(() => {
                    wx.showToast({
                      title: '报名成功',
                      icon: "none",
                      duration: 2000,
                    })
                    this.setData({
                      signupText: "已报名"
                    })
                  })
              } else {
                wx.showToast({
                  title: '未查询到数据',
                  icon: "none"
                })
              }
            })
        }
      })
  },
  userInfo(e){
    if(user.openid != this.data.openid){
      wx.showToast({
        title: '只有送养人才能查看报名人信息',
        icon:"none"
      })
      return;
    }
    const id = e.target.dataset.id;
    users.where({
      _id:id
    })
    .get()
    .then(res=>{
      if(res.data.length){
        this.setData({
          userInfoMsg:res.data[0].signupInfo
        })
        const str = `您好，我的职业是${this.data.userInfoMsg.job}，今年${this.data.userInfoMsg.age},性别${this.data.userInfoMsg.sex ? '男' : '女'}，我在成都${this.data.userInfoMsg.haveHome ? '有' : '没有'}房子，自我评价:${this.data.userInfoMsg.otherText},如果对我有兴趣，请联系我吧${this.data.userInfoMsg.contact},期待您的联系！`
        wx.showModal({
          title: '用户信息',
          content: str,
          showCancel:false
        })
      }else{
        wx.showToast({
          title: '获取信息失败',
          icon:"none"
        })
      }
    })
  }
})