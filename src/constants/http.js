/**
 * @desc 系统提示信息, 包括错误信息提示, 方便后期做国际化
 */

export const htppCodeType = {
  NO_LOGIN: 313020 // "侍酒师TOKEN验证错误,登录失败
};
// http协议method
export const HttpMethod = {
  GET: 'get',
  POST: 'post',
  DELETE: 'delete',
  PUT: 'put',
  HEAD: 'head',
  PATCH: 'patch',
  REQUEST: 'request'
};
// http协议头Content-Type
export const ContentType = {
  JSON: 'application/json',
  FORM_URLENCODED: 'application/x-www-form-urlencoded'
};

// http协议头Content-Type
export const responseStatus = {
  200: '成功',
  300: '一般错误',
  310: '规则验证错误',
  400: '请求未找到',
  401: 'token过期或不存在，需重新登陆',
  402: ' 微信小程序未查询到代理信息',
  404: '签名验证失败',
  405: '不支持的请求方式',
  500: '系统错误'
};
/**
 * @desc Demo
 * 根据用户等级, 在页面显示对应的中文, 正式开发时请删除 Demo 代码段.
 */

/**
 * Demo end
 */
