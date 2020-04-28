<template>
    <div class="dl-main-container">
      <el-card>
        <slot></slot>
      </el-card>
    </div>
</template>
  
<script>
import { goLogin } from '@utils/user';
export default {
  name: 'dlMainContainer',
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
.dl-main-container{
  margin-top: 10px;
}
</style>
