// miniprogram/pages/me/mypublish/mypublish.js
const  db = wx.cloud.database();
const unusegoods = db.collection("unusegoods");
const lostAndFind = db.collection("lostAndFind");
const findPet = db.collection("findPet");
const sendPet = db.collection("sendPet");



const dblist = [unusegoods,lostAndFind,findPet,sendPet]
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    active:0,
    publishList:[],
    page:{
      size:10,
      index:1,
      total:0
    },
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  onShow(){
    this.getList(true);
  },
  onChange(event){
    let name = event.detail.name;
    this.setData({
      active:name
    })
    this.getList(true);
  },
  async getList(init){
    const count = await dblist[this.data.active].count();
    if(init){
      this.setData({
        publishList:[],
        page:{
          size:10,
          index:1,
          total:count.total
        }
      })
    }
    const user = wx.getStorageSync('user')
    console.log(user.openid);
    dblist[this.data.active].
    where({
      "_openid":user.openid
    })
    .skip((this.data.page.index - 1) * this.data.page.size)
      .limit(this.data.page.size)
      .orderBy("date","desc")
      .get()
      .then(res=>{
        let arr = [...this.data.publishList];
        this.setData({
          publishList:arr.concat(res.data),
          page:{
            ...this.data.page,
            total:count.total
          }
        })
      })
  },
  updateDate(e){
    let index = e.target.dataset.index;
    let row = e.target.dataset.row;
    dblist[index].doc(row._id)
      .update({
        data:{
          date:new Date()
        }
      }).then((res)=>{
        wx.showToast({
          title: '擦亮成功',
        })
        this.getList(true)
      })
  },
  remove(e){
    let index = e.target.dataset.index;
    let row = e.target.dataset.row;
    wx.showModal({
      title: '提示',
      content: '是否确认此操作',
      success :(res)=> {
        if (res.confirm) {
          dblist[index].doc(row._id).remove()
          .then(()=>{
            wx.showToast({
              title: '操作成功',
            })
            this.getList(true);
          })
          new app.globalData.file().deleteFile(row.file.fileid)
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  edit(e){
    let index = e.target.dataset.index;
    let row = e.target.dataset.row;
    if(index == 0){
      wx.navigateTo({
        url: '/pages/publish/unuseGoods/unuserGoods?type=edit&id='+row._id,
      })
    }
    if(index == 1){
      wx.navigateTo({
        url: '/pages/publish/lostAndFind/lostAndFind?type=edit&id='+row._id,
      })
    }
    if(index == 2){
      wx.navigateTo({
        url: '/pages/publish/findPet/findPet?type=edit&id='+row._id,
      })
    }
    if(index == 3){
      wx.navigateTo({
        url: '/pages/publish/sendPet/sendPet?type=edit&id='+row._id,
      })
    }
  },
  onReachBottom() {
    if(this.data.page.size * this.data.page.index < this.data.page.total){
      this.setData({
        page:{
          ...this.data.page,
          index:this.data.page.index+ 1
        }
      })
      this.getList()
    }else{
      wx.showToast({
        title: '没有更多了',
        icon:"none"
      })
    }
  },
})