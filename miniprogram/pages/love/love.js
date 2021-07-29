// miniprogram/pages/love/love.js
const db = wx.cloud.database();
const users = db.collection("users");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    page:{
      index:1,
      size:10,
      count:0
    },
    list:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getList();
  },
  getList(){
    users
    .where({
      'petInfo.openLove':"1"
    })
    .skip((this.data.page.index - 1) * this.data.page.size)
    .limit(this.data.page.size)
    .get()
    .then(async (res)=>{
        let arr = this.data.list;
        let count = await users.count();
        this.setData({
          list:arr.concat(res.data),
          page:{
            ...this.data.page,
            count:count.total
          }
        })
        console.log(res.data);
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if(this.data.page.size * this.data.page.index < this.data.page.count){
      this.setData({
        page:{
          index:this.data.page.index + 1
        }
      })
      this.getList();
    }
  },
})