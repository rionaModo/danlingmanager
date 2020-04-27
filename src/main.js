// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import store from './store';
import utils from './utils';

// import mock from '../mock/mock.js';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
// 全局过滤器
import filters from '@filters';
// 全局组件
import components from '@page/components';

import '../static/styles/common.css';
import './components/toast/toast.css';
import './components/loading/index.css';
Vue.use(ElementUI);
// import { generatorUsrPromise, isAuditStatus, isUserRegister } from '@utils/user';

Vue.config.productionTip = false;
Vue.use(utils);
Vue.use(filters);
Vue.use(components);

/* eslint-disable no-new */
window._app = window.app = new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
});
