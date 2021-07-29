const app = getApp();
const db = wx.cloud.database();
const unusegoods = db.collection("unusegoods")
const follow = db.collection("follow")
const user = wx.getStorageSync('user')
const _ = db.command
Page({
  /**
   * 页面的初始数据
   */
  data: {
    id: "",
    goodstype: "",
    price: "",
    describe: "",
    contact: "",
    src: "",
    filename: "",
    ischange: false,
    oldImg: "",
    type: "", // 新增add 编辑 edit 详情info
    activeNum: "",
    data: "",
    followText: "关注"
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id,
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
      info = await unusegoods.doc(this.data.id).get();
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
      price: info.data.price,
      describe: info.data.describe,
      contact: info.data.contact,
      src: info.data.file.fileid,
      oldImg: info.data.file.fileid,
      activeNum: activeNum,
      date: info.data.date.getFullYear() + '-' + info.data.date.getMonth() + '-' + info.data.date.getDate()
    })
    if (this.data.type == "info") {
      unusegoods.where({
        _id: info.data._id
      }).update({
        data: {
          activeNum: _.inc(1)
        }
      })

      wx.cloud.callFunction({
        name: "findFollow",
        data: {
          localdb: 'follow',
          formdb: 'unusegoods',
          localField: 'infoid',
          formField: '_id',
          id: this.data.id
        }
      }).then(res => {
        if (res.result[0] && res.result[0].findList.length) {
          this.setData({
            followText: "已关注"
          })
        }
      }).catch(err => {
        console.log(err);
      })
    }
  },
  async chooseImg() {
    let res = await new app.globalData.file().chooseImage();
    this.setData({
      src: res.file[0],
      filename: res.name,
      ischange: true
    })
  },
  delImg() {
    this.setData({
      src: ""
    })
  },
  async postForm() {
    if (!this.data.goodstype || this.data.price == '' || !this.data.describe || !this.data.contact || !this.data.src) {
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
        unusegoods.add({
          data: new app.globalData.model.UnuseGoods({
            goodstype: this.data.goodstype,
            price: this.data.price,
            describe: this.data.describe,
            contact: this.data.contact,
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
        unusegoods.where({
            _id: this.data.id
          })
          .update({
            data: new app.globalData.model.UnuseGoods({
              goodstype: this.data.goodstype,
              price: this.data.price,
              describe: this.data.describe,
              contact: this.data.contact,
              // activeNum:this.data.activeNum,
              file: {
                fileid: imgInfo
              }
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
  follow() {
    if (!user.openid) {
      wx.clearStorage({
        success: (res) => {
          wx.navigateTo({
            url: '/pages/auth/auth',
          })
        },
      })
      return;
    }
    let row = {
      id: this.data.id,
      type: "unusegoods",
    };
    if (this.data.followText == '关注') {
      follow.add({
        data: new app.globalData.model.Follow(row)
      }).then(() => {
        wx.showToast({
          title: '关注成功',
        })
        this.setData({
          followText: "已关注"
        })
      })
    } else {
      follow.where({
          infoid: this.data.id,
          _openid: user.openid
        })
        .remove()
        .then(() => {
          wx.showToast({
            title: '取消成功',
            icon: 'success'
          })
          this.setData({
            followText: "关注"
          })
        })
    }
  },
  onShareAppMessage: function () {
    return {
      title: this.data.goodstype,
      path: "/pages/publish/unuseGoods/unuserGoods?type=info&id" + this.data.id,
      imageUrl: this.data.src
    }
  },
})