<template>
    <div class="home">
        <el-container>
            <el-aside width="auto">
                <!-- <div class="logo"></div> -->
                <el-menu
                default-active="users"
                :router="true"
                :collapse="isCollapse"
                :unique-opened="true"
                class="el-menu-admin"
                background-color="#545c64"
                text-color="#fff"
                active-text-color="#ffd04b">
                <el-submenu :index="item.path" v-for="item in menuList" :key="item.id">
                    <template slot="title">
                        <i class="myicon myicon-user"></i>
                        <span>{{item.authName}}</span>
                    </template>
                    <el-menu-item :index="tag.path" v-for="tag in item.children" :key="tag.id">
                        <i class="el-icon-location"></i>
                        <span slot="title">{{tag.authName}}</span>
                    </el-menu-item>
                </el-submenu>
                <!-- <el-submenu index="2">
                    <template slot="title">
                        <i class="myicon myicon-cog"></i>
                        <span>权限管理</span>
                    </template>
                    <el-menu-item index="/right">
                        <i class="el-icon-location"></i>
                        <span slot="title">权限列表</span>
                    </el-menu-item>
                    <el-menu-item index="/role">
                        <i class="el-icon-location"></i>
                        <span slot="title">角色列表</span>
                    </el-menu-item>
                </el-submenu> -->
                </el-menu>
            </el-aside>
            <el-container>
                <el-header>
                    <i class="myicon myicon-menu toggle-btn" @click="toggleMenu"></i>
                    <h2 class="system-title">后台管理系统</h2>
                    <div>
                        <span class="welcome">您好，{{$store.state.username}}</span>
                        <el-button type="text" @click="logout">退出</el-button>
                    </div>
                </el-header>
                <el-main>
                    <router-view></router-view>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>
<script>
import {getMenuList} from '@/api'
export default {
    data() {
        return {
            isCollapse: false,
            menuList: ''
        };
    },
    created(){
        this.initMunu();
    },
    methods:{
        toggleMenu(){
            this.isCollapse = !this.isCollapse;
        },
        initMunu(){
            getMenuList().then(res => {
                if(res.meta.status === 200){
                    this.menuList = res.data;
                }
            })
        },
        logout(){
            localStorage.removeItem('mytoken');
            localStorage.removeItem('username');
            this.$router.push({name:'login'});
        }
    }
};
</script>
<style lang="scss" scoped>
.home {
  height: 100%;
  .el-menu{
      border-right:0;
  }
  .el-menu-admin:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }
  .el-container {
    height: 100%;
  }
  .el-aside {
    background-color: #545c64;
  }
  .el-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #545c64;
  }
  .logo {
    height:60px;
    background: url(../assets/logo.png);
    background-size: cover;
    background-color: #989898;
  }
  .toggle-btn {
    font-size: 36px;
    color: #989898;
    cursor: pointer;
    line-height: 60px;
  }
  .system-title {
    font-size: 28px;
    color: white;
  }
  .welcome{
    color: white;
  }
}
</style>

