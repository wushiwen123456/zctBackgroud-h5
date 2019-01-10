import Cookies from 'js-cookie'
import Auth from '@/util/auth'
import router from '../../../router'
import Home from '@/page/layout'
import { login, refreshToken, getMenuTreeList} from '@/api/index'




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
            
            login(userInfo)
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
            refreshToken(state.token)
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
    getMenuTreeList({commit}){
        return new Promise((resolve) =>{
            getMenuTreeList()
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
            
            function formatRoutes(menuList){

                let appRoute = []
                menuList.forEach( item => {
                    let component, path, child
                    if (item.level == 1) {
                        component = Home
                        item.name = '/' + item.name
                        path = item.name
                    } else {
                        component = () => import("@/page" + item.name)
                        let p = item.name
                        let pos = p.indexOf('/')
                        path = p.substring(pos + 1)
                        // let pItem = p.split('/')
                        // path = pItem[pItem.length - 1]
                        item.name = '/' + item.name
                    }
                    
                    const permission = []
                    if (item.child && item.child.length > 0) {
                        child = formatRoutes(item.child)
                        if (item.child[0].ismenu) {
                            //菜单
                            item.isChildMenu = 1
                        } else {
                            //按钮
                            item.isChildMenu = 0
                            item.child.forEach(cItem =>{
                                let p = cItem.name
                                let pItem = p.split('/')
                                let auth = pItem[pItem.length - 1]
                                permission.push(auth)
                            })
                        }
                    } else {
                        child = []
                    }
            
                    const route = {
                        path : path,
                        component : component,
                        children : child,
                        meta : {
                            permission : permission,
                            name : item.title
                        }
                    }
                    appRoute.push(route)
                })
                return appRoute
            }
            let appRoutes = formatRoutes(state.navList)
            console.log('=============================================')
            console.log(appRoutes)
            console.log('=============================================')
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