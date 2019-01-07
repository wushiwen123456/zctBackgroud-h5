import Cookies from 'js-cookie'
import userAction from '@/api/login'
import Auth from '@/util/auth'
import router from '../../../router';
import Home from '@/page/layout'

const state = {
    token: '',
    navList: []
}

const mutations = {
    setMenuList: (state, data) => {
        state.navList = data
    },

    setToken: (state, data) => {
        if(data.token){
            Auth.setToken(data)
            Auth.setLoginStatus(data)
        } else {
            Auth.removeToken()
            Auth.removeLoginStatus()
        }
        state.token = data.token
    }
}

const actions = {
    // 登录
    login({ commit }, userInfo) {
        return new Promise((resolve) => {
            
            userAction.login(userInfo)
            .then(res => {
                if(res){
                    commit('setToken', res.data)
                }
                resolve(res)
            })
        });
    },

    // 登出
    logout({commit}) {
        return new Promise((resolve) => {
            commit('setToken', {'token':''})
            commit('user/setName', '', { root: true })
            commit('tagNav/removeTagNav', '', {root: true})
            resolve()
        })
    },

    // 重新获取用户信息及Token
    // TODO: 这里不需要提供用户名和密码，实际中请根据接口自行修改
    relogin({dispatch, commit, state}){
        return new Promise((resolve) => {
            // 根据Token进行重新登录
            let token = Cookies.get('token'),
                userName = Cookies.get('userName')

            // 重新登录时校验Token是否存在，若不存在则获取
            
            if(token != 'undefined'){
                commit('setToken', {'token':token})
                dispatch("refreshToken")
            } else {
                dispatch("logout");
                router.push('/');
            }
            // 刷新/关闭浏览器再进入时获取用户名
            commit('user/setName', decodeURIComponent(userName), { root: true })
            resolve()
        })
    },

    // 获取新Token
    refreshToken({dispatch, commit, state}){
        return new Promise((resolve) => {
            userAction.refreshToken(state.token)
            .then((res) =>{
                if (res.code == 200){
                    commit('setToken', res.data)
                } else {
                    dispatch("logout");
                    router.push('/');
                }
                resolve()
            })
        })
    },

    // 获取该用户的菜单列表
    getMenuList({commit}){
        return new Promise((resolve) =>{
            userAction.getMenuList()
            .then((res) => {
                commit("setMenuList", res.data)
                resolve(res.data)
            })
        })
    },

    // 将菜单列表扁平化形成权限列表
    getPermissionList({state}){
        return new Promise((resolve) =>{
            let permissionList = []
            // 将菜单数据扁平化为一级
            function flatNavList(arr){
                for(let v of arr){
                    if(v.child && v.child.length){
                        flatNavList(v.child)
                    } else{
                        permissionList.push(v)
                    }
                }
            }
            flatNavList(state.navList)
            resolve(permissionList)
        })
    },

    // 将菜单列表扁平化形成权限列表
    updateAppRoute({state}){
        return new Promise((resolve) =>{
            const appRoutes = []
            // 将菜单数据扁平化为一级
            function formatRoutes(menu){
                const menuList = menu
                menuList.forEach(item => {
                    let componet, child
                    if (item.level == 1)
                        componet = Home
                    else {
                        let path = item.name
                        let pathItem = path.split('/')
                        let cName = pathItem[pathItem.length - 1]
                        let componentPath = "src/page/" + cName
                        componet = () => require(componentPath)
                    }
            
                    const permission = []
                    if (item.child && item.child.length > 0) {
                        child = formatRoutes(item.child)
                        item.child.forEach(cItem =>{
                            let path = cItem.name
                            let pathItem = path.split('/')
                            let auth = pathItem[pathItem.length - 1]
                            permission.push(auth)
                        })
                    } else {
                        child = []
                    }
            
                    const route = {
                        path : item.name,
                        componet : componet,
                        children : child,
                        meta : {
                            permission : permission,
                            name : item.title
                        }
                    }
                    appRoutes.push(route)
                })
            }
            formatRoutes(state.navList)
            resolve(appRoutes)
        })
    }
}





export default {
    namespaced: true,
    state,
    mutations,
    actions
}