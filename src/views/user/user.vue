<template>
    <div class="user">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <div style="margin: 15px 0;">
            <el-input placeholder="请输入内容" v-model="searchword" @keydown.native.enter="initUserList" class="search-input">
                <el-button slot="append" icon="el-icon-search" @click="initUserList"></el-button>
            </el-input>
            <el-button type="success" plain @click="addDialogFormVisible = true">添加用户</el-button>
        </div>
        <el-table
            v-loading="loading"
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
                    @click="showEditDialog(scope.row)"></el-button>
                    <el-button
                    size="mini"
                    plain
                    icon="el-icon-delete"
                    type="danger"
                    @click="showDeleteDialog(scope.row)"
                    ></el-button>
                    <el-button
                    size="mini"
                    plain
                    icon="el-icon-check"
                    type="warning"
                    @click="showGrantDialog(scope.row)"
                    ></el-button>
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
                    <el-input v-model="addForm.mobile"></el-input>
                </el-form-item>
            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button @click="addDialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="addSubmitForm('addRuleForm')">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 编辑用户弹框-->
        <el-dialog title="编辑用户" :visible.sync="editDialogFormVisible">
            <el-form :model="editForm" :rules="rules" ref="editRuleForm" label-width="120px">
                <el-form-item prop="username" label="用户名">
                    <el-input v-model="editForm.username"></el-input>
                </el-form-item>
                <el-form-item prop="email" label="邮箱">
                    <el-input v-model="editForm.email"></el-input>
                </el-form-item>
                <el-form-item prop="mobile" label="电话" >
                    <el-input v-model="editForm.mobile"></el-input>
                </el-form-item>
            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button @click="editDialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="editSubmitForm('editRuleForm')">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 分配用户角色弹框-->
        <el-dialog title="分配角色" :visible.sync="grantDialogFormVisible">
            <el-form :model="grantForm" label-width="120px">
                <el-form-item label="当前的用户：">
                    <span>{{grantForm.username}}</span>
                </el-form-item>
                <el-form-item label="请选择角色：">
                    <el-select v-model="roleId" placeholder="请选择角色">
                        <el-option v-for="role in roleList" :key="item.id" :label="role.roleName" :value="role.id"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button @click="grantDialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="grantSubmitForm">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import {getUserList,addUser,changeUserState,getUserById,updateUser,deleteUser,grantUserRole,getRoleList} from '@/api'
export default {
    data() {
        return {
            loading:true,
            tableData: [],
            total: 0,
            pagenum: 1,
            pagesize: 10,
            searchword: '',
            addDialogFormVisible: false,
            editDialogFormVisible: false,
            grantDialogFormVisible: false,
            roleId: '',
            roleList: [],
            addForm: {
                username: '',
                password: '',
                email: '',
                mobile: ''
            },
            editForm:{
                id:0,
                username: '',
                email: '',
                mobile: ''
            },
            grantForm:{},
            rules: {
                username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                ],
                email: [
                    { required: true, message: '请输入邮箱', trigger: 'blur' },
                    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur,change' }
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
            this.loading = true;
            let params= {query:this.searchword,pagenum:this.pagenum,pagesize:this.pagesize}
            getUserList({params:params}).then(res => {
                if(res.meta.status === 200){
                    this.tableData = res.data.users;
                    this.total = res.data.total;
                    this.loading = false;
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
        // 修改用户状态
        changeUserState(row){
            changeUserState({uId:row.id,type:row.mg_state}).then(res => {
                if(res.meta.status==200){
                    this.$message.success('设置用户状态成功');
                }else{
                    this.$message.error(res.meta.msg);
                }
            })
        },
        // 添加用户
        addSubmitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    addUser(this.addForm).then(res => {
                        if(res.meta.status==201){
                            this.$message.success('添加用户成功');
                            this.addDialogFormVisible = false;
                            this.initUserList();
                            for(var i in this.addForm){
                                this.addForm[i]=''
                            }
                        }else{
                            this.$message.error(res.meta.msg);
                        }
                    })
                }
            });
        },
        // 显示编辑弹框
        showEditDialog(row){
            this.editDialogFormVisible = true;
            getUserById(row.id).then(res => {
                console.log(res)
                if(res.meta.status == 200){
                    this.editForm.id = res.data.id;
                    this.editForm.username = res.data.username;
                    this.editForm.email = res.data.email;
                    this.editForm.mobile = res.data.mobile;
                }else{
                    this.$message.error(res.meta.msg);
                }
            })
        },
        // 编辑用户提交
        editSubmitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    updateUser(this.editForm).then(res => {
                        if(res.meta.status==200){
                            this.$message.success('修改成功');
                            this.editDialogFormVisible = false;
                            this.initUserList();
                        }else{
                            this.$message.error(res.meta.msg);
                        }
                    })
                }
            });
        },
        // 显示删除弹框
        showDeleteDialog(row){
            this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                    deleteUser(row.id).then(res => {
                        if(res.meta.status == 200){
                            this.$message.success(res.meta.msg);
                            this.initUserList();
                        }else{
                            this.$message.error(res.meta.msg);
                        }
                    });
                }).catch(() => {
                    this.$message.info('已取消删除');
                });
        },
        // 显示分配角色弹框
        showGrantDialog(row){
            this.grantDialogFormVisible = true;
            this.grantForm = row;
            getRoleList().then(res => {
                if(res.meta.status === 200){
                    this.roleList = res.data;
                }
            })
        },
        // 分配用户角色提交
        grantSubmitForm(){
            if(!this.role) return;
            grantUserRole({id:this.grantForm.id,rid:this.role}).then(res => {
                if(res.meta.status == 200){
                    this.$message.success('设置角色成功');
                    this.grantDialogFormVisible = false;
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

