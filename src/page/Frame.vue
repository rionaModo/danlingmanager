<template>
  <div class="main-content">
    <el-container>
      <el-header class="main-header">
        <d-header></d-header>
      </el-header>
      <el-container>
        <el-aside width="220px" class="main-nav">
          <el-menu
            :default-active="menu.active"
            class="el-menu-vertical-demo"
            @open="handleOpen"
            @close="handleClose"
            @select="handleSelect"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b">
            <template v-for="item in menu.menuList" >
              <el-submenu :key="item.path" :index="item.path" v-if="item.children && item.children.length > 0">
                <template slot="title">
                  <i :class="item.icon"></i>
                  <span>{{item.title}}</span>
                </template>
                <el-menu-item v-for="v in item.children" :key="v.path" :index="v.path">{{v.title}}</el-menu-item>
              </el-submenu>
              <el-menu-item :key="item.path" :index="item.path" v-else>
                <i :class="item.icon"></i>
                <span>{{item.title}}</span>
              </el-menu-item>
            </template>
          </el-menu>
        </el-aside>
        <el-main  class="main-content"  v-loading="getLoading">
          <router-view/>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import dHeader from '@/page/components/header.vue';
import { mapGetters } from 'vuex';
// import router from '@/router';
export default {
  name: 'Frame',
  components: {
    dHeader
  },
  data () {
    return {
      menu: {
        active: `/salaryCenter/salary`,
        menuList: [
          {
            title: `活动管理`,
            uuid: '1',
            path: '/activitymanage/list'
            // icon: 'el-icon-location',
          },
          {
            title: `使用介绍`,
            uuid: '6',
            path: '/salaryCenter/salary',
            // icon: 'el-icon-location',
            children: []
          }
        ]
      }
    };
  },
  computed: {
    // 使用对象展开运算符将 getter 混入 computed 对象中
    ...mapGetters([
      'getLoading'
      // ...
    ])
  },
  methods: {
    handleOpen (key, keyPath) {
    },
    handleClose (key, keyPath) {
      console.log('handleClose', key, keyPath);
    },
    handleSelect (key, keyPath) {
      this.$router.push({path: key});
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
.main-content{
  .main-header{
    color: #ffffff;
    background-color: rgb(48, 49, 51);
    line-height: 60px;
   
  }
  .main-nav{
    overflow-x: hidden;
  }
}
</style>
