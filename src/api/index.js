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
    url: '/admin/information/getArticles',
    method: 'post',
    data: query
  });
}

export function fetchArticle(id){
  return request({
    url: '/admin/information/getArticle/' + id,
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
