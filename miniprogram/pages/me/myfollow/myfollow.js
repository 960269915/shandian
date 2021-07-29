// miniprogram/pages/me/myfollow/myfollow.js
const db = wx.cloud.database();
const follow = db.collection("follow");
const dblist = [follow]
const type = ["unusegoods", "lostAndFind", "findPet"]
Page({
  /**
   * 页面的初始数据
   */
  data: {
    active: 0,
    followList: [],
    page: {
      size: 10,
      index: 1,
      total: 0
    },
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  onShow() {
    this.getList(true);
  },
  onChange(event) {
    let name = event.detail.name;
    this.setData({
      active: name
    })
    this.getList(true);
  },
  async getList(init) {
    if (init) {
      this.setData({
        followList: [],
        page: {
          size: 10,
          index: 1,
          total: 0
        }
      })
    }
    wx.cloud.callFunction({
      name: "findFollow",
      data: {
        localdb: 'follow',
        formdb: type[this.data.active],
        type: "myfollw",
        follwType: type[this.data.active],
        page:this.data.page
      }
    }).then(res => {
      let arr = [];
      this.setData({
        followList: arr.concat(res.result.data),
        page: {
          ...this.data.page,
          ...res.result.page
        }
      })
    })
  },
  cancelFollow(e) {
    let id = e.target.dataset.row._id
    follow.where({
        "_id": id
      })
      .remove()
      .then(() => {
        wx.showToast({
          title: '取消成功',
        })
        this.getList(true)
      })
  },
  onReachBottom() {
    if (this.data.page.size * this.data.page.index < this.data.page.total) {
      this.setData({
        page: {
          ...this.data.page,
          index: this.data.page.index + 1
        }
      })
      this.getList()
    } else {
      wx.showToast({
        title: '没有更多了',
        icon: "none"
      })
    }
  },
})