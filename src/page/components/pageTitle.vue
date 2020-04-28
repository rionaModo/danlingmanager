<template>
  <div class="page-title">
    <el-breadcrumb class="page-title-breadcrumb">
      <el-breadcrumb-item v-for="(item, index) in breadcrumb" :key="index">{{item.text?item.text:item}}
      </el-breadcrumb-item>
    </el-breadcrumb>
    <div class="page-title-right">
      <slot v-if="$slots.default"></slot>
      <el-button v-else type="primary" size="medium" @click="goBack">返回</el-button>
    </div>
  </div>
</template>
  
<script>
import router from '@/router';
export default {
  name: 'dlPageTitle',
  props: {
    breadcrumb: {
      type: Array,
      requie: true
    }
  },
  data () {
    return {
    };
  },
  created () {
    console.log(this);
  },
  methods: {
    goBack () {
      router.go(-1);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
.page-title{
  overflow: hidden;
  .page-title-breadcrumb{
    height: 40px;
    line-height: 40px;
    float: left;
  }
  
  .page-title-right{
    float: right;
    height: 40px;
  }
}
</style>
