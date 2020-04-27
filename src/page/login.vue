<template>
  <div class="login">
    <div class="login-content">
        <el-card class="box-card">
          <div slot="header" class="clearfix box-card-header">
              <span>发单精灵管理后台</span>
            </div>
          <el-form ref="form" :model="form" label-width="80px">
            <el-form-item label="账号">
              <el-input v-model="form.mobile" placeholder="账号"></el-input>
            </el-form-item>
            <el-form-item label="密码">
              <el-input v-model="form.password" type="password" placeholder="密码"></el-input>
            </el-form-item>
            <el-form-item class="login-btn-content">
              <el-button type="primary" @click="onSubmit" class="login-btn">登陆</el-button>
            </el-form-item>
          </el-form>
        </el-card>
    </div>
  </div>
</template>

<script>
import {isPhone, isEmpty} from '@utils/lib';
import {userlogin} from '@server/login/index.js';
import { saveUserInfoToLocal } from '@utils/user';
export default {
  name: 'HelloWorld',
  data () {
    return {
      form: {
        mobile: '',
        password: ''
      }
    };
  },
  methods: {
    isCanSubmit () {
      if (!isPhone(this.form.mobile)) {
        this.$message({
          message: '账号必须是手机号',
          type: 'warning'
        });
        return false;
      }
      if (isEmpty(this.form.password)) {
        this.$message({
          message: '请输入密码',
          type: 'warning'
        });
        return false;
      }
      return true;
    },
    onSubmit () {
      let params = JSON.parse(JSON.stringify(this.form));
      if (this.isCanSubmit()) {
        userlogin(params).then(({code, data, msg}) => {
          if (code === 200) {
            saveUserInfoToLocal(data);
            this.$router.push('/');
          } else {
            this.$message({
              message: msg,
              type: 'warning'
            });
          }
        }).catch(() => {
          this.$message({
            message: '操作异常，请稍后再试',
            type: 'warning'
          });
        });
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
.login{
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg,#ff1a66,rgba(255,26,102,0) 70%),linear-gradient(135deg,#0643f9 10%,rgba(6,67,249,0) 80%),linear-gradient(225deg,#0df259 10%,rgba(13,242,89,0) 80%),linear-gradient(315deg,#f99e1f 100%,rgba(249,158,31,0) 0);
  .box-card-header{
    text-align: center;
  }
  .login-content{
    margin: 0 auto;
    padding-top: 200px;
    width: 400px;
    height: 500px;
    .login-btn{
      width:100%;
    }
    .login-btn-content{
      text-align: center;
    }
  }
}
</style>
