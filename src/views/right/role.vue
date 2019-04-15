<template>
    <div class="role">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-button type="primary" plain @click="addDialogFormVisible = true">添加角色</el-button>
        <el-table
        border
        :data="tableData"
        row-key="id"
        style="width: 100%;margin:20px 0">
            <el-table-column type="expand">
                <template slot-scope="scope">
                    <el-row v-for="firstChildren in scope.row.children" :key="firstChildren.id">
                        <el-col :span="3">
                            <el-tag @close="deleteRight(scope.row.id,firstChildren.id)" closable>{{firstChildren.authName}}</el-tag>
                            <i v-if="firstChildren.children.length!==0" class="el-icon-arrow-right"></i>
                        </el-col>
                        <el-col :span="21">
                            <el-row v-for="secondChildren in firstChildren.children" :key="secondChildren.id">
                                <el-col :span="3 ">
                                    <el-tag @close="deleteRight(scope.row.id,secondChildren.id)" type="success" closable>{{secondChildren.authName}}</el-tag>
                                    <i v-if="secondChildren.children.length!==0" class="el-icon-arrow-right"></i>
                                </el-col>
                                <el-col :span="21">
                                    <el-tag @close="deleteRight(scope.row.id,thirdChildren.id)" type="warning" closable v-for="thirdChildren in secondChildren.children" :key="thirdChildren.id">{{thirdChildren.authName}}</el-tag>
                                </el-col>
                            </el-row>
                        </el-col>
                    </el-row>
                    <el-row v-if="scope.row.children.length === 0">没有任何权限</el-row>
                </template>
            </el-table-column>
            <el-table-column
            width="200"
            label="角色名称"
            prop="roleName">
            </el-table-column>
            <el-table-column
            label="描述"
            prop="roleDesc">
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button
                    size="mini"
                    plain
                    icon="el-icon-edit"
                    type="primary"
                    @click="showEditDialog(scope.row)">
                    </el-button>
                    <el-button
                    size="mini"
                    plain
                    icon="el-icon-delete"
                    type="danger"
                    @click="showDeleteDialog(scope.row)">
                    </el-button>
                    <el-button
                    size="mini"
                    plain
                    icon="el-icon-check"
                    type="warning"
                    @click="showGrantDialog(scope.row)">
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
         <!-- 添加角色弹框-->
        <el-dialog title="添加角色" :visible.sync="addDialogFormVisible">
            <el-form :model="addForm" :rules="rules" ref="addRuleForm" label-width="120px">
                <el-form-item prop="roleName" label="角色名称">
                    <el-input v-model="addForm.roleName"></el-input>
                </el-form-item>
                <el-form-item prop="roleDesc" label="描述">
                    <el-input v-model="addForm.roleDesc"></el-input>
                </el-form-item>
            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button @click="addDialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="addSubmitForm('addRuleForm')">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 编辑角色弹框-->
        <el-dialog title="编辑角色" :visible.sync="editDialogFormVisible">
            <el-form :model="editForm" :rules="rules" ref="editRuleForm" label-width="120px">
                <el-form-item prop="roleName" label="角色名称">
                    <el-input v-model="editForm.roleName"></el-input>
                </el-form-item>
                <el-form-item prop="roleDesc" label="描述">
                    <el-input v-model="editForm.roleDesc"></el-input>
                </el-form-item>
            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button @click="editDialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="editSubmitForm('editRuleForm')">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 角色授权弹框-->
        <el-dialog title="角色授权" :visible.sync="grantDialogFormVisible">
            <div class="tree-container">
                <el-tree
                :data="rightsList"
                show-checkbox
                node-key="id"
                ref="tree"
                :default-expand-all="true"
                :default-checked-keys="checkedKeys"
                :props="defaultProps">
                </el-tree>
             </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="grantDialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="grantSubmit">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import {getRoleList,addRole,getRoleById,updateRole,deleteRole,deleteRight,getRightList,updateRoleRight} from '@/api'
export default {
    data() {
        return {
            loading:false,
            tableData: [],
            addDialogFormVisible:false,
            addForm: {
                roleName: '',
                roleDesc: ''
            },
            editDialogFormVisible: false,
            editForm:{
                id: 0,
                roleName: '',
                roleDesc: ''
            },
            grantDialogFormVisible: false,
            rightsList: [],
            defaultProps: {
                children: 'children',
                label: 'authName'
            },
            // 树结构默认选中项
            checkedKeys: [],
            roleId: 0,
            rules: {
                roleName: [
                    { required: true, message: '请输入角色名称', trigger: 'blur' },
                ],
                roleDesc: [
                    { required: true, message: '请输入描述', trigger: 'blur' },
                ]
            }
        };
    },
    mounted(){
        this.initList();
    },
    methods: {
        initList(){
            this.loading = true;
            getRoleList().then(res => {
                // console.log(res)
                if(res.meta.status === 200){
                    this.tableData = res.data;
                    this.loading = false;
                }
            })
        },
        // 添加角色
        addSubmitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    addRole(this.addForm).then(res => {
                        if(res.meta.status==201){
                            this.$message.success('添加角色成功');
                            this.addDialogFormVisible = false;
                            this.initList();
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
            getRoleById(row.id).then(res => {
                if(res.meta.status == 200){
                    this.editForm.id = res.data.roleId;
                    this.editForm.roleName = res.data.roleName;
                    this.editForm.roleDesc = res.data.roleDesc;
                }else{
                    this.$message.error(res.meta.msg);
                }
            })
        },
        // 编辑角色提交
        editSubmitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    updateRole(this.editForm).then(res => {
                        if(res.meta.status==200){
                            this.$message.success('修改角色成功');
                            this.editDialogFormVisible = false;
                            this.initList();
                        }else{
                            this.$message.error(res.meta.msg);
                        }
                    })
                }
            });
        },
        // 显示删除弹框
        showDeleteDialog(row){
            this.$confirm('此操作将永久删除该用色, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                    deleteRole(row.id).then(res => {
                        if(res.meta.status == 200){
                            this.$message.success(res.meta.msg);
                            this.initList();
                        }else{
                            this.$message.error(res.meta.msg);
                        }
                    });
                }).catch(() => {
                    this.$message.info('已取消删除');
                });
        },
        // 删除角色指定权限
        deleteRight(roleId,rightId){
            deleteRight({roleId:roleId,rightId:rightId}).then(res => {
                if(res.meta.status == 200){
                    this.$message.success('删除权限成功');
                    this.initList();
                }else{
                    this.$message.error(res.meta.msg);
                }
            });
        },
        // 显示角色授权弹框
        showGrantDialog(row){
            this.grantDialogFormVisible = true;
            this.roleId = row.id;
            getRightList({type:'tree'}).then(res => {
                if(res.meta.status === 200){
                    this.rightsList = res.data;
                }else{
                    this.$message.error(res.meta.msg);
                }
            });
            this.checkedKeys.length = 0;
            // 遍历获取该角色所拥有的所有权限id填充到checkedKeys
            row.children.forEach(first => {
                if(first.children&&first.children.length!=0){
                    first.children.forEach(second => {
                         if(second.children&&second.children.length!=0){
                            second.children.forEach(third => {
                                this.checkedKeys.push(third.id);
                            })
                        }
                    })
                }
            })
        },
        // 角色授权提交
        grantSubmit(){
            let rids = this.$refs.tree.getCheckedKeys().join(',');
            updateRoleRight(this.roleId,{rids:rids}).then(res => {
                if(res.meta.status === 200){
                    this.$message.success(res.meta.msg);
                    this.grantDialogFormVisible = false;
                    this.initList();
                }else{
                    this.$message.error(res.meta.msg);
                }
            })
        }

    }
};
</script>
<style lang="scss" scoped>
.role {
  .el-tag {
    margin-right: 8px;
    margin-bottom: 8px;
  }
  .tree-container {
    height: 300px;
    overflow-y: auto;
  }
}
</style>

