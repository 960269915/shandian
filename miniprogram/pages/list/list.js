const db = wx.cloud.database();
const findPet = db.collection("findPet");
const lostAndFind = db.collection("lostAndFind");
const sendPet = db.collection("sendPet");
const unusegoods = db.collection("unusegoods");
const dblist = {
  find: findPet,
  lost: lostAndFind,
  send: sendPet,
  unuse: unusegoods
}


Page({
  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    page: {
      index: 1,
      size: 10,
      count: 0
    },
    type: ""
  },
  onLoad: function (options) {
    this.setData({
      type: options.type
    })
    this.getList();
  },
  getList() {
    dblist[this.data.type]
      .orderBy("date", "desc")
      .skip((this.data.page.index - 1) * this.data.page.size)
      .limit(this.data.page.size)
      .get()
      .then(async (res) => {
        let arr = this.data.list;
        let count = await dblist[this.data.type].count();
        this.setData({
          list: arr.concat(res.data),
          page: {
            ...this.data.page,
            count: count.total
          }
        })
        console.log(this.data.list);
      })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.page.size * this.data.page.index < this.data.page.count) {
      this.setData({
        page: {
          index: this.data.page.index + 1
        }
      })
      this.getList();
    }
  },
  details(e) {
    const id = e.target.dataset.id;
    switch (this.data.type) {
      case "find":
        wx.navigateTo({
          url: '/pages/publish/findPet/findPet?type=info&id=' + id,
        })
        break;
      case "lost":
        wx.navigateTo({
          url: '/pages/publish/lostAndFind/lostAndFind?type=info&id=' + id,
        })
        break;
      case "send":
        wx.navigateTo({
          url: '/pages/publish/sendPet/sendPet?type=info&id=' + id,
        })
        break;
      case "unuse":
        wx.navigateTo({
          url: "/pages/publish/unuseGoods/unuserGoods?type=info&id=" + id,
        })
        break;
    }
  }
})