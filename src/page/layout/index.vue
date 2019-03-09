<template>
    <div class="wrapper">
        <template v-if="layout =='left'">
            <header-bar v-once>
                <p slot="logo">CoinCobo数字资产后台管理系统</p>
            </header-bar>
			<nav-scoll></nav-scoll>
            <nav-bar :layout="layout"></nav-bar>
        </template>
        <template v-if="layout == 'top'">
            <header-bar>
                <p slot="logo">CoinCobo数字资产后台管理系统</p>
				<nav-scoll  ></nav-scoll>
               <template slot="topnav">
                    <nav-bar :layout="layout"></nav-bar>
                </template>
            </header-bar>
        </template>
        <div class="sys-content" :class="layout">
            <tag-nav></tag-nav>
            <keep-alive :include="tagNavList">
                <router-view></router-view>
            </keep-alive>
        </div>
    </div>
</template>

<script>
import HeaderBar from './HeaderBar'
import NavBar from './NavBar'
import TagNav from './TagNav'
import NavScoll from './NavScoll'

export default {
    computed: {
        layout(){
			console.log(this.$store.state.navbarPosition)
            return this.$store.state.navbarPosition
        },
        tagNavList(){
			console.log(this.$store.state.tagNav.cachedPageName)
            return this.$store.state.tagNav.cachedPageName
        },
    },
    components:{
        HeaderBar,
        NavBar,
        TagNav,
		NavScoll
    }
}
</script>