import {sexType} from '@constants/enum';
import {isEmpty} from '@utils/lib';
const filters = {
  getSexText: function (v) {
    if (!isEmpty(v) && !isEmpty(sexType[v])) {
      return sexType[v];
    } else {
      return ``;
    }
  },
  getPrice: function (v) {
    v = parseInt(v);
    let a = parseInt(v / 100);
    let b = (v % 100);
    b = b >= 10 ? b : '0' + b;
    return `${a}.${b}`;
  }
};

export default {
  install: function (Vue, options) {
    for (let i in filters) {
      Vue.filter(i, filters[i]);
    }
  }
};
