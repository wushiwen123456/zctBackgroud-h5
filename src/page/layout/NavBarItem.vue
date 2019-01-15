<template>
    <el-submenu v-if="item.child && item.child.length && item.isChildMenu == 1" :index="navIndex"> 
        <!-- 创建父级菜单 -->
        <template slot="title">
            <span v-if="item.icon" class="svg-container">
                <svg-icon :icon-class=item.icon />
            </span>
            <span>{{ item.title }}</span>
            <!-- <i v-if="item.icon" class="item.icon"></i>{{ item.title }} -->
        </template>
        <!-- 创建子菜单 -->
        <nav-bar-item v-for="(subItem,i) in item.child" :key="navIndex+'-'+i" :navIndex="navIndex+'-'+i" :item="subItem" ></nav-bar-item>
    </el-submenu>

    <el-menu-item v-else :index="item.name" :route="{path: item.name}">
        <span v-if="item.icon" class="svg-container">
          <svg-icon :icon-class=item.icon />
        </span>
        <!-- <i v-if="item.icon" class={{item.icon}}></i>-->
        <span>{{ item.title }}</span>
    </el-menu-item> 
</template>

<script>
export default {
    name: 'NavBarItem',
    props: ['item','navIndex']
}
</script>