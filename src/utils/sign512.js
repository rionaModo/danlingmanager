import sha512 from 'js-sha512';
import {isEmpty} from '@utils/lib';
import {appSecret} from '@constants/common';
// 加密函数
export function getSign (params) {
  let txt = ``;
  let keys = Object.keys(params).sort();
  for (let i in keys) {
    let key = keys[i];
    if (key === `sign`) {
      continue;
    }
    if (isEmpty(params[key]) || isEmpty(params[key])) {
      continue;
    }
    txt += key + `=` + params[key] + `&`;
  }
  txt += appSecret;
  return sha512.hmac(appSecret, txt);
}
