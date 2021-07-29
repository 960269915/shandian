// 人员信息
class User {
  constructor({
    nickName,
    gender,
    avatarUrl,
    openid,
    petInfo,
    signupInfo
  }) {
    this.nickName = nickName; //简称
    this.gender = gender; //性别1男
    this.avatarUrl = avatarUrl; //微信头像
    this.openid = openid; //用户的唯一标识id
    this.petInfo = petInfo //宠物信息
    this.signupInfo = signupInfo //领养时，报名需要的信息
  }
}

// 闲置物品
class UnuseGoods {
  constructor({goodstype,price,contact,describe,file,activeNum}){
    this.goodstype = goodstype; //类型
    this.price = price;//价格
    this.contact = contact;//联系方式
    this.describe = describe;//描述
    this.date = new Date();//创建时间或者更新时间
    this.activeNum = activeNum ? activeNum : 0; //访问次数
    this.file = file;
  }
}

// 关注表
class Follow{
  constructor({id,type}){
    this.type = type; //收藏的类型
    this.infoid = id;//收藏的数据id
  }
}

class LostAndFind{
  constructor({goodstype,contact,describe,activeNum,file,position}){
    this.goodstype = goodstype; //类型
    this.contact = contact;//联系方式
    this.describe = describe;//描述
    this.date = new Date();//创建时间或者更新时间
    this.activeNum = activeNum ? activeNum : 0; //访问次数
    this.file = file;
    this.position = position //位置
  }
}

class findPet{
  constructor({goodstype,contact,describe,activeNum,file,position,name,money}){
    this.goodstype = goodstype; //类型
    this.contact = contact;//联系方式
    this.describe = describe;//描述
    this.date = new Date();//创建时间或者更新时间
    this.activeNum = activeNum ? activeNum : 0; //访问次数
    this.file = file;
    this.position = position //位置
    this.name = name; //宠物名称
    this.money = money;//报酬金额
  }
}

// 送养表
class SendPet{
  constructor({goodstype,contact,describe,activeNum,file,age,sex,sterilization,vaccines,requirement,signupList}){
    this.goodstype = goodstype; //类型
    this.contact = contact;//联系方式
    this.describe = describe;//描述
    this.date = new Date();//创建时间或者更新时间
    this.activeNum = activeNum ? activeNum : 0; //访问次数
    this.file = file;
    this.age = age;
    this.sex = sex;
    this.sterilization = sterilization;
    this.vaccines = vaccines;
    this.requirement = requirement;
    this.signupList = signupList; //已报名的人员id字符串
  }
}



module.exports = {
  User,
  UnuseGoods,
  Follow,
  LostAndFind,
  findPet,
  SendPet
}