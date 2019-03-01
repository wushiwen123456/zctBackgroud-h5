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
  var arr = new Array()
  arr.push(new Date().getTime())
  arr.push(random(3))
  return request({
    url: '/admin/base/login',
    method: 'post',
    data: {
      ...userinfo,
      'codeId' :  arr.join("")
    }
  })
}

export function modifyPwd(data) {
  return request({
    url: '/admin/index/setinfo',
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

export function getMenuList(){
  return request({
    url: '/admin/index/getMenuList',
    method: 'get'
  });
}

export function getUserList(query){
  return request({
    url: '/admin/user/index/' + query.page,
    method: 'post',
    data: query
  });
}

export function modifyUserStatus(userId){
  return request({
    url: '/admin/user/disabled/' + userId,
    method: 'get'
  });
}

export function getCoinList(){
  return request({
    url: '/admin/coin/index',
    method: 'get'
  });
}

export function updateCoinInfo(temp){
  return request({
    url: '/admin/coin/update',
    method: 'post',
    data: temp
  })
}

export function trusteeConfigs(){
  return request({
    url: '/admin/trustee/config',
    method: 'get'
    })
}

export function updateTrusteeConfig(temp){
  return request({
    url: '/admin/trustee/update',
    method: 'post',
    data: temp
  })
}

export function getCardList(query){
  return request({
    url: '/admin/user/userCards',
    method: 'post',
    data: query
  });
}

export function verifyUserCard(data){
  return request({
    url: '/admin/user/verifyUserCard',
    method: 'post',
    data: data
  });
}

export function getArticles(query){
  return request({
    url: '/admin/news/getArticles',
    method: 'post',
    data: query
  });
}

export function fetchArticle(id){
  return request({
    url: '/admin/news/getArticle/' + id,
    method: 'get'
  });
}

export function publishArticle(data){
  return request({
    url: '/admin/news/publish',
    method: 'post',
    data: data
  });
}

export function updateArticle(data){
  return request({
    url: '/admin/news/update',
    method: 'post',
    data: data
  });
}

export function modifyNewsStatus(id){
  return request({
    url: '/admin/news/modifyNewsStatus/' + id,
    method: 'get'
  });
}

export function getDepositList(data){
  return request({
    url: 'admin/deposit/getList',
    method: 'get',
    params: data
  });
}

export function getWithDrawList(data){
  return request({
    url: 'admin/withdraw/getList',
    method: 'get',
    params: data
  });
}

export function getTranslateList(data){
  return request({
    url: 'admin/translate/getList',
    method: 'get',
    params: data
  });
}

export function getTrusteeList(data){
  return request({
    url: 'admin/trustee/getList',
    method: 'get',
    params: data
  });
}

export function getFeedbacks(data){
  return request({
    url: 'admin/news/getFeedbacks',
    method: 'get',
    params: data
  });
}

export function getFeedbackDetail(id){
  return request({
    url: 'admin/news/getFeedbackDetail/' + id,
    method: 'get'
  });
}

export function replyFeedback(data){
  return request({
    url: 'admin/news/replyFeedback/',
    method: 'post',
    data: data
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
