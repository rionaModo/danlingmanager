import Vue from 'vue';
import Router from 'vue-router';
import Frame from '@/page/Frame';
Vue.use(Router);
const children = [
  {
    path: '',
    name: 'salaryManage',
    meta: { title: `首页` },
    component: () => import(/* webpackChunkName: "salaryCenter" */ '@/page/salaryCenter/salary')
  },
  {
    path: 'activitymanage/list',
    name: 'activitymanageList',
    meta: { title: `活动管理` },
    component: () => import(/* webpackChunkName: "salaryCenter" */ '@/page/activitymanage/list')
  },
  {
    path: 'activitymanage/add',
    name: 'activitymanageAdd',
    meta: { title: `活动管理` },
    component: () => import(/* webpackChunkName: "salaryCenter" */ '@/page/activitymanage/add')
  }
];
const routes = [
  {
    path: '/',
    meta: { title: `首页` },
    component: Frame, 
    children: children
  },
  {
    path: '/login',
    name: 'login',
    meta: { title: `登陆` },
    component: () => import(/* webpackChunkName: "login" */ '@/page/login')
  }
];

// ======================================================  路由配置
const router = new Router({
  mode: 'history',
  saveScrollPosition: true,
  routes,
  // 设置切换路由滚动行为
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { x: 0, y: 0 };
    }
  }
});
// =====================================================  路由监听
router.beforeEach((to, from, next) => {
  /* 路由发生变化修改页面title */
  if (to.meta.title) {
    document.title = to.meta.title;
  }
  next();
});

export default router;
