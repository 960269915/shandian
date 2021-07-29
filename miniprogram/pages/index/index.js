// miniprogram/pages/index/index.js
const db = wx.cloud.database();
const findPet = db.collection("findPet");
const lostAndFind = db.collection("lostAndFind");
const sendPet = db.collection("sendPet");
const unusegoods = db.collection("unusegoods");


Page({
  data: {
    findList: [],
    lostAndFindList: [],
    sendList: [],
    unusegoodsList: []
  },
  onShow: function (options) {
    this.getfindList();
    this.getlostAndFind();
    this.getSendList();
    this.getUnusegoods();
  },
  getfindList() {
    findPet
      .orderBy("date", "desc")
      .limit(5)
      .get()
      .then(res => {
        this.setData({
          findList: res.data
        })
      })
  },
  getlostAndFind() {
    lostAndFind
      .orderBy("date", "desc")
      .limit(4)
      .get()
      .then(res => {
        this.setData({
          lostAndFindList: res.data
        })
      })
  },
  getSendList() {
    sendPet
      .orderBy("date", "desc")
      .limit(4)
      .get()
      .then(res => {
        this.setData({
          sendList: res.data
        })
      })
  },
  getUnusegoods() {
    unusegoods
      .orderBy("date", "desc")
      .limit(10)
      .get()
      .then(res => {
        this.setData({
          unusegoodsList: res.data
        })
      })
  },

  goDetails(e) {
    const type = e.target.dataset.type;
    const id = e.target.dataset.id;
    switch (type) {
      case "findPet":
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
    }
  },
  golove(){
    wx.navigateTo({
      url: '/pages/love/love',
    })
  },
  more(e){
    let type = e.target.dataset.type;
    wx.navigateTo({
      url: '/pages/list/list?type='+type,
    })
  }
})