<template>
    <div class="role">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-button type="primary" plain>添加角色</el-button>
        <el-table
            v-loading="loading"
            :data="tableData"
            style="width: 100%">
            <el-table-column type="expand" row-key="id">
                <template slot-scope="props">
                    aaaa
                </template>
            </el-table-column>
            <el-table-column
            label="角色名称"
            prop="roleName">
            </el-table-column>
            <el-table-column
            label="描述"
            prop="roleDesc">
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
import {getRoleList} from '@/api'
export default {
    data() {
        return {
            loading:true,
            tableData: []
        };
    },
    mounted(){
        this.initList();
    },
    methods: {
        initList(){
            this.loading = true;
            getRoleList().then(res => {
                console.log(res)
                if(res.meta.status === 200){
                    this.tableData = res.data;
                    this.loading = false;
                }
            })
        }
    }
};
</script>
<style lang="scss" scoped>
.roles {
  .el-tag {
    margin-right: 5px;
    margin-bottom: 5px;
  }
  .tree-container {
    height: 300px;
    overflow: auto;
  }
}
</style>

