<template>
    <div class="login">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="container">
            <el-form-item>
                <div class="avatar">
                    <img src="../assets/avatar.jpg" alt="">
                </div>
            </el-form-item>
            <el-form-item prop="username">
                <el-input v-model="ruleForm.username" placeholder="用户名"></el-input>
            </el-form-item>
            <el-form-item prop="password">
                <el-input v-model="ruleForm.password" type="password" placeholder="密码" @keydown.native.enter="submitForm('ruleForm')"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')" class="login-btn">登录</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
import {checkUser} from '@/api'
export default {
    data() {
        return {
            ruleForm: {
                username:'',
                password:''
            },
            rules: {
                username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                ]
            }
        };
    },
    methods: {
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    checkUser(this.ruleForm).then(res => {
                        if(res.meta.status==200){
                            //登录成功
                            localStorage.setItem('mytoken', res.data.token)
                            localStorage.setItem('username', res.data.username)
                            this.$store.commit('getUserName');
                            this.$router.push({name:'home'});
                        }else{
                            this.$message.error(res.meta.msg);
                        }
                    })
                }
            });
        }
    }
};
</script>
<style lang="scss" scoped>
.login {
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: #2f4050;

  .container {
    position: absolute;
    left: 0;
    right: 0;
    width: 400px;
    padding: 0px 40px 15px 40px;
    margin: 200px auto;
    background: white;
    .avatar {
      position: relative;
      left: 50%;
      width: 120px;
      height: 120px;
      margin-left: -60px;
      margin-top: -60px;
      box-sizing: border-box;
      border-radius: 50%;
      border: 10px solid #fff;
      box-shadow: 0 1px 5px #ccc;
      overflow: hidden;
    }
    .login-btn {
      width: 100%;
    }
  }
}
</style>

