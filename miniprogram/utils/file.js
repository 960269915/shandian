class File{
  chooseImage(){
    return new Promise((reject,resolve)=>{
      wx.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success: res => {
          // tempFilePath可以作为img标签的src属性显示图片
          const tempFilePaths = res.tempFilePaths;
          reject({
            name:new Date().getMilliseconds() + Math.random() + '.png',
            file:tempFilePaths
          })
        },
        fail(err){
          resolve(err)
        }
      })
    })
  }
  uploadFile(name,file){
    return new Promise((reject,resolve)=>{
      wx.cloud.uploadFile({
        cloudPath: name, //上传到小程序服务器后的文件名称
        filePath: file, // 文件路径
      }).then(res => {
        reject(res.fileID); //fileid 可作为删除的键
      }).catch(error => {
        resolve(error)
      })
    })
  }
  deleteFile(id){
    return new Promise((reject,resolve)=>{
      wx.cloud.deleteFile({
        fileList:[id]
      }).then((res)=>{
        reject(res);
      }).catch(err=>{
        resolve(err);
      })
    })
  }
}

module.exports = File;