import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const Store = new Vuex.Store({
  namespaced: true,
  state: {
    httpLoading: false // ajax请求状态
  },
  mutations: {
    setLoading (state, vl) {
      state.httpLoading = vl;
    }
  },
  actions: {
    // RongInstance ({commit}, vl) {
    //   commit('RongInstance', vl);
    // },
  },
  getters: {
    getLoading (state) {
      return state.httpLoading;
    }
  }
});

export default Store;
