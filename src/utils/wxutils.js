import {
  appOPenType,
  getNowUrl,
  reLocation,
  isDef,
  urlParse,
  isEmpty
} from '@utils/lib';
import {goWXGetCode, byCodeGetUserStatus} from '@server/login/index.js';
import {getWxApiConfig} from '@server/wx/index.js';
import {useResultType} from '@constants/enum';
let wx = window.wx;
// 授权微信api权限
function wxApiAuthod ({appId = ``, timestamp = ``, nonceStr = ``, signature = ``}) {
  wx.config({
    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
    appId, // 必填，公众号的唯一标识
    timestamp, // 必填，生成签名的时间戳
    nonceStr, // 必填，生成签名的随机串
    signature, // 必填，签名
    jsApiList: [ // 必填，需要使用的JS接口列表
      'onMenuShareAppMessage', 'onMenuShareTimeline',
      'onMenuShareQQ', 'onMenuShareQZone'
    ]
  });
}
export function wxShareInfoInit ({
  title = '', // 分享标题
  desc = '', // 分享描述
  link = '', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
  imgUrl = '', // 分享图标
  type = 'link', // 分享类型,music、video或link，不填默认为link
  dataUrl = '', // 如果type是music或video，则要提供数据链接，默认为空
  success = function () {
    // 设置成功
  },
  cancel = function () {
  },
  initError = function () {
    // 分享初始化失败
  },
  initSuccess = function () {
    // 分享初始化成功
  }
}) {
  // 分享到朋友圈
  wx.onMenuShareTimeline({
    title, // 分享标题
    link, // 分享链接
    imgUrl, // 分享图标
    success, // 用户确认分享后执行的回调函数,
    cancel // 用户取消分享后执行的回调函数
  });
  // 分享给朋友
  wx.onMenuShareAppMessage({
    title,
    desc,
    link,
    imgUrl,
    type, // 分享类型,music、video或link，不填默认为link
    dataUrl, // 如果type是music或video，则要提供数据链接，默认为空
    success, // 用户确认分享后执行的回调函数,
    cancel // 用户取消分享后执行的回调函数
  });
  // 分享到QQ
  wx.onMenuShareQQ({
    title,
    desc,
    link,
    imgUrl,
    success, // 用户确认分享后执行的回调函数,
    cancel // 用户取消分享后执行的回调函数onsole.log("取消分享给QQ好友返回的信息为:", res);
  });
  // 分享到QQ空间
  wx.onMenuShareQZone({
    title,
    desc,
    link,
    imgUrl,
    success, // 用户确认分享后执行的回调函数,
    cancel // 用户取消分享后执行的回调函数
  });
}

// 判断是否连接中带有authorization_code
function isUrlHasCode (url) {
  let urlParam = urlParse(url);
  if (!isEmpty(urlParam) && !isEmpty(urlParam.code)) {
    return urlParam.code;
  }
  return false;
}
export function shareUrl () {
  let url = getNowUrl();
  // let params = urlParse(url);
  // if (!isEmpty(params.code)) {
  //   delete params.code;
  // }
  // let urlKeyV = [];
  // for (let k in params) {
  //   urlKeyV.push(`${k}=${params[k]}`);
  // }
  // let urlPre = url.split(`?`)[0];
  // url = urlKeyV.length > 0 ? `${urlPre}?${urlKeyV.join('&')}` : urlPre;
  return encodeURIComponent(url);
}
// 进入微信授权页面
export async function goWxAuthorPage (redirectUrl) {
  let {code, data} = await goWXGetCode({redirectUrl: encodeURIComponent(redirectUrl)});
  if (code === 200 && isDef(data)) {
    reLocation(data);
  } else {
    // 抛出异常
  }
}
// 针对返回的状态进行处理
function userStatusHandle (userInfo) {
  let {resultType, openid} = userInfo;
  if (resultType === useResultType.NO_OPENID || isEmpty(openid)) { // 是否为获取openid等信息
    return false;
  }
  return true;
}
export async function wxutils () {
  if (!appOPenType()) {
    return false;
  }
  let url = getNowUrl();
  let authorizationCode = isUrlHasCode(url);
  if (authorizationCode) {
    let params = {code: authorizationCode};
    // 数据迁移临时处理 start
    let urlParam = urlParse(url);
    if (!isEmpty(urlParam) && !isEmpty(urlParam.type)) {
      params.type = urlParam.type;
    } else {
      params.type = 2;
    }
    // 数据迁移临时处理 end
    let {code, data} = await byCodeGetUserStatus(params);
    if (code === 200 && isDef(data) && userStatusHandle(data)) {
      return data;
    }
  }
  // 微信自动授权登录方法前重定向
  await goWxAuthorPage(url); // 去授权
  return false;
}
// 微信配置api
export async function goWxConfigApi (url) {
  return new Promise(async function (resolve, reject) {
    let {data = {}} = await getWxApiConfig({url});
    if (data) {
      wxApiAuthod(data);
      wx.ready(function () {
        resolve(data);
      });
    } else {
      reject();
    }
  });
}

export function goShare (config = {
  title: '', // 分享标题
  desc: '', // 分享描述
  link: '', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
  imgUrl: '', // 分享图标
  success: function () {
    // 设置成功
  }
}) {
  goWxConfigApi(shareUrl()).then(() => {
    config.initSuccess && config.initSuccess();
    wxShareInfoInit(config);
  }, () => {
    config.initError && config.initError();
  });
}
