import Cookies from 'js-cookie'

const authToken = {
    // 当Token超时后采取何种策略
    // jumpAuthPage  每次请求时判断Token是否超时，若超时则跳转到授权页面
    // getNewToken  每次请求时判断Token是否超时，若超时则获取新Token (推荐)
    //tokenTimeoutMethod: 'getNewToken',
    tokenTimeoutMethod: 'refreshToken1',
    
    // 在Cookie中记录登录状态的key
    loginKey: 'isLogin',

    // Token是否超时
    hasToken: function(){
        return Cookies.get('token')
    },

    // 当前是否是登录状态
    isLogin: function(){
        return Cookies.get(this.loginKey)
    },

    // 设置Token
    setToken: function(tokenItem){
        // TODO: 设置token，并填写有效期
        let date = new Date();
        date.setTime(date.getTime() + tokenItem.expires * 1000);
        Cookies.set('token', tokenItem.token, {
            expires: 1
        })
    },

    // 设置登录状态
    setLoginStatus: function(tokenItem){
        // TODO: 设置超时登录时间，在该时间范围内没有任何请求操作则自动删除
        console.log("登录状态最长时间更新")
        Cookies.set(this.loginKey, 'true', {
            expires: 1
        })
    },

    // 移除Token
    removeToken: function(){
        Cookies.remove('token')
    },

    // 移除登录状态
    removeLoginStatus: function(){
        Cookies.remove(this.loginKey)
    }
}

export default authToken