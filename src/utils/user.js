import {setLocal, getLocal, clearStorage} from '@utils/storage';
import { isEmpty } from '@utils/lib';
// let app = window._app;
// let app = window.app;
export function saveUserInfoToLocal (userInfo) {
  if (isEmpty(userInfo) || isEmpty(userInfo.token) || isEmpty(userInfo.mobile)) {
    return false;
  }
  setLocal(`userInfo`, userInfo);
}

export function getLocalUserInfo () {
  return getLocal(`userInfo`);
}

export function userIsLogin () {
  let userInfo = getLocalUserInfo();
  if (isEmpty(userInfo) || isEmpty(userInfo.token) || isEmpty(userInfo.mobile)) {
    return false;
  }
  return true;
}
export function goLogin () {
  let app = window.app;
  clearUserInfo();
  app.$router.push('/login');
} 
// 退出登陆
export function clearUserInfo () {
  clearStorage();
}
