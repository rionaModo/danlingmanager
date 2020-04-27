<template>
    <div class="main-header-content">
      丹棱县民政局时间银行
        <div class="user-handle"><el-button type="text" @click="loginout">退出</el-button></div>
    </div>
</template>
  
<script>
import { goLogin } from '@utils/user';
export default {
  name: 'dHeader',
  data () {
    return {
    };
  },
  methods: {
    loginout () {
    //   console.log(app);
      goLogin();
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
.main-header-content{
  color: #ffffff;
  background-color: rgb(48, 49, 51);
  line-height: 60px;
  .user-handle{
    float: right;
  }
}
</style>
