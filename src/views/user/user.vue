<template>
    <div class="user">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <div style="margin: 15px 0;">
            <el-input placeholder="请输入内容" v-model="searchword" @keydown.native.enter="search" class="search-input">
                <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
            </el-input>
            <el-button type="success" plain @click="addDialogFormVisible = true">添加用户</el-button>
        </div>
        <el-table
            :data="tableData"
            border
            style="width: 100%">
            <el-table-column
            type="index"
            width="50">
            </el-table-column>
            <el-table-column
            prop="username"
            label="姓名"
            width="180">
            </el-table-column>
            <el-table-column
            prop="email"
            label="邮箱"
            width="180">
            </el-table-column>
            <el-table-column
            prop="mobile"
            label="电话"
            width="180">
            </el-table-column>
            <el-table-column label="用户状态" width="180">
                <template slot-scope="scope">
                    <el-switch v-model="scope.row.mg_state" @change="changeUserState(scope.row)">
                    </el-switch>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button
                    size="mini"
                    plain
                    icon="el-icon-edit"
                    type="primary"
                    @click="handleEdit(scope.$index, scope.row)"></el-button>
                    <el-button
                    size="mini"
                    plain
                    icon="el-icon-delete"
                    type="danger"
                    @click="handleDelete(scope.$index, scope.row)"></el-button>
                    <el-button
                    size="mini"
                    plain
                    icon="el-icon-check"
                    type="warning"
                    @click="handleDelete(scope.$index, scope.row)"></el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pagenum"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
        <!-- 添加用户弹框-->
        <el-dialog title="添加用户" :visible.sync="addDialogFormVisible">
            <el-form :model="addForm" :rules="rules" ref="addRuleForm" label-width="120px">
                <el-form-item prop="username" label="用户名">
                    <el-input v-model="addForm.username"></el-input>
                </el-form-item>
                <el-form-item prop="password" label="密码">
                    <el-input v-model="addForm.password" type="password"></el-input>
                </el-form-item>
                <el-form-item prop="email" label="邮箱">
                    <el-input v-model="addForm.email"></el-input>
                </el-form-item>
                <el-form-item prop="mobile" label="电话" >
                    <el-input v-model="addForm.mobile" @keydown.native.enter="addSubmitForm('addRuleForm')"></el-input>
                </el-form-item>
            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button @click="addDialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="addSubmitForm('addRuleForm')">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import {getUserList,addUser,changeUserState} from '@/api'
export default {
    data() {
        return {
            tableData: [],
            total: 0,
            pagenum: 1,
            pagesize: 10,
            searchword: '',
            value3: '',
            addDialogFormVisible: false,
            addForm: {
                username: '',
                password: '',
                email: '',
                mobile: ''
            },
            rules: {
                username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                ],
                email: [
                    { required: true, message: '请输入邮箱', trigger: 'blur' },
                ],
                mobile: [
                    { required: true, message: '请输入电话', trigger: 'blur' },
                ]
            }
        };
    },
    mounted(){
        this.initUserList();
    },
    methods: {
        initUserList(){
            let params= {query:this.searchword,pagenum:this.pagenum,pagesize:this.pagesize}
            getUserList({params:params}).then(res => {
                if(res.meta.status === 200){
                    this.tableData = res.data.users;
                    this.total = res.data.total;
                }
            })
        },
        handleCurrentChange(val) {
            this.pagenum = val;
            this.initUserList();
        },
        handleSizeChange(val) {
            this.pagesize = val;
            this.initUserList();
        },
        search(){
            this.initUserList();
        },
        addSubmitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    addUser(this.addForm).then(res => {
                        // console.log(res)
                        if(res.meta.status==201){
                            this.addDialogFormVisible = false;
                            this.initUserList();
                        }else{
                            this.$message.error(res.meta.msg);
                        }
                    })
                }
            });
        },
        // 修改用户状态
        changeUserState(row){
            changeUserState({uId:row.id,type:row.mg_state}).then(res => {
                console.log(row)
                if(res.meta.status==200){
                    this.$message.success(res.meta.msg);
                }else{
                    this.$message.error(res.meta.msg);
                }
            })
        }
    }
};
</script>
<style lang="scss" scoped>
.user {
  .search-input {
    width: 300px;
  }
}
</style>

