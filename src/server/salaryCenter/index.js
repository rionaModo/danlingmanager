import {http} from '@/utils/hourse';
// 酒水订单列表
export async function getSalary (param = {}) {
  const data = await http.post(`/admin/order/get-salary`, param);
  return data;
}
