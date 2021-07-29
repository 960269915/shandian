// miniprogram/pages/publish/publish.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    navList:[
      {
        icon:"",
        text:"闲置物品",
        url:"/pages/publish/unuseGoods/unuserGoods"
      },
      {
        icon:"",
        text:"招领宠物",
        url:"/pages/publish/lostAndFind/lostAndFind"
      },
      {
        icon:"",
        text:"寻找宠物",
        url:"/pages/publish/findPet/findPet"
      },
      {
        icon:"",
        text:"送养宠物",
        url:"/pages/publish/sendPet/sendPet",
      },
      // {
      //   icon:"",
      //   text:"宠物相亲"
      // }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },
  navfn(e){
    const url = e.currentTarget.dataset.val.url;
    wx.navigateTo({
      url
    })
    console.log(e.currentTarget.dataset.val);
  }
})