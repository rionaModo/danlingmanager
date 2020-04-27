/**
 * 是否为定义
 */
export function isUndef (v) {
  return v === undefined || v === null;
}
/**
 * 是否已经定义
 */
export function isDef (v) {
  return v !== undefined && v !== null;
}
/**
 * 是否为true
 */
export function isTrue (v) {
  return v === true;
}
/**
 * 是否为false
 */
export function isFalse (v) {
  return v === false;
}
/**
 * 判断一个对象是否为手机号
 */
export function isPhone (phone) {
  var reg = /^1\d{10}$/;
  return reg.test(phone);
}
/**
* 判断一个对象是否为数字
*/
export function isNumber (num) {
  var reg = /^[0-9]+$/;
  return reg.test(num);
}
/**
 * @desc 判断传入数据是否是数据
 * @param {Array} arr
 */
export function isArray (arr) {
  return Object.prototype.toString.call(arr) === '[object Array]';
}
/**
* 判断一个对象是否为空
*/
export function isEmpty (obj) {
  if (typeof obj === 'undefined' || obj == null || obj === '' || obj.length <= 0) return true;
  return false;
}
/**
 *
 * 获取当前的页面链接
 */
export function getNowUrl () {
  return location.href;
}
/**
 *
 * @param {*需要跳转的链接} url
 */
export function reLocation (url) {
  location.href = url;
  // browserHistory.push(`${url}`);
}
/**
*判断设备类型
**/
export let browser = {
  versions: (function () {
    let u = navigator.userAgent;
    return {// 移动终端浏览器版本信息
      trident: u.indexOf('Trident') > -1, // IE内核
      presto: u.indexOf('Presto') > -1, // opera内核
      webKit: u.indexOf('AppleWebKit') > -1, // 苹果、谷歌内核
      gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') === -1, // 火狐内核
      mobile: !!u.match(/AppleWebKit.*Mobile.*/), // 是否为移动终端
      ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), // ios终端
      android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, // android终端或者uc浏览器
      iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, // 是否为iPhone或者QQHD浏览器
      iPad: u.indexOf('iPad') > -1, // 是否iPad
      webApp: u.indexOf('Safari') === -1 // 是否web应该程序，没有头部与底部
    };
  })(),
  isIE8: navigator.appName === `Microsoft Internet Explorer` && navigator.appVersion.match(/8./i) === `8.`,
  language: (navigator.browserLanguage || navigator.language).toLowerCase()
};

/*
*判断应用的开启类型
*默认返回是否为微信浏览器
*/
export function appOPenType (typ) {
  let isweixin = false;
  let openobj = '';
  if (browser.versions.mobile) { // 判断是否是移动设备打开。browser代码在下面
    let ua = navigator.userAgent.toLowerCase();// 获取判断用的对象
    if (/MicroMessenger/i.test(ua)) {
      // 在微信中打开
      openobj = 'weixin';
      isweixin = true;
    }
    if (/WeiBo/i.test(ua)) {
      // 在新浪微博客户端打开
      openobj = 'weibo';
    }
    if (/QQ/i.test(ua)) {
      // 在QQ空间打开
      openobj = 'qq';
    }
    if (browser.versions.ios) {
      // 是否在IOS浏览器打开
      openobj = 'ios';
    }
    if (browser.versions.android) {
      // 是否在安卓浏览器打开
      openobj = 'android';
    }
  } else {
    // 否则就是PC浏览器打开
    openobj = 'PC';
  }
  if (typ === 'ty') {
    return openobj;
  } else {
    return isweixin;
  }
}
/**
 * 去除字符串首尾空格
 * */

export function trim (str) {
  if (isEmpty(str)) return '';
  return str.replace(/(^\s*)|(\s*$)/g, ``);
}
/*
* 解析url search
* 返回对象
* */

export function urlParse (url) {
  let query = {};
  let search = url || location.search;
  if (search.indexOf('?') >= 0) {
    let url = search.split('?')[1].split('&');
    for (let i = 0, len = url.length; i < len; i++) {
      let q = url[i].split('=');
      if (!isEmpty(trim(q[0]))) {
        query[trim(q[0])] = trim(q[1]);
      }
    }
  }
  return query;
}
/**
 *
 * @param {日期时间} datetime
 */
export function dateTimeToWeek (data) {
  data = data.replace(/\./g, '-');
  let w = ['日', '一', '二', '三', '四', '五', '六'];
  let week = new Date(data).getDay();
  return '星期' + w[week];
}
/**
 *
 * @param {日期时间} datetime
 * @return {}yy.mm.dd (星期X) hh:mm} text
 */
export function dateTimetoString (dtime1, dtime2) {
  const day = timestampToDateString(dtime1, '.', 'yymmdd');
  const time1 = timestampToDateString(dtime1, '.', 'ttmm');
  const time2 = timestampToDateString(dtime2, '.', 'ttmm');
  return day + ' (' + dateTimeToWeek(day) + ') ' + time1 + '-' + time2;
}
/**
 *
 * @param {日期} string
 */
export function stringToTimestamp (str) {
  str = str.replace(/-/g, '/');
  return new Date(str).getTime();
}
/**
 *
 * @param {毫秒} timestamp
 * @param {年月日的分割} sep
 * @param {返回日期或时间组合类型} type
 */
export function timestampToDateString (timestamp, sep = `-`, type = 'yymmddttmmss') {
  let formatFn = (num) => {
    return num < 10 ? `0${num}` : num;
  };
  timestamp = parseInt(timestamp);
  if (timestamp.toString().length <= 10) {
    timestamp = parseInt(timestamp) * 1000;
  }
  let d = new Date(parseInt(timestamp));
  let year = d.getFullYear();
  let mouth = d.getMonth() + 1;
  let day = d.getDate();
  let hour = d.getHours();
  let minute = d.getMinutes();
  let second = d.getSeconds();
  mouth = formatFn(mouth);
  day = formatFn(day);
  hour = formatFn(hour);
  minute = formatFn(minute);
  second = formatFn(second);
  let objDate = {
    'yymm': `${year}${sep}${mouth}`, // 年-月-日
    'yymmdd': `${year}${sep}${mouth}${sep}${day}`, // 年-月-日
    'ttmm': `${hour}:${minute}`, // 时:分
    'ttmmss': `${hour}:${minute}:${second}`, // 时:分:秒
    'yymmddttmm': `${year}${sep}${mouth}${sep}${day} ${hour}:${minute}`, // 年-月-日 时:分
    'yymmddttmmss': `${year}${sep}${mouth}${sep}${day} ${hour}:${minute}:${second}` // 年-月-日 时:分:秒
  };
  return objDate[type] || objDate['yymmddttmmss'];
}

export function getDomBySelector (selectors, parentNode = document) {
  return parentNode.querySelectorAll(selectors);
}

export function richTextInit (parentDom) {
  let addStyle = function (doms, styles) {
    doms.forEach(element => {
      let keys = Object.keys(styles);
      keys.forEach(e => {
        element.style[e] = styles[e];
      });
    });
  };
  let imgs = getDomBySelector('img', parentDom);
  addStyle(imgs, {'width': '100%', 'height': 'auto', 'visibility': 'inherit'});
  let ems = getDomBySelector('em', parentDom);
  addStyle(ems, {'font-style': 'italic'});
  let strongs = getDomBySelector('strong', parentDom);
  addStyle(strongs, {'font-weight': 'bold'});
  let us = getDomBySelector('u', parentDom);
  addStyle(us, {'text-decoration': 'underline'});
}
