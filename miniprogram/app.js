//app.js
// npm install --save wx-server-sdk
let model = require("./utils/model")
let file = require("./utils/file")

App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      this.globalData = {
        model,
        file,
        isPro:__wxConfig.envVersion, //develop
        user:{
          nickName:"",//简称
          gender:"",//性别1男
          avatarUrl:"",//微信头像
          openid:"",//用户的唯一标识id
        }
      }
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        env: __wxConfig.envVersion == 'develop' ? 'dev-7gau4e4k4b9e8a9f' : 'dev-7gau4e4k4b9e8a9f'
      })
    }
  }
})
