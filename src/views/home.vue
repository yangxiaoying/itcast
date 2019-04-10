<template>
    <div class="home">
        <el-container>
            <el-aside width="auto">
                <!-- <div class="logo"></div> -->
                <el-menu
                :collapse="isCollapse"
                default-active="2"
                background-color="#545c64"
                text-color="#fff"
                active-text-color="#ffd04b">
                <el-submenu index="1">
                    <template slot="title">
                        <i class="myicon myicon-user"></i>
                        <span>用户管理</span>
                    </template>
                    <el-submenu index="2">
                        <template slot="title">
                            <i class="el-icon-location"></i>
                            <span>用户列表</span>
                        </template>
                    </el-submenu>
                </el-submenu>
                <el-menu-item index="3">
                    <i class="myicon myicon-cog"></i>
                    <span slot="title">权限管理</span>
                </el-menu-item>
                </el-menu>
            </el-aside>
            <el-container>
                <el-header>
                    <i class="myicon myicon-menu toggle-btn" @click="collapseMenu"></i>
                    <h2 class="system-title">后台管理系统</h2>
                    <div>
                        <span class="welcome">您好，***</span>
                        <el-button type="text">退出</el-button>
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
export default {
    data() {
        return {
            isCollapse: false
        };
    },
    methods: {
        collapseMenu(){
            this.isCollapse = !this.isCollapse;
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

