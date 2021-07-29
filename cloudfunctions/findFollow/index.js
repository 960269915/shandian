// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})
var db = cloud.database()
const _ = db.command //_操作符（逻辑操作，比较操作，数组，对象操作等）
var $ = db.command.aggregate //$聚合操作符 针对 aggregate的数据
// 云函数入口函数
exports.main = async (event, context) => {
  let {
    localdb,
    formdb,
    localField,
    formField,
    type,
    page
  } = event

  // 查询收藏列表
  if (type == 'myfollw') {
    // 指定多个查询条件
    const aggregateInstance =  cloud.database().collection(localdb).aggregate()
      .lookup({
        from: formdb,
        let: {
          infoid: '$infoid', //聚合操作符，自定义变量，在表达式中使用 $infoid为数据的原始key，infoid为主表的字段
        },
        pipeline: $.pipeline() //pipeline做left-join操作，相当于拿主表的每个集合的infoid去匹配从表的_id
          .match(_.expr($.and( //expr查询操作符，传入查询条件
            [
              $.eq(['$_id', '$$infoid']),
            ]
          ))).done(),
        as: 'findList'
      })
      .match({
        type: event.follwType,
        _openid: cloud.getWXContext().OPENID,
      })
      // 获取数据
      const data = await aggregateInstance.replaceRoot({
        newRoot: $.mergeObjects([$.arrayElemAt(['$findList', 0]), '$$ROOT' ])
      })
      .project({
        findList: 0
      })
      .skip((page.index - 1) * page.size)
      .limit(page.size)
      .end();
      //获取总页数
      const info = await aggregateInstance.count('totalCount').end() 
      const totalCount = info.list[0].totalCount;
      if(totalCount > (page.index) * page.size){
        page.index += 1;
      }
      page.total = totalCount;
      return {
        page,
        data:data.list,
      }
  } else {
    // 查询商品是否已关注
    return await cloud.database().collection(localdb).aggregate()
      .lookup({
        from: formdb,
        localField: localField, //主表关联字段
        foreignField: formField, //从表关联字段
        as: "findList"
      })
      .match({
        _openid: cloud.getWXContext().OPENID,
        infoid: event.id,
      })
      // .replaceRoot({
      //replaceRoot指定一个已有字段作为输出的根节点，也可以指定一个计算出的新字段作为根节点。
      //newRoot  代表新的根节
      // newRoot: $.mergeObjects([$.arrayElemAt(['$findList', 0]), '$$ROOT'])
      //mergeObjects 累计器操作符
      //$.mergeObjects([params1,params2...]) 可以合并多个元素
      //$.arrayElemAt(['$uapproval', 0]), '$$ROOT']
      //就是取uapproval数组的第一个元素，与原始的根融合在一起
      // })
      // .project({ //制定输出字段  0隐藏 1显示
      //   findList: 0
      // })
      .end()
      .then(res => {
        return res.list
      })
      .catch(err => {
        return err
      })
  }
}