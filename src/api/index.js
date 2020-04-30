import request from '@/util/ajax'

function random(n) {
  if (n > 21) return null
  return parseInt((Math.random() + 1) * Math.pow(10,n-1))
}

export function getToken() {
  return request({
    url: '/qiniu/upload/token', // 假地址 自行替换
    method: 'get'
  })
}

export function login(userinfo) {
//   var arr = new Array()
//   arr.push(new Date().getTime())
//   arr.push(random(3))
  return request({
    url: 'admin/base/login',
    method: 'post',
    data: {
      ...userinfo,
      // 'codeId' :  arr.join("")
    }
  })
}

export function modifyPwd(data) {
  return request({
    url: '/admin/auth/changepass',
    method: 'post',
    data: data
  })
}

export function refreshToken(token) {
  return request({
      url: '/admin/index/refreshToken/' + token,
      method: 'get'
  })
}

export function getMenuTreeList(){
  return request({
    url: '/admin/index/getMenuTreeList',
    method: 'get'
  });
}
// // 获取实时提醒消息
// export function getMessage(){
//   return request({
//     url: '/admin/notice/getRolling',
//     method: 'get'
//   });
// }
// export function getMenuList(){
//   return request({
//     url: '/admin/index/getMenuList',
//     method: 'get'
//   });
// }
// 会员列表
export function getUserList(data){
  return request({
    url: 'admin/user/list',
    method: 'get',
    params: data
  });
}
// 知识管理
// 获取知识分类
export function getKnowledgeType(data){
  return request({
    url: 'admin/knowledge/categories',
    method: 'get',
    params: data
  });
}
// 获取知识列表
export function getKnowledge(data){
  return request({
    url: 'admin/knowledge/list',
    method: 'get',
    params: data
  });
}
// 获取知识详情
export function fetchArticle(id){
  return request({
    url: 'admin/knowledge/detail/' + id,
    method: 'get'
  });
}
// 添加知识列表
export function publishArticle(data){
  return request({
    url: 'admin/knowledge/add',
    method: 'post',
    data: data
  });
}
// 修改知识
export function updateArticle(data){
  return request({
    url: 'admin/knowledge/edit',
    method: 'post',
    data: data
  });
}
// 删除知识
export function deleteKnowledge(id){
  return request({
    url: 'admin/knowledge/del/' + id,
    method: 'get'
  });
}
// 订单详情
// 订单列表
export function getOrderList(data){
  return request({
    url: 'admin/order/list',
    method: 'get',
    params: data
  });
}
// 订单详情
export function getOrderListDetail(id){
  return request({
    url: 'admin/order/detail/' + id,
    method: 'get'
  });
}
// 删除订单
export function deleteOrder(id){
  return request({
    url: 'admin/order/del/' + id,
    method: 'get'
  });
}
// 预约管理
// 预约列表
export function getAppointList(data){
  return request({
    url: 'admin/appointment/list',
    method: 'get',
    params: data
  });
}
// 预约详情
export function getAppointListDetail(id){
  return request({
    url: 'admin/appointment/detail/' + id,
    method: 'get'
  });
}
// 所有技师
export function getMassigstType(data){
  return request({
    url: 'admin/appointment/allMassagists',
    method: 'get',
    params: data
  });
}
// 搜索订单
export function searchOrder(data){
  return request({
    url: 'admin/order/search',
    method: 'post',
    data: data
  });
}
// 获取可预约技师接口
export function massagst(data){
  return request({
    url: 'admin/appointment/getMassagists',
    method: 'post',
    params: data
  });
}
// 获取可预约上门接口
export function reduceGet(data){
  return request({
    url: 'admin/appointment/getUserReduce',
    method: 'get',
    params: data
  });
}
// 获取时间日期
export function date(data){
  return request({
    url: 'admin/appointment/getDates',
    method: 'get',
    params: data
  });
}
// 获取时间
export function times(data){
  return request({
    url: 'admin/appointment/getTimeclips',
    method: 'get',
    params: data
  });
}
// 添加预约服务
export function addAppointment(data){
  return request({
    url: 'admin/appointment/create',
    method: 'post',
    data: data
  });
}
// 获取评价
export function getViewListDetail(data){
  return request({
    url: 'admin/appointment/viewEvaluate',
    method: 'get',
    params: data
  });
}
// 隐藏评价
export function deletEvaluate(id){
  return request({
    url: 'admin/appointment/delEvaluate/' + id,
    method: 'get'
  });
}

// 服务管理
// 获取服务分类
export function getFeedbacksType(data){
  return request({
    url: 'admin/service/categories',
    method: 'get',
    params: data
  });
}
// 获取服务列表
export function getFeedbacks(data){
  return request({
    url: 'admin/service/list',
    method: 'get',
    params: data
  });
}
// 添加服务
export function addService(data){
  return request({
    url: 'admin/service/add',
    method: 'post',
    data: data
  });
}
// 获取服务详情
export function serviceDetail(id){
  return request({
    url: 'admin/service/detail/' + id,
    method: 'get'
  });
}
// 修改服务
export function editService(data){
  return request({
    url: 'admin/service/edit',
    method: 'post',
    data: data
  });
}
// 删除服务
export function deleteService(id){
  return request({
    url: 'admin/service/del/' + id,
    method: 'get'
  });
}
// 添加服务内容
export function getServiceContent(data){
  return request({
    url: 'admin/service/modContent',
    method: 'post',
    data: data
  });
}
// 查看服务套餐
export function getSkus(data){
  return request({
    url: 'admin/service/getSkus',
    method: 'get',
	params: data
  });
}
// 添加服务套餐
export function addSkus(data){
  return request({
    url: 'admin/service/addSku',
    method: 'post',
	data: data
  });
}
// 服务套餐详情
export function skusDeatil(id){
  return request({
    url: 'admin/service/skuDetail/' + id,
    method: 'get',
  });
}
// 修改服务套餐
export function editSkus(data){
  return request({
    url: 'admin/service/editSku',
    method: 'post',
	data: data
  });
}
// 删除服务套餐
export function deleteSkus(id){
  return request({
    url: 'admin/service/delSku/' + id,
    method: 'get'
  });
}

// 团购
// 获取团购列表
export function groupList(data){
  return request({
    url: 'admin/assemble/list',
    method: 'get',
    params: data
  });
}
// 添加团购
export function addAssemble(data){
  return request({
    url: 'admin/assemble/add',
    method: 'post',
    data: data
  });
}
// 团购详情
export function assembleDeatil(id){
  return request({
    url: 'admin/assemble/detail/' + id,
    method: 'get'
  });
}
// 团购修改
export function editAssemble(data){
  return request({
    url: 'admin/assemble/edit',
    method: 'post',
    data: data
  });
}
// 删除团购
export function deleteAssemble(id){
  return request({
    url: 'admin/assemble/del/' + id,
    method: 'get'
  });
}

// 技师管理
// 获取技师列表
export function getMassagistList(data){
  return request({
    url: 'admin/massagist/list',
    method: 'get',
    params: data
  });
}
// 添加技师
export function addMassagist(data){
  return request({
    url: 'admin/massagist/add',
    method: 'post',
    data: data
  });
}
// 技师详情
export function massagistDetail(id){
  return request({
    url: 'admin/massagist/detail/' + id,
    method: 'get'
  });
}
// 修改技师
export function editMassagist(data){
  return request({
    url: 'admin/massagist/edit',
    method: 'post',
    data: data
  });
}
// 删除技师
export function deleteMassagist(id){
  return request({
    url: 'admin/massagist/del/' + id,
    method: 'get'
  });
}
// 业绩管理
// 业绩列表
export function getScoreList(data){
  return request({
    url: 'admin/score/list',
    method: 'get',
    params: data
  });
}

// 合伙人管理
// 合伙人列表
export function getCopemateList(data){
  return request({
    url: 'admin/copemate/applyList',
    method: 'get',
    params: data
  });
}
// 合伙人审核通过
export function passAudits(id){
  return request({
    url: 'admin/copemate/applyOk/' + id,
    method: 'get'
  });
}

// 获取规则配置
export function getAward(data){
  return request({
    url: 'admin/copemate/getAward',
    method: 'get',
    params: data
  });
}
// 设置规则配置
export function setAward(data){
  return request({
    url: 'admin/copemate/setAward',
    method: 'post',
    data: data
  });
}

// 消息管理
// 消息列表
export function getMessageList(data){
  return request({
    url: 'admin/message/list',
    method: 'get',
    params: data
  });
}
// 标记已读
export function messageReady(id){
  return request({
    url: 'admin/message/read/' + id,
    method: 'get'
  });
}
// export function getInfo(token) {
//   return request({
//     url: '/user/info',
//     method: 'get',
//     params: { token }
//   })
// }

// export function logout() {
//   return request({
//     url: '/user/logout',
//     method: 'post'
//   })
// }

function dealArr(allArr){
  const arr = []
  allArr.forEach((item,index) => {
    x.forEach((key,val) => {
      
    })
  })
}

// allArr.map((item,index) => {

// })
