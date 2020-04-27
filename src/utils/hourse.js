import axios from 'axios';
import Vue from 'vue';
import { ContentType } from '@constants/http';
import { goLogin } from '@utils/user';
import { platformType } from '@constants/common';
import { getSign } from '@utils/sign512';
import Store from '../store';
axios.defaults.baseURL = '/admin-controller';
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.headers.post['Content-Type'] = `${ContentType.JSON}`;
var vue = new Vue();
let LoadingMethod = (() => {
  return {
    show: () => {
      Store.commit('setLoading', true);
    },
    close: () => {
      Store.commit('setLoading', false);
    }
  };
})();

var instance = axios.create({
  baseURL: '/admin-controller',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 30000,
  withCredentials: true // true 异步请求， false 同步请求
});
/**
 * 请求数据拦截
 */
instance.interceptors.request.use(function (config) {
  config.data.t = new Date().getTime();
  config.data.type = platformType;
  config.data.sign = getSign(config.data);
  LoadingMethod.show();
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});
/**
 * 返回数据拦截
 */
instance.interceptors.response.use(
  ({ status, data }) => { // http 请求状态
    LoadingMethod.close();
    if (status !== 200) {
      return Promise.reject(`error`);
    } else {
      // 200  成功
      // 300  一般错误
      // 310  规则验证错误
      // 400  请求未找到
      // 401  token过期或不存在，需重新登陆
      // 402  微信小程序未查询到代理信息
      // 404  签名验证失败
      // 405  不支持的请求方式
      // 500  系统错误
      if (data.code === 401) {
        goLogin();
      } else if (data.code !== 200) {
        vue.$message.error(data.msg);
        return Promise.reject(data.msg);
      }
    }
    return data;
  },
  error => {
    LoadingMethod.close();
    return Promise.reject(error);
  });

export { instance as http };
