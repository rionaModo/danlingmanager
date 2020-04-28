import pageTitle from './pageTitle';
import searchContainer from './searchContainer';
import mainContainer from './mainContainer';
// 注册全局组件
const components = [
  pageTitle,
  searchContainer,
  mainContainer
];
const componentsName = [];
export default {
  install: function (Vue) {
    components.forEach((v, i) => {
      let name = '';
      if (!v.name) {
        console.error(`global component: the component has no the prop of name`);
        return;
      }
      name = v.name;
      if (componentsName.indexOf(name) > 0) {
        console.error(`global component: ${name} is already declared as a other componentsName`);
      }
      componentsName.push(name);
      Vue.component(name, v);
    });
  }
};
