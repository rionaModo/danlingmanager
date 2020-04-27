import { http } from '@utils/hourse';
// 获取微信授权信息code
export async function userlogin (data = {}) {
  let response = await http.post(`/login/login`, data);
  return response;
}
