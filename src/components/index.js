
import wToast from './toast/toast';
import wLoading from './loading/index';
export default{
  install (Vue) {
    Vue.prototype.$wToast = wToast;
    Vue.prototype.$wLoading = wLoading;
  }
};
