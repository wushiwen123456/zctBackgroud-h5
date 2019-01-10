import request from '@/util/ajax'

function random(n) {
  if (n > 21) return null
  return parseInt((Math.random() + 1) * Math.pow(10,n-1))
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
    methods: 'get'
  });
}
export function getMenuList(){
  return request({
    url: '/admin/index/getMenuList',
    methods: 'get'
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
